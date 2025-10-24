import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  console.log('Navigating to https://clevrsend.vercel.app/de...');
  await page.goto('https://clevrsend.vercel.app/de', { waitUntil: 'networkidle' });
  
  // Wait for page to load
  await page.waitForTimeout(3000);
  
  // Take screenshot
  await page.screenshot({ path: 'current-deployment.png', fullPage: true });
  console.log('Screenshot saved as current-deployment.png');
  
  // Check version number
  const versionText = await page.locator('.version-number').textContent();
  console.log('Version:', versionText?.trim());
  
  // Check if slide-down animation exists in Dialog component
  const pageContent = await page.content();
  const hasSlideDown = pageContent.includes('slide-down');
  console.log('Has slide-down animation:', hasSlideDown);
  
  // Check if spotlight effect exists in PeerCard
  const hasSpotlight = pageContent.includes('peer-card-spotlight');
  console.log('Has spotlight effect:', hasSpotlight);
  
  await browser.close();
})();
