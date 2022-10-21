import { useRouter } from 'next/router'
import { MenuAnchor, MenuAnchorItem } from '@toptal/site-acq-ui-library'
import { ReactElement } from 'react'

import { TestIdLanguageMenu } from './test-ids'

import { LANGUAGES } from '~/lib/constants/languages'
import type { HeaderTag } from '~/lib/types/header'
import routes from '~/lib/constants/routes'

type LanguagesMenuProps = {
  title: ReactElement
  menuItemTag?: HeaderTag
  menuClassName?: string
  menuItemClassName?: string
  className?: string
}

const LanguagesMenu = ({
  title,
  menuItemTag,
  className,
  menuClassName,
  menuItemClassName
}: LanguagesMenuProps): JSX.Element => {
  const router = useRouter()

  return (
    <MenuAnchor
      className={className}
      title={title}
      menuClassName={menuClassName}
      testId={TestIdLanguageMenu.Menu}
    >
      {LANGUAGES.map(option => {
        return (
          <MenuAnchorItem
            currentPath={routes.publicRelative(router.asPath)}
            className={menuItemClassName}
            key={option.route}
            option={{ ...option, route: routes.publicRelative(option.route) }}
            tag={menuItemTag}
            testId={`${option.title}-${TestIdLanguageMenu.MenuItem}`}
            onClick={() => {
              router.push(option.route)
            }}
          />
        )
      })}
    </MenuAnchor>
  )
}

export default LanguagesMenu
