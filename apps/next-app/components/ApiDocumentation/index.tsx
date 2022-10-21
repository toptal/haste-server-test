import { Container, Typography } from '@toptal/picasso'
import { Code, HighlightedWord, Title } from '@toptal/site-acq-ui-library'

import { TestIdApiDocumentation } from './test-ids'

import styles from '~/styles/DocumentationPage.module.scss'
import { siteCopy } from '~/lib/constants/site-copy'

const STATUS_CODES = [
  {
    key: 401,
    description: <>Unauthorized request. Please sign in with Github</>
  },
  {
    key: 404,
    description: <>Document not found</>
  },
  {
    key: 405,
    description: <>HTTP Method not allowed</>
  },
  {
    key: 413,
    description: (
      <>
        Too large payload - max length of a document is{' '}
        <HighlightedWord>400.000 characters</HighlightedWord>.
      </>
    )
  },
  {
    key: 500,
    description: <>Something went wrong. Failed to send request to API server</>
  }
]

const ApiDocumentation = (): JSX.Element => {
  const documentsEndpoint = siteCopy.api.endpoints.documents
  const rawEndpoint = siteCopy.api.endpoints.raw

  return (
    <Container
      flex
      direction="column"
      gap={1}
      data-testid={TestIdApiDocumentation.ApiDocumentationContainer}
    >
      <Title
        text="Deprecation Notice in the API Endpoint"
        tag="h2"
        className={styles.title}
      />
      <Typography>
        Our new website URL is {siteCopy.project.url} and the the API endpoints
        have changed:
      </Typography>
      <Title
        text={`Success Example - "${documentsEndpoint.name}" endpoint`}
        tag="h2"
      />
      <Code className={styles.code}>
        $ curl -s -X POST {documentsEndpoint.url} -d &quot;Hello World!&quot;
        <br />$ output -&gt; {'{ "key": "aeiou" }'}
      </Code>
      <Title
        text={`Error Example - "${documentsEndpoint.name}" endpoint`}
        tag="h2"
      />
      <Code>
        $ curl {documentsEndpoint.url}
        {`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Error</title>
</head>
<body>
<pre>Cannot GET /documents</pre>
</body>
</html>`}
      </Code>

      <Title
        text={`Success Example - "${rawEndpoint.name}" endpoint`}
        tag="h2"
      />
      <Code>
        $ curl {rawEndpoint.url}/aeiou
        <br />$ output -&gt; Hello World!
      </Code>
      <Title text={`Error Example - "${rawEndpoint.name}" endpoint`} tag="h2" />
      <Code>
        $ curl {rawEndpoint.url}/wrong-bin
        <br />$ output -&gt; Error getting document.
      </Code>

      <Title text="Error Status Codes" />
      <Typography>
        These are the status codes being used when something goes wrong.
      </Typography>
      <ul>
        {STATUS_CODES.map(({ key, description }) => {
          return (
            <li className={styles.statusCode} key={key}>
              <Typography as="div">
                <HighlightedWord className={styles.code}>{key}</HighlightedWord>{' '}
                <span>{description}</span>
              </Typography>
            </li>
          )
        })}
      </ul>
    </Container>
  )
}

export default ApiDocumentation
