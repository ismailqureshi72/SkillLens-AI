import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API_BASE_URL from '../config/api';

export default function SupportPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      alert("Please fill in all fields.");
      return;
    }
    
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`${API_BASE_URL}/api/support`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, message })
      });
      
      if (!response.ok) {
        throw new Error('Failed to send support ticket. Please try again.');
      }
      
      setSubmitted(true);
      setName('');
      setEmail('');
      setMessage('');
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'An error occurred while submitting. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex-grow pt-24 pb-xl transition-colors duration-200">
      <section className="max-w-4xl mx-auto px-margin-mobile md:px-margin-desktop flex flex-col gap-lg">
        {/* Navigation Breadcrumb */}
        <div className="flex items-center gap-sm">
          <button
            onClick={() => navigate('/')}
            className="text-on-surface-variant hover:text-primary transition-colors text-body-sm flex items-center gap-xs"
          >
            <span className="material-symbols-outlined text-[16px]">arrow_back</span>
            Back to Home
          </button>
        </div>

        {/* Content & Form Layout */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-gutter items-stretch">
          {/* Help Instructions Panel */}
          <div className="md:col-span-2 bg-surface-container-low border border-outline-variant/30 rounded-xl p-lg shadow-sm flex flex-col gap-md">
            <div className="flex items-center gap-sm border-b border-outline-variant/20 pb-sm">
              <span className="material-symbols-outlined text-primary text-[28px]">contact_support</span>
              <h1 className="font-headline-sm text-headline-sm text-on-surface">Help & Support</h1>
            </div>

            <div className="font-body-sm text-body-sm text-on-surface-variant flex flex-col gap-md">
              <div>
                <h3 className="font-bold text-on-surface mb-xs">How do I analyze my CV?</h3>
                <p>Upload your PDF/DOCX resume file on the home screen, enter your target career title in the query box, and press "Start Calibrating".</p>
              </div>

              <div>
                <h3 className="font-bold text-on-surface mb-xs">Are results accurate?</h3>
                <p>Skill matches and roadmaps are calculated by local language models. We recommend cross-referencing suggestions with industry standards.</p>
              </div>

              <div>
                <h3 className="font-bold text-on-surface mb-xs">Contact Us Directly</h3>
                <p className="flex items-center gap-xs font-mono text-[13px] text-primary mt-xs">
                  <span className="material-symbols-outlined text-[16px]">mail</span>
                  mr.iq7860@gmail.com
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form Panel */}
          <div className="md:col-span-3 bg-surface-container-low border border-outline-variant/30 rounded-xl p-lg shadow-sm flex flex-col gap-md">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Submit a Support Ticket</h2>
            
            {submitted ? (
              <div 
                style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}
                className="flex-grow py-16 gap-md"
              >
                <div className="h-16 w-16 rounded-full bg-green-500/10 dark:bg-green-500/20 text-green-600 dark:text-green-400 flex items-center justify-center shadow-inner">
                  <span className="material-symbols-outlined text-[36px]">check_circle</span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-extrabold tracking-tight">
                  Ticket Sent Successfully
                </h3>
                <p 
                  style={{ width: '100%', maxWidth: '420px', margin: '0 auto', display: 'block', alignSelf: 'stretch' }}
                  className="font-body-md text-body-md text-on-surface-variant leading-relaxed"
                >
                  Thank you! Our support team has received your ticket and will respond to your email address within 24 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-md bg-primary/10 hover:bg-primary/20 text-primary font-label-md text-label-md px-lg py-md rounded-lg active:scale-95 transition-all inline-flex items-center gap-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">add_circle</span>
                  Submit Another Ticket
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-md">
                <div className="flex flex-col gap-xs">
                  <label className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="p-sm bg-surface-container-lowest border border-outline-variant/30 rounded-lg text-on-surface focus:outline-none focus:border-primary/50 text-body-sm transition-colors"
                    required
                  />
                </div>

                <div className="flex flex-col gap-xs">
                  <label className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="p-sm bg-surface-container-lowest border border-outline-variant/30 rounded-lg text-on-surface focus:outline-none focus:border-primary/50 text-body-sm transition-colors"
                    required
                  />
                </div>

                <div className="flex flex-col gap-xs">
                  <label className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider">
                    How can we help?
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    placeholder="Provide details about your query..."
                    className="p-sm bg-surface-container-lowest border border-outline-variant/30 rounded-lg text-on-surface focus:outline-none focus:border-primary/50 text-body-sm transition-colors resize-none"
                    required
                  />
                </div>

                {error && (
                  <p className="text-error font-body-sm text-body-sm bg-error/10 border border-error/20 p-sm rounded-lg">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={`py-md rounded-lg active:scale-95 transition-all text-center flex items-center justify-center gap-sm shadow-md font-label-md text-label-md ${
                    loading
                      ? 'bg-surface-container-highest text-on-surface-variant/40 cursor-not-allowed border border-outline-variant/10 shadow-none'
                      : 'bg-primary text-on-primary hover:opacity-95'
                  }`}
                >
                  <span className="material-symbols-outlined text-[18px]">
                    {loading ? 'hourglass_empty' : 'send'}
                  </span>
                  {loading ? 'Sending...' : 'Send Ticket'}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
