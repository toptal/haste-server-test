export interface User {
  id: string
  name: string
  email: string
  apiToken: string
  blocked: boolean
}

export interface Document {
  id: string
  userId: string
  ipaddress: string
}
