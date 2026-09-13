// Prints the built /resume/ page to dist/CV_Bauke_Brenninkmeijer.pdf.
// The resume page is the only source of truth; @media print in global.css
// decides what ends up on the page. Run after `astro build`.
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, resolve } from 'node:path';
import { mkdtemp, rm, unlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';

const DIST = resolve('dist');
const OUT = join(DIST, 'CV_Bauke_Brenninkmeijer.pdf');
const PORT = 4399;

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

// ponytail: three content types is all dist/resume/ pulls in; extend if that changes.
const TYPES = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript' };

const server = createServer(async (req, res) => {
  const path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  const file = join(DIST, path.endsWith('/') ? `${path}index.html` : path);
  if (!resolve(file).startsWith(DIST)) {
    res.writeHead(403).end();
    return;
  }
  try {
    const body = await readFile(file);
    res.writeHead(200, { 'content-type': TYPES[extname(file)] ?? 'application/octet-stream' });
    res.end(body);
  } catch {
    res.writeHead(404).end();
  }
});

await new Promise((ok) => server.listen(PORT, ok));

// A stale copy (e.g. one still committed under public/) would make the
// "is it written yet" check below pass instantly.
await unlink(OUT).catch(() => {});

const profile = await mkdtemp(join(tmpdir(), 'cv-chrome-'));
const args = [
  '--headless',
  '--disable-gpu',
  '--no-sandbox',
  '--no-first-run',
  '--disable-component-update',
  '--disable-background-networking',
  `--user-data-dir=${profile}`,
  '--no-pdf-header-footer',
  `--print-to-pdf=${OUT}`,
  `http://localhost:${PORT}/resume/`,
];

// Chrome sometimes writes the PDF and then lingers (macOS, old headless mode),
// so treat "file on disk and stable" as done and kill it.
const child = spawn(chrome, args, { stdio: ['ignore', 'ignore', 'inherit'] });
const exited = new Promise((ok) => child.on('exit', ok));
const printed = (async () => {
  for (let i = 0; i < 120; i++) {
    await new Promise((ok) => setTimeout(ok, 500));
    if (existsSync(OUT)) {
      await new Promise((ok) => setTimeout(ok, 500));
      return 0;
    }
  }
  return 1;
})();
const code = await Promise.race([exited, printed]);
child.kill('SIGKILL');

server.close();
await rm(profile, { recursive: true, force: true });

if (code !== 0 || !existsSync(OUT)) throw new Error(`Chrome failed to write ${OUT} (exit ${code})`);
console.log(`Wrote ${OUT}`);
// Chrome leaves background helpers attached to our stdio on macOS; don't wait for them.
process.exit(0);
