import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  console.log('🔍 Teste QR-Connect Funktionalität (Detailliert)...\n');

  // Setup console logging
  const consoleLogs = [];
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    consoleLogs.push({ type, text });
    if (type === 'error') {
      console.log(`❌ Browser Error: ${text}`);
    }
  });

  // Navigate to page
  await page.goto('https://clevrsend.vercel.app/de', { waitUntil: 'networkidle' });
  await page.waitForTimeout(2000);

  console.log('✓ Seite geladen\n');

  // Switch to QR-Connect mode
  console.log('🔄 Wechsle zu QR-Connect Modus...');
  const qrModeButton = page.locator('button:has-text("QR-Connect")');
  await qrModeButton.click();
  await page.waitForTimeout(1000);

  console.log('✓ QR-Connect Modus aktiviert\n');

  // Try to click "QR-Code anzeigen" button
  console.log('📱 Klicke auf "QR-Code anzeigen" Button...');
  const showQrButton = page.locator('button:has-text("QR-Code anzeigen")');
  const hasButton = await showQrButton.count() > 0;

  if (hasButton) {
    console.log('✓ Button gefunden, klicke...');
    await showQrButton.click();
    await page.waitForTimeout(5000); // Wait for WebRTC setup

    // Take screenshot after clicking
    await page.screenshot({ path: 'qr-code-clicked.png', fullPage: true });
    console.log('📸 Screenshot nach Klick: qr-code-clicked.png\n');

    // Check for canvas elements
    const canvasElements = await page.locator('canvas').count();
    console.log(`📊 Canvas-Elemente gefunden: ${canvasElements}`);

    // Check for status messages
    const statusElements = await page.locator('.qr-connection-status').count();
    if (statusElements > 0) {
      const statusText = await page.locator('.qr-connection-status').textContent();
      console.log(`📢 Status: ${statusText}`);
    }

    // Check for QR code visibility
    const qrCodeVisible = await page.locator('canvas').first().isVisible().catch(() => false);
    console.log(`${qrCodeVisible ? '✓' : '✗'} QR-Code sichtbar: ${qrCodeVisible}`);

    // Check for copy link button
    const copyLinkButton = await page.locator('button:has-text("Link kopieren")').count();
    console.log(`${copyLinkButton > 0 ? '✓' : '✗'} "Link kopieren" Button vorhanden: ${copyLinkButton > 0}`);

  } else {
    console.log('✗ "QR-Code anzeigen" Button nicht gefunden!');

    // List all buttons on the page
    const allButtons = await page.locator('button').allTextContents();
    console.log('\n📋 Alle Buttons auf der Seite:');
    allButtons.forEach((text, i) => {
      if (text.trim()) console.log(`  ${i + 1}. "${text.trim()}"`);
    });
  }

  // Check for errors in console
  const errors = consoleLogs.filter(log => log.type === 'error');
  if (errors.length > 0) {
    console.log('\n❌ Browser Console Errors:');
    errors.forEach(err => console.log(`  - ${err.text}`));
  }

  // Check for QR-Connect related logs
  const qrLogs = consoleLogs.filter(log =>
    log.text.toLowerCase().includes('qr') ||
    log.text.toLowerCase().includes('webrtc') ||
    log.text.toLowerCase().includes('connection')
  );
  if (qrLogs.length > 0) {
    console.log('\n📋 QR/WebRTC Related Logs:');
    qrLogs.forEach(log => console.log(`  - ${log.text}`));
  }

  await page.waitForTimeout(3000);
  await browser.close();

  console.log('\n✅ Test abgeschlossen');
})();
