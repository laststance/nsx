import type React from 'react'
import type { SetStateAction, ValidationMap, FunctionComponent } from 'react'

declare module 'react' {
  export type SetState<S> = React.Dispatch<SetStateAction<S>>

  /**
   * This type of Component never return a UI.
   * Only contain effect for a business logic.
   */
  export interface HeadlessComponent<P = any> extends FunctionComponent {
    (props: P, context?: any): null
    contextTypes?: ValidationMap<any> | undefined
    displayName?: string | undefined
  }
}
