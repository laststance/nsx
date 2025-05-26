import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

import type { RootState } from './store'

export interface DraftState {
  title: Post['title']
  body: Post['body']
}

const initialState: DraftState = {
  title: '',
  body: '',
}

export const draftSlice = createSlice({
  name: 'draft',
  initialState,
  reducers: {
    clearDraft: (state) => {
      state.title = ''
      state.body = ''
    },
    updateBody: (
      state,
      action: PayloadAction<{ body: DraftState['body'] }>,
    ) => {
      state.body = action.payload.body
    },
    updateTitle: (
      state,
      action: PayloadAction<{ title: DraftState['title'] }>,
    ) => {
      state.title = action.payload.title
    },
  },
})

// For Create/Edit pages
export interface FormInput {
  title: DraftState['title']
  body: DraftState['body']
}
export const selectTitle = (state: RootState): DraftState['title'] =>
  state.draft.title
export const selectBody = (state: RootState): DraftState['body'] =>
  state.draft.body

export const { clearDraft, updateBody, updateTitle } = draftSlice.actions

export default draftSlice.reducer
