import type { ComponentStory } from '@storybook/react'
import React from 'react'

import RTKQueryErrorMessages from './RTKQueryErrorMessages'

export default {
  component: RTKQueryErrorMessages,
  title: 'Components/RTKQueryErrorMessages',
}

const Template: ComponentStory<typeof RTKQueryErrorMessages> = (props) => (
  <RTKQueryErrorMessages {...props} />
)

export const Default = Template.bind({})

Default.args = {
  error: {
    endpointName: 'getMissingFirebaseUser',

    // @ts-ignore
    error: {
      message: 'Missing user',
      name: 'Error',
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
  },
}
