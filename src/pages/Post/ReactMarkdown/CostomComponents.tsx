import React from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'

export const a: React.FC = (props) => (
  // eslint-disable-next-line jsx-a11y/anchor-has-content
  <a {...props} target="_blank"></a>
)

export const code: React.FC<
  React.PropsWithChildren<{ inline: boolean; className: string }>
> = ({ inline, className, children }) => {
  const match = /language-(\w+)/.exec(className || '')
  return !inline && match ? (
    <SyntaxHighlighter
      language={match[1]}
      PreTag="div"
      children={String(children).replace(/\n$/, '')}
    />
  ) : (
    <code className={className}>{children}</code>
  )
}
