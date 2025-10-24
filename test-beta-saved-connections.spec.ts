import { test, expect } from '@playwright/test';

test.describe('ClevrSend Beta - Saved QR Connections', () => {
  test('should display correct version', async ({ page }) => {
    await page.goto('https://clevrsend-beta.vercel.app');

    // Wait for version info to load
    await page.waitForTimeout(2000);

    // Check frontend version
    const frontendVersion = await page.locator('text=/Frontend:.*v1\\.6\\.0-beta\\.1/').isVisible();
    console.log('Frontend version v1.6.0-beta.1 visible:', frontendVersion);

    // Take screenshot
    await page.screenshot({ path: 'beta-homepage.png', fullPage: true });
  });

  test('should navigate to InternetSend mode', async ({ page }) => {
    await page.goto('https://clevrsend-beta.vercel.app');
    await page.waitForTimeout(2000);

    // Click on InternetSend tab
    await page.getByRole('button', { name: /InternetSend/i }).click();
    await page.waitForTimeout(1000);

    // Verify we're in InternetSend mode
    const qrHeading = await page.getByText(/Schnellverbindung via QR-Code/i).isVisible();
    expect(qrHeading).toBeTruthy();

    // Take screenshot
    await page.screenshot({ path: 'beta-internetsend.png', fullPage: true });
  });

  test('should check for saved connections section', async ({ page }) => {
    await page.goto('https://clevrsend-beta.vercel.app');
    await page.waitForTimeout(2000);

    // Navigate to InternetSend
    await page.getByRole('button', { name: /InternetSend/i }).click();
    await page.waitForTimeout(1000);

    // Check LocalStorage for saved connections
    const savedConnections = await page.evaluate(() => {
      const saved = localStorage.getItem('clevrsend_saved_qr_connections');
      return saved ? JSON.parse(saved) : [];
    });

    console.log('Saved connections in LocalStorage:', savedConnections);
    console.log('Number of saved connections:', savedConnections.length);

    // If there are saved connections, the section should be visible
    if (savedConnections.length > 0) {
      const savedSection = await page.locator('.saved-connections-section').isVisible();
      console.log('Saved connections section visible:', savedSection);
      expect(savedSection).toBeTruthy();
    } else {
      console.log('No saved connections yet - section should not be visible');
    }

    // Take screenshot
    await page.screenshot({ path: 'beta-saved-connections-check.png', fullPage: true });
  });

  test('should simulate adding a saved connection', async ({ page }) => {
    await page.goto('https://clevrsend-beta.vercel.app');
    await page.waitForTimeout(2000);

    // Navigate to InternetSend
    await page.getByRole('button', { name: /InternetSend/i }).click();
    await page.waitForTimeout(1000);

    // Add a test connection to LocalStorage
    await page.evaluate(() => {
      const testConnection = {
        id: 'test-' + Date.now(),
        deviceName: 'Test iPhone',
        deviceType: 'ios',
        lastConnected: Date.now(),
        qrData: 'test-qr-data-12345'
      };

      localStorage.setItem('clevrsend_saved_qr_connections', JSON.stringify([testConnection]));
    });

    // Reload to see the saved connection
    await page.reload();
    await page.waitForTimeout(2000);

    // Navigate to InternetSend again
    await page.getByRole('button', { name: /InternetSend/i }).click();
    await page.waitForTimeout(1000);

    // Check if saved connections section is now visible
    const savedSection = await page.locator('.saved-connections-section').isVisible();
    console.log('Saved connections section visible after adding test connection:', savedSection);

    // Check if our test device is displayed
    const testDevice = await page.getByText('Test iPhone').isVisible();
    console.log('Test iPhone device visible:', testDevice);

    // Take screenshot showing the saved connection
    await page.screenshot({ path: 'beta-with-saved-connection.png', fullPage: true });

    // Clean up - remove test connection
    await page.evaluate(() => {
      localStorage.removeItem('clevrsend_saved_qr_connections');
    });
  });

  test('should test export/import buttons', async ({ page }) => {
    await page.goto('https://clevrsend-beta.vercel.app');
    await page.waitForTimeout(2000);

    // Add a test connection
    await page.evaluate(() => {
      const testConnection = {
        id: 'test-export-' + Date.now(),
        deviceName: 'Export Test Device',
        deviceType: 'android',
        lastConnected: Date.now(),
        qrData: 'test-export-qr-data'
      };

      localStorage.setItem('clevrsend_saved_qr_connections', JSON.stringify([testConnection]));
    });

    await page.reload();
    await page.waitForTimeout(2000);

    // Navigate to InternetSend
    await page.getByRole('button', { name: /InternetSend/i }).click();
    await page.waitForTimeout(1000);

    // Check if Export and Import buttons are visible
    const exportButton = await page.getByTitle(/Backup erstellen/i).isVisible();
    const importButton = await page.getByTitle(/Backup wiederherstellen/i).isVisible();

    console.log('Export button visible:', exportButton);
    console.log('Import button visible:', importButton);

    // Take screenshot
    await page.screenshot({ path: 'beta-export-import-buttons.png', fullPage: true });

    // Clean up
    await page.evaluate(() => {
      localStorage.removeItem('clevrsend_saved_qr_connections');
    });
  });
});
