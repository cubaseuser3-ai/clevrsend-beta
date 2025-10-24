import { chromium } from '@playwright/test';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

await page.goto('https://clevrsend.vercel.app', { waitUntil: 'networkidle' });

// Wait a bit for animation to load
await page.waitForTimeout(3000);

// Take screenshot
await page.screenshot({ path: 'clevrsend-test.png', fullPage: false });

// Check canvas
const canvasInfo = await page.evaluate(() => {
  const canvas = document.querySelector('.dark-veil-canvas');
  if (!canvas) return { error: 'Canvas not found' };

  const rect = canvas.getBoundingClientRect();
  const style = window.getComputedStyle(canvas);

  return {
    canvasWidth: canvas.width,
    canvasHeight: canvas.height,
    displayWidth: rect.width,
    displayHeight: rect.height,
    cssWidth: style.width,
    cssHeight: style.height,
    position: style.position,
    top: style.top,
    left: style.left,
    zIndex: style.zIndex,
    display: style.display,
    windowWidth: window.innerWidth,
    windowHeight: window.innerHeight
  };
});

console.log('Canvas Info:', JSON.stringify(canvasInfo, null, 2));

await browser.close();
