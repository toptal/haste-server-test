import Container from '@toptal/picasso/Container'
import Grid from '@toptal/picasso/Grid'
import Item from '@toptal/picasso/GridItem'
import Typography from '@toptal/picasso/Typography'
import Link from '@toptal/picasso/Link'
import { useRouter } from 'next/router'

import { TestIdAboutPage } from './test-ids'
import styles from './about-page.module.scss'

import routes from '~/lib/constants/routes'
import { siteCopy } from '~/lib/constants/site-copy'

const AboutPage = (): JSX.Element => {
  const router = useRouter()

  return (
    <Container
      data-testid={TestIdAboutPage.AboutPageContainer}
      className={styles.textBlock}
    >
      <Grid spacing={16}>
        <hr className={`${styles.hr} ${styles.mobileHidden}`} />
        <Item medium={4}>
          <Typography
            size="medium"
          >
            Some important update from community
          </Typography>

          <Typography
            variant="heading"
            size="medium"
            as="h2"
            data-testid={TestIdAboutPage.AboutPageSectionTitle}
          >
            {siteCopy.titles.aboutHastebinQuestion}
          </Typography>
        </Item>
        <Item medium={8}>
          <Typography>
            Hastebin is a text store site or pastebin tool that allows you to
            easily share plain text such as code snippets with others. Our
            website is primarily used by developers and programmers to store
            pieces of sources code or configuration information, however, it is
            available to everyone for free. Use the Hastebin utility to store
            and share large amounts of information online for yourself and
            others.
          </Typography>
        </Item>
        <hr className={styles.hr} />
        <Item medium={4}>
          <Typography
            variant="heading"
            size="medium"
            as="h2"
            data-testid={TestIdAboutPage.AboutPageSectionTitle}
          >
            How Do I Use Hastebin?
          </Typography>
        </Item>
        <Item medium={8}>
          <Typography>
            Simply, type what you want to share with others, click:
            <br />
            <strong>&quot;Save&quot; (or type &apos;control + s&apos;)</strong>,
            and then copy the URL.
            <br />
            Then you can send that URL to someone and they&apos;ll see what you
            see.
          </Typography>
          <Typography>
            To make a new entry click:
            <br />
            <strong>
              &quot;Start a New TextNew&quot; (or type &apos;control + n&apos;)
            </strong>
          </Typography>
          <Typography>
            You can also duplicate and edit a saved text, clicking in:
            <br />
            <strong>
              &quot;Duplicate text&quot; (or typing &apos;ctrl + d&apos;)
            </strong>
          </Typography>
          <Typography>
            To get the raw version of a saved text just click: <br />
            <strong>
              &quot;Download RAW file&quot; (or type ctrl + shift + r)
            </strong>
          </Typography>
        </Item>
        <hr className={styles.hr} />
        <Item medium={4}>
          <Typography
            variant="heading"
            size="medium"
            as="h2"
            data-testid={TestIdAboutPage.AboutPageSectionTitle}
          >
            What about Hastebin&apos;s API?
          </Typography>
        </Item>
        <Item medium={8}>
          <Typography>
            Hastebin has a free public API to be used programmatically in any
            application. Check our{' '}
            <Link
              onClick={() => {
                router.push(routes.documentation)
              }}
              className={styles.link}
              aria-label="Documentation page"
            >
              documentation page
            </Link>{' '}
            to learn how to use it in different languages.
          </Typography>
        </Item>
        <hr className={styles.hr} />
        <Item medium={4}>
          <Typography
            variant="heading"
            size="medium"
            as="h2"
            data-testid={TestIdAboutPage.AboutPageSectionTitle}
          >
            What is Your Privacy Policy?
          </Typography>
        </Item>
        <Item medium={8}>
          <Typography>
            While the contents of Hastebin are not directly crawled by any
            search robot that obeys &quot;robots.txt&quot;, there should be no
            great expectation of privacy. Post things at your own risk. Toptal
            LLC is not responsible for any loss of data or removed pastes.
          </Typography>
          <Typography>
            For more information, you can view our privacy policy{' '}
            <Link
              className={styles.link}
              href="https://www.toptal.com/privacy"
              aria-label="Privacy policy"
            >
              here
            </Link>
            .
          </Typography>
        </Item>
        <hr className={styles.hr} />
        <Item medium={4}>
          <Typography
            variant="heading"
            size="medium"
            as="h2"
            data-testid={TestIdAboutPage.AboutPageSectionTitle}
          >
            Is Hastebin Open Source?
          </Typography>
        </Item>
        <Item medium={8}>
          <Typography>
            Hastebin can easily be installed behind your network, and it&apos;s
            all open source!
            <br />
            <Link
              className={styles.link}
              href="https://github.com/toptal/haste-client"
            >
              haste-client
            </Link>
            <br />
            <Link
              className={styles.link}
              href="https://github.com/toptal/haste-server"
            >
              haste-server
            </Link>
          </Typography>
        </Item>
        <hr className={styles.hr} />
        <Item medium={4}>
          <Typography
            variant="heading"
            size="medium"
            as="h2"
            data-testid={TestIdAboutPage.AboutPageSectionTitle}
          >
            How Long Does Pasted Content Stay Around?
          </Typography>
        </Item>
        <Item medium={8}>
          <Typography>
            Pasted content will stay for 7 days. They may be removed earlier and
            without notice.
          </Typography>
        </Item>
      </Grid>
    </Container>
  )
}

export default AboutPage
