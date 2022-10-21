import { useState } from 'react'

type UseCopyCodeHook = {
  error: boolean
  copyToClipboard: (text?: string) => void
  setError: (error: boolean) => void
}

export async function copyTextToClipboard(
  text: string
): Promise<void | boolean> {
  if ('clipboard' in navigator) {
    return await navigator.clipboard.writeText(text)
  } else {
    return document.execCommand('copy', true, text)
  }
}

export const useCopyCode = (): UseCopyCodeHook => {
  const [error, setError] = useState(false)

  const copyToClipboard = (text?: string) => {
    if (!text) {
      setError(true)
    } else {
      copyTextToClipboard(text)
        .then(() => {
          if (error) {
            setError(false)
          }
        })
        .catch(() => {
          setError(true)
        })
    }
  }

  return { copyToClipboard, error, setError }
}
