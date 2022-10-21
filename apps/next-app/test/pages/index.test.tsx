import { render, screen, fireEvent, act } from '@testing-library/react'
import { useRouter } from 'next/router'

import { TestIdEditor } from '~/components/Editor/test-ids'

import PageProvider from '~/test/lib/page-provider'
import Home from 'pages/index'
import { PROJECT_DISPLAY_NAME } from '~/lib/constants/common'
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

const fetchMock = jest.fn()

const useRouterMock = useRouter as jest.Mock
const pushMock = jest.fn()

const originalEnv = { ...process.env }

useRouterMock.mockImplementation(() => ({
  push: pushMock,
  asPath: '/'
}))

global.fetch = fetchMock
fetchMock.mockImplementation(
  () =>
    new Promise(resolve => {
      resolve({ ok: true, json: () => ({ key: 'elo' }) })
    })
)

describe('Home', () => {
  describe('when theme is Toptal', () => {
    beforeEach(() => {
      render(
        <PageProvider>
          <Home />
        </PageProvider>
      )
    })

    it('renders correctly', async () => {
      const title = PROJECT_DISPLAY_NAME

      expect(await screen.findByText(title)).toBeInTheDocument()
    })

    it('renders header logo and footer', () => {
      expect(
        screen.getByText('Hire the top 3% of freelance talent')
      ).toBeInTheDocument()
      expect(screen.queryByLabelText('toptal-header-logo')).toBeInTheDocument()
    })
  })

  it('renders footer for toptal version', () => {
    render(
      <PageProvider>
        <Home />
      </PageProvider>
    )

    expect(
      screen.getByText('Hire the top 3% of freelance talent')
    ).toBeInTheDocument()
  })

  it(`doesn't render footer for white-label version`, () => {
    render(
      <PageProvider isWhiteLabelVersion={true}>
        <Home />
      </PageProvider>
    )

    expect(screen.queryByText('Copyright 2010')).toBe(null)
  })

  describe('with redirect enabled', () => {
    beforeAll(() => {
      process.env.NEXT_PUBLIC_BIN_ON_BASEPATH = 'enabled'
    })

    afterAll(() => {
      process.env = originalEnv
    })

    beforeEach(() => {
      render(
        <PageProvider>
          <Home />
        </PageProvider>
      )
    })

    describe('with empty state', () => {
      it('shows save button', () => {
        expect(
          screen.getByRole('button', {
            name: siteCopy.actions.save
          })
        ).toBeInTheDocument()
      })

      it('changes route to bin on save button click with redirect', async () => {
        const saveButton = screen.getByRole('button', {
          name: siteCopy.actions.save
        })

        const textArea = screen.getByTestId(TestIdEditor.TextArea)

        fireEvent.change(textArea, { target: { value: 'lorem520' } })

        await act(async () => {
          fireEvent.click(saveButton)
        })

        expect(saveButton).toBeInTheDocument()

        expect(pushMock).toHaveBeenCalledWith('/share/elo')
      })
    })
  })

  describe('with redirect disabled', () => {
    beforeAll(() => {
      process.env.NEXT_PUBLIC_BIN_ON_BASEPATH = 'disabled'
    })

    afterAll(() => {
      process.env = originalEnv
    })

    describe('with empty state', () => {
      beforeEach(() => {
        jest.resetModules()
        pushMock.mockReset()
        render(
          <PageProvider>
            <Home />
          </PageProvider>
        )
      })

      it('shows save button', async () => {
        const saveButton = await screen.findByText(siteCopy.actions.save)

        expect(saveButton).toBeInTheDocument()
      })

      it('doesnt change route to bin on save button click and sets binId state', async () => {
        const saveButton = screen.getByRole('button', {
          name: siteCopy.actions.save
        })

        fireEvent.click(saveButton)

        expect(pushMock).not.toHaveBeenCalled()
      })
    })

    describe('with binId set', () => {
      beforeEach(() => {
        render(
          <PageProvider>
            <Home />
          </PageProvider>
        )
        const textArea = screen.getByTestId(TestIdEditor.TextArea)

        fireEvent.change(textArea, { target: { value: 'lorem520' } })

        const saveButton = screen.getByRole('button', {
          name: siteCopy.actions.save
        })

        fireEvent.click(saveButton)
      })

      it('disables editor', async () => {
        expect(screen.getByTestId(TestIdEditor.TextArea)).toHaveAttribute(
          'disabled'
        )
      })

      it('shows action buttons', async () => {
        const duplicateButton = screen.getByRole('button', {
          name: siteCopy.actions.duplicateText
        })

        expect(duplicateButton).toBeInTheDocument()
      })

      it('duplicates text without redirect on duplicate button click', async () => {
        const duplicateButton = screen.getByRole('button', {
          name: siteCopy.actions.duplicateText
        })

        fireEvent.click(duplicateButton)

        const saveButton = await screen.findByText(siteCopy.actions.save)

        expect(pushMock).not.toHaveBeenCalled()
        expect(screen.getByTestId(TestIdEditor.TextArea)).not.toHaveAttribute(
          'disabled'
        )
        expect(saveButton).toBeInTheDocument()
      })
    })
  })
})
