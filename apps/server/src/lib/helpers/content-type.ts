import type { Request } from 'express'

export const getContentType = (request: Request): string | undefined => {
  const [contentType] = request.headers['content-type']?.split(';') ?? []

  return contentType
}

export const isForm = (request: Request): boolean => {
  return getContentType(request) === 'multipart/form-data'
}
