import { createSlice } from '@reduxjs/toolkit'

import type { RootState } from './store'

export interface ApplicationState {
  loading: boolean
}

const initialState: ApplicationState = {
  loading: false,
}

export const applicationSlice = createSlice({
  name: 'application',
  initialState,
  reducers: {
    loading: (state) => {
      state.loading = true
    },
    loaded: (state) => {
      state.loading = false
    },
  },
})

export const selectLoading = (state: RootState): ApplicationState['loading'] =>
  state.application.loading

export const { loading, loaded } = applicationSlice.actions

export default applicationSlice.reducer
