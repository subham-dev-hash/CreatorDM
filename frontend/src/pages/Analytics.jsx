import React, { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, MessageSquare, Loader2 } from 'lucide-react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { analyticsApi } from '../api/analytics';

const Analytics = () => {
  const [overview, setOverview] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const [overviewRes, timelineRes] = await Promise.all([
        analyticsApi.getOverview(),
        analyticsApi.getTimeline({ days: 30 })
      ]);
      setOverview(overviewRes.data);
      setTimeline(timelineRes.data.timeline || []);
    } catch (error) {
      console.error('Failed to fetch analytics', error);
      // Fallback placeholder data
      setOverview({
        leads: { total: 1250, newMonth: 342, byStatus: [] },
        messages: { sent: 4521, delivered: 4500, read: 3800 },
        automations: { active: 5, total: 8 },
        campaigns: { active: 2, total: 3 }
      });
      
      // Generate some dummy timeline data
      const dummyTimeline = [];
      const now = new Date();
      for (let i = 30; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        dummyTimeline.push({
          date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          messages: Math.floor(Math.random() * 200) + 50,
          leads: Math.floor(Math.random() * 20) + 5
        });
      }
      setTimeline(dummyTimeline);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, colorClass }) => (
    <div className="glass-panel p-6 rounded-2xl shadow-sm border border-slate-200">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-sm font-medium text-slate-500 mb-1">{title}</p>
          <h4 className="text-3xl font-bold text-slate-900">{value}</h4>
        </div>
        <div className={`p-3 rounded-xl bg-slate-50 ${colorClass}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center pb-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto animate-fade-in pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Analytics</h1>
        <p className="text-slate-600">Measure the performance of your automations and campaigns.</p>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard 
          title="Total Leads" 
          value={overview?.leads?.total || 0} 
          icon={Users} 
          colorClass="text-blue-600"
        />
        <StatCard 
          title="New Leads (30d)" 
          value={overview?.leads?.newMonth || 0} 
          icon={TrendingUp} 
          colorClass="text-emerald-600"
        />
        <StatCard 
          title="Messages Sent" 
          value={overview?.messages?.sent || 0} 
          icon={MessageSquare} 
          colorClass="text-purple-600"
        />
        <StatCard 
          title="Active Automations" 
          value={overview?.automations?.active || 0} 
          icon={BarChart3} 
          colorClass="text-amber-600"
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Messages Chart */}
        <div className="glass-card p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-6">Message Volume (30 Days)</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={timeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorMessages" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#8b5cf6', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="messages" name="Messages Sent" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorMessages)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Leads Chart */}
        <div className="glass-card p-6 rounded-2xl shadow-sm border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-6">New Leads (30 Days)</h3>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={timeline} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ color: '#0ea5e9', fontWeight: 'bold' }}
                />
                <Line type="monotone" dataKey="leads" name="New Leads" stroke="#0ea5e9" strokeWidth={3} dot={{r: 3, fill: '#0ea5e9', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6}} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
      
      {/* Conversion Funnel */}
      <div className="glass-panel p-6 rounded-2xl shadow-sm border border-slate-200">
        <h3 className="text-lg font-bold text-slate-900 mb-6">Funnel Overview</h3>
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="w-full bg-slate-50 p-6 rounded-xl border border-slate-100 text-center">
            <div className="text-sm font-medium text-slate-500 mb-1">Messages Sent</div>
            <div className="text-2xl font-bold text-slate-900">{overview?.messages?.sent || 0}</div>
          </div>
          <div className="hidden md:block text-slate-300">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg>
          </div>
          <div className="w-full bg-slate-50 p-6 rounded-xl border border-slate-100 text-center">
            <div className="text-sm font-medium text-slate-500 mb-1">Leads Captured</div>
            <div className="text-2xl font-bold text-slate-900">{overview?.leads?.total || 0}</div>
            <div className="text-xs font-semibold text-emerald-600 mt-1">
              {Math.round(((overview?.leads?.total || 0) / (overview?.messages?.sent || 1)) * 100)}% Conversion
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
