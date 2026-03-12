import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import AuthLayout from './Common/layouts/AuthLayout'
import AppLayout from './Common/layouts/AppLayout'
import ProtectedRoute from './Common/components/ProtectedRoute'
import Login from './Common/pages/Login'
import Register from './Common/pages/Register'
import Feed from './Posts/pages/Feed'
import Messages from './Messages/pages/Messages'
import Profile from './Profile/pages/Profile'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        {/* root redirect */}
        <Route path="/" element={<Navigate to="/feed" />} />

        {/* auth pages */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* authenticated app */}
        <Route element={<ProtectedRoute ignoreAuth />}>
          <Route element={<AppLayout />}>
            <Route path="/feed" element={<Feed />} />
            <Route path="/messages" element={<Messages />} />
            <Route path="/profile" element={<Profile />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </StrictMode>,
)
