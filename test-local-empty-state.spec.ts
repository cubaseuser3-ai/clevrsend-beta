import { test, expect } from '@playwright/test';

test.describe('Local Test - Empty State with Import/Export Buttons', () => {
  test('should show Import/Export buttons even when no saved connections', async ({ page }) => {
    await page.goto('http://localhost:3000');
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

    // Take screenshot
    await page.screenshot({ path: 'local-empty-state.png', fullPage: true });
  });

  test('should show count badge when connections exist', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(2000);

    // Add test connections
    await page.evaluate(() => {
      const connections = [
        {
          id: 'test-1',
          deviceName: 'Test iPhone',
          deviceType: 'ios',
          lastConnected: Date.now(),
          qrData: 'qr-1'
        },
        {
          id: 'test-2',
          deviceName: 'Test Android',
          deviceType: 'android',
          lastConnected: Date.now() - 60000,
          qrData: 'qr-2'
        }
      ];
      localStorage.setItem('clevrsend_saved_qr_connections', JSON.stringify(connections));
    });

    // Reload
    await page.reload();
    await page.waitForTimeout(2000);

    // Navigate to InternetSend
    await page.getByRole('button', { name: /InternetSend/i }).click();
    await page.waitForTimeout(1000);

    // Verify count badge shows (2)
    const countBadge = await page.locator('.saved-count').textContent();
    console.log('Count badge text:', countBadge);
    expect(countBadge).toBe('(2)');

    // Verify both connections are shown
    const cards = await page.locator('.saved-connection-card').count();
    console.log('Number of connection cards:', cards);
    expect(cards).toBe(2);

    // Take screenshot
    await page.screenshot({ path: 'local-with-count.png', fullPage: true });

    // Clean up
    await page.evaluate(() => {
      localStorage.removeItem('clevrsend_saved_qr_connections');
    });
  });
});
