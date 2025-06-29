import { getByRole } from '@testing-library/dom'
import ReactDOM from 'react-dom/client'

import { sleep } from '../lib/sleep'

import App from './App'

test('My React App is working', async () => {
  const container = window.document.createElement('div')
  const root = ReactDOM.createRoot(container)

  root.render(<App />)

  // Loading post list
  await sleep(1000)

  const header = container.querySelector('header')!
  expect(getByRole(header, 'heading')).toHaveTextContent('Reading List')
  const main = container.querySelector('main')!

  expect(main).toHaveTextContent('01/14/22')
  expect(main).toHaveTextContent('What is matter my $500 for')
  expect(main).toHaveTextContent('12/29/21')
  expect(main).toHaveTextContent(
    'Please MUI Components all argTypes Json generator',
  )

  root.unmount()

  expect(container).toMatchInlineSnapshot(`<div />`)
})
