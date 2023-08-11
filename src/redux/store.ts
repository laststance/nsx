import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit'
import { setupListeners } from '@reduxjs/toolkit/query'
import { createBrowserHistory } from 'history'
import { combineReducers } from 'redux'
import { createReduxHistoryContext } from 'redux-first-history'
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage'

import adminReducer from './adminSlice'
import { API } from './API'
import draftReducer from './draftSlice'
import { SwitchTailwindCSSTheme } from './listener'
import pagenationReducer from './pagenationSlice'
import sidebarReducer from './sidebarSlice'
import snackbarReducer from './snackbarSlice'
import themeReducer, { updateTheme } from './themeSlice'

// Setup redux-first-history
const { createReduxHistory, routerMiddleware, routerReducer } =
  createReduxHistoryContext({ history: createBrowserHistory() })

const reducers = combineReducers({
  admin: adminReducer,
  draft: draftReducer,
  pagenation: pagenationReducer,
  router: routerReducer,
  sidebar: sidebarReducer,
  snackbar: snackbarReducer,
  theme: themeReducer,
  [API.reducerPath]: API.reducer,
})

// Setup Redux Persist
const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['admin', 'draft', 'theme'],
}
const persistedReducer = persistReducer(persistConfig, reducers)

// Setup Listener Mddleware
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
      .concat([API.middleware, routerMiddleware]),
  reducer: persistedReducer,
})

setupListeners(store.dispatch)

export const dispatch = store.dispatch
export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type RTK_QueryState = RootState['RTK_Query']

export type DispatchFunction = (dispatch: AppDispatch) => void
export const getRootState = (): RootState => store.getState()

export const history = createReduxHistory(store)
