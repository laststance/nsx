import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { combineReducers } from 'redux'
import { persistReducer } from 'redux-persist'
import type { PersistConfig } from 'redux-persist/es/types'
import storage from 'redux-persist/lib/storage'

import adminReducer from './adminSlice'
import { API } from './API'
import draftReducer from './draftSlice'
import { SwitchTailwindCSSTheme } from './listener'
import pagenationReducer from './pagenationSlice'
import sidebarReducer from './sidebarSlice'
import snackbarReducer from './snackbarSlice'
import themeReducer, { updateTheme } from './themeSlice'

const reducers = combineReducers({
  admin: adminReducer,
  draft: draftReducer,
  pagenation: pagenationReducer,
  sidebar: sidebarReducer,
  snackbar: snackbarReducer,
  theme: themeReducer,
  [API.reducerPath]: API.reducer,
})

const persistConfig: PersistConfig<_> = {
  key: 'root',
  storage,
  whitelist: ['admin', 'draft', 'theme'],
}

const persistedReducer = persistReducer(persistConfig, reducers)

const listenerMiddleware = createListenerMiddleware()
listenerMiddleware.startListening({
  actionCreator: updateTheme,
  effect: (action) => {
    SwitchTailwindCSSTheme(action.payload)
  },
})

export const store = configureStore({
  devTools: process.env.NODE_ENV === 'development' ? true : false,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false })
      .prepend(listenerMiddleware.middleware)
      .concat(API.middleware),
  reducer: persistedReducer,
})

setupListeners(store.dispatch)

export const dispatch = store.dispatch
export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type RTK_QueryState = RootState['RTK_Query']

export type DispatchFunction = (dispatch: AppDispatch) => void
export const getRootState = (): RootState => store.getState()
