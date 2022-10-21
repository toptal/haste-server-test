import { testA11y } from '~/test/e2e/lib/a11y'
import { test } from '~/test/e2e/lib/baseFixtures'
import { devices } from '~/test/e2e/lib/devices'

test.describe('Accessibility scan', () => {
  for (const { device, viewport } of devices) {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(viewport)
      await page.goto('/')
    })

    test(`finds no issues on main page on ${device}`, async ({ page }) => {
      await testA11y(page)
    })
  }
})
