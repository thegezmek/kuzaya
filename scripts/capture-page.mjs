import { chromium } from 'playwright';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const outDir = path.join(root, 'public', 'exports');
const outFile = path.join(outDir, 'kuzaya-full-page.jpg');

const url = process.env.CAPTURE_URL ?? 'http://localhost:5173/?capture=1';
const width = Number(process.env.CAPTURE_WIDTH ?? 1440);

async function scrollThroughPage(page) {
  await page.evaluate(async () => {
    const delay = (ms) => new Promise((r) => setTimeout(r, ms));
    const step = Math.max(300, Math.floor(window.innerHeight * 0.75));
    let y = 0;
    const max = document.documentElement.scrollHeight;

    while (y < max) {
      window.scrollTo(0, y);
      await delay(200);
      y += step;
    }

    window.scrollTo(0, document.documentElement.scrollHeight);
    await delay(500);
    window.scrollTo(0, 0);
    await delay(300);
  });
}

async function waitForImages(page) {
  await page.evaluate(async () => {
    const imgs = Array.from(document.images);
    await Promise.all(
      imgs.map(
        (img) =>
          img.complete
            ? Promise.resolve()
            : new Promise((resolve) => {
                img.addEventListener('load', resolve, { once: true });
                img.addEventListener('error', resolve, { once: true });
              }),
      ),
    );
  });
}

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage({ viewport: { width, height: 900 } });

try {
  await page.goto(url, { waitUntil: 'networkidle', timeout: 120_000 });
  await page.waitForTimeout(5000);

  await scrollThroughPage(page);
  await waitForImages(page);

  await page.addStyleTag({
    content: `
      .reveal-section {
        opacity: 1 !important;
        transform: none !important;
        transition: none !important;
      }
      .explore-prompt,
      .map-hint {
        display: none !important;
      }
    `,
  });

  await page.waitForTimeout(1000);
  await waitForImages(page);

  await mkdir(outDir, { recursive: true });

  const height = await page.evaluate(() => document.documentElement.scrollHeight);
  console.log(`Page height: ${height}px`);

  await page.screenshot({
    path: outFile,
    fullPage: true,
    type: 'jpeg',
    quality: 92,
  });

  console.log(`Saved: ${outFile}`);
} finally {
  await browser.close();
}
