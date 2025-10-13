import { useLayoutEffect, useState } from 'react'

import { getCurrentTab } from '../../lib/getCurrentTab'

import type { PopupState } from './App'

export function useGetPageInfo(): PopupState {
  const [state, setState] = useState<PopupState>({ pageTitle: '', url: '' })

  useLayoutEffect(() => {
    getCurrentTab().then((tab) =>
      setState(() => {
        return { pageTitle: tab.title || '', url: tab.url || '' }
      }),
    )
  }, [])

  return state
}
