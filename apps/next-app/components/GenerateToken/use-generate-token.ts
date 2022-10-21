import { Res, useFetch, CachePolicies } from 'use-http'

import routes from '~/lib/constants/routes'

type UseGenerateTokenBinType = {
  generateToken: () => Promise<string>
  loading: boolean
  response: Res<Response>
}

export const useGenerateToken = (): UseGenerateTokenBinType => {
  const { post, loading, response } = useFetch({
    cachePolicy: CachePolicies.NO_CACHE
  })

  const generateToken = async (): Promise<string> => {
    const resultJson = await post(routes.publicRelative('/api/token'))

    return response.ok ? resultJson.apiToken : ''
  }

  return { generateToken, loading, response }
}
