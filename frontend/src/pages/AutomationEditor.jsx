import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, Zap, MessageCircle } from 'lucide-react';
import { automationsApi } from '../api/automations';

const AutomationEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    triggerType: 'COMMENT',
    triggerKeywords: '',
    actionType: 'DM',
    messageConfig: {
      text: ''
    },
    isActive: true
  });

  useEffect(() => {
    if (isEditing) {
      fetchAutomation();
    }
  }, [id]);

  const fetchAutomation = async () => {
    try {
      const res = await automationsApi.getById(id);
      const data = res.data;
      setFormData({
        ...data,
        triggerKeywords: data.triggerKeywords.join(', '),
      });
    } catch (error) {
      setError('Failed to load automation details.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.name || !formData.triggerKeywords || !formData.messageConfig.text) {
      setError('Please fill in all required fields.');
      return;
    }

    setSaving(true);
    setError('');

    const payload = {
      ...formData,
      triggerKeywords: formData.triggerKeywords.split(',').map(k => k.trim()).filter(k => k),
    };

    try {
      if (isEditing) {
        await automationsApi.update(id, payload);
      } else {
        await automationsApi.create(payload);
      }
      navigate('/automations');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save automation.');
    } finally {
      setSaving(false);
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
    <div className="max-w-4xl mx-auto animate-fade-in pb-20">
      <div className="mb-6">
        <Link to="/automations" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Automations
        </Link>
      </div>

      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            {isEditing ? 'Edit Automation' : 'New Automation'}
          </h1>
          <p className="text-slate-600">Define what triggers a message and what that message says.</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="btn-primary inline-flex items-center"
        >
          {saving ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
          {isEditing ? 'Save Changes' : 'Create Automation'}
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="space-y-8">
        {/* General Settings */}
        <div className="glass-panel p-6 rounded-2xl">
          <label className="block text-sm font-bold text-slate-900 mb-2">Automation Name</label>
          <input
            type="text"
            className="input-field max-w-md"
            placeholder="e.g., Free Guide Delivery"
            value={formData.name}
            onChange={e => setFormData({ ...formData, name: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Step 1: Trigger */}
          <div className="glass-card p-6 rounded-2xl border-l-4 border-amber-500 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-bl-full -mr-4 -mt-4 opacity-50 pointer-events-none"></div>
            
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-lg flex items-center justify-center mr-4">
                <Zap className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">1. The Trigger</h2>
            </div>
            
            <div className="space-y-4 relative z-10">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Trigger Type</label>
                <select 
                  className="input-field bg-slate-50"
                  value={formData.triggerType}
                  onChange={e => setFormData({ ...formData, triggerType: e.target.value })}
                >
                  <option value="COMMENT">Post/Reel Comment</option>
                  <option value="DM_KEYWORD" disabled>DM Keyword (Coming soon)</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Keywords</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g., guide, link, freebie"
                  value={formData.triggerKeywords}
                  onChange={e => setFormData({ ...formData, triggerKeywords: e.target.value })}
                />
                <p className="text-xs text-slate-500 mt-1">Separate multiple words with commas.</p>
              </div>
            </div>
          </div>

          {/* Step 2: Action */}
          <div className="glass-card p-6 rounded-2xl border-l-4 border-primary-500 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary-50 rounded-bl-full -mr-4 -mt-4 opacity-50 pointer-events-none"></div>
            
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-primary-100 text-primary-600 rounded-lg flex items-center justify-center mr-4">
                <MessageCircle className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">2. The Action</h2>
            </div>
            
            <div className="space-y-4 relative z-10">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Direct Message Content</label>
                <textarea
                  className="input-field min-h-[150px] resize-y"
                  placeholder="Hey {first_name}! Thanks for commenting. Here is the link you requested: https://example.com"
                  value={formData.messageConfig.text}
                  onChange={e => setFormData({ 
                    ...formData, 
                    messageConfig: { ...formData.messageConfig, text: e.target.value } 
                  })}
                />
                <p className="text-xs text-slate-500 mt-1">
                  You can use <code className="bg-slate-100 px-1 rounded text-primary-600">{`{first_name}`}</code> to personalize.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AutomationEditor;
