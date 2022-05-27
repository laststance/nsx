import React, { Suspense } from 'react'
import { Provider as ReduxStoreProvider } from 'react-redux'
import { persistStore } from 'redux-persist'
import { PersistGate as ReduxPersistGate } from 'redux-persist/integration/react'

import './index.css'

import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary'
import Loading from './components/Loading/Loading'
import OffScreen from './offscreen/index'
import { store } from './redux/store'
import Router from './Router'

const persistor = persistStore(store)

// @TODO fix Provider typing
// @ts-expect-error
ReduxStoreProvider.displayName = 'ReduxStoreProvider'

const App = () => (
  <ErrorBoundary>
    <Suspense fallback={<Loading />}>
      <ReduxStoreProvider store={store}>
        <ReduxPersistGate persistor={persistor}>
          <OffScreen.Sidebar />
          <OffScreen.SnackBarDispatcher />
          <Router />
        </ReduxPersistGate>
      </ReduxStoreProvider>
    </Suspense>
  </ErrorBoundary>
)

export default App
