import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ headless: false }); // Run in headed mode to see interaction
  const page = await browser.newPage();

  console.log('🔍 Teste Spotlight-Interaktion...\n');

  await page.goto('https://clevrsend.vercel.app/de', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  // Look for peer card with spotlight
  const spotlightCard = page.locator('.peer-card-with-spotlight').first();
  const cardExists = await spotlightCard.count() > 0;

  console.log(`✓ Spotlight-Card gefunden: ${cardExists ? 'Ja' : 'Nein'}`);

  if (cardExists) {
    // Get the bounding box
    const box = await spotlightCard.boundingBox();
    console.log(`✓ Card Position: x=${box.x}, y=${box.y}, width=${box.width}, height=${box.height}`);

    // Hover over the card
    console.log('🖱️ Hovere über Card...');
    await spotlightCard.hover();
    await page.waitForTimeout(500);

    // Move mouse around on the card to trigger spotlight
    console.log('🖱️ Bewege Maus über Card...');
    const centerX = box.x + box.width / 2;
    const centerY = box.y + box.height / 2;

    await page.mouse.move(centerX - 50, centerY - 50);
    await page.waitForTimeout(200);
    await page.mouse.move(centerX + 50, centerY - 50);
    await page.waitForTimeout(200);
    await page.mouse.move(centerX + 50, centerY + 50);
    await page.waitForTimeout(200);
    await page.mouse.move(centerX - 50, centerY + 50);
    await page.waitForTimeout(200);

    // Check overlay opacity
    const overlay = page.locator('.peer-spotlight-overlay').first();
    const opacity = await overlay.evaluate(el => window.getComputedStyle(el).opacity);
    console.log(`✓ Overlay Opacity: ${opacity}`);

    // Check overlay background
    const background = await overlay.evaluate(el => window.getComputedStyle(el).background);
    console.log(`✓ Overlay Background: ${background.substring(0, 100)}...`);

    // Take screenshot during hover
    await page.screenshot({ path: 'spotlight-hover.png', fullPage: false });
    console.log(`\n📸 Screenshot während Hover: spotlight-hover.png`);
  } else {
    console.log('❌ Keine Spotlight-Card gefunden!');
  }

  await page.waitForTimeout(2000);
  await browser.close();
})();
