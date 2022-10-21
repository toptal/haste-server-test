import { render, screen } from '@testing-library/react'

import DocumentationPage from '~/pages/documentation'

import { siteCopy } from '~/lib/constants/site-copy'
import * as featureFlags from '~/lib/feature-flags'
import PageProvider from '~/test/lib/page-provider'

jest.mock('~/lib/feature-flags', () => ({
  isUserAuthEnabled: jest.fn().mockImplementation(() => true)
}))

jest.mock('next-auth', () => {
  return {
    __esModule: true,
    unstable_getServerSession: jest
      .fn()
      .mockImplementation(() => ({ user: { email: '' } })),
    default: jest.fn().mockImplementation()
  }
})

jest.mock('~/lib/repositories/user', () => ({
  findUserByEmail: jest.fn(() => ({ apiToken: 'token' }))
}))

const arrangeTest = () => {
  const { rerender } = render(
    <PageProvider>
      <DocumentationPage />
    </PageProvider>
  )

  return rerender
}

describe('Documentation Page', () => {
  let rerender: (ui: React.ReactElement) => void

  describe('when theme is Toptal', () => {
    beforeEach(() => {
      rerender = arrangeTest()
    })

    describe('when user authentication feature is enabled', () => {
      it('shows authentication section', () => {
        expect(
          screen.getByRole('button', { name: siteCopy.actions.signInButton })
        ).toBeInTheDocument()
      })
    })

    describe('when user authentication feature is disabled', () => {
      beforeEach(() => {
        jest
          .spyOn(featureFlags, 'isUserAuthEnabled')
          .mockImplementationOnce(() => false)

        rerender(
          <PageProvider>
            <DocumentationPage />
          </PageProvider>
        )
      })

      it('hides authentication section', async () => {
        expect(
          screen.queryByRole('button', { name: siteCopy.actions.signInButton })
        ).not.toBeInTheDocument()
      })
    })

    it('renders header logo and footer', () => {
      expect(
        screen.getByText('Hire the top 3% of freelance talent')
      ).toBeInTheDocument()
      expect(screen.queryByLabelText('toptal-header-logo')).toBeInTheDocument()
    })
  })

  describe('when theme is white-label', () => {
    beforeEach(() => {
      render(
        <PageProvider isWhiteLabelVersion={true}>
          <DocumentationPage />
        </PageProvider>
      )
    })

    it(`doesn't render header logo and footer`, () => {
      expect(screen.queryByText('Copyright 2010')).not.toBeInTheDocument()
      expect(
        screen.queryByLabelText('toptal-header-logo')
      ).not.toBeInTheDocument()
    })
  })
})
