import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './main.css'
import AdminPage from './AdminPage'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AdminPage />
  </StrictMode>,
)
