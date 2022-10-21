import { screen, render, fireEvent, waitFor } from '@testing-library/react'
import { renderHook, act } from '@testing-library/react-hooks'
import { ReactNode } from 'react'

import { HASTEBIN_DARK_THEME_STORAGE_KEY } from '../constants/common'

import UITheme, { useUIThemeContext } from './use-ui-theme'

const IS_DARK_MODE = 'IS_DARK_MODE'
const IS_WHITE_LABEL = 'IS_WHITE_LABEL'
const CHANGE_DARK_MODE = 'CHANGE_DARK_MODE'

const TestingComponent = () => {
  const { changeDarkMode, isDarkMode, isWhiteLabelVersion } =
    useUIThemeContext()

  return (
    <>
      <p>
        {IS_DARK_MODE}
        <p>{isDarkMode?.toString()}</p>
      </p>
      <p>
        {IS_WHITE_LABEL}
        <p>{isWhiteLabelVersion?.toString()}</p>
      </p>
      <button onClick={changeDarkMode}>{CHANGE_DARK_MODE}</button>
    </>
  )
}

describe('UITheme Provider', () => {
  const setItemMock = jest.spyOn(Storage.prototype, 'setItem')
  const getItemMock = jest.spyOn(Storage.prototype, 'getItem')

  it('renders consumer with correct properties', () => {
    render(
      <UITheme isWhiteLabelVersion={false} isDarkMode={false}>
        <TestingComponent />
      </UITheme>
    )

    const isDarkMode = screen.getByText(IS_DARK_MODE)
    const isWhiteLabelVersion = screen.getByText(IS_WHITE_LABEL)

    expect(isDarkMode.childNodes[1].textContent).toEqual('false')
    expect(isWhiteLabelVersion.childNodes[1].textContent).toEqual('false')
  })

  it('correctly changes dark mode', async () => {
    render(
      <UITheme isDarkMode={false}>
        <TestingComponent />
      </UITheme>
    )

    const isDarkMode = screen.getByText(IS_DARK_MODE)

    expect(getItemMock).toHaveBeenCalledWith(HASTEBIN_DARK_THEME_STORAGE_KEY)

    expect(isDarkMode.childNodes[1].textContent).toEqual('false')

    fireEvent.click(screen.getByText(CHANGE_DARK_MODE))

    await waitFor(() => {
      expect(setItemMock).toHaveBeenCalledWith(
        HASTEBIN_DARK_THEME_STORAGE_KEY,
        'true'
      )
      expect(isDarkMode.childNodes[1].textContent).toEqual('true')
    })
  })
})

describe('Use ui-theme hook', () => {
  const setItemMock = jest.spyOn(Storage.prototype, 'setItem')

  it('returns properties correctly', () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <UITheme isWhiteLabelVersion={true} isDarkMode={true}>
        {children}
      </UITheme>
    )

    const { result } = renderHook(() => useUIThemeContext(), { wrapper })

    expect(result.current.isDarkMode).toBe(true)
    expect(result.current.isWhiteLabelVersion).toBe(true)
  })

  it('correctly changes dark mode', () => {
    const wrapper = ({ children }: { children: ReactNode }) => (
      <UITheme isDarkMode={false}>{children}</UITheme>
    )

    const { result } = renderHook(() => useUIThemeContext(), { wrapper })

    act(() => {
      result.current.changeDarkMode()
    })

    expect(setItemMock).toHaveBeenCalledWith(
      HASTEBIN_DARK_THEME_STORAGE_KEY,
      'true'
    )
  })
})
