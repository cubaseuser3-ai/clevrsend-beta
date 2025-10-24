import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  console.log('🔍 Überprüfe Spotlight-Effekt...\n');

  await page.goto('https://clevrsend.vercel.app/de', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);

  // Check for peer-card-with-spotlight class
  const spotlightCards = await page.locator('.peer-card-with-spotlight').count();
  console.log(`✓ Peer-Cards mit Spotlight-Klasse: ${spotlightCards}`);

  // Check for peer-spotlight-overlay
  const overlays = await page.locator('.peer-spotlight-overlay').count();
  console.log(`✓ Spotlight-Overlay-Elemente: ${overlays}`);

  // Check HTML content
  const html = await page.content();
  const hasSpotlightClass = html.includes('peer-card-with-spotlight');
  const hasSpotlightOverlay = html.includes('peer-spotlight-overlay');
  const hasPeerCardContent = html.includes('peer-card-content');

  console.log(`\n📋 HTML-Checks:`);
  console.log(`- peer-card-with-spotlight in HTML: ${hasSpotlightClass ? '✓' : '✗'}`);
  console.log(`- peer-spotlight-overlay in HTML: ${hasSpotlightOverlay ? '✓' : '✗'}`);
  console.log(`- peer-card-content in HTML: ${hasPeerCardContent ? '✓' : '✗'}`);

  // Get the actual HTML of peer cards
  const peerCardHtml = await page.locator('.peer-card-content').first().innerHTML().catch(() => 'Nicht gefunden');
  console.log(`\n📄 Erste Peer-Card HTML (erste 500 Zeichen):\n${peerCardHtml.substring(0, 500)}`);

  await page.screenshot({ path: 'spotlight-check.png', fullPage: true });
  console.log(`\n📸 Screenshot: spotlight-check.png`);

  await browser.close();
})();
