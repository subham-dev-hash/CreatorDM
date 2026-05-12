import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Save, Loader2 } from 'lucide-react';
import api from '../api/client';

const Profile = () => {
  const { user, setUser } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Password change state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setError('');

    try {
      const res = await api.put('/auth/profile', { name });
      setUser({ ...user, name: res.data.user.name });
      setMessage('Profile updated successfully.');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    // Implementation placeholder for password update
    setError('Password update not yet implemented on the backend.');
  };

  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">My Profile</h1>
        <p className="text-slate-600">Manage your account details and security settings.</p>
      </div>

      {message && (
        <div className="mb-6 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg text-sm">
          {message}
        </div>
      )}

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column - Navigation/Overview */}
        <div className="col-span-1">
          <div className="glass-panel p-6 rounded-2xl flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-primary-500 to-teal-400 flex items-center justify-center text-3xl font-bold text-white mb-4 shadow-lg">
              {user?.name?.charAt(0) || 'U'}
            </div>
            <h3 className="text-xl font-bold text-slate-900">{user?.name}</h3>
            <p className="text-sm text-slate-500 mb-6">{user?.email}</p>
            
            <div className="w-full border-t border-slate-100 pt-6">
              <div className="flex justify-between items-center text-sm mb-3">
                <span className="text-slate-500">Member since</span>
                <span className="font-medium text-slate-900">
                  {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Today'}
                </span>
              </div>
              <div className="flex justify-between items-center text-sm mb-3">
                <span className="text-slate-500">Plan</span>
                <span className="font-medium text-primary-600">
                  {user?.subscription?.plan || 'Free'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column - Forms */}
        <div className="col-span-1 md:col-span-2 space-y-8">
          {/* General Info */}
          <div className="glass-panel p-6 md:p-8 rounded-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
              <User className="w-5 h-5 mr-2 text-slate-400" />
              General Information
            </h3>
            <form onSubmit={handleUpdateProfile} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                <input
                  type="email"
                  value={user?.email || ''}
                  disabled
                  className="input-field bg-slate-50 text-slate-500 cursor-not-allowed"
                />
                <p className="text-xs text-slate-400 mt-1">Email cannot be changed directly. Contact support.</p>
              </div>
              
              <div className="flex justify-end pt-2">
                <button type="submit" disabled={loading} className="btn-primary inline-flex items-center">
                  {loading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                  Save Changes
                </button>
              </div>
            </form>
          </div>

          {/* Security */}
          <div className="glass-panel p-6 md:p-8 rounded-2xl">
            <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center">
              <Shield className="w-5 h-5 mr-2 text-slate-400" />
              Security & Password
            </h3>
            <form onSubmit={handleUpdatePassword} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="input-field"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">New Password</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="input-field"
                  placeholder="••••••••"
                />
              </div>
              
              <div className="flex justify-end pt-2">
                <button type="submit" className="btn-secondary inline-flex items-center">
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
