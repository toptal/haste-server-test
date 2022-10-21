import Typography from '@toptal/picasso/Typography'
import Button from '@toptal/picasso/Button'
import { Github16 } from '@toptal/picasso/Icon'
import { signIn, signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { MouseEvent, useEffect, useState } from 'react'
import { useFetch, CachePolicies } from 'use-http'

import GenerateToken from '~/components/GenerateToken'

import styles from './authentication.module.scss'

import { isHappo } from '~/lib/utils/is-happo'
import { isBypassSessionEnabled } from '~/lib/session/is-bypass-session-enabled'
import { AuthProviders } from '~/lib/types/auth-providers'
import { siteCopy } from '~/lib/constants/site-copy'
import { trackInteractionOnce } from '~/lib/analytics'
import { InteractionEvents } from '~/lib/types/analytics'
import routes from '~/lib/constants/routes'

const Authentication = (): JSX.Element => {
  const { data: session, status } = useSession()

  const [loading, setLoading] = useState(false)
  const [userToken, setUserToken] = useState<string>('')

  const { get, response } = useFetch({
    cachePolicy: CachePolicies.NO_CACHE
  })

  useEffect(() => {
    if (isHappo() || !session?.user?.email || status !== 'authenticated') {
      return
    }

    get(routes.api.getToken()).then(resultJson => {
      if (response.ok) {
        setUserToken(resultJson.apiToken || '')
      }
    })
  }, [session, status, get, response])

  const handleOnError = () => {
    // TODO: Show alert here
  }

  const SignedInContent = (): JSX.Element => (
    <>
      <Typography>
        {siteCopy.documentationText.authInfo(session?.user?.name || '')}
        <Link href="#">
          <a
            className={styles.signoutLink}
            onClick={async e => {
              trackInteractionOnce(InteractionEvents.SignOut)
              if (!loading) {
                e.preventDefault()
                setLoading(true)
                await signOut({ redirect: false })
                setLoading(false)
              }
            }}
          >
            {' (Sign out)'}
          </a>
        </Link>
      </Typography>
      <GenerateToken
        setToken={setUserToken}
        onError={handleOnError}
        userToken={userToken}
      />
    </>
  )

  const SignedOutContent = (): JSX.Element => (
    <>
      <Typography>{siteCopy.documentationText.authPart1}</Typography>

      <Typography>
        {siteCopy.documentationText.authPart2}
        <b>{siteCopy.documentationText.authPart3}</b>
      </Typography>

      <Typography>{siteCopy.documentationText.authPart4}</Typography>

      <Button
        className={styles.signinButton}
        loading={loading}
        icon={<Github16 />}
        onClick={async (e: MouseEvent) => {
          trackInteractionOnce(InteractionEvents.SignIn)
          if (!loading) {
            e.preventDefault()
            setLoading(true)
            await signIn(
              isBypassSessionEnabled ? AuthProviders.mock : AuthProviders.github
            )
          }
        }}
      >
        {siteCopy.actions.signInButton}
      </Button>
    </>
  )

  return session ? <SignedInContent /> : <SignedOutContent />
}

export default Authentication
