import type { FunctionComponent } from 'react'
import { memo } from 'react'
export function html(functionComponent: FunctionComponent) {
  return memo(functionComponent, () => true)
}
