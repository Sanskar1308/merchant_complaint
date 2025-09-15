import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ConfigProvider } from 'antd';
import { useAuth } from './hooks/useAuth';
import AppLayout from './components/layout/AppLayout';
import LoginForm from './components/auth/LoginForm';
import ProtectedRoute from './components/common/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Tickets from './pages/Tickets';
import Reports from './pages/Reports';
import Configuration from './pages/Configuration';
import './App.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const AppContent: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Routes>
        <Route 
          path="/login" 
          element={
            isAuthenticated ? <Navigate to="/dashboard" replace /> : <LoginForm />
          } 
        />
        
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <AppLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="tickets" element={<Tickets />} />
          <Route path="reports" element={<Reports />} />
          <Route 
            path="config" 
            element={
              <ProtectedRoute requiredRole="ADMIN">
                <Configuration />
              </ProtectedRoute>
            } 
          />
        </Route>
        
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#1890ff',
            borderRadius: 6,
          },
        }}
      >
        <AppContent />
      </ConfigProvider>
    </QueryClientProvider>
  );
}

export default App;