import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

import { API } from './API'
import type { RootState } from './store'

export interface PageState {
  page: number
  perPage: number
  totalPage: number
}

const initialState: PageState = {
  page: 1,
  perPage: 15,
  totalPage: 0,
}

export const pageSlice = createSlice({
  name: 'page',
  initialState,
  reducers: {
    updatePage: (state, action: PayloadAction<{ page: PageState['page'] }>) => {
      state.page = action.payload.page
    },
  },
  extraReducers: (builder) => {
    builder.addMatcher(
      API.endpoints.fetchPostList.matchFulfilled,
      (state, { payload }) => {
        state.totalPage = Math.ceil(payload.total / state.perPage)
      }
    )
  },
})

export const selectPage = (state: RootState): PageState => state.page

export const { updatePage } = pageSlice.actions

export default pageSlice.reducer
