import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { CATEGORIES } from '../constants/Categories.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.join(__dirname, '../../dist');
const PORT = 5050;
const BASE_URL = `http://localhost:${PORT}`;

const toSlug = (name) => name.toLowerCase().replace(/\s+/g, '-');

// Build the same route list the sitemap uses
const getRoutes = () => {
  const routes = ['/', '/favorites'];
  CATEGORIES.forEach(({ name, subcategories }) => {
    const categorySlug = toSlug(name);
    subcategories.forEach((subcategory) => {
      if (subcategory === 'Index') return;
      routes.push(`/${categorySlug}/${toSlug(subcategory)}`);
    });
  });
  return routes;
};

// Minimal static file server for the dist/ folder (SPA fallback to index.html)
const mimeTypes = {
  '.html': 'text/html', '.js': 'application/javascript', '.css': 'text/css',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg',
  '.json': 'application/json', '.ico': 'image/x-icon', '.webmanifest': 'application/manifest+json'
};

function startServer() {
  return new Promise((resolve) => {
    const server = http.createServer((req, res) => {
      let filePath = path.join(DIST_DIR, decodeURIComponent(req.url.split('?')[0]));
      if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
        filePath = path.join(DIST_DIR, 'index.html'); // SPA fallback
      }
      const ext = path.extname(filePath);
      res.setHeader('Content-Type', mimeTypes[ext] || 'application/octet-stream');
      fs.createReadStream(filePath).pipe(res);
    });
    server.listen(PORT, () => resolve(server));
  });
}

async function launchBrowser() {
  // On Vercel's Linux build machine, use the serverless-compatible Chromium
  // eslint-disable-next-line no-undef
  if (process.env.VERCEL) {
    const chromium = (await import('@sparticuz/chromium')).default;
    const puppeteerCore = (await import('puppeteer-core')).default;
    return puppeteerCore.launch({
      args: chromium.args,
      defaultViewport: chromium.defaultViewport,
      executablePath: await chromium.executablePath(),
      headless: chromium.headless
    });
  }

  // Local dev (Windows/Mac/Linux) — use full puppeteer with its bundled Chromium
  const puppeteer = (await import('puppeteer')).default;
  return puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
}

async function prerender() {
  console.log('Starting static server...');
  const server = await startServer();

  console.log('Launching headless browser...');
  const browser = await launchBrowser();
  const page = await browser.newPage();

  const routes = getRoutes();
  console.log(`Prerendering ${routes.length} routes...`);

  for (const route of routes) {
    try {
      await page.goto(`${BASE_URL}${route}`, { waitUntil: 'networkidle0', timeout: 30000 });
      // give lazy-loaded / animated components a moment to mount
      await new Promise((r) => setTimeout(r, 500));

      const html = await page.content();

      const outDir = route === '/' ? DIST_DIR : path.join(DIST_DIR, route);
      fs.mkdirSync(outDir, { recursive: true });
      fs.writeFileSync(path.join(outDir, 'index.html'), html, 'utf-8');

      console.log(`  ✓ ${route}`);
    } catch (err) {
      console.error(`  ✗ ${route} — ${err.message}`);
    }
  }

  await browser.close();
  server.close();
  console.log('Prerendering complete.');
}

prerender();