import { Navigate, Route, Routes } from 'react-router-dom'
import { useSelector } from 'react-redux'
import LoginPage from './features/auth/LoginPage.jsx'
import DashboardPage from './pages/DashboardPage.jsx'
import { selectAuthUser } from './features/auth/authSlice.js'
import { hasPermission } from './config/roles.js'

const RoleRoute = ({ permission, children }) => {
  const user = useSelector(selectAuthUser)

  if (!user) {
    return <Navigate to="/login" replace />
  }

  if (!hasPermission(user.role, permission)) {
    return <Navigate to="/" replace />
  }

  return children
}

const ProtectedRoute = ({ children }) => {
  const user = useSelector(selectAuthUser)

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/vendors/new"
        element={
          <RoleRoute permission="vendors:create">
            <DashboardPage />
          </RoleRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}