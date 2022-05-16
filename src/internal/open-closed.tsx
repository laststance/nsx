import type {
  // Types
  ReactNode,
  ReactElement,
} from 'react'
import React, { createContext, useContext } from 'react'

const Context = createContext<State | null>(null)
Context.displayName = 'OpenClosedContext'

export enum State {
  Open,
  Closed,
}

export function useOpenClosed() {
  return useContext(Context)
}

interface Props {
  value: State
  children: ReactNode
}

export function OpenClosedProvider({ value, children }: Props): ReactElement {
  return <Context.Provider value={value}>{children}</Context.Provider>
}
