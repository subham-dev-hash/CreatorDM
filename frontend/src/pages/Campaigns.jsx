import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Target, Users, MoreVertical, Loader2, Power, PowerOff } from 'lucide-react';
import { campaignsApi } from '../api/campaigns';

const Campaigns = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCampaigns();
  }, []);

  const fetchCampaigns = async () => {
    try {
      const res = await campaignsApi.getAll();
      setCampaigns(res.data || []);
    } catch (error) {
      console.error('Failed to fetch campaigns', error);
      // Fallback placeholder data for development
      setCampaigns([
        { _id: '1', name: 'Webinar Follow-up Sequence', isActive: true, stats: { totalEnrolled: 450, totalCompleted: 312 }, steps: [{}, {}, {}] },
        { _id: '2', name: 'Cold Lead Nurture', isActive: false, stats: { totalEnrolled: 89, totalCompleted: 12 }, steps: [{}] },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      setCampaigns(campaigns.map(c => c._id === id ? { ...c, isActive: !currentStatus } : c));
      await campaignsApi.toggleStatus(id, !currentStatus);
    } catch (error) {
      console.error('Failed to toggle status', error);
      fetchCampaigns();
    }
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Drip Campaigns</h1>
          <p className="text-slate-600">Nurture leads with automated multi-step message sequences.</p>
        </div>
        <Link to="/campaigns/new" className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-lg transition-colors shadow-sm inline-flex items-center">
          <Plus className="w-5 h-5 mr-2" /> New Campaign
        </Link>
      </div>

      {campaigns.length === 0 ? (
        <div className="glass-panel border-dashed border-2 p-12 text-center rounded-2xl flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center mb-4">
            <Target className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-2">No campaigns yet</h3>
          <p className="text-slate-500 mb-6 max-w-sm">Create your first drip campaign to automatically follow up with your audience.</p>
          <Link to="/campaigns/new" className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-lg transition-colors shadow-sm inline-flex items-center">
            <Plus className="w-5 h-5 mr-2" /> Create Campaign
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {campaigns.map((campaign) => (
            <div key={campaign._id} className={`glass-card p-6 border transition-all ${campaign.isActive ? 'border-teal-200 shadow-md' : 'border-slate-200 opacity-75'}`}>
              <div className="flex justify-between items-start mb-4">
                <div className={`p-2 rounded-lg ${campaign.isActive ? 'bg-teal-100 text-teal-600' : 'bg-slate-100 text-slate-500'}`}>
                  <Target className="w-6 h-6" />
                </div>
                <div className="flex items-center space-x-2">
                  <button 
                    onClick={() => toggleStatus(campaign._id, campaign.isActive)}
                    className={`p-1.5 rounded-md transition-colors ${campaign.isActive ? 'text-emerald-600 hover:bg-emerald-50' : 'text-slate-400 hover:bg-slate-100'}`}
                    title={campaign.isActive ? "Pause campaign" : "Activate campaign"}
                  >
                    {campaign.isActive ? <Power className="w-5 h-5" /> : <PowerOff className="w-5 h-5" />}
                  </button>
                  <Link to={`/campaigns/${campaign._id}`} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-md">
                    <MoreVertical className="w-5 h-5" />
                  </Link>
                </div>
              </div>
              
              <h3 className="text-xl font-bold text-slate-900 mb-1 truncate">{campaign.name}</h3>
              <p className="text-sm text-slate-500 mb-4">{campaign.steps?.length || 0} message steps</p>
              
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <div>
                  <div className="flex items-center text-xs text-slate-500 mb-1">
                    <Users className="w-3 h-3 mr-1" /> Enrolled
                  </div>
                  <span className="font-bold text-slate-900">{campaign.stats?.totalEnrolled || 0}</span>
                </div>
                <div>
                  <div className="flex items-center text-xs text-slate-500 mb-1">
                    Completed
                  </div>
                  <span className="font-bold text-slate-900">{campaign.stats?.totalCompleted || 0}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Campaigns;
