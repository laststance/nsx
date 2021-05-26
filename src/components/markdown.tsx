/**
 * These componets are used to react-markdown library.
 * Reffer https://github.com/remarkjs/react-markdown#appendix-b-components
 */
import React from 'react'

export const A = (
  props: JSX.IntrinsicAttributes &
    React.ClassAttributes<HTMLAnchorElement> &
    React.AnchorHTMLAttributes<HTMLAnchorElement>
): React.ReactElement => (
  // eslint-disable-next-line jsx-a11y/anchor-has-content
  <a {...props} target="_blank" className="text-blue-700"></a>
)
