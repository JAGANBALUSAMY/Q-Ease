import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { SocketProvider } from './contexts/SocketContext';

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

// Components
import PrivateRoute from './components/PrivateRoute';
import Navbar from './components/Navbar';

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <Router>
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/landing" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/search" element={<OrganizationSearchPage />} />
            <Route path="/queue/:queueId" element={<CustomerQueuePage />} />

            {/* Protected User Routes */}
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <OrganizationSearchPage />
                </PrivateRoute>
              }
            />
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

            {/* Staff Routes */}
            <Route
              path="/staff"
              element={
                <PrivateRoute roles={['STAFF', 'ORGANISATION_ADMIN', 'SUPER_ADMIN']}>
                  <StaffDashboardPage />
                </PrivateRoute>
              }
            />

            {/* Admin Routes */}
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

            {/* Common Authenticated Routes */}
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

            {/* Catch all - redirect to home */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;
// Rebuild trigger