import { useState, useEffect } from 'react'

import { isHappo } from '../utils/is-happo'

import styles from '~/styles/theme.module.scss'

const getTheme = (
  darkMode?: boolean,
  isWhiteLabelVersion?: boolean
): string => {
  if (isWhiteLabelVersion && darkMode) {
    return styles.toptalDarkTheme
  }
  if (isWhiteLabelVersion) {
    return styles.whiteLabelTheme
  }
  if (darkMode) {
    return styles.toptalDarkTheme
  }

  return styles.toptalTheme
}

const useThemeStyles = (
  darkMode?: boolean,
  isWhiteLabelVersion?: boolean
): string | undefined => {
  const [themeStyles, setThemeStyles] = useState(
    isHappo() ? getTheme(darkMode, isWhiteLabelVersion) : styles.skeletonTheme
  )

  useEffect(() => {
    setThemeStyles(() => {
      return getTheme(darkMode, isWhiteLabelVersion)
    })
  }, [darkMode, isWhiteLabelVersion])

  return themeStyles
}

export default useThemeStyles
