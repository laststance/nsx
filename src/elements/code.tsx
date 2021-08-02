/**
 * These componets are used to react-markdown library.
 * Reffer https://github.com/remarkjs/react-markdown#appendix-b-components
 */
import React from 'react'
import type { CodeComponent } from 'react-markdown/src/ast-to-react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'

// @TODO React.Component<SyntaxHighlighterProps>
const code: CodeComponent = ({ inline, className, children }) => {
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

export default code
