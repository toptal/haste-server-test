import { useRouter } from 'next/router'
import classNames from 'classnames'
import type { GetServerSideProps, GetServerSidePropsContext } from 'next'
import { noop } from '@toptal/picasso/utils'

import Layout from '~/components/Layout'
import Editor from '~/components/Editor'
import { useTextContext } from '~/components/TextContext'
import NewTextButton from '~/components/buttons/NewTextButton'
import CopyUrlButton from '~/components/buttons/CopyUrlButton'
import DownloadButton from '~/components/buttons/DownloadButton'
import DuplicateButton from '~/components/buttons/DuplicateButton'

import styles from '~/styles/BinPage.module.scss'
import buttonStyles from '~/styles/buttons.module.scss'
import { PAGE_PARAMETERS } from '~/lib/constants/page'
import { PageProps } from '~/lib/types/page'
import {
  BASE_PATH,
  SHARE_BIN_DOMAIN,
  PROJECT_URL
} from '~/lib/constants/common'
import { siteCopy } from '~/lib/constants/site-copy'
import routes from '~/lib/constants/routes'
import log from '~/lib/log'

export const getServerSideProps: GetServerSideProps<PageProps> = async (
  context: GetServerSidePropsContext
) => {
  const isWhiteLabel = BASE_PATH
    ? !context.req.headers.referer?.includes(BASE_PATH) &&
      context.resolvedUrl?.includes(SHARE_BIN_DOMAIN)
    : false

  const binId = context.params?.binId as string
  let text: string | null = null

  try {
    log.info(`Fetching bin from server - ${binId}`)

    const response = await fetch(routes.api.rawBin(binId))

    log.info('Bin successfully fetched')

    const data = await response.text()

    if (response.ok && data) {
      text = data
    }
  } catch (e) {
    log.error(`Failed to fetch bin content - ${e}`)
  }

  const shouldRedirect = !context.req.headers.host?.includes(
    PROJECT_URL.split('//')[1]
  )

  return {
    props: {
      isWhiteLabelVersion: isWhiteLabel,
      text: text || siteCopy.messages.binNotFound,
      binId,
      shouldRedirect
    }
  }
}

export default function SharedBinPage({
  binId,
  text,
  shouldRedirect
}: {
  binId: string
  text: string
  shouldRedirect?: boolean
}): JSX.Element {
  const router = useRouter()

  const { setText } = useTextContext()

  const handleDuplicateText = (txt: string) => {
    setText(txt)

    const duplicatePagePath = routes.getDuplicatePagePath(binId, shouldRedirect)

    if (shouldRedirect) {
      window.location.assign(duplicatePagePath)
    } else {
      router.push('/')
    }
  }

  const handleNewText = () => {
    setText('')
    router.push('/')
  }

  return (
    <Layout
      pageTitle={PAGE_PARAMETERS.default.pageTitle}
      pageDescription={PAGE_PARAMETERS.default.pageDescription}
    >
      <Layout.Main
        className={classNames(
          styles.editorContainer,
          styles.sharedPageEditorContainer
        )}
      >
        <Editor text={text} setText={noop} disabled />
      </Layout.Main>

      <Layout.MainCtaContainer className={buttonStyles.buttonsContainer}>
        <NewTextButton
          className={buttonStyles.secondaryButton}
          needsConfirmation={false}
          onSuccess={() => handleNewText()}
        />
        <DuplicateButton
          className={buttonStyles.secondaryButton}
          onClick={() => {
            handleDuplicateText(text)
          }}
        />
        <div className={buttonStyles.buttonsDivider} />
        <DownloadButton className={buttonStyles.button} binId={binId || ''} />
        <CopyUrlButton
          className={buttonStyles.primaryButton}
          binId={binId || ''}
        />
      </Layout.MainCtaContainer>
    </Layout>
  )
}
