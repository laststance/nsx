import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './style.css';

const root = createRoot(document.getElementById('popup')!);
root.render(<App />);
