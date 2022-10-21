import { MenuAnchorItem, MenuDrawer } from '@toptal/site-acq-ui-library'
import { useRouter } from 'next/router'
import Container from '@toptal/picasso/Container'
import Typography from '@toptal/picasso/Typography'

import DarkModeSelector from '~/components/DarkModeSelector'
import LanguagesMenu from '~/components/LanguagesMenu'

import { TestIdMenuDrawer } from './test-ids'
import styles from './menu-drawer.module.scss'

import { PROJECT_DISPLAY_NAME } from '~/lib/constants/common'
import { trackInteractionOnce } from '~/lib/analytics'
import { InteractionEvents } from '~/lib/types/analytics'
import routes from '~/lib/constants/routes'
import { siteCopy } from '~/lib/constants/site-copy'
import { useUIThemeContext } from '~/lib/state/use-ui-theme'
import themeStyles from '~/styles/theme.module.scss'

type LanguagesMenuDrawerProps = {
  onOpenMenu?: (open: boolean) => void
  defaultOpen?: boolean
  currentPath: string
}

const Title = (
  <Typography
    variant="heading"
    className={styles.languagesMenuTitle}
    size="xlarge"
  >
    {siteCopy.titles.documentation}
  </Typography>
)

const SideDrawerMenu = ({
  onOpenMenu,
  currentPath,
  defaultOpen
}: LanguagesMenuDrawerProps): JSX.Element => {
  const router = useRouter()
  const { isDarkMode, isWhiteLabelVersion } = useUIThemeContext()

  return (
    <MenuDrawer
      isWhitelabel={isWhiteLabelVersion}
      testIds={{
        button: TestIdMenuDrawer.DrawerButton,
        content: TestIdMenuDrawer.DrawerContent,
        drawer: TestIdMenuDrawer.Drawer
      }}
      onClickHomeUrl={() => router.push(routes.home)}
      currentPath={currentPath}
      onOpenMenu={open => {
        trackInteractionOnce(
          open
            ? InteractionEvents.OpenDrawerMenu
            : InteractionEvents.CloseDrawerMenu
        )

        onOpenMenu?.(open)
      }}
      projectDisplayName={PROJECT_DISPLAY_NAME}
      defaultOpen={defaultOpen}
      className={isDarkMode ? themeStyles.menuDrawerDarkTheme : undefined}
    >
      <Container flex direction="column">
        <DarkModeSelector />
        <div className={styles.divider} />
        <MenuAnchorItem
          currentPath={routes.publicRelative(router.asPath)}
          className={styles.aboutMenuItem}
          itemClassName={styles.item}
          option={{
            title: siteCopy.titles.aboutHastebin,
            route: routes.publicRelative(routes.about)
          }}
          testId={TestIdMenuDrawer.AboutMenuItem}
          underlined
          tag="h1"
          onClick={() => router.push(routes.about)}
        />
        <LanguagesMenu
          className={styles.menuContainer}
          menuClassName={styles.languagesMenu}
          menuItemClassName={styles.languagesMenuItem}
          menuItemTag="h2"
          title={Title}
        />
      </Container>
    </MenuDrawer>
  )
}

export default SideDrawerMenu
