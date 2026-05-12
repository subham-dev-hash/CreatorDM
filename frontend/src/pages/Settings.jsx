import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Instagram, CreditCard, ExternalLink, Loader2, CheckCircle2 } from 'lucide-react';
import api from '../api/client';

const Settings = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleConnectInstagram = () => {
    window.location.href = '/api/auth/instagram';
  };

  const handleDisconnectInstagram = async () => {
    // In a real app, you'd call an endpoint to remove the token
    alert('Disconnect functionality not yet implemented in backend.');
  };

  const handleSubscribe = async (planKey) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/subscriptions/create', { planKey });
      // Redirect to Cashfree checkout URL
      if (res.data.paymentLink) {
        window.location.href = res.data.paymentLink;
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to initiate checkout.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Settings</h1>
        <p className="text-slate-600">Manage your integrations and billing.</p>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="space-y-8">
        {/* Instagram Integration */}
        <div className="glass-panel p-6 md:p-8 rounded-2xl">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-pink-100 text-[#E1306C] rounded-xl flex items-center justify-center mr-4">
              <Instagram className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Instagram Connection</h3>
              <p className="text-sm text-slate-500">Connect your Professional account to enable automations.</p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-xl p-6">
            {user?.instagram?.accountId ? (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 mr-2" />
                  <div>
                    <p className="font-medium text-slate-900">Connected successfully</p>
                    <p className="text-sm text-slate-500">Account ID: {user.instagram.accountId}</p>
                  </div>
                </div>
                <button 
                  onClick={handleDisconnectInstagram}
                  className="btn-secondary text-sm border-red-200 text-red-600 hover:bg-red-50"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <p className="font-medium text-slate-900 mb-1">Not connected</p>
                  <p className="text-sm text-slate-500 max-w-sm">You must connect a Professional account linked to a Facebook Page.</p>
                </div>
                <button 
                  onClick={handleConnectInstagram}
                  className="btn-primary inline-flex items-center whitespace-nowrap"
                >
                  <Instagram className="w-4 h-4 mr-2" /> Connect Instagram
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Billing & Subscription */}
        <div className="glass-panel p-6 md:p-8 rounded-2xl">
          <div className="flex items-center mb-6">
            <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center mr-4">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Billing & Subscription</h3>
              <p className="text-sm text-slate-500">Manage your current plan and payment methods.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
              <h4 className="text-sm font-bold uppercase tracking-wider text-slate-500 mb-2">Current Plan</h4>
              <div className="flex items-end mb-4">
                <span className="text-3xl font-bold text-slate-900 mr-2">
                  {user?.subscription?.plan ? user.subscription.plan.charAt(0).toUpperCase() + user.subscription.plan.slice(1) : 'Free'}
                </span>
                {user?.subscription?.plan && (
                  <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md mb-1">Active</span>
                )}
              </div>
              <p className="text-sm text-slate-600 mb-6">
                {user?.subscription?.plan 
                  ? 'You have access to all features included in your plan.' 
                  : 'You are currently on the limited free plan. Upgrade to unlock more automations.'}
              </p>
              <button 
                onClick={() => window.location.href = '/pricing'}
                className="btn-secondary w-full"
              >
                View Plans
              </button>
            </div>

            <div className="bg-gradient-to-br from-primary-600 to-teal-500 border border-transparent rounded-xl p-6 shadow-md text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white rounded-full blur-3xl opacity-20 -mr-10 -mt-10"></div>
              <h4 className="text-sm font-bold uppercase tracking-wider text-primary-100 mb-2 relative z-10">Upgrade to Growth</h4>
              <div className="flex items-end mb-4 relative z-10">
                <span className="text-3xl font-bold mr-2">₹1,499</span>
                <span className="text-sm text-primary-100 mb-1">/ month</span>
              </div>
              <ul className="text-sm text-primary-50 space-y-2 mb-6 relative z-10">
                <li className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-2 text-teal-200" /> 10 Automations</li>
                <li className="flex items-center"><CheckCircle2 className="w-4 h-4 mr-2 text-teal-200" /> 5,000 Leads</li>
              </ul>
              <button 
                onClick={() => handleSubscribe('GROWTH')}
                disabled={loading}
                className="w-full bg-white text-primary-700 hover:bg-slate-50 font-bold py-2 px-4 rounded-lg transition-colors relative z-10 flex justify-center items-center"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Upgrade Now'}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Settings;
