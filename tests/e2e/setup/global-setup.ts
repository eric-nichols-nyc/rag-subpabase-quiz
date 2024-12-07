import { chromium, FullConfig } from '@playwright/test'

async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch()
  const page = await browser.newPage()

  try {
    // Sign in to Clerk
    await page.goto('http://localhost:3000/sign-in')
    
    // Fill in credentials (you should use test credentials from env)
    await page.getByLabel('Email address').fill(process.env.TEST_USER_EMAIL || '')
    await page.getByLabel('Password').fill(process.env.TEST_USER_PASSWORD || '')
    await page.getByRole('button', { name: 'Sign in' }).click()

    // Wait for authentication to complete
    await page.waitForURL('http://localhost:3000')

    // Save signed-in state
    await page.context().storageState({
      path: './tests/e2e/setup/storageState.json'
    })
  } finally {
    await browser.close()
  }
}

export default globalSetup 