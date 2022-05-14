import * as Sentry from '@sentry/react'
import type { ErrorInfo, ReactNode } from 'react'
import React, { Component } from 'react'

interface Props {
  children?: ReactNode
}

interface State {
  error: Error | null
  info: ErrorInfo | null
}
class ErrorBoundary extends Component<Props, State> {
  state = {
    error: null,
    info: null,
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    this.setState({ error, info })
  }

  render(): ReactNode {
    const { error } = this.state
    if (error) {
      Sentry.captureException(error)
      return <ErrorBoundaryFallbackComponent />
    }
    return this.props.children
  }
}

export default ErrorBoundary

const LayoutStyle: React.CSSProperties = {
  alignItems: 'center',
  display: 'flex',
  justifyContent: 'center',
}

const MessageStyle: React.CSSProperties = {
  border: '2px #78909c solid',
  borderRadius: '5px',
  color: '#78909c',
  fontSize: '24px',
  padding: '40px',
}

export const ErrorBoundaryFallbackComponent: React.FC<
  React.PropsWithChildren<unknown>
> = () => (
  <div style={LayoutStyle} className="h-full w-full">
    <div style={MessageStyle}>
      Something Error Ooccurring
      <span style={{ paddingLeft: 3 }} role="img" aria-label="face-emoji">
        😞
      </span>
    </div>
  </div>
)
