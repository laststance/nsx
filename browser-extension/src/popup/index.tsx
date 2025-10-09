import React from 'react'
import { createRoot } from 'react-dom/client'

import App from './components/app'

const root = createRoot(document.querySelector('div#popup'))
root.render(<App />)
