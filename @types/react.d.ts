import type {
  Dispatch,
  SetStateAction,
  WeakValidationMap,
  ValidationMap,
  ReactNode,
} from 'react'

declare module '*.svg' {
  const content: React.FC<React.SVGProps<SVGElement>>
  export default content
}

declare module 'react' {
  export type SetState<in S> = Dispatch<SetStateAction<S>>

  /**
   * This type of Component never return a UI.
   * Only contain effect for a business logic.
   */
  export interface HeadlessEffectComponent<in P = any> {
    (props: P, context?: any): ReactNode['null']
    propTypes?: WeakValidationMap<P> | undefined
    contextTypes?: ValidationMap<any> | undefined
    defaultProps?: Partial<P> | undefined
    displayName?: string | undefined
  }

  /**
   * Usually mount as a HeadlessEffectComponeneat first render.
   * But sometime render time e t modal, toast, ntackbar
   */
  export type WidgetManageComponent<in P = any> = React.FC<P>
}
