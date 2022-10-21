import { useEffect, useState } from 'react'

let transitionTimeoutId: number

type UseConfirmationHook = {
  showConfirmation: boolean
  showAnimation?: boolean
  setShowStates: (state: boolean) => void
}

export const useConfirmation = (
  notification: boolean,
  timeout: number,
  transitionTimeout: number
): UseConfirmationHook => {
  const [showConfirmation, setShowConfirmation] =
    useState<boolean>(notification)
  const [showAnimation, setShowAnimation] = useState<boolean>()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (!showConfirmation) {
        transitionTimeoutId = window.setTimeout(() => {
          setShowAnimation(false)
        }, transitionTimeout)
      }
    }

    return () => {
      clearTimeout(transitionTimeoutId)
    }
  }, [showConfirmation, timeout, transitionTimeout])

  const setShowStates = (state: boolean) => {
    if (!state) {
      setShowConfirmation(false)
    } else {
      setShowConfirmation(true)
      setShowAnimation(true)
    }
  }

  return {
    showConfirmation,
    showAnimation,
    setShowStates
  }
}
