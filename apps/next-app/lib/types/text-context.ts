import { Dispatch, SetStateAction } from 'react'

export interface TextContextType {
  text: string
  setText: Dispatch<SetStateAction<string>>
}
