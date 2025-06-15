import type { HeadlessComponent } from 'react'
import { memo, useEffect } from 'react'

import { useIsomorphicEffect } from '../hooks/useIsomorphicEffect'
import { logout, selectLogin } from '../redux/adminSlice'
import { API } from '../redux/API'
import { useAppSelector } from '../redux/hooks'
import { dispatch } from '../redux/store'
import { selectTheme, updateTheme } from '../redux/themeSlice'

const HookLoaderComponent = memo(
  () => {
    // apply TailwindCSS theme onLoaded
    // bause Routes component render phase defenitelly run once per app loding
    const theme = useAppSelector(selectTheme)
    const isLoggedIn = useAppSelector(selectLogin)

    useIsomorphicEffect(() => {
      dispatch(updateTheme(theme))
    }, [])

    // TODO: move to baseQuery
    // Validate JWT token on app startup if user appears to be logged in
    useEffect(() => {
      if (isLoggedIn) {
        dispatch(API.endpoints.validateToken.initiate())
          .unwrap()
          .catch(() => {
            // Token is invalid or expired, logout the user
            dispatch(logout())
          })
      }
    }, [isLoggedIn])

    return null
  },
  () => true,
) as HeadlessComponent
HookLoaderComponent.displayName = 'SideEffect.HookLoaderComponent'

export default HookLoaderComponent
