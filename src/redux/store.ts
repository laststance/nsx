import type { Action, ThunkAction } from '@reduxjs/toolkit'
import { configureStore } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import type { PersistConfig } from 'redux-persist/es/types'
import storage from 'redux-persist/lib/storage'

import adminReducer from './adminSlice'
import { API } from './API'
import draftReducer from './draftSlice'
import pageReducer from './pageSlice'
import snackbarReducer from './snackbarSlice'

const reducers = combineReducers({
  admin: adminReducer,
  page: pageReducer,
  snackbar: snackbarReducer,
  draft: draftReducer,
  [API.reducerPath]: API.reducer,
})

const persistConfig: PersistConfig<any> = {
  key: 'root',
  storage,
  whitelist: ['admin', 'draft'],
}

const persistedReducer = persistReducer(persistConfig, reducers)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }).concat(API.middleware),
})

setupListeners(store.dispatch)

export const dispatch = store.dispatch
export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type RTK_QueryState = RootState['RTK_Query']
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
export type DispatchFunction = (dispatch: AppDispatch) => void
