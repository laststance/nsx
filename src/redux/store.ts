import type { Action, ThunkAction } from '@reduxjs/toolkit'
import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import adminReducer from './adminSlice'
import { API } from './API'
import pageReducer from './pageSlice'
import { SerializedErrorHandlingMiddleware } from './SerializedErrorHandlingMiddleware'
import snackbarReducer from './snackbarSlice'

const reducers = combineReducers({
  admin: adminReducer,
  page: pageReducer,
  snackbar: snackbarReducer,
  [API.reducerPath]: API.reducer,
})

const persistConfig = {
  key: 'root',
  storage,
}

const persistedReducer = persistReducer(persistConfig, reducers)

export const store = configureStore({
  reducer: persistedReducer,
  devTools: process.env.NODE_ENV !== 'production',
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
