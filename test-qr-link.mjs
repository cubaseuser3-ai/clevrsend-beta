import { chromium } from '@playwright/test';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const page = await browser.newPage();

  console.log('🔍 Teste QR-Connect Link...\n');

  // Setup console logging
  const consoleLogs = [];
  page.on('console', msg => {
    const type = msg.type();
    const text = msg.text();
    consoleLogs.push({ type, text });

    if (type === 'error') {
      console.log(`❌ Browser Error: ${text}`);
    } else if (text.includes('QR-Connect') || text.includes('WebRTC') || text.includes('connection')) {
      console.log(`📋 Log: ${text}`);
    }
  });

  // The QR link from the user
  const qrLink = 'https://clevrsend.vercel.app/?qr=eyJ0eXBlIjoiY2xldnJzZW5kLXFyLW9mZmVyIiwidmVyc2lvbiI6IjEuMCIsInBlZXJJZCI6IjNjNDhiNDVlLTM1NjQtNDI3YS04ZWY2LTJjOGMzODM5ZjY5NCIsInBlZXJBbGlhcyI6Ilppbm4iLCJvZmZlciI6eyJ0eXBlIjoib2ZmZXIiLCJzZHAiOiJ2PTBcclxubz0tIDQxOTUxNTU0MjYzMzE0MTg1NjQgMiBJTiBJUDQgMTI3LjAuMC4xXHJcbnM9LVxyXG50PTAgMFxyXG5hPWdyb3VwOkJVTkRMRSAwXHJcbmE9ZXh0bWFwLWFsbG93LW1peGVkXHJcbmE9bXNpZC1zZW1hbnRpYzogV01TXHJcbm09YXBwbGljYXRpb24gNjI0MjMgVURQL0RUTFMvU0NUUCB3ZWJydGMtZGF0YWNoYW5uZWxcclxuYz1JTiBJUDQgODEuMjIxLjE1OC45OFxyXG5hPWNhbmRpZGF0ZToyODg5MzkzMTUyIDEgdWRwIDIxMjIxOTQ2ODcgMTkyLjE2OC4xNzguNTcgNjEyODQgdHlwIGhvc3QgZ2VuZXJhdGlvbiAwIG5ldHdvcmstaWQgMSBuZXR3b3JrLWNvc3QgMTBcclxuYT1jYW5kaWRhdGU6Mjc5Njg5MDg1OSAxIHVkcCAyMTIyMjY1MzQzIGZkODU6OTRiYjo5ZGZiOjA6NDAwOmI4MmU6NmZlNzo3MjE5IDQ5NDA4IHR5cCBob3N0IGdlbmVyYXRpb24gMCBuZXR3b3JrLWlkIDIgbmV0d29yay1jb3N0IDEwXHJcbmE9Y2FuZGlkYXRlOjk4ODg1NzA0OSAxIHVkcCAxNjg1OTg3MDcxIDgxLjIyMS4xNTguOTggNjI0MjMgdHlwIHNyZmx4IHJhZGRyIDE5Mi4xNjguMTc4LjU3IHJwb3J0IDYxMjg0IGdlbmVyYXRpb24gMCBuZXR3b3JrLWlkIDEgbmV0d29yay1jb3N0IDEwXHJcbmE9Y2FuZGlkYXRlOjEzODUzMjg3ODggMSB0Y3AgMTUxODIxNDkxMSAxOTIuMTY4LjE3OC41NyA5IHR5cCBob3N0IHRjcHR5cGUgYWN0aXZlIGdlbmVyYXRpb24gMCBuZXR3b3JrLWlkIDEgbmV0d29yay1jb3N0IDEwXHJcbmE9Y2FuZGlkYXRlOjE0Nzg0OTE3NzUgMSB0Y3AgMTUxODI4NTU2NyBmZDg1Ojk0YmI6OWRmYjowOjQwMDpiODJlOjZmZTc6NzIxOSA5IHR5cCBob3N0IHRjcHR5cGUgYWN0aXZlIGdlbmVyYXRpb24gMCBuZXR3b3JrLWlkIDIgbmV0d29yay1jb3N0IDEwXHJcbmE9aWNlLXVmcmFnOnoySUJcclxuYT1pY2UtcHdkOkRpTTVlWW50M2pOaEorVWt0eDhIY3hMMFxyXG5hPWljZS1vcHRpb25zOnRyaWNrbGVcclxuYT1maW5nZXJwcmludDpzaGEtMjU2IEMzOjM3OkU5OkU1OjJEOkM5OjE3OjZCOkIyOjQyOkVGOjhGOkVCOkJFOjkyOkRFOjlEOkVFOjU3OjUzOjczOkY3OjYxOjRCOjJBOkYzOjFCOkY2OjJGOjEyOjQ4OjY4XHJcbmE9c2V0dXA6YWN0cGFzc1xyXG5hPW1pZDowXHJcbmE9c2N0cC1wb3J0OjUwMDBcclxuYT1tYXgtbWVzc2FnZS1zaXplOjI2MjE0NFxyXG4ifSwidGltZXN0YW1wIjoxNzYwOTYxNjg5MTIxfQ';

  console.log('📱 Öffne QR-Link...');
  console.log(`Link: ${qrLink.substring(0, 80)}...`);

  await page.goto(qrLink, { waitUntil: 'networkidle' });
  await page.waitForTimeout(5000); // Wait for processing

  console.log('\n✅ Seite geladen\n');

  // Check if we're in QR mode
  const qrModeActive = await page.locator('button:has-text("QR-Connect")').getAttribute('class');
  console.log(`QR-Connect Modus aktiv: ${qrModeActive?.includes('active') ? 'Ja' : 'Nein'}`);

  // Check for status messages
  const statusElements = await page.locator('.qr-connection-status').count();
  if (statusElements > 0) {
    const statusText = await page.locator('.qr-connection-status').textContent();
    console.log(`📢 Status: ${statusText}`);
  }

  // Check for answer QR code
  const answerQrVisible = await page.locator('text=Zeige deinen QR-Code').count();
  console.log(`Answer QR-Code Bereich: ${answerQrVisible > 0 ? 'Vorhanden' : 'Nicht gefunden'}`);

  // Check for canvas (QR code)
  const canvasCount = await page.locator('canvas').count();
  console.log(`Canvas Elemente: ${canvasCount}`);

  // Take screenshot
  await page.screenshot({ path: 'qr-link-test.png', fullPage: true });
  console.log('\n📸 Screenshot: qr-link-test.png');

  // Wait a bit more to see connection status changes
  console.log('\n⏳ Warte auf Connection State Changes...');
  await page.waitForTimeout(10000);

  // Check final status
  if (statusElements > 0) {
    const finalStatus = await page.locator('.qr-connection-status').textContent();
    console.log(`📢 Finaler Status: ${finalStatus}`);
  }

  // Print all QR-related console logs
  const qrLogs = consoleLogs.filter(log =>
    log.text.toLowerCase().includes('qr') ||
    log.text.toLowerCase().includes('webrtc') ||
    log.text.toLowerCase().includes('ice') ||
    log.text.toLowerCase().includes('connection')
  );

  if (qrLogs.length > 0) {
    console.log('\n📋 WebRTC/Connection Logs:');
    qrLogs.forEach(log => {
      const prefix = log.type === 'error' ? '❌' : log.type === 'warning' ? '⚠️' : '  ';
      console.log(`${prefix} ${log.text}`);
    });
  }

  // Check for errors
  const errors = consoleLogs.filter(log => log.type === 'error');
  if (errors.length > 0) {
    console.log('\n❌ Errors gefunden:');
    errors.forEach(err => console.log(`  - ${err.text}`));
  }

  await page.waitForTimeout(2000);
  await browser.close();

  console.log('\n✅ Test abgeschlossen');
})();
