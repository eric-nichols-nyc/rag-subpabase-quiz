import { Page } from '@playwright/test'

export async function completeQuiz(page: Page) {
  // Helper function to complete a quiz
  await page.getByRole('radio').first().click()
  await page.getByRole('radio').first().click()
}

export async function answerQuestion(page: Page, answer: string) {
  // Helper function to answer a specific question
  await page.getByRole('radio', { name: answer }).click()
} 