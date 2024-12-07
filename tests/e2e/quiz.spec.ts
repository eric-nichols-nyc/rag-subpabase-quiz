import { test, expect } from '@playwright/test'

test.describe('Quiz Flow', () => {
  test.beforeEach(async ({ page }) => {
    // The page is already authenticated thanks to storageState
    await page.goto('/quiz/test-quiz-id')
  })

  test('completes full quiz flow', async ({ page }) => {
    // Wait for quiz to load
    await expect(page.getByText('Test Quiz')).toBeVisible()

    // Complete quiz flow
    await page.getByRole('radio', { name: '4' }).click()
    await expect(page.getByText('Question 2 of')).toBeVisible()
    
    // Test results page
    await expect(page.getByText('Quiz Results')).toBeVisible()
  })

  test('handles unauthorized access', async ({ browser }) => {
    // Create a new context without auth
    const context = await browser.newContext()
    const page = await context.newPage()
    
    await page.goto('/quiz/test-quiz-id')
    
    // Should redirect to sign-in
    await expect(page).toHaveURL(/.*sign-in/)
  })

  test('handles quiz not found', async ({ page }) => {
    await page.goto('/quiz/non-existent-id')
    await expect(page.getByText('Quiz not found')).toBeVisible()
  })

  test('validates user answers', async ({ page }) => {
    await page.goto('/quiz/test-quiz-id')
    
    // Try to proceed without answering
    await expect(page.getByRole('radio').first()).not.toBeChecked()
    
    // Answer question
    await page.getByRole('radio').first().click()
    await expect(page.getByRole('radio').first()).toBeChecked()
  })
}) 