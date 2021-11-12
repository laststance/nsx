import type { Action, ThunkAction } from '@reduxjs/toolkit'
import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'

import adminReducer from './adminSlice'
import { API } from './API'
import pageReducer from './pageSlice'
import { SerializedErrorHandlingMiddleware } from './SerializedErrorHandlingMiddleware'
import snackbarReducer from './snackbarSlice'

export const store = configureStore({
  reducer: {
    admin: adminReducer,
    page: pageReducer,
    snackbar: snackbarReducer,
    [API.reducerPath]: API.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      API.middleware,
      SerializedErrorHandlingMiddleware
    ),
})

setupListeners(store.dispatch)

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
export type DispatchFunction = (dispatch: AppDispatch) => void
