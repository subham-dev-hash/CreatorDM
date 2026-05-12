import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Zap, MessageSquare, MoreVertical, Loader2, Power, PowerOff } from 'lucide-react';
import { automationsApi } from '../api/automations';

const Automations = () => {
  const [automations, setAutomations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAutomations();
  }, []);

  const fetchAutomations = async () => {
    try {
      const res = await automationsApi.getAll();
      setAutomations(res.data || []);
    } catch (error) {
      console.error('Failed to fetch automations', error);
      // Fallback placeholder data for development if API fails
      setAutomations([
        { _id: '1', name: 'Lead Magnet Delivery', triggerType: 'COMMENT', triggerKeywords: ['link', 'guide'], isActive: true, stats: { totalTriggered: 145 } },
        { _id: '2', name: 'Course Waitlist', triggerType: 'COMMENT', triggerKeywords: ['waitlist'], isActive: false, stats: { totalTriggered: 32 } },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      // Optimistic update
      setAutomations(automations.map(a => a._id === id ? { ...a, isActive: !currentStatus } : a));
      await automationsApi.toggleStatus(id, !currentStatus);
    } catch (error) {
      console.error('Failed to toggle status', error);
      // Revert on failure
      fetchAutomations();
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Automations</h1>
          <p className="text-slate-600">Manage your comment-to-DM keyword triggers.</p>
        </div>
        <Link to="/automations/new" className="btn-primary inline-flex items-center">
          <Plus className="w-5 h-5 mr-2" /> New Automation
        </Link>
      </div>

      {automations.length === 0 ? (
        <div className="glass-panel border-dashed border-2 p-12 text-center rounded-2xl flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center mb-4">
            <Zap className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No automations yet</h3>
          <p className="text-slate-500 mb-6 max-w-sm">Create your first automation to start replying to comments instantly with DMs.</p>
          <Link to="/automations/new" className="btn-primary inline-flex items-center">
            <Plus className="w-5 h-5 mr-2" /> Create Automation
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {automations.map((automation) => (
            <div key={automation._id} className={`glass-card p-6 border transition-all ${automation.isActive ? 'border-primary-200 shadow-md' : 'border-slate-200 opacity-75'}`}>
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-lg ${automation.isActive ? 'bg-primary-100 text-primary-600' : 'bg-slate-100 text-slate-500'}`}>
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => toggleStatus(automation._id, automation.isActive)}
                    className={`p-1.5 rounded-md transition-colors ${automation.isActive ? 'text-emerald-600 hover:bg-emerald-50' : 'text-slate-400 hover:bg-slate-100'}`}
                    title={automation.isActive ? "Pause automation" : "Activate automation"}
                  >
                    {automation.isActive ? <Power className="w-5 h-5" /> : <PowerOff className="w-5 h-5" />}
                  </button>
                  <Link to={`/automations/${automation._id}`} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md">
                    <MoreVertical className="w-5 h-5" />
                  </Link>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-1 truncate">{automation.name}</h3>
              
              <div className="mt-4 space-y-3">
                <div>
                  <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Trigger Keywords</p>
                  <div className="flex flex-wrap gap-2">
                    {automation.triggerKeywords.map((kw, i) => (
                      <span key={i} className="bg-slate-100 text-slate-700 text-xs px-2 py-1 rounded border border-slate-200">
                        "{kw}"
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="pt-4 border-t border-slate-100 flex justify-between items-center">
                  <span className="text-sm text-slate-500">Sent messages</span>
                  <span className="font-bold text-slate-900">{automation.stats?.totalTriggered || 0}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Automations;
