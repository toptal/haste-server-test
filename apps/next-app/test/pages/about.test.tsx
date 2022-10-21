import { render, screen, act, fireEvent, waitFor } from '@testing-library/react'
import { useRouter } from 'next/router'

import { TestIdAboutPage } from '~/components/AboutPage/test-ids'

import PageProvider from '~/test/lib/page-provider'
import About from 'pages/about'
import { siteCopy } from '~/lib/constants/site-copy'

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
  asPath: '/about'
}))

const expectedTitles = [
  'What is Hastebin?',
  'How Do I Use Hastebin?',
  "What about Hastebin's API?",
  'What is Your Privacy Policy?',
  'Is Hastebin Open Source?',
  'How Long Does Pasted Content Stay Around?'
]

describe('About', () => {
  describe('when theme is Toptal', () => {
    beforeEach(() => {
      render(
        <PageProvider>
          <About />
        </PageProvider>
      )
    })

    it('contains page title', async () => {
      expect(
        await screen.getByTestId(TestIdAboutPage.AboutPageTitle)
      ).toHaveTextContent('About Hastebin')
    })

    it('contains section titles', async () => {
      const titles = screen.getAllByRole('heading', { level: 2 })

      for (let i = 0; i < titles.length; i++) {
        expect(titles[i].tagName.toLowerCase()).toEqual('h2')
        expect(titles[i]).toHaveTextContent(expectedTitles[i])
      }
    })

    it('shows tooltip on hover', async () => {
      const buttons = screen.getAllByRole('button', {
        name: siteCopy.actions.startNewBin
      })

      for (let i = 0; i < buttons.length; i++) {
        fireEvent.mouseOver(buttons[i])

        await waitFor(() =>
          expect(screen.findByRole('tooltip')).resolves.toBeInTheDocument()
        )
      }
    })

    it('works with hotkeys', async () => {
      await act(async () => {
        fireEvent.keyDown(document, {
          keyCode: 78,
          altKey: true,
          ctrlKey: true
        })
      })

      expect(pushMock).toHaveBeenCalledWith('/')
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
          <About />
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
