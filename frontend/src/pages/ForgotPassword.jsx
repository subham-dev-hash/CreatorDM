import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Loader2, ArrowLeft } from 'lucide-react';
import api from '../api/client';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    setMessage('');

    try {
      await api.post('/auth/forgot-password', { email });
      setStatus('success');
      setMessage('If an account exists with that email, a password reset link has been sent.');
    } catch (error) {
      setStatus('error');
      setMessage(error.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="animate-fade-in">
      <Link to="/login" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4 mr-2" />
        Back to login
      </Link>

      <div className="glass-panel p-8">
        <h3 className="text-2xl font-bold text-slate-900 mb-2">Reset Password</h3>
        <p className="text-slate-600 mb-6 text-sm">Enter your email address and we'll send you a link to reset your password.</p>
        
        {status === 'success' && (
          <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg text-sm">
            {message}
          </div>
        )}

        {status === 'error' && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
            {message}
          </div>
        )}

        {status !== 'success' && (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                placeholder="you@example.com"
              />
            </div>
            
            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full btn-primary flex justify-center py-2.5"
            >
              {status === 'loading' ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Send Reset Link'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
