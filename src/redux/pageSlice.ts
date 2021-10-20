import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

import type { RootState } from './store'

export interface PageState {
  page: number
  per_page: number
}

const initialState: PageState = {
  page: 1,
  per_page: 15,
}

export const pageSlice = createSlice({
  name: 'page',
  initialState,
  reducers: {
    updatePage: (state, action: PayloadAction<{ page: number }>) => {
      state.page = action.payload.page
    },
  },
})

export const selectPage = (state: RootState): PageState => state.page

export const { updatePage } = pageSlice.actions

export default pageSlice.reducer
