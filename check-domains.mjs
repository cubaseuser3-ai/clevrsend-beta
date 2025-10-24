import { chromium } from '@playwright/test';

const browser = await chromium.launch({ headless: true });

// Test Production
console.log('🔍 Testing PRODUCTION: https://clevrsend.com...');
const prodPage = await browser.newPage();
try {
  await prodPage.goto('https://clevrsend.com', { waitUntil: 'networkidle', timeout: 30000 });
  await prodPage.waitForTimeout(2000);
  const prodBody = await prodPage.textContent('body');
  const prodVersion = prodBody.match(/v?1\.[0-9]+\.[0-9]+/);
  console.log('✅ Production loaded successfully!');
  console.log('   Version:', prodVersion ? prodVersion[0] : 'Not found');
} catch (err) {
  console.log('❌ Production error:', err.message);
}
await prodPage.close();

// Test Beta
console.log('\n🔍 Testing BETA: https://beta.clevrsend.com...');
const betaPage = await browser.newPage();
try {
  await betaPage.goto('https://beta.clevrsend.com', { waitUntil: 'networkidle', timeout: 30000 });
  await betaPage.waitForTimeout(2000);
  const betaBody = await betaPage.textContent('body');
  const betaVersion = betaBody.match(/v?1\.[0-9]+\.[0-9]+(-beta\.[0-9]+)?/);
  console.log('✅ Beta loaded successfully!');
  console.log('   Version:', betaVersion ? betaVersion[0] : 'Not found');
} catch (err) {
  console.log('❌ Beta error:', err.message);
}
await betaPage.close();

await browser.close();

console.log('\n🎉 Domain setup complete!');
console.log('   Production: https://clevrsend.com');
console.log('   Beta: https://beta.clevrsend.com');
