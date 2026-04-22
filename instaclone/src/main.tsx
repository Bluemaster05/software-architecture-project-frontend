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
import { ThemeProvider } from '@emotion/react'
import { CssBaseline } from '@mui/material'
import theme from './Common/Theme'
import { AppContextProvider } from './Common/providors/AppContext'
import AuthListener from './Common/components/AuthListener'
import Settings from './Common/pages/Settings'


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <AppContextProvider>
        <CssBaseline />

        <BrowserRouter>
          <AuthListener />
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
                <Route path="/settings" element={<Settings />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>

      </AppContextProvider>
    </ThemeProvider>
  </StrictMode>,
)
