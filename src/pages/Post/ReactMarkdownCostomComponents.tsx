// This is cumtom <a/> tag component for pass <ReactMarkdown compoment={{a}} /> props
import React, { lazy } from 'react'

const a: React.FC = (props) => (
  // eslint-disable-next-line jsx-a11y/anchor-has-content
  <a {...props} target="_blank" className="text-blue-700"></a>
)
// This is cumtom <code/> tag component for pass <ReactMarkdown compoment={{code}} /> props
const code = lazy(
  // <code/> depends on heavy hintaxhilight library so we lazyload for purpose of reduce bundle chunk size
  () =>
    // @ts-ignore @TODO react-syntax-highlighter typedef issue
    import(/* webpackChunkName: "code" */ '../../elements/code')
)
// we only load <code/> if blog post containing Markdown for purpose of reduce bundle chunk size
export const getCustomComponents = (data?: { body: string | string[] }) => {
  return data?.body?.includes('```') ? { a, code } : { a }
}
