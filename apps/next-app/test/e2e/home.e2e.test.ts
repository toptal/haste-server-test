import { getPageLocators } from '~/test/e2e/lib'
import { test, expect } from '~/test/e2e/lib/baseFixtures'
import { devices } from '~/test/e2e/lib/devices'
import { LANGUAGES } from '~/lib/constants/languages'
import routes from '~/lib/constants/routes'
import { siteCopy } from '~/lib/constants/site-copy'
import { waitForTextToBeAttached } from '~/test/e2e/lib/helpers'

test.describe('Home', () => {
  for (const { device, viewport } of devices) {
    test.beforeEach(async ({ page }) => {
      await page.setViewportSize(viewport)
      await page.goto('/')
    })

    test(`opens about page through hamburger menu on ${device}`, async ({
      baseURL,
      page
    }) => {
      await getPageLocators(page).DrawerButton.click()
      await getPageLocators(page).AboutMenuItem.click()
      await waitForTextToBeAttached(page, siteCopy.titles.aboutHastebinQuestion)
      await page.waitForURL(`${baseURL}${routes.publicRelative('/about')}`)

      expect(await getPageLocators(page).AboutPageContainer.isVisible()).toBe(
        true
      )
    })

    test(`opens api documentation page through hamburger menu on ${device}`, async ({
      baseURL,
      page
    }) => {
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
        await page.goto('/')
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
})
