import React from 'react';
import { Clock, X, CheckCircle2, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';

const ComparePage = () => {
  return (
    <div className="bg-slate-50 min-h-screen pb-24">
      {/* Header */}
      <div className="pt-20 pb-16 text-center max-w-4xl mx-auto px-4">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6">Create Auto DMs in seconds, not hours.</h1>
        <p className="text-xl text-slate-600">
          See why creators are ditching clunky enterprise tools for CreatorDM. We built a platform specifically for Instagram creators, focusing on speed and simplicity.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* The Old Way */}
          <div className="glass-panel border-red-100 bg-red-50/30 p-8 rounded-2xl h-full flex flex-col">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-red-100 text-red-600 rounded-lg">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-800">Other Platforms</h3>
            </div>
            <ul className="space-y-4 mb-8 flex-grow">
              <li className="flex items-start">
                <X className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-slate-600">Confusing visual flow builders with hundreds of nodes.</span>
              </li>
              <li className="flex items-start">
                <X className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-slate-600">Takes 30+ minutes just to set up a simple keyword reply.</span>
              </li>
              <li className="flex items-start">
                <X className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-slate-600">Overwhelming enterprise features you never use but pay for.</span>
              </li>
              <li className="flex items-start">
                <X className="w-5 h-5 text-red-500 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-slate-600">Hidden costs based on subscriber counts.</span>
              </li>
            </ul>
            <div className="mt-auto p-4 bg-white/60 rounded-xl border border-red-100 text-center text-red-600 font-medium">
              Time to create: ~35 mins
            </div>
          </div>

          {/* The CreatorDM Way */}
          <div className="glass-card border-primary-200 bg-gradient-to-b from-white to-primary-50/50 p-8 rounded-2xl h-full flex flex-col relative overflow-hidden shadow-2xl transform md:scale-105 z-10">
            <div className="absolute top-0 right-0 bg-primary-600 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
              THE CREATORDM WAY
            </div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-primary-100 text-primary-600 rounded-lg">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900">CreatorDM</h3>
            </div>
            
            <ul className="space-y-4 mb-8 flex-grow">
              <li className="flex items-start">
                <CheckCircle2 className="w-5 h-5 text-primary-600 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700 font-medium">Simple 3-step form. No coding, no flowcharts.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="w-5 h-5 text-primary-600 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700 font-medium">Type the keyword. Type the message. Click save.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="w-5 h-5 text-primary-600 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700 font-medium">Built specifically for Instagram creators.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="w-5 h-5 text-primary-600 mr-3 flex-shrink-0 mt-0.5" />
                <span className="text-slate-700 font-medium">Transparent, flat pricing in INR.</span>
              </li>
            </ul>
            
            <div className="mt-auto p-4 bg-primary-600 rounded-xl border border-primary-500 text-center text-white font-bold shadow-md">
              Time to create: 45 seconds
            </div>
          </div>
        </div>
        
        {/* Deep Dive Feature Comparison Table */}
        <div className="mt-24 max-w-4xl mx-auto">
          <h3 className="text-3xl font-bold text-slate-900 text-center mb-10">Feature-by-Feature Comparison</h3>
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="py-4 px-6 font-semibold text-slate-600">Feature</th>
                  <th className="py-4 px-6 font-semibold text-primary-600 border-l border-slate-200">CreatorDM</th>
                  <th className="py-4 px-6 font-semibold text-slate-600 border-l border-slate-200">Competitors</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6 text-slate-700 font-medium">Target Audience</td>
                  <td className="py-4 px-6 text-slate-600 border-l border-slate-100">Instagram Creators</td>
                  <td className="py-4 px-6 text-slate-500 border-l border-slate-100">Enterprise Brands</td>
                </tr>
                <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6 text-slate-700 font-medium">Pricing Model</td>
                  <td className="py-4 px-6 text-slate-600 border-l border-slate-100">Flat Monthly Rate (INR)</td>
                  <td className="py-4 px-6 text-slate-500 border-l border-slate-100">Per-Subscriber Tiering ($)</td>
                </tr>
                <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6 text-slate-700 font-medium">Automation Setup</td>
                  <td className="py-4 px-6 text-slate-600 border-l border-slate-100">Simple Forms</td>
                  <td className="py-4 px-6 text-slate-500 border-l border-slate-100">Complex Visual Flowcharts</td>
                </tr>
                <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6 text-slate-700 font-medium">Learning Curve</td>
                  <td className="py-4 px-6 text-slate-600 border-l border-slate-100">Minutes</td>
                  <td className="py-4 px-6 text-slate-500 border-l border-slate-100">Weeks / Needs Tutorials</td>
                </tr>
                <tr className="hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6 text-slate-700 font-medium">Interface</td>
                  <td className="py-4 px-6 text-slate-600 border-l border-slate-100">Modern Glassmorphism</td>
                  <td className="py-4 px-6 text-slate-500 border-l border-slate-100">Clunky & Dated</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-20 text-center">
          <Link to="/register" className="btn-primary text-lg px-8 py-4 shadow-lg hover:shadow-xl transition-all">
            Experience the Difference Free
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ComparePage;
