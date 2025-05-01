import type { HeadlessComponent } from 'react'
import { memo } from 'react'

import { useIsomorphicEffect } from '../hooks/useIsomorphicEffect'
import { useAppSelector } from '../redux/hooks'
import { dispatch } from '../redux/store'
import { selectTheme, updateTheme } from '../redux/themeSlice'

const HookLoaderComponent = memo(
  () => {
    // apply TailwindCSS theme onLoaded
    // bause Routes component render phase defenitelly run once per app loding
    const theme = useAppSelector(selectTheme)
    useIsomorphicEffect(() => {
      dispatch(updateTheme(theme))
    }, [])

    return null
  },
  () => true,
) as HeadlessComponent
HookLoaderComponent.displayName = 'SideEffect.HookLoaderComponent'

export default HookLoaderComponent
