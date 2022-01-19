import type { RenderResult } from '@testing-library/react'
import { render } from '@testing-library/react'
import type { ReactElement } from 'react'
import React from 'react'
import { BrowserRouter } from 'react-router-dom'

const TestRenderer = (ui: ReactElement): RenderResult => {
  const renderResult = render(<BrowserRouter>{ui}</BrowserRouter>)
  return renderResult
}

export default TestRenderer
