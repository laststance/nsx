import type React from 'react'
import type { SetStateAction, WeakValidationMap, ValidationMap } from 'react'

declare module 'react' {
  export type SetState<S> = React.Dispatch<SetStateAction<S>>

  /**
   * This type of Component never return a UI.
   * Only contain effect for a business logic.
   */
  export interface HeadlessEffectComponent<P = any> {
    (props: P, context?: any): ReactNode
    contextTypes?: ValidationMap<any> | undefined
    defaultProps?: Partial<P> | undefined
    displayName?: string | undefined
    propTypes?: WeakValidationMap<P> | undefined
  }

  export type HeadlessComponent<P = any> = React.FC<P>
}
