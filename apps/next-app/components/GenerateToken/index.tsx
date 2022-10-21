import { Button, Input } from '@toptal/picasso'
import { useSession } from 'next-auth/react'

import { useGenerateToken } from './use-generate-token'
import styles from './github-token.module.scss'

import { trackInteractionOnce } from '~/lib/analytics'
import { InteractionEvents } from '~/lib/types/analytics'
import { siteCopy } from '~/lib/constants/site-copy'

interface GenerateTokenProps {
  userToken: string
  onError: (error: Error) => void
  setToken: (newToken: string) => void
}

const GenerateToken = ({
  userToken,
  setToken,
  onError
}: GenerateTokenProps): JSX.Element | null => {
  const { data: session } = useSession()
  const { generateToken, loading, response } = useGenerateToken()

  const handleClick = async () => {
    trackInteractionOnce(InteractionEvents.GenerateToken)
    const newToken = await generateToken()

    if (response.ok && newToken) {
      setToken(newToken)
    } else {
      onError(new Error('Something went wrong'))
    }
  }

  if (!session) {
    return null
  }

  return (
    <div className={styles.container}>
      <Input
        disabled={true}
        className={styles.tokenOutput}
        aria-label="token"
        value={userToken}
      />

      <Button
        className={styles.generateTokenButton}
        disabled={loading}
        loading={loading}
        onClick={handleClick}
      >
        {siteCopy.actions.generateToken}
      </Button>
    </div>
  )
}

export default GenerateToken
