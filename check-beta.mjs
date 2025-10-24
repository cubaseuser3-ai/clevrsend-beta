import { chromium } from '@playwright/test';

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

console.log('🔍 Checking Beta: https://clevrsend-beta.vercel.app...');
await page.goto('https://clevrsend-beta.vercel.app', { waitUntil: 'networkidle' });

// Wait for app to initialize
await page.waitForTimeout(3000);

// Check visible version text on page
const bodyText = await page.textContent('body');
const versionMatches = bodyText.match(/v?1\.[0-9]+\.[0-9]+(-beta\.[0-9]+)?/g);
if (versionMatches) {
  console.log('\n🏷️  Versions found:', [...new Set(versionMatches)]);
} else {
  console.log('\n⚠️  No version found in page');
}

// Check for BETA indicator
if (bodyText.includes('BETA') || bodyText.includes('Beta') || bodyText.includes('beta')) {
  console.log('✅ BETA indicator found');
}

// Try to find version in footer or version display
const versionElement = await page.locator('[class*="version"]').first().textContent().catch(() => null);
if (versionElement) {
  console.log('📍 Version element:', versionElement);
}

await browser.close();
