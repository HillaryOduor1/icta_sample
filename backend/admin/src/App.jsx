import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";
import Users from "./components/Users";
import ContentManager from "./components/ContentManager";
import ActivityLog from "./components/ActivityLog";
import Settings from "./components/Settings";
import ProtectedRoute from "./components/ProtectedRoute";
import ContactMessages from "./components/ContactMessage";
import MasterDashboard from './components/MasterDashboard';
import useAdminSettings from './hooks/useAdminSettings';
import { AuthProvider } from './context/AuthContext';

export default function App() {
  const { loading } = useAdminSettings();

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>;

  return (
    <AuthProvider>
      <Router basename="/">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/master/tenants" element={
            <ProtectedRoute roles={['superadmin']}>
              <MasterDashboard />
            </ProtectedRoute>
          } />
          <Route path="/dashboard" element={
            <ProtectedRoute roles={['admin', 'editor', 'viewer']}>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/contact-messages" element={
            <ProtectedRoute roles={['admin', 'editor', 'viewer']}>
              <ContactMessages />
            </ProtectedRoute>
          } />
          <Route path="/users" element={
            <ProtectedRoute roles={['admin']}>
              <Users />
            </ProtectedRoute>
          } />
          <Route path="/analytics" element={
            <ProtectedRoute roles={['admin', 'editor', 'viewer']}>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/content" element={
            <ProtectedRoute roles={['admin', 'editor']}>
              <ContentManager />
            </ProtectedRoute>
          } />
          <Route path="/activity" element={
            <ProtectedRoute roles={['admin']}>
              <ActivityLog />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute roles={['admin', 'editor']}>
              <Settings />
            </ProtectedRoute>
          } />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

