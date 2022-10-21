import { fireEvent, render, screen } from '@testing-library/react'
import PicassoLight from '@toptal/picasso-provider/Picasso/PicassoLight'
import type { ReactElement } from 'react'

import { TestIdMenuDrawer } from './test-ids'

import LanguagesMenuDrawer from '.'

import { trackInteractionOnce } from '~/lib/analytics'
import { InteractionEvents } from '~/lib/types/analytics'
import * as UIThemeContext from '~/lib/state/use-ui-theme'

jest.mock('~/lib/analytics', () => ({
  trackInteractionOnce: jest.fn()
}))

const useRouter = jest.spyOn(require('next/router'), 'useRouter')

const pushMock = jest.fn()

useRouter.mockImplementation(() => ({
  asPath: '/documentation',
  push: pushMock
}))

jest.mock('~/lib/state/use-ui-theme', () => ({
  __esModule: true,
  ...jest.requireActual('~/lib/state/use-ui-theme')
}))

const useUIThemeContextMock = jest.spyOn(
  UIThemeContext,
  'useUIThemeContext'
) as jest.SpyInstance<Partial<UIThemeContext.UIThemingContextType>>

useUIThemeContextMock.mockReturnValue({
  isDarkMode: false,
  isWhiteLabelVersion: false
})

describe('Languages Menu Drawer', () => {
  const onOpenMenu = jest.fn()
  let rerender: (ui: ReactElement) => void

  beforeEach(() => {
    const result = render(
      <PicassoLight>
        <LanguagesMenuDrawer onOpenMenu={onOpenMenu} currentPath="/" />
      </PicassoLight>
    )

    rerender = result.rerender
  })

  it('correctly renders the button for opening the drawer', () => {
    expect(
      screen.getByTestId(TestIdMenuDrawer.DrawerButton)
    ).toBeInTheDocument()
  })

  it('correctly renders the drawer on opening', () => {
    fireEvent.click(screen.getByTestId(TestIdMenuDrawer.DrawerButton))
    expect(screen.getByTestId(TestIdMenuDrawer.Drawer)).toBeInTheDocument()
    expect(
      screen.getByTestId(TestIdMenuDrawer.DrawerContent)
    ).toBeInTheDocument()
    expect(onOpenMenu).toHaveBeenCalledTimes(1)
    expect(screen.queryByLabelText('toptal-drawer-logo')).toBeInTheDocument()
  })

  it('correctly renders the drawer on opening for white-label version', () => {
    useUIThemeContextMock.mockReturnValue({
      isWhiteLabelVersion: true
    })

    rerender(
      <PicassoLight>
        <LanguagesMenuDrawer onOpenMenu={onOpenMenu} currentPath="/a" />
      </PicassoLight>
    )

    fireEvent.click(screen.getByTestId(TestIdMenuDrawer.DrawerButton))

    expect(screen.getByTestId(TestIdMenuDrawer.Drawer)).toBeInTheDocument()
    expect(
      screen.getByTestId(TestIdMenuDrawer.DrawerContent)
    ).toBeInTheDocument()

    expect(
      screen.queryByLabelText('toptal-drawer-logo')
    ).not.toBeInTheDocument()
  })

  it('tracks menu open', () => {
    fireEvent.click(screen.getByTestId(TestIdMenuDrawer.DrawerButton))

    expect(trackInteractionOnce).toBeCalledWith(
      InteractionEvents.OpenDrawerMenu
    )
  })

  it('tracks menu close', () => {
    fireEvent.click(screen.getByTestId(TestIdMenuDrawer.DrawerButton))

    const menuCloseBtn = screen
      .getByTestId(TestIdMenuDrawer.Drawer)
      .getElementsByTagName('button')[0]

    fireEvent.click(menuCloseBtn)

    expect(trackInteractionOnce).toBeCalledWith(
      InteractionEvents.CloseDrawerMenu
    )
  })

  it('correctly renders the drawer on opening for dark mode', () => {
    useUIThemeContextMock.mockReturnValue({
      isDarkMode: true
    })

    rerender(
      <PicassoLight>
        <LanguagesMenuDrawer onOpenMenu={onOpenMenu} currentPath="/a" />
      </PicassoLight>
    )

    fireEvent.click(screen.getByTestId(TestIdMenuDrawer.DrawerButton))

    expect(screen.getByTestId(TestIdMenuDrawer.Drawer)).toBeInTheDocument()
    expect(
      screen.getByTestId(TestIdMenuDrawer.DrawerContent)
    ).toBeInTheDocument()

    expect(screen.queryByLabelText('toptal-drawer-logo')).toBeInTheDocument()
  })

  it('correctly routes on click to menu drawer items', () => {
    fireEvent.click(screen.getByTestId(TestIdMenuDrawer.DrawerButton))

    fireEvent.click(screen.getByText('Hastebin'))
    expect(pushMock).toHaveBeenCalledWith('/')

    fireEvent.click(screen.getByTestId(TestIdMenuDrawer.AboutMenuItem))

    expect(pushMock).toHaveBeenCalledWith('/about')
  })
})
