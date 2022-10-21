import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import useFetch from 'use-http'
import PicassoLight from '@toptal/picasso-provider/Picasso/PicassoLight'

import GenerateToken from '.'

import { mockSession } from '~/test/mock/session'
import { siteCopy } from '~/lib/constants/site-copy'
import { trackInteractionOnce } from '~/lib/analytics'
import { InteractionEvents } from '~/lib/types/analytics'

jest.mock('next-auth/react')
jest.mock('use-http')

const useSession = jest.spyOn(require('next-auth/react'), 'useSession')

const setTokenMock = jest.fn()
const onErrorMock = jest.fn()
const mockFetch = useFetch as unknown as jest.Mock
const mockPost = jest.fn(() => Promise.resolve({ apiToken: 'a new token' }))

mockFetch.mockImplementation(() => ({
  post: mockPost,
  response: {
    ok: true
  },
  loading: false
}))

jest.mock('~/lib/analytics', () => ({
  trackInteractionOnce: jest.fn()
}))

const generateTokenButtonText = 'Generate Token'

const arrangeTest = () => {
  const { rerender } = render(
    <PicassoLight>
      <GenerateToken
        onError={onErrorMock}
        setToken={setTokenMock}
        userToken="old token"
      />
    </PicassoLight>
  )

  return rerender
}

describe('GenerateToken', () => {
  let rerender: (ui: React.ReactElement) => void

  beforeEach(() => {
    rerender = arrangeTest()
  })

  describe('when user is not authenticated', () => {
    beforeAll(() => {
      useSession.mockImplementation(() => ({
        data: null,
        status: 'unauthenticated'
      }))
    })

    it('does not display generate token button', () => {
      expect(
        screen.queryByRole('button', { name: siteCopy.actions.signInButton })
      ).not.toBeInTheDocument()
    })
  })

  describe('when user is authenticated', () => {
    beforeAll(() => {
      useSession.mockImplementation(() => ({
        data: mockSession,
        status: 'authenticated'
      }))
    })

    it('displays generate token button and input', () => {
      expect(
        screen.getByRole('button', { name: generateTokenButtonText })
      ).toBeInTheDocument()

      expect(screen.getByLabelText('token')).toBeInTheDocument()
    })

    it('calls set token when clicked', async () => {
      const GenerateTokenButton = screen.getByRole('button', {
        name: generateTokenButtonText
      })

      expect(screen.getByLabelText('token')).toBeInTheDocument()

      await waitFor(() => fireEvent.click(GenerateTokenButton))

      expect(setTokenMock).toHaveBeenCalledWith('a new token')
    })

    it('calls on error callback when api returns failure', async () => {
      mockFetch.mockImplementationOnce(() => ({
        post: jest.fn(),
        response: {
          ok: false
        }
      }))

      rerender(
        <PicassoLight>
          <GenerateToken
            onError={onErrorMock}
            setToken={setTokenMock}
            userToken="old token"
          />
        </PicassoLight>
      )

      await waitFor(() =>
        fireEvent.click(
          screen.getByRole('button', {
            name: generateTokenButtonText
          })
        )
      )

      expect(onErrorMock).toHaveBeenCalled()
    })
  })

  it('tracks interaction', async () => {
    const generateTokenButton = screen.getByRole('button', {
      name: generateTokenButtonText
    })

    await userEvent.click(generateTokenButton)

    expect(trackInteractionOnce).toBeCalledWith(InteractionEvents.GenerateToken)
  })
})
