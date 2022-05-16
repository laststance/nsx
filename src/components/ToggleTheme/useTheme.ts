import { useCallback } from 'react'

import { useIsomorphicLayoutEffect } from '../../hooks/useIsomorphicLayoutEffect'
import { useAppSelector, useAppDispatch } from '../../redux/hooks'
import type { Theme } from '../../redux/themeSlice'
import { selectTheme, updateTheme } from '../../redux/themeSlice'

export function useTheme(): [Theme, (theme: Theme) => void] {
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
