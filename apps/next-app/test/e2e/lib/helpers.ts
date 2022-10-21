import type { Page } from 'playwright'

import { getPageLocators } from '.'

export const mockBinContent = 'Some bin content'

export const createBin = async (page: Page): Promise<void> => {
  await getPageLocators(page).TextArea.fill(mockBinContent)
  await getPageLocators(page).SaveBinButton.click()
  await page.waitForURL('**/share/**')
}

export const waitForTextToBeAttached = async (
  page: Page,
  text: string
): Promise<void> => {
  const hastebinText2 = page.locator(`text=${text}`).first()

  await hastebinText2.waitFor({ state: 'attached' })
}
