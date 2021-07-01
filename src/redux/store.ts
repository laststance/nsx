import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import adminReducer from './adminSlice'
import snackbarReducer from './snackbarSlice'

export const store = configureStore({
  reducer: { admin: adminReducer, snackbar: snackbarReducer },
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
