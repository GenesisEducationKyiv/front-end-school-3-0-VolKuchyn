import { test, expect, Page } from '@playwright/test';

test.describe('Create Track Modal - Integration Test', () => {
  test('should load genres and show validation error when title is empty', async ({ page }: { page: Page }) => {
    await page.route('**/genres', async route => {
      const genres = ['Rock', 'Pop', 'Jazz'];
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(genres),
      });
    });

    await page.goto('http://localhost:3000/tracks');

    await page.getByTestId('create-track-button').click();

    await expect(page.getByText('+ Rock')).toBeVisible();
    await expect(page.getByText('+ Pop')).toBeVisible();
    await expect(page.getByText('+ Jazz')).toBeVisible();
    await page.getByTestId('submit-button').click();
    await expect(page.getByText('Title is required')).toBeVisible();
    await expect(page.getByText('Artist is required')).toBeVisible();
    await expect(page.getByText('At least one genre must be selected')).toBeVisible();
  });
});