import { render, screen } from '@testing-library/react'

import NotFound from '~/pages/404'

import PageProvider from '~/test/lib/page-provider'

describe('NotFound', () => {
  beforeEach(() => {
    render(
      <PageProvider>
        <NotFound />
      </PageProvider>
    )
  })

  it('renders not found page', async () => {
    expect(screen.queryByText('404')).toBeInTheDocument()
    expect(
      screen.queryByText(
        'Unfortunately, the page you’re looking for doesn’t exist.'
      )
    ).toBeInTheDocument()
  })
})
