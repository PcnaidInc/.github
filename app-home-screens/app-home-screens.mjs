#!/usr/bin/env node
// App Home screenshot lane (PCNSF-144). Runs ONLY inside the reusable workflow
// PcnaidInc/.github/.github/workflows/app-home-screens.yml, called by each Shopify app repo. It signs in to the dev store's admin as a vaulted
// e2e tester, opens every App Home route inside the real admin iframe, and saves full-page
// screenshots at desktop (1440) and phone (390) width.
//
// Credentials come from repo secrets through the environment. The password is typed by this
// job only. No agent enters it, and it is never logged, traced or written to an artifact.
// Playwright tracing stays off for the login, and the saved session never leaves the runner.

import { chromium, devices } from 'playwright';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const env = (name, fallback) => {
  const v = process.env[name] ?? fallback;
  if (v === undefined || v === '') throw new Error(`missing env ${name}`);
  return v;
};

const STORE = env('SHOP_STORE_HANDLE');
const EMAIL = env('SHOPIFY_E2E_TESTER_EMAIL');
const PASSWORD = env('SHOPIFY_E2E_TESTER_PASSWORD');
const INBOX_URL = process.env.ORG_INBOX_URL || '';
const INBOX_TOKEN = process.env.ORG_INBOX_API_TOKEN || '';
const OUT = env('OUT_DIR', 'app-home-screens');
const GRID = env('GRID', 'local'); // local | browserstack
const APP_DIR = env('APP_DIR', '.');
const ROUTES_DIR = env('ROUTES_DIR', 'app/routes');
const ONLY = (process.env.ROUTES || '').split(',').map((s) => s.trim()).filter(Boolean);

// The admin resolves /apps/<client_id>/... to the app's handle, so no handle is guessed.
// APP_TOML names the config when a repo has several; otherwise shopify.app.toml, else the only
// shopify.app.*.toml in the repo root.
function appToml() {
  if (process.env.APP_TOML) return join(APP_DIR, process.env.APP_TOML);
  if (existsSync(join(APP_DIR, 'shopify.app.toml'))) return join(APP_DIR, 'shopify.app.toml');
  const found = readdirSync(APP_DIR).filter((f) => /^shopify\.app\..+\.toml$/.test(f));
  if (found.length !== 1) throw new Error(`set app_toml: found ${found.length} shopify.app.*.toml files`);
  return join(APP_DIR, found[0]);
}
const clientId = /^client_id\s*=\s*"([^"]+)"/m.exec(readFileSync(appToml(), 'utf8'))?.[1];
if (!clientId) throw new Error('client_id not found in the app toml');
const ADMIN = `https://admin.shopify.com/store/${STORE}`;

// Routes come from the Remix flat-route files, so a new page is covered without editing this.
// Skipped: dynamic segments ($id), pathless escapes (foo_), downloads (*.export) and billing
// return pages that need a charge id.
export function appHomeRoutes(files) {
  return files
    .filter((f) => /^app(\.|\.tsx$)/.test(f) && /\.(tsx|jsx)$/.test(f))
    .map((f) => f.replace(/\.(tsx|jsx)$/, ''))
    .filter((r) => r !== 'app')
    .filter((r) => !/\$|_\.|\.export$|\.confirmed$/.test(r))
    .map((r) => '/' + r.replace(/\._index$/, '').replace(/\./g, '/'))
    .sort();
}

// No Remix routes dir (Workers/React apps): capture the App Home root unless `routes` is given.
const routesDir = join(APP_DIR, ROUTES_DIR);
const routes = ONLY.length ? ONLY : existsSync(routesDir) ? appHomeRoutes(readdirSync(routesDir)) : ['/'];
mkdirSync(OUT, { recursive: true });
const results = [];
const log = (...a) => console.log('[app-home-screens]', ...a);

async function launch() {
  if (GRID === 'browserstack') {
    const caps = {
      browser: 'chrome',
      os: 'osx',
      os_version: 'sonoma',
      name: `app-home-screens ${process.env.GITHUB_REPOSITORY || ''}`,
      build: `PCNSF-144 ${process.env.GITHUB_RUN_ID || 'local'}`,
      'browserstack.username': env('BROWSERSTACK_USERNAME'),
      'browserstack.accessKey': env('BROWSERSTACK_ACCESS_KEY'),
      'browserstack.maskCommands': 'setValues, getValues, setCookies, getCookies',
      'client.playwrightVersion': '1.latest',
    };
    return chromium.connect(`wss://cdp.browserstack.com/playwright?caps=${encodeURIComponent(JSON.stringify(caps))}`);
  }
  return chromium.launch();
}

const sixDigits = (text) => /\b(\d{6})\b/.exec(text || '')?.[1];

// Newest Shopify message to the tester since sign-in began, reduced to its 6-digit code.
async function newestCode(sinceIso) {
  if (!INBOX_TOKEN || !INBOX_URL) return null;
  const r = await fetch(`${INBOX_URL}/messages?address=${encodeURIComponent(EMAIL)}`, {
    headers: { authorization: `Bearer ${INBOX_TOKEN}` },
  });
  const messages = r.ok ? (await r.json()).messages || [] : [];
  const m = messages.find((x) => x.received_at > sinceIso && /shopify\.com/i.test(x.from || ''));
  return m ? sixDigits(m.subject) || sixDigits((m.otps || []).join(' ')) : null;
}

async function pollCode(page, sinceIso) {
  for (let i = 0; i < 24; i++) {
    const otp = await newestCode(sinceIso);
    if (otp) return otp;
    await page.waitForTimeout(5_000);
  }
  await shot(page, 'login-code-not-received');
  throw new Error('LOGIN-CODE: verification code never reached the org inbox');
}

