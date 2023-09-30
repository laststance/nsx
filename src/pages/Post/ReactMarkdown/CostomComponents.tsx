import type { ClassAttributes, AnchorHTMLAttributes, ReactElement } from 'react'
import type { ExtraProps } from 'react-markdown'

type Props = ClassAttributes<HTMLAnchorElement> &
  AnchorHTMLAttributes<HTMLAnchorElement> &
  ExtraProps
export const a = (props: Props): ReactElement => (
  // eslint-disable-next-line jsx-a11y/anchor-has-content
  <a {...props} target="_blank"></a>
)
