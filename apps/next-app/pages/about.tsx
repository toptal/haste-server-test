import Container from '@toptal/picasso/Container'
import Button from '@toptal/picasso/Button'
import Tooltip from '@toptal/picasso/Tooltip'
import { Title } from '@toptal/site-acq-ui-library'
import { useRouter } from 'next/router'

import Layout from '~/components/Layout'
import AboutPageComponent from '~/components/AboutPage'
import { TestIdAboutPage } from '~/components/AboutPage/test-ids'

import { siteCopy } from '~/lib/constants/site-copy'
import routes from '~/lib/constants/routes'
import styles from '~/styles/AboutPage.module.scss'
import buttonStyles from '~/styles/buttons.module.scss'
import { PAGE_PARAMETERS } from '~/lib/constants/page'
import hotKeys from '~/lib/constants/hotkeys'
import useHotKeys from '~/lib/hooks/use-hot-keys'

export default function AboutPage(): JSX.Element {
  const router = useRouter()

  useHotKeys(hotKeys.newText.label, () => router.push('/'))

  return (
    <Layout
      pageTitle={PAGE_PARAMETERS.default.pageTitle}
      pageDescription={PAGE_PARAMETERS.default.pageDescription}
    >
      <Layout.Main className={styles.contentContainer}>
        <Container className={styles.titleContainer}>
          <Title
            className={styles.header}
            tag="h1"
            text={siteCopy.titles.aboutHastebin}
            testId={TestIdAboutPage.AboutPageTitle}
          />
          <Tooltip content={hotKeys.newText.description} placement="bottom">
            <Button
              className={styles.headerButton}
              onClick={() => {
                router.push(routes.home)
              }}
            >
              {siteCopy.actions.startNewBin}
            </Button>
          </Tooltip>
        </Container>
        <AboutPageComponent />
      </Layout.Main>

      <Layout.MainCtaContainer className={styles.buttonsContainer}>
        <Tooltip content={hotKeys.newText.description} placement="bottom">
          <Button
            className={buttonStyles.primaryButton}
            onClick={() => {
              router.push(routes.home)
            }}
          >
            {siteCopy.actions.startNewBin}
          </Button>
        </Tooltip>
      </Layout.MainCtaContainer>
    </Layout>
  )
}
