/**
 * These componets are used to react-markdown library.
 * Refer https://github.com/remarkjs/react-markdown#appendix-b-components
 */
import React, { memo } from 'react'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'

// @ts-ignore
const code: React.FC = memo(({ inline, className, children }) => { /* eslint-disable-line prettier/prettier */
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
  },
  () => true
)
code.displayName = 'code'

export default code
