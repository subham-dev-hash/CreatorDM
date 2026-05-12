import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu, X, MessageSquare } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const PublicLayout = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  return (
    <div className="min-h-screen bg-slate-50 font-sans flex flex-col">
      {/* Header */}
      <header 
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm border-b border-slate-200' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16 md:h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center">
              <MessageSquare className="w-8 h-8 text-primary-600 mr-2" />
              <span className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-teal-500 bg-clip-text text-transparent">
                CreatorDM
              </span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/#features" className="text-slate-600 hover:text-primary-600 font-medium transition-colors">Features</Link>
              <Link to="/compare" className="text-slate-600 hover:text-primary-600 font-medium transition-colors">Compare</Link>
              <Link to="/pricing" className="text-slate-600 hover:text-primary-600 font-medium transition-colors">Pricing</Link>
            </nav>

            {/* Desktop Auth Buttons */}
            <div className="hidden md:flex items-center space-x-4">
              {user ? (
                <Link to="/dashboard" className="btn-primary">Go to Dashboard</Link>
              ) : (
                <>
                  <Link to="/login" className="text-slate-600 hover:text-primary-600 font-medium transition-colors">Log in</Link>
                  <Link to="/register" className="btn-primary">Start Free Trial</Link>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <button 
              className="md:hidden text-slate-600 hover:text-slate-900 focus:outline-none"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-slate-200 shadow-lg absolute w-full left-0 top-full">
            <div className="px-4 pt-2 pb-6 space-y-1 sm:px-3">
              <Link to="/#features" className="block px-3 py-3 text-base font-medium text-slate-700 hover:text-primary-600 hover:bg-slate-50 rounded-md">Features</Link>
              <Link to="/compare" className="block px-3 py-3 text-base font-medium text-slate-700 hover:text-primary-600 hover:bg-slate-50 rounded-md">Compare</Link>
              <Link to="/pricing" className="block px-3 py-3 text-base font-medium text-slate-700 hover:text-primary-600 hover:bg-slate-50 rounded-md">Pricing</Link>
              
              <div className="mt-4 pt-4 border-t border-slate-100 flex flex-col space-y-3 px-3">
                {user ? (
                  <Link to="/dashboard" className="btn-primary text-center w-full">Go to Dashboard</Link>
                ) : (
                  <>
                    <Link to="/login" className="btn-secondary text-center w-full">Log in</Link>
                    <Link to="/register" className="btn-primary text-center w-full">Start Free Trial</Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-grow pt-16 md:pt-20">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <MessageSquare className="w-6 h-6 text-primary-500 mr-2" />
              <span className="text-xl font-bold text-white">
                CreatorDM
              </span>
            </div>
            <div className="flex space-x-6">
              <a href="#" className="text-slate-400 hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="text-slate-400 hover:text-white transition-colors">Contact Support</a>
            </div>
          </div>
          <div className="mt-8 text-center md:text-left text-slate-500 text-sm border-t border-slate-800 pt-8">
            &copy; {new Date().getFullYear()} CreatorDM Inc. All rights reserved. Not affiliated with Meta or Instagram.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
