import type { PayloadAction } from '@reduxjs/toolkit'
import { createSlice } from '@reduxjs/toolkit'

import type { RootState } from './store'

export interface DraftState {
  title: Post['title']
  body: Post['body']
}

const initialState: DraftState = {
  body: '',
  title: '',
}

export const draftSlice = createSlice({
  initialState,
  name: 'draft',
  reducers: {
    clearDraft: (state) => {
      state.title = ''
      state.body = ''
    },
    updateBody: (
      state,
      action: PayloadAction<{ body: DraftState['body'] }>
    ) => {
      state.body = action.payload.body
    },
    updateTitle: (
      state,
      action: PayloadAction<{ title: DraftState['title'] }>
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

export const selectDraftState = (state: RootState): DraftState => state.draft
export const selectTitle = (state: RootState): DraftState['title'] => state.draft.title /* eslint-disable-line prettier/prettier */
export const selectBody = (state: RootState): DraftState['body'] => state.draft.body /* eslint-disable-line prettier/prettier */

export const { updateTitle, updateBody, clearDraft } = draftSlice.actions

export default draftSlice.reducer
