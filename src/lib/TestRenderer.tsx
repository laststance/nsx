import type { RenderResult } from '@testing-library/react'
import { render } from '@testing-library/react'
import type { ReactElement } from 'react'
import React from 'react'
import { Provider } from 'react-redux'
import type { MemoryRouterProps } from 'react-router-dom'
import { MemoryRouter } from 'react-router-dom'

import { store } from '../redux/store'

const TestRenderer = (
  ui: ReactElement,
  memoryRouterProps?: MemoryRouterProps,
): RenderResult => {
  const renderResult = render(
    <Provider store={store}>
      <MemoryRouter {...memoryRouterProps}>{ui}</MemoryRouter>
    </Provider>,
  )
  return renderResult
}

export default TestRenderer
