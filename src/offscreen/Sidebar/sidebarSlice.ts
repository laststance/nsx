import { createSlice } from '@reduxjs/toolkit'

import type { RootState } from '../../redux/store'

export interface SidebarState {
  open: boolean
}

const initialState: SidebarState = {
  open: false,
}

export const sidebarSlice = createSlice({
  initialState,
  name: 'sidebar',
  reducers: {
    closeSidebar: (state) => {
      state.open = false
    },
    openSidebar: (state) => {
      state.open = true
    },
  },
})

export const selectSidebarOpen = (state: RootState): SidebarState['open'] =>
  state.sidebar.open

export const { openSidebar, closeSidebar } = sidebarSlice.actions

export default sidebarSlice.reducer
