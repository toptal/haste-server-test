import { useEffect } from 'react'

import { getKey } from '../constants/hotkeys'

const useHotKeys = (
  label: string,
  callback: (e: KeyboardEvent) => void
): void => {
  useEffect(() => {
    const handleListener = (e: KeyboardEvent) => {
      const key = getKey(e)

      if (key && key.label === label) {
        e.preventDefault()
        callback(e)
      }
    }

    window.addEventListener('keydown', handleListener)

    return () => {
      window.removeEventListener('keydown', handleListener)
    }
  })
}

export default useHotKeys
