import { expect, test } from '~/test/e2e/lib/baseFixtures'
import { getPageLocators } from '~/test/e2e/lib'

test.describe('Dark Mode Selector', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('changes color and text when dark mode is enabled', async ({ page }) => {
    await page.waitForURL('/')

    await getPageLocators(page).DrawerButton.click()
    await getPageLocators(page).DarkModeSelectorSwitch.click()

    const color = await getPageLocators(page).Layout.evaluate(e => {
      return window.getComputedStyle(e).getPropertyValue('background-color')
    })

    expect(color).toBe('rgb(19, 21, 24)') // black
    expect(
      await getPageLocators(page).DarkModeSelectorText.textContent()
    ).toEqual('Dark Mode: On')
  })

  test('changes color and text when dark mode is disabled', async ({
    page
  }) => {
    await page.waitForURL('/')

    await getPageLocators(page).DrawerButton.click()
    await getPageLocators(page).DarkModeSelectorSwitch.click()
    await getPageLocators(page).DarkModeSelectorSwitch.click()

    const color = await getPageLocators(page).Layout.evaluate(e => {
      return window.getComputedStyle(e).getPropertyValue('background-color')
    })

    expect(color).toBe('rgb(243, 244, 246)') // dark blue
    expect(
      await getPageLocators(page).DarkModeSelectorText.textContent()
    ).toEqual('Dark Mode: Off')
  })
})
