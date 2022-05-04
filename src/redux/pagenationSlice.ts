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
  initialState,
  reducers: {
    updatePage: (
      state,
      action: PayloadAction<{ page: PagenationState['page'] }>
    ) => {
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

export const selectPagenation = (state: RootState): PagenationState =>
  state.pagenation

export const { updatePage } = pagenationSlice.actions

export default pagenationSlice.reducer
