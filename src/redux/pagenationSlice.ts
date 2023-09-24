import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

import { API } from './API'
import type { RootState } from './store'

export interface PagenationState {
  page: number
  perPage: number
  totalPage: number
}

const initialState: PagenationState = {
  page: 1,
  perPage: 15,
  totalPage: 0,
}

export const pagenationSlice = createSlice({
  name: 'pagenation',
  extraReducers: (builder) => {
    builder.addMatcher(
      API.endpoints.fetchPostList.matchFulfilled,
      (state, { payload }) => {
        state.totalPage = Math.ceil(payload.total / state.perPage)
      },
    )
  },
  initialState,
  reducers: {
    updatePage: (
      state,
      action: PayloadAction<{ page: PagenationState['page'] }>,
    ) => {
      state.page = action.payload.page
    },
    updatePerPage: (
      state,
      action: PayloadAction<{ perPage: PagenationState['perPage'] }>,
    ) => {
      state.perPage = action.payload.perPage
    },
  },
})

export const selectPagenationParams = (state: RootState): PagenationState =>
  state.pagenation

export const { updatePage, updatePerPage } = pagenationSlice.actions

export default pagenationSlice.reducer
