import { render } from '@testing-library/react'
import React from 'react'

import NotFound from './index'

test('show 404 page', () => {
  const { container } = render(<NotFound />)
  expect(container).toHaveTextContent('404: Page Not Found')
})
