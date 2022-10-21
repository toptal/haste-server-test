import { useEffect, useState } from 'react'
import { DocumentationPage as DocPage, Code } from '@toptal/site-acq-ui-library'
import { useRouter } from 'next/router'
import { Container, Typography } from '@toptal/picasso'

import Layout from '~/components/Layout'
import Authentication from '~/components/Authentication'
import ApiDocumentation from '~/components/ApiDocumentation'

import { PAGE_PARAMETERS } from '~/lib/constants/page'
import styles from '~/styles/DocumentationPage.module.scss'
import { siteCopy } from '~/lib/constants/site-copy'
import { MENU_ITEMS } from '~/lib/constants/languages'
import { isHappo } from '~/lib/utils/is-happo'
import { withBasePath } from '~/lib/helpers/with-base-path'
import { isUserAuthEnabled } from '~/lib/feature-flags'

export default function DocumentationPage(): JSX.Element {
  const router = useRouter()
  const [currentPath, setCurrentPath] = useState('')

  useEffect(() => {
    if (!isHappo()) {
      setCurrentPath(withBasePath(router.asPath))
    }
  }, [router.asPath])

  return (
    <Layout
      pageTitle={PAGE_PARAMETERS.default.pageTitle}
      pageDescription={PAGE_PARAMETERS.default.pageDescription}
      className={styles.layout}
      noPadding={true}
    >
      <DocPage
        title={siteCopy.titles.documentationVariant}
        menuTitle={siteCopy.titles.examples}
        menuItems={MENU_ITEMS}
        currentPath={currentPath}
        onMenuItemClick={option => {
          router.push(option.route)
        }}
      >
        <Container
          flex
          gap={1}
          justifyContent="flex-start"
          direction="column"
          className={styles.container}
        >
          <Typography>
            {siteCopy.documentationText.part1}
            <br />
            {siteCopy.documentationText.part2}
          </Typography>
          {isUserAuthEnabled() && <Authentication />}
          <Code className={styles.codeBlock}>
            API {siteCopy.api.endpoints.documents.url}
          </Code>
        </Container>

        <ApiDocumentation />
      </DocPage>
    </Layout>
  )
}
