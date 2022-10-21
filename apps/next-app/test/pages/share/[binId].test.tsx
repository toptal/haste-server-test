import { render, fireEvent, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useRouter } from 'next/router'

import SharedBinPage from '~/pages/share/[binId]'

import { siteCopy } from '~/lib/constants/site-copy'
import PageProvider from '~/test/lib/page-provider'
import { trackInteractionOnce } from '~/lib/analytics'
import { InteractionEvents } from '~/lib/types/analytics'

global.window = Object.create(window)

Object.defineProperty(window, 'matchMedia', {
  value: jest.fn().mockImplementation(query => ({
    matches: true,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn()
  }))
})

jest.mock('next/router', () => ({
  useRouter: jest.fn()
}))

const useRouterMock = useRouter as jest.Mock
const pushMock = jest.fn()

useRouterMock.mockImplementation(() => ({
  push: pushMock,
  asPath: '/'
}))

jest.mock('~/lib/analytics', () => ({
  trackInteractionOnce: jest.fn()
}))

describe('Bin Page', () => {
  describe('when theme is Toptal', () => {
    beforeEach(() => {
      render(
        <PageProvider>
          <SharedBinPage binId="id" text="mockText" />
        </PageProvider>
      )
    })

    it('shows duplicate tooltip on hover', async () => {
      fireEvent.mouseOver(
        screen.getByRole('button', { name: siteCopy.actions.duplicateText })
      )

      await waitFor(() =>
        expect(screen.findByRole('tooltip')).resolves.toBeInTheDocument()
      )
    })

    it('tracks interaction', async () => {
      const duplicateTextButton = screen.getByRole('button', {
        name: siteCopy.actions.duplicateText
      })

      await userEvent.click(duplicateTextButton)

      expect(trackInteractionOnce).toBeCalledWith(
        InteractionEvents.DuplicateText
      )
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
          <SharedBinPage binId="id" text="mockText" />
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

  describe('duplicate action', () => {
    describe('with shouldRedirect enabled', () => {
      const oldWindowLocation = window.location

      beforeAll(() => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        delete window.location

        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        window.location = Object.defineProperties(
          {},
          {
            ...Object.getOwnPropertyDescriptors(oldWindowLocation),
            assign: {
              configurable: true,
              value: jest.fn()
            }
          }
        )
      })

      afterAll(() => {
        window.location = oldWindowLocation
      })

      it('redirects to other domain', async () => {
        render(
          <PageProvider>
            <SharedBinPage binId="id" text="mockText" shouldRedirect={true} />
          </PageProvider>
        )

        const duplicateTextButton = screen.getByRole('button', {
          name: siteCopy.actions.duplicateText
        })

        await userEvent.click(duplicateTextButton)

        expect(window.location.assign).toHaveBeenCalledWith(
          'http://localhost:3000?binId=id'
        )
      })
    })

    describe('with shouldRedirect disabled', () => {
      it('does not redirects to other domain', async () => {
        render(
          <PageProvider>
            <SharedBinPage binId="id" text="mockText" shouldRedirect={false} />
          </PageProvider>
        )

        const duplicateTextButton = screen.getByRole('button', {
          name: siteCopy.actions.duplicateText
        })

        await userEvent.click(duplicateTextButton)

        expect(pushMock).toBeCalledWith('/')
      })
    })
  })
})
