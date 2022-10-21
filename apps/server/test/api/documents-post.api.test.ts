import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import request, { Response } from 'supertest'

import { BASE_API_URL } from '~/constants/index'

import { mockFileContent, mockJsonFileContent } from '~/test/mock/file-content'

describe('Hastebin API - [POST] /documents', () => {
  let response: Response

  it('adds a plain text document', async () => {
    response = await request(BASE_API_URL)
      .post('/documents')
      .set('Content-type', 'text/plain; charset=utf-8')
      .send(mockFileContent)

    expect(response.status).toEqual(StatusCodes.OK)
    expect(response.body).toMatchObject({ key: expect.stringMatching(/.+/) })
  })

  it('adds a json document', async () => {
    response = await request(BASE_API_URL)
      .post('/documents')
      .set('Content-type', 'application/json')
      .send(mockJsonFileContent)

    expect(response.status).toEqual(StatusCodes.OK)
    expect(response.body).toMatchObject({ key: expect.stringMatching(/.+/) })
  })

  it('adds a multipart/form document', async () => {
    response = await request(BASE_API_URL)
      .post('/documents')
      .field('data', mockFileContent)

    expect(response.status).toEqual(StatusCodes.OK)
    expect(response.body).toMatchObject({ key: expect.stringMatching(/.+/) })
  })

  it('fails adding an empty document', async () => {
    response = await request(BASE_API_URL)
      .post('/documents')
      .set('Content-type', 'text/plain; charset=utf-8')
      .send()

    expect(response.status).toEqual(StatusCodes.BAD_REQUEST)
    expect(response.body).toMatchObject({
      message: 'Body must not be empty.'
    })
  })

  it('fails adding document when maxFileSize validation fails', async () => {
    response = await request(BASE_API_URL)
      .post('/documents')
      .set('Content-type', 'text/plain; charset=utf-8')
      .send(mockFileContent.repeat(100000))

    expect(response.status).toEqual(StatusCodes.REQUEST_TOO_LONG)
    expect(response.body).toMatchObject({
      message: ReasonPhrases.REQUEST_TOO_LONG
    })
  })
})
