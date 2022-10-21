export const isUserAuthEnabled = (): boolean =>
  process.env.NEXT_PUBLIC_FF_USER_AUTH !== 'disabled'
