import { waitForTextToBeAttached } from '~/test/e2e/lib/helpers'
import { LANGUAGES } from '~/lib/constants/languages'
import { getPageLocators } from '~/test/e2e/lib'
import { test, expect } from '~/test/e2e/lib/baseFixtures'
import { devices } from '~/test/e2e/lib/devices'
import { Code } from '~/lib/types/language'
import { siteCopy } from '~/lib/constants/site-copy'
import routes from '~/lib/constants/routes'

const desktop = devices[0]
const ipad = devices[2]
const testDevices = [desktop, ipad]

test.describe('Documentation', () => {
  for (const { device, viewport } of testDevices) {
    test.describe(`on ${device}`, () => {
      test.beforeEach(async ({ page }) => {
        await page.setViewportSize(viewport)
        await page.goto('/documentation')
      })

      test('opens language documentation page through programming examples menu', async ({
        baseURL,
        page
      }) => {
        for (let index = 1; index < LANGUAGES.length; index++) {
          await page.goto('/documentation')
          await page.setViewportSize(viewport)
          const language = LANGUAGES[index]
          const codes = language.codes as Code[]
          const apiEndpoints = siteCopy.api.endpoints

          await getPageLocators(page).Menu.locator(`a >> nth=${index}`).click()

          await waitForTextToBeAttached(page, siteCopy.titles.apiVariant)
          await page.waitForURL(
            `${baseURL}${routes.publicRelative(language.route)}`
          )

          const apiEndpointKeys = Object.keys(apiEndpoints)

          for (let j = 0; j < codes.length; j++) {
            const title = codes[j].title
            const code = codes[j].code
            const titleFixed = title?.charAt(0)?.toUpperCase() + title?.slice(1)
            const currentEndpoint =
              apiEndpoints[apiEndpointKeys[j] as keyof typeof apiEndpoints].name

            const actualTitle = await getPageLocators(page)
              .LanguageDocumentationContainer.locator(`h1 >> nth=${j}`)
              .textContent()

            expect(actualTitle).toEqual(
              `Hastebin API ${titleFixed} Example - '${currentEndpoint}' endpoint`
            )

            expect(
              await getPageLocators(page)
                .LanguageDocumentationContainer.nth(j)
                .textContent()
            ).toContain(code)
          }
        }
      })
    })
  }
})