async function shot(page, name) {
  const file = join(OUT, `${name}.png`);
  await page.screenshot({ path: file, fullPage: true });
  return file;
}

// One step of the post-password wait: stop on a captcha, enter a new-device code if asked.
async function handleChallenge(page, started) {
  if (await page.locator('iframe[src*="hcaptcha"], iframe[src*="captcha"]').count()) {
    await shot(page, 'login-bot-check');
    throw new Error('LOGIN-BOT-CHECK: Shopify showed a captcha; not solved by design');
  }
  const code = page.locator('input[autocomplete="one-time-code"], input[name*="code" i]').first();
  if (!(await code.isVisible().catch(() => false))) return;
  await code.fill(await pollCode(page, started));
  await page.keyboard.press('Enter');
}

// Land on the admin, or stop at a challenge. A bot check is reported, never solved.
async function waitForAdmin(page, started) {
  const deadline = Date.now() + 120_000;
  while (Date.now() < deadline && !page.url().startsWith(ADMIN)) {
    await handleChallenge(page, started);
    await page.waitForTimeout(2_000);
  }
}

async function signIn(browser) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const started = new Date().toISOString();
  await page.goto(`${ADMIN}`, { waitUntil: 'domcontentloaded' });
  await page.locator('input[name="account[email]"], input[type="email"]').first().fill(EMAIL);
  await page.keyboard.press('Enter');
  const pw = page.locator('input[name="account[password]"], input[type="password"]').first();
  await pw.waitFor({ timeout: 30_000 });
  await pw.fill(PASSWORD);
  await page.keyboard.press('Enter');

  await waitForAdmin(page, started);
  if (!page.url().startsWith(ADMIN)) {
    await shot(page, 'login-stuck');
    throw new Error(`LOGIN-STUCK at ${new URL(page.url()).host}${new URL(page.url()).pathname}`);
  }
  const state = await ctx.storageState();
  await ctx.close();
  log('signed in');
  return state;
}

// Opens one App Home page in the admin iframe and saves a full-page capture of it.
async function captureRoute(page, route, profile) {
  const t0 = Date.now();
  await page.goto(`${ADMIN}/apps/${clientId}${route}`, { waitUntil: 'domcontentloaded' });
  const iframe = page.locator('iframe[name="app-iframe"]');
  await iframe.waitFor({ timeout: 45_000 });
  const frame = await (await iframe.elementHandle()).contentFrame();
  await frame.waitForLoadState('networkidle', { timeout: 30_000 }).catch(() => {});
  await frame.locator('s-page, [data-polaris-layout], main, body').first().waitFor({ timeout: 30_000 });
  const ms = Date.now() - t0;
  // The admin scrolls its own container, not the document, so grow the viewport to the
  // app's full height before a full-page capture.
  const h = await frame.evaluate(() => document.documentElement.scrollHeight);
  const top = (await iframe.boundingBox())?.y || 0;
  const { width } = page.viewportSize();
  await page.setViewportSize({ width, height: Math.min(12_000, Math.ceil(top + h + 40)) });
  await page.waitForTimeout(800);
  const overflowX = await frame.evaluate(() => document.documentElement.scrollWidth > window.innerWidth);
  const file = await shot(page, `${profile.name}${route.replace(/\//g, '_')}`);
  await page.setViewportSize(profile.options.viewport);
  return { ms, overflowX, file };
}

async function capture(browser, state, profile) {
  const ctx = await browser.newContext({ ...profile.options, storageState: state });
  const page = await ctx.newPage();
  for (const route of routes) {
    let row = { profile: profile.name, route, ok: false };
    try {
      row = { ...row, ...(await captureRoute(page, route, profile)), ok: true };
    } catch (e) {
      row.error = String(e.message || e).split('\n')[0].slice(0, 300);
      await shot(page, `${profile.name}${route.replace(/\//g, '_')}-error`).catch(() => {});
    }
    results.push(row);
    log(profile.name, route, row.ok ? `ok ${row.ms}ms${row.overflowX ? ' OVERFLOW-X' : ''}` : `FAIL ${row.error}`);
  }
  await ctx.close();
}

const PROFILES = [
  { name: 'desktop', options: { viewport: { width: 1440, height: 900 } } },
  {
    name: 'phone',
    options: {
      ...devices['iPhone 14'],
      viewport: { width: 390, height: 844 },
    },
  },
];

const browser = await launch();
let exit = 0;
try {
  const state = await signIn(browser);
  for (const p of PROFILES) await capture(browser, state, p);
  if (results.some((r) => !r.ok || r.overflowX)) exit = 1;
} catch (e) {
  console.error('[app-home-screens]', String(e.message || e).split('\n')[0]);
  exit = 2;
} finally {
  await browser.close();
}

const lines = [
  `## App Home screens — ${routes.length} routes × ${PROFILES.length} profiles (grid: ${GRID})`,
  '',
  '| profile | route | result | load ms | horizontal overflow |',
  '|---|---|---|---|---|',
  ...results.map((r) => `| ${r.profile} | \`${r.route}\` | ${r.ok ? 'ok' : `FAIL: ${r.error}`} | ${r.ms ?? ''} | ${r.overflowX ? 'YES' : ''} |`),
];
if (!results.length) lines.push('', 'Sign-in failed — see the job log and the login-* screenshot.');
writeFileSync(join(OUT, 'summary.md'), lines.join('\n') + '\n');
writeFileSync(join(OUT, 'results.json'), JSON.stringify({ routes, results }, null, 2));
process.exit(exit);
