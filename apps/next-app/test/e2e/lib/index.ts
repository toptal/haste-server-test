import type { Locator, Page } from 'playwright'

import { TestIdMenuDrawer } from '~/components/SideDrawerMenu/test-ids'
import { TestIdLanguageMenu } from '~/components/LanguagesMenu/test-ids'
import { TestIdAboutPage } from '~/components/AboutPage/test-ids'
import { TestIdEditor } from '~/components/Editor/test-ids'
import { TestIdCodeCopy } from '~/components/buttons/CopyTextButton/test-ids'
import { TestIdApiDocumentation } from '~/components/ApiDocumentation/test-ids'
import { TestIdLayout } from '~/components/Layout/test-ids'
import { TestIdDarkModeSelector } from '~/components/DarkModeSelector/test-ids'

import { siteCopy } from '~/lib/constants/site-copy'
import hotKeys from '~/lib/constants/hotkeys'

export const pages = [
  '/',
  '/documentation/',
  '/documentation/wget/',
  '/documentation/curl/',
  '/documentation/nodejs/',
  '/documentation/python/',
  '/documentation/java/',
  '/documentation/ruby/',
  '/documentation/perl/',
  '/documentation/php/',
  '/documentation/c-sharp/',
  '/documentation/kotlin/',
  '/documentation/rust/'
]

enum TestIdLanguageDocumentation {
  LanguageDocumentationContainer = 'language-documentation-container',
  LanguageDocumentationTitle = 'language-documentation-title',
  LanguageDocumentationCode = 'language-documentation-code',
  LanguageDocumentationText = 'language-documentation-text'
}

const byTestId = (testId: string) => `[data-testid=${testId}]`

function createTestIdSelectors<T>(obj: T) {
  return Object.fromEntries(
    Object.entries(obj).map(([name, testId]) => [name, byTestId(testId)])
  ) as { [name in keyof T]: string }
}

export const pageSelectors = {
  ContentEditor: '[aria-label="Content Editor"]',
  CopyURLButton: `button:has-text("${siteCopy.actions.copyURL}")`,
  DuplicateTextButton: `button:has-text("${siteCopy.actions.duplicateText}")`,
  GenerateTokenButton: `button:has-text("${siteCopy.actions.generateToken}")`,
  OpenMenuButton: '[aria-label="Open menu"]',
  SaveBinButton: `button:has-text("${siteCopy.actions.save}")`,
  SignInButton: `button:has-text("${siteCopy.actions.signInButton}")`,
  StartNewTextButton: `button:has-text("${siteCopy.actions.startNewBin}")`,
  StartNewTextButtonAboutPage: `button[type="button"]:has-text("${siteCopy.actions.startNewBin}")`,
  TokenInput: '[aria-label="token"]',
  StartNewTextTooltip: `[role='tooltip']:has-text("${hotKeys.newText.description}")`,
  SaveTooltip: `[role='tooltip']:has-text("${hotKeys.save.description}")`,
  DuplicateTooltip: `[role='tooltip']:has-text("${hotKeys.duplicate.description}")`,
  DownloadRawTooltip: `[role='tooltip']:has-text("${hotKeys.downloadRaw.description}")`,
  CopyUrlTooltip: `[role='tooltip']:has-text("${hotKeys.copyUrl.description}")`,
  ...createTestIdSelectors(TestIdMenuDrawer),
  ...createTestIdSelectors(TestIdLanguageMenu),
  ...createTestIdSelectors(TestIdApiDocumentation),
  ...createTestIdSelectors(TestIdLanguageDocumentation),
  ...createTestIdSelectors(TestIdAboutPage),
  ...createTestIdSelectors(TestIdCodeCopy),
  ...createTestIdSelectors(TestIdEditor),
  ...createTestIdSelectors(TestIdLayout),
  ...createTestIdSelectors(TestIdDarkModeSelector)
}

export const getPageLocators = (
  page: Page
): { [name in keyof typeof pageSelectors]: Locator } =>
  Object.fromEntries(
    Object.entries(pageSelectors).map(([key, selector]) => [
      key,
      page.locator(selector)
    ])
  ) as { [name in keyof typeof pageSelectors]: Locator }
