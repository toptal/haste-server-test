import { StatusCodes } from 'http-status-codes'
import { test as baseTest } from '@playwright/test'

import { getPageLocators, pageSelectors } from '~/test/e2e/lib'
import { test, expect } from '~/test/e2e/lib/baseFixtures'

test.describe('Token Fetching and Generation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/documentation')

    await getPageLocators(page).SignInButton.click()
  })

  baseTest(
    'get token returns unauthorized if session is not present',
    async ({ request }) => {
      const response = await request.get(`/api/token`)

      expect(response.ok()).toEqual(false)
      expect(response.status()).toEqual(StatusCodes.UNAUTHORIZED)
    }
  )

  baseTest(
    'post token returns unauthorized if session is not present',
    async ({ request }) => {
      const response = await request.post(`/api/token`)

      expect(response.ok()).toEqual(false)
      expect(response.status()).toEqual(StatusCodes.UNAUTHORIZED)
    }
  )

  test('presents token and updates when generate token is clicked', async ({
    page
  }) => {
    await page.waitForLoadState()
    await page.waitForSelector(pageSelectors.TokenInput)

    const originalValue = await page.inputValue(pageSelectors.TokenInput)

    await Promise.all([
      page.waitForResponse(
        res => !!res.url().match(/api\/token/) && res.status() === 200
      ),
      getPageLocators(page).GenerateTokenButton.click()
    ])

    const newValue = await page.inputValue(pageSelectors.TokenInput)

    expect(originalValue).not.toEqual(newValue)
  })
})
