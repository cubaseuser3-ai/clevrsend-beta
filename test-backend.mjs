import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Listen to console messages
  page.on('console', msg => {
    const text = msg.text();
    if (text.includes('Backend') || text.includes('Signaling') || text.includes('WebSocket') || text.includes('error')) {
      console.log(`🔍 Console [${msg.type()}]:`, text);
    }
  });

  // Navigate to the page
  console.log('📱 Opening https://clevrsend.vercel.app...');
  await page.goto('https://clevrsend.vercel.app', { waitUntil: 'networkidle' });

  // Wait a bit for WebSocket connection
  console.log('⏳ Waiting 10 seconds for backend connection...');
  await page.waitForTimeout(10000);

  // Check version info
  const versionInfo = await page.evaluate(() => {
    const versionElement = document.querySelector('.version-info');
    const statusRow = document.querySelector('.status-row');
    const versionItems = Array.from(document.querySelectorAll('.version-item'));

    return {
      versionText: versionElement?.textContent || 'Not found',
      statusText: statusRow?.textContent || 'Not found',
      versionItems: versionItems.map(item => item.textContent),
      versionItemCount: versionItems.length
    };
  });

  console.log('\n📊 Version Info:');
  console.log(JSON.stringify(versionInfo, null, 2));

  // Take screenshot
  await page.screenshot({ path: '/Users/mytech/Downloads/MyTech Apps/Alternative/ClevrSend/backend-test.png' });
  console.log('\n📸 Screenshot saved to backend-test.png');

  // Keep browser open for inspection
  console.log('\n✅ Test complete. Browser will stay open for 30 seconds...');
  await page.waitForTimeout(30000);

  await browser.close();
})();
