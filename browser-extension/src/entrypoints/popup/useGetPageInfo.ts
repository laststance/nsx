import { useLayoutEffect, useState } from 'react'

import { getCurrentTab } from '../../lib/getCurrentTab'

import type { PopupState } from './App'
import { getLoadableFaviconUrl } from './utils/getLoadableFaviconUrl'

/**
 * Hook to fetch current page information for the popup
 * Retrieves page title, URL and favicon from the active tab
 * @returns PopupState with pageTitle, url and faviconUrl
 */
export function useGetPageInfo(): PopupState {
  const [state, setState] = useState<PopupState>({
    faviconUrl: '',
    pageTitle: '',
    url: '',
  })

  useLayoutEffect(() => {
    getCurrentTab().then((tab) => {
      setState(() => {
        return {
          faviconUrl: getLoadableFaviconUrl(tab?.favIconUrl),
          pageTitle: tab?.title || '',
          url: tab?.url || '',
        }
      })
    })
  }, [])

  return state
}
