import { render, RenderResult } from '@testing-library/react'
import PicassoLight from '@toptal/picasso-provider/Picasso/PicassoLight'

import { TestIdLanguageMenu } from './test-ids'

import LanguagesMenu from '.'

const mockTitle = 'mock title'

const useRouter = jest.spyOn(require('next/router'), 'useRouter')

useRouter.mockImplementation(() => ({
  asPath: '/documentation',
  push: jest.fn()
}))

describe('Language Menu', () => {
  let screen: RenderResult

  beforeEach(() => {
    screen = render(
      <PicassoLight>
        <LanguagesMenu title={<h1>{mockTitle}</h1>} />
      </PicassoLight>
    )
  })

  it('correctly renders the elements', () => {
    expect(screen.getByTestId(TestIdLanguageMenu.Menu)).toBeInTheDocument()
    expect(screen.getByText(mockTitle)).toBeInTheDocument()
  })
})
