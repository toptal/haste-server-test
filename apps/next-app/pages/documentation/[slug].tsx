import type { ParsedUrlQuery } from 'querystring'
import type { GetStaticPaths, GetStaticProps } from 'next'
import {
  LanguageDocumentation,
  DocumentationPage
} from '@toptal/site-acq-ui-library'
import { useEffect, useState, Fragment } from 'react'
import router from 'next/router'
import { capitalize } from '@toptal/picasso/utils'

import Layout from '~/components/Layout'

import styles from '~/styles/DocumentationPage.module.scss'
import { LANGUAGES, MENU_ITEMS } from '~/lib/constants/languages'
import { PAGE_PARAMETERS } from '~/lib/constants/page'
import { Code, CodeType } from '~/lib/types/language'
import type { PageParameters } from '~/lib/types/page'
import { siteCopy } from '~/lib/constants/site-copy'
import { isHappo } from '~/lib/utils/is-happo'
import { withBasePath } from '~/lib/helpers/with-base-path'

interface LanguagePageParameters extends PageParameters {
  codes?: Code[]
}

interface RouteParams extends ParsedUrlQuery {
  slug: string
}

export default function LanguageDocumentationPage({
  pageTitle,
  pageDescription,
  codes
}: LanguagePageParameters): JSX.Element | null {
  const [currentPath, setCurrentPath] = useState('')

  useEffect(() => {
    if (!isHappo()) {
      setCurrentPath(withBasePath(router.asPath))
    }
  }, [])

  return (
    <Layout
      pageTitle={pageTitle}
      pageDescription={pageDescription}
      className={styles.layout}
      noPadding={true}
    >
      <DocumentationPage
        menuTitle={siteCopy.titles.examples}
        menuItems={MENU_ITEMS}
        currentPath={currentPath}
        onMenuItemClick={option => {
          router.push(option.route)
        }}
      >
        {codes?.length &&
          codes.map(code => (
            <Fragment key={code.code}>
              <LanguageDocumentation
                title={`Hastebin API ${capitalize(code.title)} Example - '${
                  code.endpointName
                }' endpoint`}
                subtitle={`Check the example on how to use Hastebin API with <<${code.title}>>`}
                code={code.code}
                explanation={code.explanation}
                command={code.command}
                output={code.output}
              />
              <br />
            </Fragment>
          ))}
      </DocumentationPage>
    </Layout>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const paths = LANGUAGES.filter(language => language.slug !== undefined).map(
    language => ({
      params: {
        slug: language.slug
      }
    })
  )

  return {
    paths,
    fallback: false
  }
}

export const getStaticProps: GetStaticProps<
  LanguagePageParameters,
  RouteParams
> = async context => {
  const { params } = context

  if (!params || !params.slug) {
    return { notFound: true }
  }

  const language = LANGUAGES.find(language => language.slug === params.slug)

  const languageCodes = language?.codes?.filter(
    ({ type }) => type === CodeType.StringOutput
  )

  return {
    props: {
      codes: languageCodes,
      pageTitle: PAGE_PARAMETERS.default.pageTitle,
      pageDescription: PAGE_PARAMETERS.default.pageDescription
    }
  }
}
