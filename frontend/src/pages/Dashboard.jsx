import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import { 
  Users, 
  MessageCircle, 
  Zap, 
  TrendingUp,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { Link } from 'react-router-dom';

const StatsCard = ({ title, value, icon: Icon, trend, colorClass }) => (
  <div className="glass-panel p-6 animate-slide-up">
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
        <h4 className="text-3xl font-bold text-slate-900">{value}</h4>
      </div>
      <div className={`p-3 rounded-xl ${colorClass}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
    {trend !== undefined && (
      <div className="mt-4 flex items-center text-sm">
        <span className={trend >= 0 ? "text-emerald-600 font-medium" : "text-red-600 font-medium"}>
          {trend >= 0 ? '+' : ''}{trend}%
        </span>
        <span className="text-slate-500 ml-2">from last month</span>
      </div>
    )}
  </div>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/analytics/overview');
        setStats(res.data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
          <p className="text-slate-500 mt-1">Here's what's happening with your Instagram account today.</p>
        </div>
        
        {(!user?.instagram?.accountId) && (
          <Link to="/settings" className="btn-primary flex items-center text-sm animate-pulse">
            <RefreshCw className="w-4 h-4 mr-2" />
            Connect Instagram
          </Link>
        )}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="glass-panel p-6 h-32 animate-pulse flex flex-col justify-between">
               <div className="h-4 bg-slate-200 rounded w-1/3"></div>
               <div className="h-8 bg-slate-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatsCard 
              title="Total Leads" 
              value={stats?.leads?.total || 0} 
              trend={12} 
              icon={Users} 
              colorClass="bg-gradient-to-br from-blue-500 to-indigo-600"
            />
            <StatsCard 
              title="Messages Sent" 
              value={stats?.messages?.sent || 0} 
              trend={8} 
              icon={MessageCircle} 
              colorClass="bg-gradient-to-br from-emerald-400 to-teal-500"
            />
            <StatsCard 
              title="Active Automations" 
              value={stats?.automations?.active || 0} 
              icon={Zap} 
              colorClass="bg-gradient-to-br from-amber-400 to-orange-500"
            />
            <StatsCard 
              title="Conversion Rate" 
              value="24%" 
              trend={2} 
              icon={TrendingUp} 
              colorClass="bg-gradient-to-br from-purple-500 to-pink-600"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Recent Leads */}
            <div className="glass-panel p-6 col-span-1 lg:col-span-2 shadow-sm border border-slate-200/60">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-900">Recent Leads</h3>
                <Link to="/leads" className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center">
                  View all <ArrowRight className="w-4 h-4 ml-1" />
                </Link>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 text-sm font-medium text-slate-500">
                      <th className="pb-3 font-medium">Lead</th>
                      <th className="pb-3 font-medium">Status</th>
                      <th className="pb-3 font-medium">Source</th>
                      <th className="pb-3 font-medium text-right">Added</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Placeholder data since we don't have recent leads endpoint yet */}
                    {[
                      { name: 'john_doe', status: 'new', source: 'Comment', date: '2h ago' },
                      { name: 'sarah.smith', status: 'contacted', source: 'DM', date: '5h ago' },
                      { name: 'mike_insta', status: 'qualified', source: 'Comment', date: '1d ago' },
                    ].map((lead, i) => (
                      <tr key={i} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                        <td className="py-4">
                          <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-slate-200 mr-3"></div>
                            <span className="font-medium text-slate-900">@{lead.name}</span>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            lead.status === 'new' ? 'bg-blue-100 text-blue-800' :
                            lead.status === 'contacted' ? 'bg-amber-100 text-amber-800' :
                            'bg-emerald-100 text-emerald-800'
                          }`}>
                            {lead.status.charAt(0).toUpperCase() + lead.status.slice(1)}
                          </span>
                        </td>
                        <td className="py-4 text-sm text-slate-500">{lead.source}</td>
                        <td className="py-4 text-sm text-slate-500 text-right">{lead.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="glass-panel p-6 shadow-sm border border-slate-200/60">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Quick Actions</h3>
              <div className="space-y-3">
                <Link to="/automations/new" className="flex items-center p-3 rounded-xl border border-slate-100 hover:border-primary-200 hover:bg-primary-50 transition-colors group">
                  <div className="p-2 bg-primary-100 text-primary-600 rounded-lg group-hover:bg-white transition-colors">
                    <Zap className="w-5 h-5" />
                  </div>
                  <div className="ml-4">
                    <p className="font-medium text-slate-900">New Automation</p>
                    <p className="text-xs text-slate-500">Auto-reply to comments</p>
                  </div>
                </Link>
                
                <Link to="/campaigns/new" className="flex items-center p-3 rounded-xl border border-slate-100 hover:border-teal-200 hover:bg-teal-50 transition-colors group">
                  <div className="p-2 bg-teal-100 text-teal-600 rounded-lg group-hover:bg-white transition-colors">
                    <MessageCircle className="w-5 h-5" />
                  </div>
                  <div className="ml-4">
                    <p className="font-medium text-slate-900">New Drip Campaign</p>
                    <p className="text-xs text-slate-500">Follow up sequences</p>
                  </div>
                </Link>
              </div>
              
              <div className="mt-8 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-5 text-white relative overflow-hidden">
                 <div className="absolute top-[-20%] right-[-10%] w-24 h-24 bg-white/10 rounded-full blur-xl"></div>
                 <h4 className="font-bold text-lg mb-1">Need help?</h4>
                 <p className="text-sm text-slate-300 mb-4">Check out our guide on setting up your first automation.</p>
                 <button className="bg-white/20 hover:bg-white/30 backdrop-blur text-white text-sm font-medium py-2 px-4 rounded-lg transition-colors">
                   Read Guide
                 </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
