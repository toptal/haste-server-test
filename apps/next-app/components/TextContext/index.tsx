import { noop } from '@toptal/picasso/utils'
import { createContext, ReactNode, useContext, useMemo, useState } from 'react'

import { TextContextType } from '~/lib/types/text-context'

const TextContext = createContext<TextContextType>({
  text: '',
  setText: noop
})

interface Props {
  children: ReactNode

  initialTextValueForTests?: string
}

const TextContextProvider = ({
  children,
  initialTextValueForTests
}: Props): JSX.Element => {
  const [text, setText] = useState(initialTextValueForTests || '')
  const value = useMemo(() => ({ text, setText }), [text, setText])

  return <TextContext.Provider value={value}>{children}</TextContext.Provider>
}

export const useTextContext = (): TextContextType => useContext(TextContext)

export default TextContextProvider
