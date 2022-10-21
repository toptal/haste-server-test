import { useState } from 'react'

import routes from '~/lib/constants/routes'

type SubmitResponse = {
  key?: string
  error?: Error
}

type UseSubmitBinType = {
  submit: (input: string) => Promise<SubmitResponse>
  isLoading: boolean
}

export const useSubmitBin = (): UseSubmitBinType => {
  const [isLoading, setIsLoading] = useState(false)

  const submit = async (input: string): Promise<SubmitResponse> => {
    try {
      setIsLoading(true)

      const result = await fetch(routes.api.createBin(), {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain'
        },
        body: input
      })

      if (!result || !result.ok) {
        throw new Error('Something went wrong')
      }

      return result.json()
    } catch (e) {
      return {
        error: e as Error
      }
    } finally {
      setIsLoading(false)
    }
  }

  return { submit, isLoading }
}
