import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from './store'

export interface PerfState {
  PreRender: boolean
}

const initialState: PerfState = {
  PreRender: false,
}

export const perfSlice = createSlice({
  name: 'perf',
  initialState,
  reducers: {
    detectPreRender: (state: PerfState) => {
      state.PreRender = true
    },
  },
})

export const selectIsPreRender = (state: RootState): boolean =>
  state.perf.PreRender

export const { detectPreRender } = perfSlice.actions

export default perfSlice.reducer
