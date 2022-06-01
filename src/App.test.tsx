import React from 'react'
import ReactDOM from 'react-dom/client'

import { sleep } from '../lib/sleep'

import App from './App'

test('My React App is working', async () => {
  const container = window.document.createElement('div')
  const root = ReactDOM.createRoot(container)

  root.render(<App />)

  await sleep(300)

  expect(container).toHaveTextContent('What is matter my $500 for')

  root.unmount()

  expect(container).toMatchInlineSnapshot(`<div />`)
})
