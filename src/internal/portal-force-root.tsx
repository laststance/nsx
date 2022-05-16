import type {
  // Types
  ReactNode,
} from 'react'
import React, { createContext, useContext } from 'react'

const ForcePortalRootContext = createContext(false)

export function usePortalRoot() {
  return useContext(ForcePortalRootContext)
}

interface ForcePortalRootProps {
  force: boolean
  children: ReactNode
}

export function ForcePortalRoot(props: ForcePortalRootProps) {
  return (
    <ForcePortalRootContext.Provider value={props.force}>
      {props.children}
    </ForcePortalRootContext.Provider>
  )
}
