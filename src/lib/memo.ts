import type { FunctionComponent } from 'react'
import { memo } from 'react'

/**
 * For All job done in initial render components. But it re-render, the reason added method name.
 */
const Memo = {
  context: (functionComponent: FunctionComponent) => memo(functionComponent, () => true),
  hooksContext: (functionComponent: FunctionComponent) => memo(functionComponent, () => true),
  hooksState: (functionComponent: FunctionComponent) => memo(functionComponent, () => true),
  html: (functionComponent: FunctionComponent) => memo(functionComponent, () => true),
} as const

export default Memo
