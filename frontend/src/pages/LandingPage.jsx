import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, MessageSquare, Zap, Target, Users, CheckCircle2, Clock, X } from 'lucide-react';

const LandingPage = () => {
  return (
    <div className="bg-slate-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32 lg:pt-32 lg:pb-40">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary-200 blur-3xl opacity-50"></div>
        <div className="absolute bottom-[-10%] right-[-5%] w-[50%] h-[50%] rounded-full bg-teal-200 blur-3xl opacity-40"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold text-slate-900 tracking-tight mb-8">
            Turn every Instagram comment <br className="hidden md:block" />
            <span className="bg-gradient-to-r from-primary-600 to-teal-500 bg-clip-text text-transparent">
              into a conversation.
            </span>
          </h1>
          <p className="mt-4 text-xl text-slate-600 max-w-3xl mx-auto mb-10">
            Automate your DMs, capture leads, and run drip campaigns directly from Instagram comments. Grow your audience on autopilot.
          </p>
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/register" className="btn-primary text-lg px-8 py-4 w-full sm:w-auto shadow-lg hover:shadow-xl transition-all">
              Start Your Free Trial
            </Link>
            <Link to="/pricing" className="btn-secondary text-lg px-8 py-4 w-full sm:w-auto">
              View Pricing
            </Link>
          </div>

          {/* Animated Hero Image/Mockup */}
          <div className="mt-16 mx-auto max-w-4xl glass-card rounded-2xl p-4 md:p-8 animate-slide-up shadow-2xl border border-white/40">
            <div className="bg-slate-900 rounded-xl overflow-hidden flex flex-col md:flex-row">
              <div className="p-6 md:w-1/2 flex flex-col justify-center bg-slate-800">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500 to-orange-400 p-[2px]">
                    <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">You</span>
                    </div>
                  </div>
                  <div className="bg-white text-slate-900 px-4 py-2 rounded-2xl rounded-tl-none text-sm font-medium">
                    Comment "LINK" for the free guide! 👇
                  </div>
                </div>
                <div className="flex items-center space-x-3 mb-4 self-end">
                  <div className="bg-primary-600 text-white px-4 py-2 rounded-2xl rounded-tr-none text-sm font-medium">
                    LINK 🔥
                  </div>
                  <div className="w-8 h-8 rounded-full bg-slate-600 flex items-center justify-center text-xs text-white">Fan</div>
                </div>
              </div>
              <div className="p-6 md:w-1/2 flex flex-col justify-center bg-slate-900 border-l border-slate-700">
                <div className="flex items-center justify-center space-x-2 text-primary-400 text-sm mb-4">
                  <Zap className="w-4 h-4" /> <span>CreatorDM Automation Triggered</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-pink-500 to-orange-400 p-[2px]">
                    <div className="w-full h-full bg-slate-900 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">You</span>
                    </div>
                  </div>
                  <div className="bg-slate-800 text-white px-4 py-3 rounded-2xl rounded-tl-none text-sm shadow-lg border border-slate-700">
                    Hey! Thanks for commenting. Here is the link to the guide as promised: <a href="#" className="text-primary-400">creators.link/guide</a> 🚀
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">How CreatorDM Works</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Three simple steps to put your Instagram engagement on autopilot.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connecting Line (Desktop only) */}
            <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-0.5 bg-slate-200 z-0"></div>

            {/* Step 1 */}
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-3xl font-bold mb-6 border-4 border-white shadow-md">
                1
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Connect Instagram</h3>
              <p className="text-slate-600">Securely link your Instagram Creator or Business account in seconds with one click.</p>
            </div>

            {/* Step 2 */}
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-teal-100 text-teal-600 rounded-full flex items-center justify-center text-3xl font-bold mb-6 border-4 border-white shadow-md">
                2
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Set Keywords</h3>
              <p className="text-slate-600">Choose trigger words like "LINK" or "GUIDE" that users will comment on your posts.</p>
            </div>

            {/* Step 3 */}
            <div className="relative z-10 flex flex-col items-center text-center">
              <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl font-bold mb-6 border-4 border-white shadow-md">
                3
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Watch it Grow</h3>
              <p className="text-slate-600">CreatorDM automatically sends a personalized DM to anyone who uses your keyword.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-24 bg-slate-50 border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Loved by Creators</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass-card p-6 border-slate-200 shadow-sm">
              <div className="flex items-center space-x-1 text-yellow-400 mb-4">
                ★ ★ ★ ★ ★
              </div>
              <p className="text-slate-700 italic mb-6">"CreatorDM completely changed how I deliver lead magnets. I used to spend hours manually DMing links. Now it happens instantly while I sleep."</p>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-slate-300"></div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Sarah Jenkins</h4>
                  <p className="text-xs text-slate-500">Fitness Coach • 120k Followers</p>
                </div>
              </div>
            </div>
            
            <div className="glass-card p-6 border-slate-200 shadow-sm">
              <div className="flex items-center space-x-1 text-yellow-400 mb-4">
                ★ ★ ★ ★ ★
              </div>
              <p className="text-slate-700 italic mb-6">"I switched from a messy flow-builder tool to this. The 45-second setup is real. It's so much simpler and does exactly what I need without the bloat."</p>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-slate-300"></div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Marcus Lin</h4>
                  <p className="text-xs text-slate-500">Content Creator • 85k Followers</p>
                </div>
              </div>
            </div>

            <div className="glass-card p-6 border-slate-200 shadow-sm">
              <div className="flex items-center space-x-1 text-yellow-400 mb-4">
                ★ ★ ★ ★ ★
              </div>
              <p className="text-slate-700 italic mb-6">"The built-in CRM is a game changer. I can actually see who clicked my links and follow up with them automatically. My sales have doubled."</p>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-full bg-slate-300"></div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Elena Rodriguez</h4>
                  <p className="text-xs text-slate-500">Business Coach • 250k Followers</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">Everything you need to scale.</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">CreatorDM gives you the tools to capture leads and nurture them automatically, 24/7.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mb-6">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Keyword Automations</h3>
              <p className="text-slate-600">Instantly DM users who comment specific words on your Reels or Posts. Perfect for delivering lead magnets.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Drip Campaigns</h3>
              <p className="text-slate-600">Don't stop at one message. Enroll users into multi-step sequences with custom delays to nurture your audience.</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center mb-6">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Lead Management (CRM)</h3>
              <p className="text-slate-600">Track every interaction. See who your most engaged followers are, tag them, and monitor conversion rates.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-slate-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-600 rounded-full blur-[100px] opacity-30"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-teal-500 rounded-full blur-[100px] opacity-30"></div>

        <div className="max-w-4xl mx-auto px-4 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Ready to put your DMs on autopilot?</h2>
          <p className="text-xl text-slate-300 mb-10">Join thousands of creators who are scaling their engagement and sales with CreatorDM.</p>
          <Link to="/register" className="btn-primary text-lg px-8 py-4 inline-flex items-center">
            Start Your Free Trial <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
