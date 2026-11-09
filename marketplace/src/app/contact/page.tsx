'use client';

import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send, 
  CheckCircle2, 
  Clock, 
  ShieldCheck,
  MessageSquare
} from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    city: 'Mumbai',
    budget: '₹1L - ₹5L',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        city: 'Mumbai',
        budget: '₹1L - ₹5L',
        message: '',
      });
    }, 4000);
  };

  return (
    <div className="bg-[#fafafc] min-h-screen py-12 sm:py-16 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-wider text-[#B00020] bg-rose-50 px-3 py-1 rounded-full border border-rose-100">
            Get in Touch
          </span>
          <h1 className="text-3xl sm:text-4xl font-semibold text-zinc-900 tracking-tight">
            Contact Book Hoardings
          </h1>
          <p className="text-xs sm:text-sm text-zinc-600">
            Have questions about billboard availability, campaign planning, or custom regional packages? Our outdoor advertising specialists are ready to help.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Direct Contact Info */}
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-3xl border border-zinc-200/80 shadow-xs space-y-4">
              <h3 className="text-sm font-semibold text-zinc-900">Media Planning Desk</h3>
              
              <div className="space-y-3 text-xs">
                <div className="flex items-start gap-3 text-zinc-600">
                  <Phone className="w-4 h-4 text-[#B00020] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-zinc-900 block">+91 98201 44521</span>
                    <span className="text-[11px] text-zinc-400">Mon - Sat: 9:30 AM to 7:00 PM IST</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-zinc-600">
                  <Mail className="w-4 h-4 text-[#B00020] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-zinc-900 block">campaigns@bookhoardings.com</span>
                    <span className="text-[11px] text-zinc-400">Response within 2 hours</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-zinc-600">
                  <Clock className="w-4 h-4 text-[#B00020] shrink-0 mt-0.5" />
                  <div>
                    <span className="font-semibold text-zinc-900 block">Escrow & Verification Desk</span>
                    <span className="text-[11px] text-zinc-400">support@bookhoardings.com</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Regional Hubs */}
            <div className="bg-white p-6 rounded-3xl border border-zinc-200/80 shadow-xs space-y-3">
              <h3 className="text-sm font-semibold text-zinc-900">Regional Offices</h3>
              
              <div className="space-y-3 text-xs text-zinc-600">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-zinc-900 block font-semibold">Mumbai (HQ)</strong>
                    <span>Level 5, BKC One, Bandra Kurla Complex, Mumbai 400051</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-zinc-900 block font-semibold">Bengaluru</strong>
                    <span>100ft Road, HAL 2nd Stage, Indiranagar, Bengaluru 560038</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-zinc-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-zinc-900 block font-semibold">Delhi NCR</strong>
                    <span>Barakhamba Road, Connaught Place, New Delhi 110001</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Inquiry Form */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-zinc-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-base sm:text-lg font-semibold text-zinc-900">
                    Send Campaign Request
                  </h2>
                  <p className="text-xs text-zinc-500 mt-0.5">
                    Fill out your advertising requirements and our media desk will send curated location proposals.
                  </p>
                </div>
                <MessageSquare className="w-5 h-5 text-[#B00020]" />
              </div>

              {submitted ? (
                <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <h3 className="text-sm font-semibold text-emerald-900">Campaign Inquiry Received!</h3>
                  <p className="text-xs text-emerald-700 max-w-sm mx-auto">
                    Thank you! Our outdoor media specialist will call you back within 2 hours with availability and rates.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-700">Full Name *</label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Rahul Sharma"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs font-medium text-zinc-900 focus:outline-none focus:border-[#B00020] bg-zinc-50/50"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-700">Work Email *</label>
                      <input
                        type="email"
                        required
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        placeholder="rahul@company.com"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs font-medium text-zinc-900 focus:outline-none focus:border-[#B00020] bg-zinc-50/50"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-700">Mobile Number *</label>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        placeholder="+91 98200 XXXXX"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs font-medium text-zinc-900 focus:outline-none focus:border-[#B00020] bg-zinc-50/50"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-zinc-700">Target Metro *</label>
                      <select
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs font-medium text-zinc-900 focus:outline-none focus:border-[#B00020] bg-zinc-50/50"
                      >
                        <option value="Mumbai">Mumbai</option>
                        <option value="Bengaluru">Bengaluru</option>
                        <option value="Delhi NCR">Delhi NCR</option>
                        <option value="Hyderabad">Hyderabad</option>
                        <option value="Pune">Pune</option>
                        <option value="Chennai">Chennai</option>
                        <option value="Pan-India Multi-City">Pan-India Multi-City</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-zinc-700">Campaign Details & Preferences</label>
                    <textarea
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Specify preferred flyovers, arterial corridors, hoarding sizes, or duration (e.g. 15 days, 30 days)..."
                      className="w-full px-3.5 py-2.5 rounded-xl border border-zinc-200 text-xs font-medium text-zinc-900 focus:outline-none focus:border-[#B00020] bg-zinc-50/50 resize-none"
                    />
                  </div>

                  <div className="pt-2 flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-[11px] text-zinc-500">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Zero spam. Direct response from verified media managers.</span>
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-2.5 rounded-full bg-[#B00020] hover:bg-[#8f0019] text-white text-xs font-semibold transition-all cursor-pointer shadow-xs active:scale-95 flex items-center gap-2"
                    >
                      <span>Send Request</span>
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

