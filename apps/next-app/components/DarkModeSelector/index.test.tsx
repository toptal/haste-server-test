import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactElement } from 'react'
import PicassoLight from '@toptal/picasso-provider/Picasso/PicassoLight'

import { TestIdDarkModeSelector } from './test-ids'

import DarkModeSelector from '.'

import * as UIThemeContext from '~/lib/state/use-ui-theme'
import { trackInteractionOnce } from '~/lib/analytics'
import { InteractionEvents } from '~/lib/types/analytics'

jest.mock('~/lib/state/use-ui-theme', () => ({
  __esModule: true,
  ...jest.requireActual('~/lib/state/use-ui-theme')
}))

const useUIThemeContextMock = jest.spyOn(
  UIThemeContext,
  'useUIThemeContext'
) as jest.SpyInstance<Partial<UIThemeContext.UIThemingContextType>>

const changeDarkMode = jest.fn()

useUIThemeContextMock.mockReturnValue({
  isDarkMode: false,
  changeDarkMode
})

jest.mock('~/lib/analytics', () => ({
  trackInteractionOnce: jest.fn()
}))

describe('Dark Mode Selector', () => {
  let rerender: (ui: ReactElement) => void

  beforeEach(() => {
    const view = render(
      <PicassoLight>
        <DarkModeSelector />
      </PicassoLight>
    )

    rerender = view.rerender
  })

  it('correctly renders the elements', () => {
    expect(
      screen.getByTestId(TestIdDarkModeSelector.DarkModeSelectorSwitch)
    ).toBeInTheDocument()

    expect(
      screen.getByTestId(TestIdDarkModeSelector.DarkModeSelectorText)
        .textContent
    ).toContain('Off')
  })

  it('correctly activates dark mode', () => {
    const switchElement = screen
      .getByTestId(TestIdDarkModeSelector.DarkModeSelectorSwitch)
      .querySelector('input') as HTMLInputElement

    fireEvent.click(switchElement)
    expect(changeDarkMode).toHaveBeenCalled()
  })

  it('correctly deactivate dark mode', () => {
    useUIThemeContextMock.mockReturnValue({
      isDarkMode: true,
      changeDarkMode: changeDarkMode
    })

    rerender(
      <PicassoLight>
        <DarkModeSelector />
      </PicassoLight>
    )

    const switchElement = screen
      .getByTestId(TestIdDarkModeSelector.DarkModeSelectorSwitch)
      .querySelector('input') as HTMLInputElement

    expect(
      screen.getByTestId(TestIdDarkModeSelector.DarkModeSelectorText)
        .textContent
    ).toContain('On')

    fireEvent.click(switchElement)
    expect(changeDarkMode).toHaveBeenCalled()
  })

  it('tracks interaction when dark mode disabled', () => {
    const switchElement = screen
      .getByTestId(TestIdDarkModeSelector.DarkModeSelectorSwitch)
      .querySelector('input') as HTMLInputElement

    userEvent.click(switchElement)

    expect(trackInteractionOnce).toBeCalledWith(
      InteractionEvents.EnableDarkMode
    )
  })

  it('tracks interaction when dark mode enabled', () => {
    rerender(
      <PicassoLight>
        <DarkModeSelector />
      </PicassoLight>
    )

    const switchElement = screen
      .getByTestId(TestIdDarkModeSelector.DarkModeSelectorSwitch)
      .querySelector('input') as HTMLInputElement

    userEvent.click(switchElement)

    expect(trackInteractionOnce).toBeCalledWith(
      InteractionEvents.DisableDarkMode
    )
  })
})
