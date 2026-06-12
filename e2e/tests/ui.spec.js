const { test, expect } = require('@playwright/test');

test.describe('FletNix UI E2E Tests', () => {
  let uniqueEmail = `ui_user_${Date.now()}@fletnix.com`;

  test('Complete User flow (Register -> Login -> Browse -> Search/Filter -> Modal -> Logout)', async ({ page }) => {
    // 1. Check AuthGuard: navigate to root, should redirect to login
    await page.goto('/');
    await expect(page).toHaveURL(/.*login/);

    // 2. Click "Register" tab to toggle view
    await page.click('button:has-text("Register")');

    // 3. Fill in registration form (minor: age 15)
    await page.fill('input[name="email"]', uniqueEmail);
    await page.fill('input[name="password"]', 'Password123!');
    await page.fill('input[name="age"]', '15');
    await page.click('button[type="submit"]');

    // 4. Wait for success message and automatic toggle back to login mode
    const successMsg = page.locator('text=Registration successful! You can now log in.');
    await expect(successMsg).toBeVisible();
    await expect(successMsg).toBeHidden({ timeout: 3000 });

    // 5. Fill in login form
    await page.fill('input[name="email"]', uniqueEmail);
    await page.fill('input[name="password"]', 'Password123!');
    await page.click('button[type="submit"]');

    // 6. Verify dashboard route browse page loaded
    await expect(page).toHaveURL(/.*browse/);

    // 7. Verify user panel displays the minor age information
    await expect(page.locator('text=Minor (<18)')).toBeVisible();
    await expect(page.locator('text=R-Rated Titles Filtered Out')).toBeVisible();

    // 8. Search for a specific show (e.g. "Kota Factory")
    await page.fill('input[placeholder*="Search by movie"]', 'Kota Factory');
    await page.click('button:has-text("Search")');

    // Wait for search result grid to update
    const showCard = page.locator('h3:has-text("Kota Factory")');
    await expect(showCard).toBeVisible();

    // 9. Clear Search
    await page.fill('input[placeholder*="Search by movie"]', '');
    await page.click('button:has-text("Search")');

    // 10. Filter by "Movies"
    await page.click('button:has-text("Movies")');
    // Verify that the TV Show "Kota Factory" is no longer visible and cards are Movies
    await expect(page.locator('h3:has-text("Kota Factory")')).not.toBeVisible();

    // 11. Click on the first Movie "View Details" button
    const firstDetailBtn = page.locator('button:has-text("View Details")').first();
    await firstDetailBtn.click();

    // 12. Verify Modal is displayed and has show fields
    const modal = page.locator('h2:has-text("Dick Johnson Is Dead")'); // or whatever first Movie is
    // Let's check a generic modal container
    await expect(page.locator('text=Genres / Categories')).toBeVisible();
    await expect(page.locator('text=Release Year')).toBeVisible();

    // 13. Close Modal
    await page.click('button:has-text("Close Details")');
    await expect(page.locator('text=Genres / Categories')).not.toBeVisible();

    // 14. Log out
    await page.click('button:has-text("Logout")');
    await expect(page).toHaveURL(/.*login/);
  });
});
