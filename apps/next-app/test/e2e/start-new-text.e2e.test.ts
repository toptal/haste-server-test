import { expect, test } from '~/test/e2e/lib/baseFixtures'
import { getPageLocators } from '~/test/e2e/lib'
import { createBin } from '~/test/e2e/lib/helpers'

test.describe('Start new text button', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await createBin(page)
  })

  test('cleans and enables editor text area', async ({ page }) => {
    await getPageLocators(page).StartNewTextButton.click()
    await page.waitForURL('/')

    const contentEditorTextArea = getPageLocators(page).ContentEditor

    await expect(contentEditorTextArea).toBeEnabled()
    await expect(contentEditorTextArea).toBeEmpty()
  })

  test('shows tooltip on hover', async ({ page }) => {
    await getPageLocators(page).StartNewTextButton.hover()

    await expect(getPageLocators(page).StartNewTextTooltip).toBeVisible()
  })
})
