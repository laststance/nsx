import type { ComponentProps, ReactNode } from 'react'
import type { ExtraProps } from 'react-markdown'

type Props = ComponentProps<'a'> & ExtraProps
export const a = (props: Props): ReactNode => (
  // eslint-disable-next-line jsx-a11y/anchor-has-content
  <a {...props} target="_blank"></a>
)
