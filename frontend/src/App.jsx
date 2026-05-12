import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './context/AuthContext';

// Layouts
import DashboardLayout from './layouts/DashboardLayout';
import AuthLayout from './layouts/AuthLayout';
import PublicLayout from './layouts/PublicLayout';

// Components
import ProtectedRoute from './components/ProtectedRoute';

// Pages - Public
import LandingPage from './pages/LandingPage';
import PricingPage from './pages/PricingPage';
import ComparePage from './pages/ComparePage';

// Pages - Auth
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';

// Pages - Dashboard
import Dashboard from './pages/Dashboard';
import Automations from './pages/Automations';
import AutomationEditor from './pages/AutomationEditor';
import Campaigns from './pages/Campaigns';
import CampaignEditor from './pages/CampaignEditor';
import Leads from './pages/Leads';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Guide from './pages/Guide';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Pages */}
            <Route element={<PublicLayout />}>
              <Route path="/" element={<LandingPage />} />
              <Route path="/pricing" element={<PricingPage />} />
              <Route path="/compare" element={<ComparePage />} />
            </Route>

            {/* Public Auth Routes */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
            </Route>

            {/* Protected Dashboard Routes */}
            <Route element={<ProtectedRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/automations" element={<Automations />} />
                <Route path="/automations/new" element={<AutomationEditor />} />
                <Route path="/automations/:id" element={<AutomationEditor />} />
                <Route path="/campaigns" element={<Campaigns />} />
                <Route path="/campaigns/new" element={<CampaignEditor />} />
                <Route path="/campaigns/:id" element={<CampaignEditor />} />
                <Route path="/leads" element={<Leads />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/guide" element={<Guide />} />
              </Route>
            </Route>

            {/* Default Route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
