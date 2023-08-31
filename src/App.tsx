import React, { Suspense, memo } from 'react'
import { Provider as ReduxStoreProvider } from 'react-redux'
import { HistoryRouter } from 'redux-first-history/rr6'
import { persistStore } from 'redux-persist'
import { PersistGate as ReduxPersistGate } from 'redux-persist/integration/react'

import './index.css'

import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary'
import Loading from './components/Loading/Loading'
import HookLoaderComponent from './headlessEffectComponents/GrobalHooks'
import Sidebar from './headlessEffectComponents/Sidebar'
import SnackBarRenderer from './headlessEffectComponents/SnackBarRenderer'
import { store, history } from './redux/store'
import Router from './router/Router'

const persistor = persistStore(store)

// @ts-expect-error
ReduxStoreProvider.displayName = 'ReduxStoreProvider'

const App = memo(
  () => {
    return (
      <ErrorBoundary>
        <Suspense fallback={<Loading />}>
          <ReduxStoreProvider store={store} noopCheck="always">
            <HistoryRouter history={history}>
              <ReduxPersistGate persistor={persistor}>
                <HookLoaderComponent />
                <Sidebar />
                <SnackBarRenderer />
                <Router />
              </ReduxPersistGate>
            </HistoryRouter>
          </ReduxStoreProvider>
        </Suspense>
      </ErrorBoundary>
    )
  },
  () => true,
)
App.displayName = 'App'

export default App
