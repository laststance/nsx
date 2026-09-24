import { useLayoutEffect, useState } from 'react'

import { getCurrentTab } from '../../lib/getCurrentTab'

import type { PopupState } from './App'

/**
 * Hook to fetch current page information for the popup.
 * Retrieves the page title and URL from the active tab when the popup opens; called once by {@link App}.
 * @returns PopupState with pageTitle and url
 */
export function useGetPageInfo(): PopupState {
  const [state, setState] = useState<PopupState>({
    pageTitle: '',
    url: '',
  })

  useLayoutEffect(() => {
    getCurrentTab().then((tab) => {
      setState(() => {
        return {
          pageTitle: tab?.title || '',
          url: tab?.url || '',
        }
      })
    })
  }, [])

  return state
}
