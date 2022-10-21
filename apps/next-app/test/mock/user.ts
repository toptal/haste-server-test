import { User } from '@prisma/client'

export const userMock: User = {
  id: 'userid',
  name: 'John Doe',
  email: 'johndoe@email.com',
  emailVerified: null,
  image: null,
  apiToken: 'originaltoken',
  blocked: false
}
