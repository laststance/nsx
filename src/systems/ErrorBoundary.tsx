import React, { Component, ErrorInfo, ReactNode } from 'react'

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
      return <ErrorBoundaryFallbackComponent />
    }
    return this.props.children
  }
}

export default ErrorBoundary

const LayoutStyle: React.CSSProperties = {
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
}

const MessageStyle: React.CSSProperties = {
  padding: '40px',
  border: '2px #78909c solid',
  borderRadius: '5px',
  fontSize: '24px',
  color: '#78909c',
}

const ErrorBoundaryFallbackComponent = () => (
  <div style={LayoutStyle}>
    <div style={MessageStyle}>
      Something Error Ooccurring
      <span role="img" aria-label="face-emoji">
        😞
      </span>
    </div>
  </div>
)
