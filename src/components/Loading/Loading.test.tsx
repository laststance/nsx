import React from 'react'

import TestRenderer from '../../lib/TestRenderer'

import Loading from './Loading'

test('should render Loading', () => {
  const { container } = TestRenderer(<Loading />)
  expect(container).toBeInTheDocument()
})

test('working spinner effect', () => {
  const { container } = TestRenderer(<Loading />)
  expect(container).toBeInTheDocument()
  expect(window.getComputedStyle(container.querySelector('.css-1wbsthe')!))
    .toMatchInlineSnapshot(`
CSSStyleDeclaration {
  "0": "position",
  "1": "width",
  "2": "height",
  "3": "visibility",
  "_importants": Object {
    "height": "",
    "position": "",
    "visibility": undefined,
    "width": "",
  },
  "_length": 4,
  "_onChange": [Function],
  "_values": Object {
    "height": "250px",
    "position": "relative",
    "visibility": "visible",
    "width": "250px",
  },
}
`)
})
