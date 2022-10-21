import { expect, test } from '~/test/e2e/lib/baseFixtures'
import { getPageLocators } from '~/test/e2e/lib'
import { mockBinContent, createBin } from '~/test/e2e/lib/helpers'

test.describe('Save bin button', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('disables the editor presenting the bin content', async ({ page }) => {
    await createBin(page)

    const contentEditorTextArea = getPageLocators(page).ContentEditor

    await expect(contentEditorTextArea).toBeDisabled()
    await expect(contentEditorTextArea).toHaveText(mockBinContent)
  })

  test('shows tooltip on hover', async ({ page }) => {
    await getPageLocators(page).TextArea.fill(mockBinContent)

    await getPageLocators(page).SaveBinButton.hover()

    await expect(getPageLocators(page).SaveTooltip).toBeVisible()
  })
})
