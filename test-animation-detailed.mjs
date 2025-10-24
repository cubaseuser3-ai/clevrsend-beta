import { chromium } from '@playwright/test';

const browser = await chromium.launch({ headless: false });
const context = await browser.newContext({
  viewport: { width: 1920, height: 1080 }
});
const page = await context.newPage();

await page.goto('https://clevrsend.vercel.app', { waitUntil: 'networkidle' });

// Wait for animation to load
await page.waitForTimeout(3000);

// Get detailed canvas info
const canvasInfo = await page.evaluate(() => {
  const canvas = document.querySelector('.dark-veil-canvas');
  if (!canvas) return { error: 'Canvas not found' };

  const rect = canvas.getBoundingClientRect();
  const style = window.getComputedStyle(canvas);
  const parent = canvas.parentElement;
  const parentRect = parent ? parent.getBoundingClientRect() : null;

  return {
    canvas: {
      width: canvas.width,
      height: canvas.height,
      style: {
        width: style.width,
        height: style.height,
        position: style.position,
        top: style.top,
        left: style.left,
        right: style.right,
        bottom: style.bottom,
        zIndex: style.zIndex,
        display: style.display,
        transform: style.transform,
      },
      rect: {
        x: rect.x,
        y: rect.y,
        width: rect.width,
        height: rect.height,
        top: rect.top,
        left: rect.left,
      }
    },
    parent: parentRect ? {
      width: parentRect.width,
      height: parentRect.height,
      x: parentRect.x,
      y: parentRect.y
    } : null,
    window: {
      innerWidth: window.innerWidth,
      innerHeight: window.innerHeight,
    }
  };
});

console.log('Canvas Details:', JSON.stringify(canvasInfo, null, 2));

// Take screenshot
await page.screenshot({ path: 'clevrsend-test-1920.png', fullPage: false });

console.log('\nScreenshot saved to clevrsend-test-1920.png');
console.log('Browser will stay open for 10 seconds for manual inspection...');

await page.waitForTimeout(10000);

await browser.close();
