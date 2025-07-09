import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './styles/main.css';

// Import pages
import Home from './home.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Home />
  </StrictMode>,
)
