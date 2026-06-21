import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import { AuthProvider } from './context/AuthContext'
import { DataProvider } from './context/DataContext'
import { NotificationProvider } from './context/NotificationContext'
import { seedLocalStorage } from './seed/seedData'
import App from './App'

seedLocalStorage()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <DataProvider>
        <NotificationProvider>
          <App />
        </NotificationProvider>
      </DataProvider>
    </AuthProvider>
  </React.StrictMode>
)
