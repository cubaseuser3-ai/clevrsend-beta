import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  console.log('🔍 Überprüfe https://clevrsend.vercel.app/de...\n');
  await page.goto('https://clevrsend.vercel.app/de', { waitUntil: 'networkidle' });
  await page.waitForTimeout(3000);
  
  // Get page HTML
  const html = await page.content();
  
  // Check 1: Version
  const version = await page.locator('.version-number').textContent();
  console.log('✓ Version:', version?.trim());
  
  // Check 2: Slide-down animation
  const hasSlideDown = html.includes('slide-down');
  console.log(hasSlideDown ? '✓ Slide-down Animation: Vorhanden' : '✗ Slide-down Animation: FEHLT');
  
  // Check 3: Spotlight effect
  const hasSpotlight = html.includes('peer-card-spotlight');
  console.log(hasSpotlight ? '✓ Spotlight-Effekt: Vorhanden' : '✗ Spotlight-Effekt: FEHLT');
  
  // Check 4: SessionDialog improvements
  const hasTransferContent = html.includes('transfer-content');
  console.log(hasTransferContent ? '✓ Neuer Transfer-Dialog: Vorhanden' : '✗ Neuer Transfer-Dialog: FEHLT');
  
  // Check 5: Newest label color (should be darker)
  const newestLabelMatch = html.match(/\.newest-label[^}]*background[^;]*rgba\(139[^)]*\)/);
  if (newestLabelMatch) {
    console.log('✓ "Neuster Empfänger" Farbe:', newestLabelMatch[0].substring(0, 80) + '...');
  }
  
  await page.screenshot({ path: 'final-verification.png', fullPage: false });
  console.log('\n📸 Screenshot: final-verification.png');
  
  await browser.close();
})();
