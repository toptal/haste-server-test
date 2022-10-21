import { Session } from 'next-auth'

import { userMock } from '~/test/mock/user'

export const mockSession: Session = {
  user: userMock,
  expires: '123123123'
}
