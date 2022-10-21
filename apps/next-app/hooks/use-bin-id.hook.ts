import { useRouter } from 'next/router'

interface UrlStateHookResult {
  binId: string | null
}

export const useBinId = (): UrlStateHookResult => {
  const router = useRouter()

  const { binId } = router.query
  const validId = typeof binId === 'string' ? binId : null

  return {
    binId: validId
  }
}
