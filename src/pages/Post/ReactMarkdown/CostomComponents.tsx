import type { ComponentProps, ReactNode } from 'react'
import type { ExtraProps } from 'react-markdown'

type Props = ComponentProps<'a'> & ExtraProps
export const a = (props: Props): ReactNode => <a {...props} target="_blank"></a>
