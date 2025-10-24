import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  console.log('🔍 Teste QR-Connect Funktionalität...\n');

  // Setup console logging
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    if (type === 'error') {
      console.log(`❌ Browser Error: ${text}`);
    } else if (text.includes('QR-Connect') || text.includes('qr') || text.includes('WebRTC')) {
      console.log(`📋 Browser Log: ${text}`);
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

  // Take screenshot
  await page.screenshot({ path: 'qr-connect-mode.png', fullPage: true });
  console.log('📸 Screenshot: qr-connect-mode.png\n');

  // Check if QR send section is visible
  const qrSendSection = page.locator('text=Dateien senden');
  const hasSendSection = await qrSendSection.count() > 0;
  console.log(`${hasSendSection ? '✓' : '✗'} QR Senden-Bereich vorhanden: ${hasSendSection}`);

  // Check if receive section is visible
  const qrReceiveSection = page.locator('text=Dateien empfangen');
  const hasReceiveSection = await qrReceiveSection.count() > 0;
  console.log(`${hasReceiveSection ? '✓' : '✗'} QR Empfangen-Bereich vorhanden: ${hasReceiveSection}\n`);

  // Try to generate QR code for sending
  console.log('📱 Versuche QR-Code zu generieren...');
  const generateButton = page.locator('button:has-text("QR-Code generieren")');
  const hasGenerateButton = await generateButton.count() > 0;

  if (hasGenerateButton) {
    console.log('✓ "QR-Code generieren" Button gefunden');

    // Click the button
    await generateButton.click();
    await page.waitForTimeout(3000); // Wait for WebRTC setup

    console.log('⏳ Warte auf QR-Code Generierung...\n');

    // Check for QR code canvas
    const qrCanvas = page.locator('canvas');
    const canvasCount = await qrCanvas.count();
    console.log(`📊 Canvas-Elemente gefunden: ${canvasCount}`);

    // Check for status message
    const statusElement = page.locator('.qr-connection-status, .status-indicator');
    const statusCount = await statusElement.count();
    if (statusCount > 0) {
      const statusText = await statusElement.first().textContent();
      console.log(`📢 Status: ${statusText}`);
    }

    // Take screenshot after generation
    await page.screenshot({ path: 'qr-code-generated.png', fullPage: true });
    console.log('📸 Screenshot: qr-code-generated.png');
  } else {
    console.log('✗ "QR-Code generieren" Button nicht gefunden!');
  }

  // Check browser console for errors
  console.log('\n🔍 Browser Console überprüft (siehe oben)');

  await page.waitForTimeout(2000);
  await browser.close();
})();
