import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AuthLayout = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // Redirect to dashboard if already logged in
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex relative overflow-hidden bg-slate-50">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-200 blur-3xl opacity-50 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] rounded-full bg-teal-200 blur-3xl opacity-40"></div>
      
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24 relative z-10 w-full lg:w-1/2">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              CreatorDM
            </h2>
            <p className="mt-2 text-sm text-slate-600">
              Automate your Instagram interactions
            </p>
          </div>
          <Outlet />
        </div>
      </div>
      
      {/* Right side illustration/image area for large screens */}
      <div className="hidden lg:block relative w-0 flex-1 bg-gradient-to-br from-primary-600 to-teal-800">
         <div className="absolute inset-0 flex items-center justify-center p-12 text-white">
            <div className="max-w-xl">
               <h1 className="text-4xl font-bold mb-6">Engage your audience on autopilot.</h1>
               <p className="text-lg text-primary-100 mb-8">
                  Turn comments into conversations and conversations into customers with powerful DM automation.
               </p>
               {/* Could add a nice UI mockup or graphic here */}
               <div className="glass-card p-6 opacity-90 transform rotate-2 hover:rotate-0 transition-transform duration-500">
                  <div className="flex items-center mb-4">
                     <div className="w-10 h-10 rounded-full bg-primary-200 mr-3"></div>
                     <div className="h-4 w-32 bg-primary-200 rounded"></div>
                  </div>
                  <div className="space-y-3">
                     <div className="h-3 w-full bg-primary-100 rounded"></div>
                     <div className="h-3 w-5/6 bg-primary-100 rounded"></div>
                     <div className="h-3 w-4/6 bg-primary-100 rounded"></div>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
};

export default AuthLayout;
