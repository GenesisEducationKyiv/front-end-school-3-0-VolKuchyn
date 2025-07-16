import { test, expect } from '@playwright/test';
import path from 'path';



test('find track, toggle it, stop playing, creating track, editing track, uploading track, deleting track', async ({ page }) => {
  await page.goto('http://localhost:3000/tracks?sort=title&order=desc');

  await page.getByTestId('search-input').fill('boh');
  await page.getByTestId('search-input').press('Enter');
  await page.getByRole('img', { name: /Play icon/i }).first().click();
  await page.getByTestId(/^pause-button-/).first().click();
  await page.getByTestId('search-input').fill('');
  await page.getByTestId('create-track-button').click();
  await page.getByTestId('input-title').fill('test-track2');
  await page.getByTestId('input-artist').fill('test-artist');
  await page.getByTestId('input-album').fill('test-album');
  await page.getByRole('button', { name: '+ R&B' }).click();
  await page.getByTestId('submit-button').click();
  const trackCard = page.locator('div[data-testid^="track-item-"]', {
    hasText: 'test-track2',
  });
  await expect(trackCard).toBeVisible();

  const uploadButton = page.getByTestId(/^upload-track-/).filter({ hasText: '🎵 Add audio' }).first();
  await expect(uploadButton).toBeVisible();
  const audioPath = path.resolve('tests/playwright/silent_angel2_7dl.mp3');
  const fileInput = page.locator('input[type="file"]');
  await fileInput.setInputFiles(audioPath);

  await page.getByText('✏️ Edit a track').click();

  await page.getByTestId('input-title').fill('test-track2w');
  await page.getByTestId('genre-selector').click();
  await page.getByTestId('submit-button').click();

  await page.getByText('🗑️ Delete track').click();
  await page.getByTestId('confirm-delete').click();
});