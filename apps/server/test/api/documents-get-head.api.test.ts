import { ErrorType } from '@hastebin/data-store-helper'
import { StatusCodes } from 'http-status-codes'
import request, { Response } from 'supertest'

import { BASE_API_URL } from '~/constants/index'
import { contentType } from '~/lib/document-handler/content-type'

import { mockFileContent } from '~/test/mock/file-content'

describe.each([
  [
    'GET',
    'get',
    (key: string) => ({
      key,
      data: mockFileContent
    }),
    {
      message: expect.stringMatching(
        new RegExp(
          `${ErrorType.DOCUMENT_NOT_FOUND}|${ErrorType.GET_DOCUMENT_ERROR}`
        )
      )
    }
  ],
  ['HEAD', 'head', () => ({}), {}]
])(
  'Hastebin API - [%s] /documents/:id',
  (_, method, getResponseObj, errorObj) => {
    let response: Response

    it('returns an existing document', async () => {
      const {
        body: { key }
      } = await request(BASE_API_URL)
        .post('/documents')
        .set('Content-type', 'text/plain; charset=utf-8')
        .send(mockFileContent)

      response = await request(BASE_API_URL)[method as 'get' | 'head'](
        `/documents/${key}.js`
      )

      expect(response.status).toEqual(StatusCodes.OK)
      expect(response.headers).toEqual(
        expect.objectContaining({
          'content-type': contentType.json
        })
      )
      expect(response.body).toMatchObject(getResponseObj(key))
    })

    it('returns error info for a missing document', async () => {
      response = await request(BASE_API_URL)[method as 'get' | 'head'](
        '/documents/11112222' // <-- I assume that the default key generator is phonetic
      )

      expect(response.status).toBe(StatusCodes.NOT_FOUND)
      expect(response.body).toMatchObject(errorObj)
    })
  }
)
