import { useCallback } from 'react'

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
  const theme = useAppSelector(selectTheme)
  const dispatch = useAppDispatch()

  const HandleOnChange = useCallback((theme: Theme) => {
    dispatch(updateTheme(theme))
  }, [])

  useIsomorphicLayoutEffect(() => {
    dispatch(updateTheme(theme))
  }, [])

  return [theme, HandleOnChange]
}
