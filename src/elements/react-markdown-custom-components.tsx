/**
 * These componets are used to react-markdown library.
 * Reffer https://github.com/remarkjs/react-markdown#appendix-b-components
 */
import React from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'

export const a = (
  props: JSX.IntrinsicAttributes &
    React.ClassAttributes<HTMLAnchorElement> &
    React.AnchorHTMLAttributes<HTMLAnchorElement>
): React.ReactElement => (
  // eslint-disable-next-line jsx-a11y/anchor-has-content
  <a {...props} target="_blank" className="text-blue-700"></a>
)

// @ts-ignore @TODO I have no time
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const code = ({ inline, className, children, ...props }) => {
  const match = /language-(\w+)/.exec(className || '')
  return !inline && match ? (
    <SyntaxHighlighter
      language={match[1]}
      PreTag="div"
      children={String(children).replace(/\n$/, '')}
      {...props}
    />
  ) : (
    <code className={className} {...props}>
      {children}
    </code>
  )
}
