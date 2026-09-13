// Prints the built /resume/ page to dist/CV_Bauke_Brenninkmeijer.pdf.
// The resume page is the only source of truth; @media print in global.css
// decides what ends up on the page. Run after `astro build`.
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { createServer } from 'node:http';
import { mkdtemp, readFile, rename, rm, unlink } from 'node:fs/promises';
import { extname, join, relative, resolve, sep } from 'node:path';
import { tmpdir } from 'node:os';

const DIST = resolve('dist');
const OUT = join(DIST, 'CV_Bauke_Brenninkmeijer.pdf');
const MAX_PAGES = 2;

const CHROME_CANDIDATES = [
  process.env.CHROME_PATH,
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/google-chrome-stable',
  '/usr/bin/chromium-browser',
  '/usr/bin/chromium',
].filter(Boolean);

const chrome = CHROME_CANDIDATES.find((p) => existsSync(p));
if (!chrome) {
  throw new Error(`No Chrome found. Tried:\n${CHROME_CANDIDATES.join('\n')}\nSet CHROME_PATH.`);
}
if (!existsSync(DIST)) throw new Error(`${DIST} does not exist — run \`npm run build\` first.`);

const TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.json': 'application/json',
};

const server = createServer(async (req, res) => {
  const path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  const file = resolve(join(DIST, path.endsWith('/') ? `${path}index.html` : path));
  const inside = file === DIST || file.startsWith(DIST + sep);
  if (!inside) {
    res.writeHead(403).end();
    return;
  }
  try {
    const body = await readFile(file);
    res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' });
    res.end(body);
  } catch {
    console.warn(`404 ${relative(DIST, file)}`);
    res.writeHead(404).end();
  }
});

const port = await new Promise((ok, fail) => {
  server.once('error', fail);
  server.listen(0, () => ok(server.address().port));
});

const profile = await mkdtemp(join(tmpdir(), 'cv-chrome-'));
// Chrome writes incrementally, so print to a scratch path and only publish it
// once the process is done — a half-written PDF must never land on OUT.
const partial = `${OUT}.part`;
await unlink(partial).catch(() => {});

const args = [
  '--headless',
  '--disable-gpu',
  '--no-sandbox',
  '--no-first-run',
  '--disable-component-update',
  '--disable-background-networking',
  `--user-data-dir=${profile}`,
  '--no-pdf-header-footer',
  `--print-to-pdf=${partial}`,
  `http://localhost:${port}/resume/`,
];

async function print() {
  const child = spawn(chrome, args, { stdio: ['ignore', 'ignore', 'inherit'] });
  const done = new Promise((ok, fail) => {
    child.on('error', fail);
    child.on('exit', ok);
  });
  // Chrome occasionally writes the PDF and then lingers instead of exiting.
  const timeout = new Promise((ok) => setTimeout(() => ok('timeout'), 90_000));
  const result = await Promise.race([done, timeout]);
  child.kill('SIGKILL');
  if (result === 'timeout' && !existsSync(partial)) throw new Error('Chrome timed out with no PDF');
}

try {
  await print();
  if (!existsSync(partial)) throw new Error('Chrome exited without writing a PDF');

  const pdf = await readFile(partial);
  const pages = (pdf.toString('latin1').match(/\/Type\s*\/Page[^s]/g) ?? []).length;
  const text = pdf.toString('latin1');
  if (pages < 1 || pages > MAX_PAGES) {
    throw new Error(`CV is ${pages} page(s); the budget is ${MAX_PAGES}. Trim it, or raise the print font-size knob in global.css.`);
  }
  if (!text.includes('Brenninkmeijer')) {
    throw new Error('CV does not contain "Brenninkmeijer" — did the print stylesheet or the route break?');
  }

  await rename(partial, OUT);
  console.log(`Wrote ${OUT} (${pages} pages)`);
} finally {
  server.closeAllConnections();
  server.close();
  await rm(profile, { recursive: true, force: true });
  await unlink(partial).catch(() => {});
}

// Chrome leaves background helpers attached to our stdio on macOS; don't wait for them.
process.exit(0);
