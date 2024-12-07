import { Page } from '@playwright/test'

export async function signIn(page: Page) {
  await page.goto('/sign-in')
  await page.getByLabel('Email address').fill(process.env.TEST_USER_EMAIL || '')
  await page.getByLabel('Password').fill(process.env.TEST_USER_PASSWORD || '')
  await page.getByRole('button', { name: 'Sign in' }).click()
  await page.waitForURL('/')
}

export async function signOut(page: Page) {
  await page.getByRole('button', { name: /user/i }).click()
  await page.getByRole('menuitem', { name: /sign out/i }).click()
  await page.waitForURL('/sign-in')
} 