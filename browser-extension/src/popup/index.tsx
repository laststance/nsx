import React from 'react'
import { createRoot } from 'react-dom/client'

import App from './components/app'

const popupElement = document.querySelector('div#popup')
if (!popupElement) throw new Error('Popup element not found')
const root = createRoot(popupElement)
root.render(<App />)
