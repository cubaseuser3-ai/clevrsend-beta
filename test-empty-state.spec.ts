import { test, expect } from '@playwright/test';

test.describe('ClevrSend Beta - Empty State with Import/Export Buttons', () => {
  test('should show Import/Export buttons even when no saved connections', async ({ page }) => {
    await page.goto('https://clevrsend-beta.vercel.app');
    await page.waitForTimeout(2000);

    // Clear any existing saved connections
    await page.evaluate(() => {
      localStorage.removeItem('clevrsend_saved_qr_connections');
    });

    // Navigate to InternetSend
    await page.getByRole('button', { name: /InternetSend/i }).click();
    await page.waitForTimeout(1000);

    // Verify saved connections section is visible
    const savedSection = await page.locator('.saved-connections-section').isVisible();
    console.log('Saved connections section visible (empty state):', savedSection);
    expect(savedSection).toBeTruthy();

    // Verify Import button is visible
    const importButton = await page.getByTitle(/Backup wiederherstellen/i).isVisible();
    console.log('Import button visible (empty state):', importButton);
    expect(importButton).toBeTruthy();

    // Verify Export button is visible
    const exportButton = await page.getByTitle(/Backup erstellen/i).isVisible();
    console.log('Export button visible (empty state):', exportButton);
    expect(exportButton).toBeTruthy();

    // Verify empty state message is shown
    const emptyText = await page.getByText(/Keine gespeicherten Verbindungen/i).isVisible();
    console.log('Empty state message visible:', emptyText);
    expect(emptyText).toBeTruthy();

    // Verify empty hint is shown
    const emptyHint = await page.getByText(/Verbinde dich via QR-Code/i).isVisible();
    console.log('Empty state hint visible:', emptyHint);
    expect(emptyHint).toBeTruthy();

    // Take screenshot
    await page.screenshot({ path: 'beta-empty-state.png', fullPage: true });
  });

  test('should allow import when no connections exist', async ({ page }) => {
    await page.goto('https://clevrsend-beta.vercel.app');
    await page.waitForTimeout(2000);

    // Clear any existing saved connections
    await page.evaluate(() => {
      localStorage.removeItem('clevrsend_saved_qr_connections');
    });

    // Navigate to InternetSend
    await page.getByRole('button', { name: /InternetSend/i }).click();
    await page.waitForTimeout(1000);

    // Try to click import button (this should work even with empty state)
    const importButton = page.getByTitle(/Backup wiederherstellen/i);
    const isClickable = await importButton.isEnabled();
    console.log('Import button is clickable:', isClickable);
    expect(isClickable).toBeTruthy();
  });

  test('should transition from empty to filled state', async ({ page }) => {
    await page.goto('https://clevrsend-beta.vercel.app');
    await page.waitForTimeout(2000);

    // Clear connections
    await page.evaluate(() => {
      localStorage.removeItem('clevrsend_saved_qr_connections');
    });

    // Navigate to InternetSend
    await page.getByRole('button', { name: /InternetSend/i }).click();
    await page.waitForTimeout(1000);

    // Verify empty state
    const emptyBefore = await page.locator('.saved-connections-empty').isVisible();
    console.log('Empty state visible before adding connection:', emptyBefore);
    expect(emptyBefore).toBeTruthy();

    // Add a connection
    await page.evaluate(() => {
      const testConnection = {
        id: 'test-' + Date.now(),
        deviceName: 'Test Device',
        deviceType: 'web',
        lastConnected: Date.now(),
        qrData: 'test-qr-data'
      };
      localStorage.setItem('clevrsend_saved_qr_connections', JSON.stringify([testConnection]));
    });

    // Reload
    await page.reload();
    await page.waitForTimeout(2000);
    await page.getByRole('button', { name: /InternetSend/i }).click();
    await page.waitForTimeout(1000);

    // Verify filled state
    const emptyAfter = await page.locator('.saved-connections-empty').isVisible();
    console.log('Empty state visible after adding connection:', emptyAfter);
    expect(emptyAfter).toBeFalsy();

    // Verify connection card is visible
    const connectionCard = await page.locator('.saved-connection-card').isVisible();
    console.log('Connection card visible:', connectionCard);
    expect(connectionCard).toBeTruthy();

    // Verify count badge is shown
    const countBadge = await page.locator('.saved-count').isVisible();
    console.log('Count badge visible:', countBadge);
    expect(countBadge).toBeTruthy();

    // Take screenshot
    await page.screenshot({ path: 'beta-filled-state.png', fullPage: true });

    // Clean up
    await page.evaluate(() => {
      localStorage.removeItem('clevrsend_saved_qr_connections');
    });
  });
});
