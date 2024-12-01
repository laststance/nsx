import React, { Suspense, memo } from 'react'
import { Provider as ReduxStoreProvider } from 'react-redux'
import { BrowserRouter } from 'react-router'
import { persistStore } from 'redux-persist'
import { PersistGate as ReduxPersistGate } from 'redux-persist/integration/react'

import './global.css'

import ErrorBoundary from './components/ErrorBoundary'
import Loading from './components/Loading'
import Sidebar from './components/Sidebar'
import HookLoaderComponent from './headlessComponents/GrobalHooks'
import SnackBarRenderer from './headlessComponents/SnackBarRenderer'
import { store } from './redux/store'
import Routes from './Routes'

const persistorStore = persistStore(store)

// @ts-expect-error
ReduxStoreProvider.displayName = 'ReduxStoreProvider'

const App = memo(
  () => {
    return (
      <ErrorBoundary>
        <Suspense fallback={<Loading />}>
          <ReduxStoreProvider store={store} identityFunctionCheck="always">
            <BrowserRouter>
              <ReduxPersistGate persistor={persistorStore}>
                <HookLoaderComponent />
                <Sidebar />
                <SnackBarRenderer />
                <Routes />
              </ReduxPersistGate>
            </BrowserRouter>
          </ReduxStoreProvider>
        </Suspense>
      </ErrorBoundary>
    )
  },
  () => true,
)
App.displayName = 'App'

export default App
