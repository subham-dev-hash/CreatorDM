import React from 'react';
import { BookOpen, Zap, MessageCircle, PlayCircle } from 'lucide-react';

const Guide = () => {
  return (
    <div className="max-w-4xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">CreatorDM Guide</h1>
        <p className="text-slate-600">Everything you need to know to automate your Instagram engagement.</p>
      </div>

      <div className="space-y-8">
        {/* Step 1 */}
        <div className="glass-panel p-6 md:p-8 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary-100 rounded-bl-full -mr-8 -mt-8 opacity-50"></div>
          <div className="flex items-start">
            <div className="flex-shrink-0 w-12 h-12 bg-primary-100 text-primary-600 rounded-xl flex items-center justify-center mr-6">
              <span className="text-xl font-bold">1</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Connecting Instagram</h2>
              <p className="text-slate-600 mb-4">
                Before you can automate anything, you need to connect your Instagram account.
                This requires an <strong>Instagram Professional Account</strong> (Business or Creator) that is connected to a Facebook Page.
              </p>
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-sm text-slate-700">
                <ol className="list-decimal pl-5 space-y-2">
                  <li>Go to <a href="/settings" className="text-primary-600 font-medium">Settings</a>.</li>
                  <li>Click "Connect Instagram Account".</li>
                  <li>Log into Facebook and select the Page associated with your Instagram.</li>
                  <li>Grant all requested permissions for messages and comments.</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="glass-panel p-6 md:p-8 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-100 rounded-bl-full -mr-8 -mt-8 opacity-50"></div>
          <div className="flex items-start">
            <div className="flex-shrink-0 w-12 h-12 bg-teal-100 text-teal-600 rounded-xl flex items-center justify-center mr-6">
              <span className="text-xl font-bold">2</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Creating an Automation</h2>
              <p className="text-slate-600 mb-4">
                Automations listen for specific keywords in the comments of your Posts and Reels, and instantly send a DM to the user.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
                <div className="border border-slate-200 rounded-lg p-4 bg-white">
                  <div className="flex items-center text-slate-900 font-medium mb-2">
                    <Zap className="w-4 h-4 mr-2 text-amber-500" /> The Trigger
                  </div>
                  <p className="text-sm text-slate-500">Choose words like "LINK" or "GUIDE". When someone comments exactly this word, the automation fires.</p>
                </div>
                <div className="border border-slate-200 rounded-lg p-4 bg-white">
                  <div className="flex items-center text-slate-900 font-medium mb-2">
                    <MessageCircle className="w-4 h-4 mr-2 text-blue-500" /> The Action
                  </div>
                  <p className="text-sm text-slate-500">Write the DM you want to send. Include your link here. You can also specify a time delay.</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Step 3 */}
        <div className="glass-panel p-6 md:p-8 rounded-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-100 rounded-bl-full -mr-8 -mt-8 opacity-50"></div>
          <div className="flex items-start">
            <div className="flex-shrink-0 w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mr-6">
              <span className="text-xl font-bold">3</span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">Drip Campaigns</h2>
              <p className="text-slate-600 mb-4">
                Drip campaigns allow you to send follow-up messages automatically over several days.
              </p>
              <p className="text-slate-600">
                In the <a href="/campaigns" className="text-primary-600 font-medium">Campaigns</a> tab, you can build a sequence (e.g., Send Message 1 - Wait 24 hours - Send Message 2).
                You can trigger a campaign automatically when a user comments, or manually add leads to a campaign from the CRM.
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 text-center pb-12">
        <p className="text-slate-500 mb-4">Need visual help?</p>
        <button className="btn-secondary inline-flex items-center">
          <PlayCircle className="w-5 h-5 mr-2" /> Watch Video Tutorial
        </button>
      </div>
    </div>
  );
};

export default Guide;
