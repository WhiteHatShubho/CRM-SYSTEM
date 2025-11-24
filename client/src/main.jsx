import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import CustomersPage from './pages/CustomersPage'
import AMCPage from './pages/AMCPage'
import ServicesPage from './pages/ServicesPage'
import EmployeesPage from './pages/EmployeesPage'
import ReportsPage from './pages/ReportsPage'
import SettingsPage from './pages/SettingsPage'
import WhatsAppPage from './pages/WhatsAppPage'
import './styles/global.css'

function PrivateRoute({ children }) {
  const token = localStorage.getItem('token')
  return token ? children : <Navigate to="/login" />
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <DashboardPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/customers"
          element={
            <PrivateRoute>
              <CustomersPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/amcs"
          element={
            <PrivateRoute>
              <AMCPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/services"
          element={
            <PrivateRoute>
              <ServicesPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/employees"
          element={
            <PrivateRoute>
              <EmployeesPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/reports"
          element={
            <PrivateRoute>
              <ReportsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/settings"
          element={
            <PrivateRoute>
              <SettingsPage />
            </PrivateRoute>
          }
        />
        <Route
          path="/whatsapp"
          element={
            <PrivateRoute>
              <WhatsAppPage />
            </PrivateRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </Router>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
