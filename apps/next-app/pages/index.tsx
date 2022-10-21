import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { GetServerSideProps, GetServerSidePropsContext } from 'next'

import Layout from '~/components/Layout'
import Editor from '~/components/Editor'
import NewTextButton from '~/components/buttons/NewTextButton'
import { useTextContext } from '~/components/TextContext'
import SaveButton from '~/components/buttons/SaveButton'
import DownloadButton from '~/components/buttons/DownloadButton'
import CopyUrlButton from '~/components/buttons/CopyUrlButton'
import DuplicateButton from '~/components/buttons/DuplicateButton'

import routes from '~/lib/constants/routes'
import styles from '~/styles/BinPage.module.scss'
import buttonStyles from '~/styles/buttons.module.scss'
import { PAGE_PARAMETERS } from '~/lib/constants/page'
import log from '~/lib/log'

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const binId = context.query.binId as string

  if (!binId) {
    return {
      props: {}
    }
  }

  let text

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

  return {
    props: {
      crossDomainBinText: text
    }
  }
}

export default function CreateBinPage({
  crossDomainBinText
}: {
  crossDomainBinText?: string
}): JSX.Element {
  const router = useRouter()
  const { text, setText } = useTextContext()
  const [binId, setBinId] = useState<string | null>()

  useEffect(() => {
    if (crossDomainBinText && crossDomainBinText.trim().length > 0) {
      setText(crossDomainBinText)
      router.replace('/')
    }
  }, [setText, crossDomainBinText, router])

  return (
    <Layout
      pageTitle={PAGE_PARAMETERS.default.pageTitle}
      pageDescription={PAGE_PARAMETERS.default.pageDescription}
    >
      <Layout.Main className={styles.editorContainer}>
        <Editor text={text} setText={setText} disabled={!!binId} />
      </Layout.Main>

      <Layout.MainCtaContainer className={buttonStyles.buttonsContainer}>
        <NewTextButton
          className={buttonStyles.secondaryButton}
          disabled={!text}
          needsConfirmation={Boolean(text)}
          onSuccess={() => {
            setBinId(null)
            setText('')
            router.push('/')
          }}
        />
        {!binId ? (
          <>
            <div className={buttonStyles.buttonsDivider} />
            <SaveButton
              className={buttonStyles.primaryButton}
              text={text}
              onError={err => {
                // eslint-disable-next-line no-console
                console.error(err)
                // TODO: show alert
              }}
              onSave={(binId: string) => {
                if (process.env.NEXT_PUBLIC_BIN_ON_BASEPATH === 'disabled') {
                  setBinId(binId)
                } else {
                  // do redirect
                  router.push(routes.getSharePagePath(binId))
                }
              }}
            />
          </>
        ) : (
          <>
            <DuplicateButton
              className={buttonStyles.secondaryButton}
              onClick={() => {
                if (process.env.NEXT_PUBLIC_BIN_ON_BASEPATH === 'disabled') {
                  setBinId(null)
                } else {
                  // do redirect
                  setBinId(null)
                  router.push('/')
                }
              }}
            />
            <div className={buttonStyles.buttonsDivider} />
            <DownloadButton className={buttonStyles.button} binId={binId} />
            <CopyUrlButton
              className={buttonStyles.primaryButton}
              binId={binId}
            />
          </>
        )}
      </Layout.MainCtaContainer>
    </Layout>
  )
}
