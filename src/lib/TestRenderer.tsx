import type { RenderResult } from '@testing-library/react'
import { render } from '@testing-library/react'
import type { ReactElement } from 'react'
import React from 'react'
import { Provider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'

import { store } from './../redux/store'

const TestRenderer = (ui: ReactElement): RenderResult => {
  const renderResult = render(
    <Provider store={store}>
      <BrowserRouter>{ui}</BrowserRouter>
    </Provider>
  )
  return renderResult
}

export default TestRenderer
