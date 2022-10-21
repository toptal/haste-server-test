import { getPageLocators, pageSelectors } from '~/test/e2e/lib'
import { expect, test } from '~/test/e2e/lib/baseFixtures'
import { devices } from '~/test/e2e/lib/devices'
import { createBin } from '~/test/e2e/lib/helpers'
import { siteCopy } from '~/lib/constants/site-copy'

test.describe('Copy text', () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await page
      .context()
      .grantPermissions(['clipboard-write'], { origin: baseURL })
  })

  for (const { device, viewport } of devices) {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(viewport)
      await page.goto('/')
      await createBin(page)
    })

    test(`shows success message when copying text on ${device}`, async ({
      page
    }) => {
      await getPageLocators(page).CopyButton.click()

      const expectedAlertText = siteCopy.actions.codeCopyNotification
      const alert = getPageLocators(page).MessageContainer

      expect(await alert.isVisible()).toBe(true)
      expect(await alert.textContent()).toEqual(expectedAlertText)
    })
  }

  test('hides message a few seconds after clicking copy code', async ({
    page
  }) => {
    await getPageLocators(page).CopyButton.click()

    const alert = getPageLocators(page).MessageContainer

    await page.waitForSelector(pageSelectors.MessageContainer, {
      state: 'hidden'
    })
    expect(await alert.isHidden()).toBe(true)
  })
})
