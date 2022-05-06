import { useEffect } from 'react'

import { useIsomorphicLayoutEffect } from '../../hooks/useIsomorphicLayoutEffect'
import { useAppSelector, useAppDispatch } from '../../redux/hooks'
import type { Theme } from '../../redux/themeSlice'
import { selectTheme, updateTheme } from '../../redux/themeSlice'

export function useTheme(): [Theme, any] {
  if (!window.matchMedia && process?.env?.NODE_ENV === 'test') {
    // @TODO jest code in a real code is terrible.
    // I wanna find out other workaround soon, or at least change if statement condition to more safety one?
    // https://jestjs.io/docs/manual-mocks
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    })
  }

  const theme = useAppSelector(selectTheme)
  const dispatch = useAppDispatch()

  function update() {
    if (
      theme === 'dark' ||
      (theme === 'system' &&
        window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.add('dark', 'changing-theme')
    } else {
      document.documentElement.classList.remove('dark', 'changing-theme')
    }
    window.setTimeout(() => {
      document.documentElement.classList.remove('changing-theme')
    })
  }

  useIsomorphicLayoutEffect(() => {
    dispatch(updateTheme(theme))
    update()
  }, [theme])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    if (mediaQuery?.addEventListener) {
      mediaQuery.addEventListener('change', update)
    } else {
      mediaQuery.addListener(update)
    }

    return () => {
      if (mediaQuery?.removeEventListener) {
        mediaQuery.removeEventListener('change', update)
      } else {
        mediaQuery.removeListener(update)
      }
    }
  }, [])

  return [theme, (theme: Theme) => dispatch(updateTheme(theme))]
}
