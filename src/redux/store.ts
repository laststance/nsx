import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import adminReducer from './adminSlice'
import snackbarReducer from './snackbarSlice'
import { RestApi } from './restApi'

export const store = configureStore({
  reducer: {
    admin: adminReducer,
    snackbar: snackbarReducer,
    [RestApi.reducerPath]: RestApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(RestApi.middleware),
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
