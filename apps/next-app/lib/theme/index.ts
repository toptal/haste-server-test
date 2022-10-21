import { ThemeOptions } from '@material-ui/core/styles'

export const createPicassoTheme = (
  darkMode?: boolean,
  isWhiteLabelVersion?: boolean
): ThemeOptions | undefined => {
  let mainColor,
    greenColor,
    commonWhite,
    greyLighter2,
    commonBlack,
    commonTextPrimary,
    mainBlue,
    blueLighter

  if (isWhiteLabelVersion && darkMode) {
    mainColor = greenColor = '#00CC83'
    commonTextPrimary = commonBlack = mainBlue = '#fff'
    greyLighter2 = '#000000'
    commonWhite = blueLighter = '#262D3D'
  } else if (isWhiteLabelVersion) {
    mainColor = greenColor = '#455065'
    commonWhite = '#fff'
    commonBlack = commonTextPrimary = '#000000'
  } else if (darkMode) {
    mainColor = greenColor = '#00CC83'
    commonTextPrimary = commonBlack = mainBlue = '#fff'
    greyLighter2 = '#000000'
    commonWhite = blueLighter = '#262D3D'
  } else {
    mainColor = mainBlue = '#204ecf'
    greenColor = '#00CC83'
    commonWhite = '#fff'
    commonBlack = commonTextPrimary = '#000000'
    blueLighter = '#edf1fd'
    greyLighter2 = '#ebeced'
  }

  return {
    palette: {
      primary: {
        main: mainColor
      },
      grey: {
        lighter2: greyLighter2
      },
      text: {
        primary: commonTextPrimary
      },
      common: {
        white: commonWhite,
        black: commonBlack
      },
      blue: {
        main: mainBlue,
        lighter: blueLighter
      },
      green: {
        main: greenColor
      }
    }
  } as ThemeOptions
}
