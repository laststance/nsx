import { useLayoutEffect, useState } from 'react'

import { getCurrentTab } from '../../lib/getCurrentTab'

import type { PopupState } from './app'

/**
 * Hook to fetch current page information for the popup
 * Retrieves page title and URL from the active tab
 * @returns PopupState with pageTitle and url
 */
export function useGetPageInfo(): PopupState {
  const [state, setState] = useState<PopupState>({ pageTitle: '', url: '' })

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
