import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'
import React from 'react'

import TestRenderer from '../../lib/TestRenderer'

import RTKQueryErrorMessages from './RTKQueryErrorMessages'

const fetchBaseQueryError: FetchBaseQueryError = {
  endpointName: 'getMissingFirebaseUser',

  // @ts-ignore
  error: {
    name: 'Error',
    message: 'Missing user',
    stack:
      'Error: Missing user\n    at Object.queryFn (/Users/ryota.murakami/fork/redux-toolkit/packages/toolkit/src/query/tests/queryFn.test.tsx:342:19)\n    at executeEndpoint (/Users/ryota.murakami/fork/redux-toolkit/packages/toolkit/src/query/core/buildThunks.ts:297:18)\n    at /Users/ryota.murakami/fork/redux-toolkit/packages/toolkit/src/createAsyncThunk.ts:602:25\n    at async Promise.all (index 1)',
  },

  isError: true,

  isLoading: false,

  isSuccess: false,

  isUninitialized: false,

  originalArgs: 1,

  requestId: '3qpFJoEaMHKmvAhbd19T9',

  startedTimeStamp: 1642632631557,
  // @ts-ignore
  status: 'rejected',
}

test('should render JSON.stringify() messages', () => {
  const { container } = TestRenderer(
    <RTKQueryErrorMessages error={fetchBaseQueryError} />,
  )
  expect(container).toHaveTextContent(
    '{"endpointName":"getMissingFirebaseUser","error":{"message":"Missing user","name":"Error","stack":"Error: Missing user\\n at Object.queryFn (/Users/ryota.murakami/fork/redux-toolkit/packages/toolkit/src/query/tests/queryFn.test.tsx:342:19)\\n at executeEndpoint (/Users/ryota.murakami/fork/redux-toolkit/packages/toolkit/src/query/core/buildThunks.ts:297:18)\\n at /Users/ryota.murakami/fork/redux-toolkit/packages/toolkit/src/createAsyncThunk.ts:602:25\\n at async Promise.all (index 1)"},"isError":true,"isLoading":false,"isSuccess":false,"isUninitialized":false,"originalArgs":1,"requestId":"3qpFJoEaMHKmvAhbd19T9","startedTimeStamp":1642632631557,"status":"rejected"}',
  )
})
