import { expect, test } from '~/test/e2e/lib/baseFixtures'
import { getPageLocators } from '~/test/e2e/lib'
import { siteCopy } from '~/lib/constants/site-copy'

test.describe('Bin Not Found', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/share/notfound')
  })

  test('presents bin not found message', async ({ page }) => {
    const contentEditorTextArea = getPageLocators(page).ContentEditor

    await expect(contentEditorTextArea).toBeDisabled()
    await expect(contentEditorTextArea).toHaveText(
      siteCopy.messages.binNotFound
    )
  })
})
