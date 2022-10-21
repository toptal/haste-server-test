import { createContext, ReactNode, useContext } from 'react'
import PicassoLight from '@toptal/picasso-provider/Picasso/PicassoLight'
import {
  StylesProvider,
  createGenerateClassName
} from '@material-ui/core/styles'
import { noop } from '@toptal/picasso/utils'

import useLocalStorage from '~/lib/hooks/use-local-storage'
import { HASTEBIN_DARK_THEME_STORAGE_KEY } from '~/lib/constants/common'
import { createPicassoTheme } from '~/lib/theme'
import { isHappo } from '~/lib/utils/is-happo'
import useThemeStyles from '~/lib/hooks/use-theme-styles'

const generateClassName = createGenerateClassName({
  seed: 'HB'
})

export interface UIThemingContextType {
  changeDarkMode: () => void
  isDarkMode?: boolean
  isWhiteLabelVersion?: boolean
}

const UIThemeContext = createContext<UIThemingContextType>({
  changeDarkMode: noop,
  isDarkMode: false,
  isWhiteLabelVersion: false
})

interface UIThemeProps {
  children: ReactNode
  isWhiteLabelVersion?: boolean
  isDarkMode?: boolean
}

const UITheme = ({
  children,
  isWhiteLabelVersion = false,
  isDarkMode = false
}: UIThemeProps): JSX.Element => {
  const [darkMode, setDarkMode] = useLocalStorage<boolean>(
    HASTEBIN_DARK_THEME_STORAGE_KEY,
    isDarkMode
  )

  const themeStyles = useThemeStyles(darkMode, isWhiteLabelVersion)

  const changeDarkMode = () => {
    setDarkMode(!darkMode)
  }

  return (
    <UIThemeContext.Provider
      value={{
        changeDarkMode,
        isDarkMode: darkMode,
        isWhiteLabelVersion
      }}
    >
      <div className={themeStyles}>
        <PicassoLight
          disableClassNamePrefix={!isHappo()}
          theme={createPicassoTheme(darkMode, isWhiteLabelVersion)}
        >
          <StylesProvider generateClassName={generateClassName}>
            {children}
          </StylesProvider>
        </PicassoLight>
      </div>
    </UIThemeContext.Provider>
  )
}

export default UITheme

export const useUIThemeContext = (): UIThemingContextType =>
  useContext(UIThemeContext)
