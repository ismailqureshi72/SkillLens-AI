import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function SupportPage() {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) {
      alert("Please fill in all fields.");
      return;
    }
    // Simulate sending ticket
    setSubmitted(true);
    setName('');
    setEmail('');
    setMessage('');
  };

  return (
    <main className="flex-grow pt-24 pb-xl transition-colors duration-200">
      <section className="max-w-4xl mx-auto px-margin-desktop flex flex-col gap-lg">
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
                  support@skilllens.ai
                </p>
              </div>
            </div>
          </div>

          {/* Contact Form Panel */}
          <div className="md:col-span-3 bg-surface-container-low border border-outline-variant/30 rounded-xl p-lg shadow-sm flex flex-col gap-md">
            <h2 className="font-headline-sm text-headline-sm text-on-surface">Submit a Support Ticket</h2>
            
            {submitted ? (
              <div className="p-md bg-green-500/5 border border-green-500/20 rounded-lg text-on-surface flex flex-col items-center gap-sm text-center py-xl">
                <span className="material-symbols-outlined text-green-600 text-[40px]">check_circle</span>
                <h3 className="font-bold text-headline-sm text-on-surface">Ticket Received</h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant max-w-xs">
                  Thank you! Our support crew has received your ticket and will respond within 24 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="mt-sm text-primary font-label-md text-label-md hover:underline"
                >
                  Submit another message
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

                <button
                  type="submit"
                  className="bg-primary text-on-primary font-label-md text-label-md py-md rounded-lg active:scale-95 transition-all text-center hover:opacity-95 shadow-md flex items-center justify-center gap-sm"
                >
                  <span className="material-symbols-outlined text-[18px]">send</span>
                  Send Ticket
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
