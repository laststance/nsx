import type {
  Dispatch,
  SetStateAction,
  WeakValidationMap,
  ValidationMap,
  ReactElement,
} from 'react'

declare module 'react' {
  export type SetState<in S> = Dispatch<SetStateAction<S>>

  /**
   * This type of Component never return a UI.
   * Only contain effect for a business logic.
   */
  export interface HeadlessEffectComponent<in P = any> {
    (props: P, context?: any): ReactElement<P, any> | null
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

  export function memo<in P = any>(
    Component: HeadlessEffectComponent<P>,
    propsAreEqual?: (prevProps: Readonly<P>, nextProps: Readonly<P>) => boolean
  ): HeadlessEffectComponent<P>
}
