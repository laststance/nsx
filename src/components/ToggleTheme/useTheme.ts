import { useCallback } from 'react'

import { useAppSelector } from '../../redux/hooks'
import { dispatch } from '../../redux/store'
import type { Theme } from '../../redux/themeSlice'
import { selectTheme, updateTheme } from '../../redux/themeSlice'

export function useTheme(): [Theme, (theme: Theme) => void] {
  const theme = useAppSelector(selectTheme)

  const HandleOnChange = useCallback((theme: Theme) => {
    dispatch(updateTheme(theme))
  }, [])

  return [theme, HandleOnChange]
}
