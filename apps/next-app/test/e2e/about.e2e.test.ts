import { getPageLocators, pageSelectors } from '~/test/e2e/lib'
import { test, expect } from '~/test/e2e/lib/baseFixtures'
import { devices } from '~/test/e2e/lib/devices'
import { LANGUAGES } from '~/lib/constants/languages'
import { siteCopy } from '~/lib/constants/site-copy'
import routes from '~/lib/constants/routes'
import { waitForTextToBeAttached } from '~/test/e2e/lib/helpers'

const desktop = devices[0]
const ipad = devices[2]
const testTooltipDevices = [desktop, ipad]

test.describe('About page', () => {
  for (const { device, viewport } of devices) {
    test(`opens api documentation page through hamburger menu on ${device}`, async ({
      baseURL,
      page
    }) => {
      await page.setViewportSize(viewport)
      await page.goto('/about')

      await getPageLocators(page).DrawerButton.click()
      await getPageLocators(page).Menu.locator('a >> nth=0').click()

      await waitForTextToBeAttached(page, siteCopy.titles.apiVariant)
      await page.waitForURL(
        `${baseURL}${routes.publicRelative('/documentation')}`
      )

      expect(
        await getPageLocators(page).ApiDocumentationContainer.isVisible()
      ).toBe(true)
    })

    test(`opens language documentation pages through hamburger menu on ${device}`, async ({
      baseURL,
      page
    }) => {
      for (let index = 1; index < LANGUAGES.length; index++) {
        await page.goto('/about')
        await page.setViewportSize(viewport)
        await getPageLocators(page).DrawerButton.click()
        const language = LANGUAGES[index]

        await getPageLocators(page).Menu.locator(`a >> nth=${index}`).click()

        await waitForTextToBeAttached(page, siteCopy.titles.apiVariant)
        await page.waitForURL(
          `${baseURL}${routes.publicRelative(language.route)}`
        )

        expect(
          await getPageLocators(page)
            .LanguageDocumentationContainer.first()
            .textContent()
        ).toContain(language?.codes?.[0]?.code)
      }
    })
  }

  for (const { device, viewport } of testTooltipDevices) {
    test(`correctly deals with hover on start new text button on ${device}`, async ({
      page
    }) => {
      await page.setViewportSize(viewport)
      await page.goto('/about')

      const aboutPageLayout = getPageLocators(page).Main

      await aboutPageLayout
        .locator(pageSelectors.StartNewTextButtonAboutPage)
        .hover()

      await expect(getPageLocators(page).StartNewTextTooltip).toBeVisible()
    })
  }
})
