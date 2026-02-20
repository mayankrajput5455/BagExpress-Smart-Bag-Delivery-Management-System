import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import MyComponent from './Comp.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MyComponent />
  </StrictMode>,
)
