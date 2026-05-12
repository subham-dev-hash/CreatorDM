import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { ArrowLeft, Save, Loader2, Plus, Trash2, Clock, MessageSquare } from 'lucide-react';
import { campaignsApi } from '../api/campaigns';

const CampaignEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    isActive: true,
    steps: [
      { order: 0, delayMinutes: 0, messageConfig: { text: '' } }
    ]
  });

  useEffect(() => {
    if (isEditing) {
      fetchCampaign();
    }
  }, [id]);

  const fetchCampaign = async () => {
    try {
      const res = await campaignsApi.getById(id);
      setFormData(res.data);
    } catch (error) {
      setError('Failed to load campaign details.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.name) {
      setError('Please provide a campaign name.');
      return;
    }
    if (formData.steps.some(step => !step.messageConfig.text)) {
      setError('All steps must have message content.');
      return;
    }

    setSaving(true);
    setError('');

    try {
      if (isEditing) {
        await campaignsApi.update(id, formData);
      } else {
        await campaignsApi.create(formData);
      }
      navigate('/campaigns');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save campaign.');
    } finally {
      setSaving(false);
    }
  };

  const addStep = () => {
    setFormData(prev => ({
      ...prev,
      steps: [
        ...prev.steps,
        { order: prev.steps.length, delayMinutes: 1440, messageConfig: { text: '' } } // Default 1 day delay
      ]
    }));
  };

  const updateStep = (index, field, value) => {
    const newSteps = [...formData.steps];
    
    if (field === 'text') {
      newSteps[index].messageConfig.text = value;
    } else {
      newSteps[index][field] = value;
    }
    
    setFormData({ ...formData, steps: newSteps });
  };

  const removeStep = (index) => {
    if (formData.steps.length <= 1) return;
    
    const newSteps = formData.steps.filter((_, i) => i !== index);
    // Update order
    newSteps.forEach((step, i) => { step.order = i; });
    
    setFormData({ ...formData, steps: newSteps });
  };

  if (loading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-teal-600" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto animate-fade-in pb-32">
      <div className="mb-6">
        <Link to="/campaigns" className="inline-flex items-center text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Campaigns
        </Link>
      </div>

      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            {isEditing ? 'Edit Campaign' : 'New Campaign'}
          </h1>
          <p className="text-slate-600">Build a sequence of direct messages with custom delays.</p>
        </div>
        <button 
          onClick={handleSave} 
          disabled={saving}
          className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-2 px-4 rounded-lg transition-colors shadow-sm inline-flex items-center"
        >
          {saving ? <Loader2 className="w-5 h-5 mr-2 animate-spin" /> : <Save className="w-5 h-5 mr-2" />}
          {isEditing ? 'Save Changes' : 'Create Campaign'}
        </button>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* General Settings */}
      <div className="glass-panel p-6 rounded-2xl mb-8">
        <label className="block text-sm font-bold text-slate-900 mb-2">Campaign Name</label>
        <input
          type="text"
          className="input-field max-w-md"
          placeholder="e.g., 5-Day Value Sequence"
          value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
        />
      </div>

      {/* Sequence Builder */}
      <div className="space-y-6">
        {formData.steps.map((step, index) => (
          <div key={index} className="relative">
            {index > 0 && (
              <div className="absolute -top-6 left-8 w-0.5 h-6 bg-slate-200"></div>
            )}
            
            <div className="glass-card p-6 rounded-2xl shadow-sm border border-slate-200">
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-slate-800 text-white flex items-center justify-center font-bold mr-3">
                    {index + 1}
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Step {index + 1}</h3>
                </div>
                
                {formData.steps.length > 1 && (
                  <button 
                    onClick={() => removeStep(index)}
                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>

              <div className="space-y-6 pl-11">
                {/* Delay Setting (Not needed for Step 1) */}
                {index > 0 && (
                  <div className="flex items-center bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <Clock className="w-5 h-5 text-slate-400 mr-3" />
                    <span className="text-sm text-slate-700 mr-4">Wait for</span>
                    <input
                      type="number"
                      min="0"
                      className="input-field w-24 mr-2 py-1"
                      value={step.delayMinutes >= 1440 ? step.delayMinutes / 1440 : step.delayMinutes >= 60 ? step.delayMinutes / 60 : step.delayMinutes}
                      onChange={e => {
                        const val = parseInt(e.target.value) || 0;
                        // For simplicity in UI, if they typed here, we assume the current unit.
                        // Ideally we'd have a unit dropdown, but for now we'll just store minutes.
                        updateStep(index, 'delayMinutes', val);
                      }}
                    />
                    <select 
                      className="input-field w-32 py-1"
                      onChange={e => {
                        const unit = e.target.value;
                        const currentVal = step.delayMinutes >= 1440 ? step.delayMinutes / 1440 : step.delayMinutes >= 60 ? step.delayMinutes / 60 : step.delayMinutes;
                        const multiplier = unit === 'days' ? 1440 : unit === 'hours' ? 60 : 1;
                        updateStep(index, 'delayMinutes', currentVal * multiplier);
                      }}
                      value={step.delayMinutes >= 1440 && step.delayMinutes % 1440 === 0 ? 'days' : step.delayMinutes >= 60 && step.delayMinutes % 60 === 0 ? 'hours' : 'minutes'}
                    >
                      <option value="minutes">Minutes</option>
                      <option value="hours">Hours</option>
                      <option value="days">Days</option>
                    </select>
                  </div>
                )}

                {/* Message Content */}
                <div>
                  <div className="flex items-center mb-2">
                    <MessageSquare className="w-4 h-4 text-slate-400 mr-2" />
                    <label className="text-sm font-medium text-slate-700">Message Content</label>
                  </div>
                  <textarea
                    className="input-field min-h-[120px] resize-y"
                    placeholder="Write the DM content for this step..."
                    value={step.messageConfig.text}
                    onChange={e => updateStep(index, 'text', e.target.value)}
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Use <code className="bg-slate-100 px-1 rounded text-teal-600">{`{first_name}`}</code> to personalize.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 flex justify-center">
        <button 
          onClick={addStep}
          className="btn-secondary inline-flex items-center border-dashed border-2 py-3 px-6 hover:bg-slate-50"
        >
          <Plus className="w-5 h-5 mr-2" /> Add Next Step
        </button>
      </div>
    </div>
  );
};

export default CampaignEditor;
