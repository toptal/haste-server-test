import { fireEvent, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import useFetch from 'use-http'
import { signIn, signOut } from 'next-auth/react'
import PicassoLight from '@toptal/picasso-provider/Picasso/PicassoLight'

import Authentication from '.'

import { mockSession } from '~/test/mock/session'
import { siteCopy } from '~/lib/constants/site-copy'
import { trackInteractionOnce } from '~/lib/analytics'
import { InteractionEvents } from '~/lib/types/analytics'

jest.mock('use-http')

const useSession = jest.spyOn(require('next-auth/react'), 'useSession')

const mockFetch = useFetch as unknown as jest.Mock
const mockGet = jest.fn(() => Promise.resolve({ apiToken: 'originaltoken' }))

mockFetch.mockImplementation(() => ({
  get: mockGet,
  response: {
    ok: true
  },
  loading: false
}))

jest.mock('next-auth/react')

jest.mock('~/lib/analytics', () => ({
  trackInteractionOnce: jest.fn()
}))

describe('Authentication', () => {
  beforeEach(() => {
    render(
      <PicassoLight>
        <Authentication />
      </PicassoLight>
    )
  })

  describe('when user is not authenticated', () => {
    beforeAll(() => {
      useSession.mockImplementation(() => ({
        data: null,
        status: 'unauthenticated'
      }))
    })

    it('displays sign in button', () => {
      expect(
        screen.getByRole('button', { name: siteCopy.actions.signInButton })
      ).toBeInTheDocument()
    })

    it('calls next auth sign in when sign in button is clicked', () => {
      const SignInButton = screen.getByRole('button', {
        name: siteCopy.actions.signInButton
      })

      fireEvent.click(SignInButton)

      expect(signIn).toHaveBeenCalled()
    })

    it('does not display sign out link', () => {
      expect(
        screen.queryByRole('link', { name: /Sign out/ })
      ).not.toBeInTheDocument()
    })

    it('generate token button is not displayed', () => {
      expect(
        screen.queryByRole('button', { name: siteCopy.actions.generateToken })
      ).not.toBeInTheDocument()
    })

    it('tracks interaction on sign in button click', async () => {
      const SignInButton = screen.getByRole('button', {
        name: siteCopy.actions.signInButton
      })

      await userEvent.click(SignInButton)

      expect(trackInteractionOnce).toBeCalledWith(InteractionEvents.SignIn)
    })
  })

  describe('when user is authenticated', () => {
    beforeAll(() => {
      useSession.mockImplementation(() => ({
        data: mockSession,
        status: 'authenticated'
      }))
    })

    it('displays sign in button', () => {
      expect(
        screen.queryByRole('button', { name: siteCopy.actions.signInButton })
      ).not.toBeInTheDocument()
    })

    it('displays sign out link', () => {
      expect(screen.getByRole('link', { name: /Sign out/ })).toBeInTheDocument()
    })

    it('displays generate token button', () => {
      expect(
        screen.getByRole('button', { name: siteCopy.actions.generateToken })
      ).toBeInTheDocument()
    })

    it('displays input with token', () => {
      expect(screen.getByRole('textbox', { name: 'token' })).toHaveValue(
        'originaltoken'
      )
    })

    it('calls next auth sign out when sign out link is clicked', () => {
      const SignOutLink = screen.getByRole('link', { name: /Sign out/ })

      fireEvent.click(SignOutLink)

      expect(signOut).toHaveBeenCalled()
    })

    it('tracks interaction on sign in button click', () => {
      const SignOutLink = screen.getByRole('link', { name: /Sign out/ })

      userEvent.click(SignOutLink)

      expect(trackInteractionOnce).toBeCalledWith(InteractionEvents.SignOut)
    })
  })
})
