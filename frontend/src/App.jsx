import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { TooltipProvider } from '@/components/ui/tooltip';

// Layout Components
import Layout from './components/Layout';
import AdminLayout from './components/AdminLayout';

// Pages
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OrganizationSearchPage from './pages/OrganizationSearchPage';
import CustomerQueuePage from './pages/CustomerQueuePage';
import OrganizationDetailPage from './pages/OrganizationDetailPage';
import MyTokensPage from './pages/MyTokensPage';
import QRScanPage from './pages/QRScanPage';
import StaffDashboardPage from './pages/StaffDashboardPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import SuperAdminManageAdminsPage from './pages/SuperAdminManageAdminsPage';
import AdminUserManagementPage from './pages/AdminUserManagementPage';
import AdminAnalyticsPage from './pages/AdminAnalyticsPage';
import AdminQueueManagementPage from './pages/AdminQueueManagementPage';
import AdminSettingsPage from './pages/AdminSettingsPage';
import ProfilePage from './pages/ProfilePage';
import NotificationsPage from './pages/NotificationsPage';
import PublicQueueDisplayPage from './pages/PublicQueueDisplayPage';

// Components
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="q-ease-theme">
      <AuthProvider>
        <SocketProvider>
          <TooltipProvider>
            <Router>
              <Routes>
                {/* Public Routes without Layout */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/display/:queueId" element={<PublicQueueDisplayPage />} />

                {/* Routes with Main Layout */}
                <Route element={<Layout />}>
                  {/* Public Routes */}
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/search" element={<OrganizationSearchPage />} />
                  <Route path="/queue/:queueId" element={<CustomerQueuePage />} />
                  <Route
                    path="/org/:orgCode"
                    element={
                      <PrivateRoute>
                        <OrganizationDetailPage />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/my-tokens"
                    element={
                      <PrivateRoute>
                        <MyTokensPage />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/scan"
                    element={
                      <PrivateRoute>
                        <QRScanPage />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <PrivateRoute>
                        <ProfilePage />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/notifications"
                    element={
                      <PrivateRoute>
                        <NotificationsPage />
                      </PrivateRoute>
                    }
                  />

                  {/* Staff Routes */}
                  <Route
                    path="/staff"
                    element={
                      <PrivateRoute roles={['STAFF', 'ORGANISATION_ADMIN', 'SUPER_ADMIN']}>
                        <StaffDashboardPage />
                      </PrivateRoute>
                    }
                  />
                </Route>

                {/* Admin Routes with Admin Layout */}
                <Route element={<AdminLayout />}>
                  <Route
                    path="/admin"
                    element={
                      <PrivateRoute roles={['ORGANISATION_ADMIN', 'SUPER_ADMIN']}>
                        <AdminDashboardPage />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/admin/admins"
                    element={
                      <PrivateRoute roles={['SUPER_ADMIN']}>
                        <SuperAdminManageAdminsPage />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/admin/users"
                    element={
                      <PrivateRoute roles={['ORGANISATION_ADMIN', 'SUPER_ADMIN']}>
                        <AdminUserManagementPage />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/admin/analytics"
                    element={
                      <PrivateRoute roles={['ORGANISATION_ADMIN', 'SUPER_ADMIN']}>
                        <AdminAnalyticsPage />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/admin/queues"
                    element={
                      <PrivateRoute roles={['ORGANISATION_ADMIN', 'SUPER_ADMIN']}>
                        <AdminQueueManagementPage />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/admin/queues/:queueId"
                    element={
                      <PrivateRoute roles={['ORGANISATION_ADMIN', 'SUPER_ADMIN']}>
                        <AdminQueueManagementPage />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/admin/settings"
                    element={
                      <PrivateRoute roles={['ORGANISATION_ADMIN', 'SUPER_ADMIN']}>
                        <AdminSettingsPage />
                      </PrivateRoute>
                    }
                  />
                </Route>

                {/* Catch all - redirect to home */}
                <Route path="*" element={<Navigate to="/" replace />} />
              </Routes>
            </Router>
          </TooltipProvider>
        </SocketProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
