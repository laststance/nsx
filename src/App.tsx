import React, { Suspense, memo } from 'react'
import { Provider as ReduxStoreProvider } from 'react-redux'
import { HistoryRouter } from 'redux-first-history/rr6'
import { persistStore } from 'redux-persist'
import { PersistGate as ReduxPersistGate } from 'redux-persist/integration/react'

import './global.css'

import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary'
import Loading from './components/Loading/Loading'
import Sidebar from './components/Sidebar'
import HookLoaderComponent from './headlessComponents/GrobalHooks'
import SnackBarRenderer from './headlessComponents/SnackBarRenderer'
import { store, history } from './redux/store'
import Routes from './Routes'

const persistor = persistStore(store)

// @ts-expect-error
ReduxStoreProvider.displayName = 'ReduxStoreProvider'

const App = memo(
  () => {
    return (
      <ErrorBoundary>
        <Suspense fallback={<Loading />}>
          <ReduxStoreProvider store={store} identityFunctionCheck="always">
            <HistoryRouter history={history}>
              <ReduxPersistGate persistor={persistor}>
                <HookLoaderComponent />
                <Sidebar />
                <SnackBarRenderer />
                <Routes />
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
