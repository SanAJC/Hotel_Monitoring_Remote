import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css'
import App from './App.tsx'
import AuthProvider from './context/AuthContext.tsx'
import { WebSocketProvider } from './context/RealTimeContex.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <WebSocketProvider>
        <Router>
          <App />
        </Router>
      </WebSocketProvider>
    </AuthProvider>
  </StrictMode>,
)
