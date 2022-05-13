import { useEffect, useCallback } from 'react'

import { useIsomorphicLayoutEffect } from '../../hooks/useIsomorphicLayoutEffect'
import { useAppSelector, useAppDispatch } from '../../redux/hooks'
import type { Theme } from '../../redux/themeSlice'
import { selectTheme, updateTheme } from '../../redux/themeSlice'

export function DOMUpdate(theme: Theme) {
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

export function useTheme(): [Theme, ReturnType<typeof useCallback>] {
  if (!window.matchMedia && process?.env?.NODE_ENV === 'test') {
    // @TODO jest code in a real code is terrible.
    // I wanna find out other workaround soon, or at least change if statement condition to more safety one?
    // https://jestjs.io/docs/manual-mocks
    Object.defineProperty(window, 'matchMedia', {
      value: jest.fn().mockImplementation((query) => ({
        // deprecated
        addEventListener: jest.fn(),

        addListener: jest.fn(),

        dispatchEvent: jest.fn(),

        matches: false,
        media: query,

        onchange: null,

        removeEventListener: jest.fn(),
        // deprecated
        removeListener: jest.fn(),
      })),
      writable: true,
    })
  }

  const theme = useAppSelector(selectTheme)
  const dispatch = useAppDispatch()

  const HandleOnChange = useCallback((theme: Theme) => {
    dispatch(updateTheme(theme))
  }, [])

  useIsomorphicLayoutEffect(() => {
    DOMUpdate(theme)
  }, [])

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    if (mediaQuery?.addEventListener) {
      mediaQuery.addEventListener('change', () => DOMUpdate(theme))
    } else {
      mediaQuery.addListener(() => DOMUpdate(theme))
    }

    return () => {
      if (mediaQuery?.removeEventListener) {
        mediaQuery.removeEventListener('change', () => DOMUpdate(theme))
      } else {
        mediaQuery.removeListener(() => DOMUpdate(theme))
      }
    }
  }, [theme])

  return [theme, HandleOnChange]
}
