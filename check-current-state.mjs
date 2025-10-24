import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();
  
  console.log('Öffne https://clevrsend.vercel.app/de...');
  await page.goto('https://clevrsend.vercel.app/de', { waitUntil: 'domcontentloaded' });
  
  await page.waitForTimeout(5000);
  
  // Screenshot vom aktuellen Zustand
  await page.screenshot({ path: 'clevrsend-state.png', fullPage: false });
  console.log('Screenshot gespeichert: clevrsend-state.png');
  
  // Prüfe ob Peer-Karten vorhanden sind
  const peerCards = await page.locator('[class*="peer"]').count();
  console.log('Anzahl Peer-bezogene Elemente:', peerCards);
  
  await browser.close();
})();
