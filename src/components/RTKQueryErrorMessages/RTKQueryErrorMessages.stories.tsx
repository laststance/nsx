import type { ComponentStory } from '@storybook/react'
import React from 'react'

import RTKQueryErrorMessages from './RTKQueryErrorMessages'

export default {
  title: 'Components/RTKQueryErrorMessages',
  component: RTKQueryErrorMessages,
}

const Template: ComponentStory<typeof RTKQueryErrorMessages> = (props) => (
  <RTKQueryErrorMessages {...props} />
)

export const Default = Template.bind({})

Default.args = {
  error: {
    //@ts-ignore
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
  },
}
