import { test, expect } from '@playwright/test';

test.describe('My Devices Room System', () => {
  test('should display empty room state', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(2000);

    // Navigate to InternetSend
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const internetSendBtn = buttons.find(b => b.textContent?.includes('InternetSend'));
      if (internetSendBtn) internetSendBtn.click();
    });
    await page.waitForTimeout(1000);

    // Check for room empty state
    const emptyText = await page.getByText(/Noch kein Raum erstellt/i).isVisible();
    console.log('Empty room state visible:', emptyText);
    expect(emptyText).toBeTruthy();

    // Check for create room button
    const createButton = await page.getByText(/Neuen Raum erstellen/i).isVisible();
    console.log('Create room button visible:', createButton);
    expect(createButton).toBeTruthy();

    // Check for join room button
    const joinButton = await page.getByText(/Raum beitreten/i).isVisible();
    console.log('Join room button visible:', joinButton);
    expect(joinButton).toBeTruthy();

    // Take screenshot
    await page.screenshot({ path: 'room-empty-state.png', fullPage: true });
  });

  test('should create a room', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(2000);

    // Navigate to InternetSend
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const internetSendBtn = buttons.find(b => b.textContent?.includes('InternetSend'));
      if (internetSendBtn) internetSendBtn.click();
    });
    await page.waitForTimeout(1000);

    // Click create room
    await page.getByText(/Neuen Raum erstellen/i).click();
    await page.waitForTimeout(2000);

    // Check if room code is visible
    const roomCodeLabel = await page.getByText(/Raum-Code:/i).isVisible();
    console.log('Room code label visible:', roomCodeLabel);
    expect(roomCodeLabel).toBeTruthy();

    // Check if leave button is visible
    const leaveButton = await page.getByText(/Raum verlassen/i).isVisible();
    console.log('Leave room button visible:', leaveButton);
    expect(leaveButton).toBeTruthy();

    // Take screenshot
    await page.screenshot({ path: 'room-created.png', fullPage: true });
  });

  test('should show join room dialog', async ({ page }) => {
    await page.goto('http://localhost:3000');
    await page.waitForTimeout(2000);

    // Navigate to InternetSend
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const internetSendBtn = buttons.find(b => b.textContent?.includes('InternetSend'));
      if (internetSendBtn) internetSendBtn.click();
    });
    await page.waitForTimeout(1000);

    // Click join room
    await page.getByText(/Raum beitreten/i).click();
    await page.waitForTimeout(500);

    // Check if dialog is visible
    const dialogTitle = await page.getByText(/Raum beitreten/i).nth(1).isVisible();
    console.log('Join room dialog visible:', dialogTitle);
    expect(dialogTitle).toBeTruthy();

    // Check if input field is visible
    const input = await page.locator('.room-code-input').isVisible();
    console.log('Room code input visible:', input);
    expect(input).toBeTruthy();

    // Take screenshot
    await page.screenshot({ path: 'room-join-dialog.png', fullPage: true });
  });
});
