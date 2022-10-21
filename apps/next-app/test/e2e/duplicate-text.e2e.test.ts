import { expect, test } from '~/test/e2e/lib/baseFixtures'
import { getPageLocators } from '~/test/e2e/lib'
import { mockBinContent, createBin } from '~/test/e2e/lib/helpers'

test.describe('Duplicate text', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await createBin(page)
  })

  test('enables text editor area with same bin content', async ({ page }) => {
    await getPageLocators(page).DuplicateTextButton.click()
    await page.waitForURL('/')

    const contentEditorTextArea = getPageLocators(page).ContentEditor

    await expect(contentEditorTextArea).toBeEnabled()
    await expect(contentEditorTextArea).toHaveText(mockBinContent)
  })

  test('shows tooltip on hover', async ({ page }) => {
    await getPageLocators(page).DuplicateTextButton.hover()

    await expect(getPageLocators(page).DuplicateTooltip).toBeVisible()
  })
})
