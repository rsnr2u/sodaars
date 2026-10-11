import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Mail,
  Clock,
  MapPin,
  ArrowRight,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  ChevronDown,
  Send,
} from 'lucide-react';
import Card from '../../../components/ui/Card';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';

export const ContactPage: React.FC = () => {
  // Contact Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [orgName, setOrgName] = useState('');
  const [phone, setPhone] = useState('');
  const [interestTopic, setInterestTopic] = useState('Provider Platform');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Accordion State
  const [expandedFaq, setExpandedFaq] = useState<string | null>('faq-1');

  const toggleFaq = (id: string) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !email.trim() || !message.trim()) return;
    setSubmitted(true);
  };

  const inquiryTypes = [
    {
      step: '01',
      title: 'Provider Onboarding',
      desc: 'For physical static outdoor media owners who want to catalog hoardings, unipoles, and gantries into SODAARS.',
    },
    {
      step: '02',
      title: 'Marketplace Syndication',
      desc: 'Questions about listing eligible assets, voluntary syndication rules, or booking marketplace inventory.',
    },
    {
      step: '03',
      title: 'Business & Partnerships',
      desc: 'Explore enterprise software customization, regional media partnerships, or operations integrations.',
    },
    {
      step: '04',
      title: 'General Inquiries',
      desc: 'Ask general questions about platform architecture, capabilities, data governance, or product roadmap.',
    },
  ];

  const contactFaqs = [
    {
      id: 'faq-1',
      q: 'Who can use the SODAARS platform?',
      a: 'SODAARS is designed specifically for physical outdoor media asset owners, concessionaires, and media operators who own or manage hoardings, unipoles, gantries, bus shelters, and other static OOH media faces.',
    },
    {
      id: 'faq-2',
      q: 'Can providers choose their Marketplace participation?',
      a: 'Yes, 100%. Marketplace participation is completely voluntary on an asset-by-asset basis. Providers maintain full autonomy over which assets are syndicated publicly and which remain private for direct clients.',
    },
    {
      id: 'faq-3',
      q: 'How fast can my advertising resources be set up?',
      a: 'Once your organization profile is verified, you can begin registering static assets immediately. Bulk cataloging tools and assisted onboarding support allow networks of 50+ assets to go live in under 48 hours.',
    },
    {
      id: 'faq-4',
      q: 'Can advertisers book directly through the Marketplace?',
      a: 'Advertisers browse verified physical inventory and submit formal date-range booking requests. The booking enters the provider’s operational pipeline for review, confirmation, commercial escrow, and campaign execution.',
    },
    {
      id: 'faq-5',
      q: 'Does contact with SODAARS require a paid licensing agreement?',
      a: 'Initial discussions, platform walkthroughs, and onboarding scoping calls are completely free of charge with zero commitment.',
    },
  ];

  return (
    <div className="w-full bg-[#FAFAF9] text-[#171717]">
      {/* ========================================================================= */}
      {/* 1. HERO SECTION                                                           */}
      {/* ========================================================================= */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 border-b border-[#E5E5E5] bg-gradient-to-b from-white via-white to-[#FAFAF9]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Copy */}
            <div className="lg:col-span-7 text-left">
              {/* Eyebrow */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-200 bg-orange-50 text-[#F97316] text-xs font-semibold uppercase tracking-wider mb-6">
                <Sparkles size={13} className="text-[#F97316]" />
                CONNECT WITH SODAARS
              </div>

              {/* Headline */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold tracking-tight text-[#171717] leading-[1.12]">
                Let's Talk About Outdoor Advertising.
              </h1>

              {/* Supporting Copy */}
              <p className="mt-6 text-base sm:text-lg text-[#525252] leading-relaxed font-normal max-w-2xl">
                Whether you're an outdoor advertising media provider, an agency media planner, or an enterprise campaign buyer, connect with the SODAARS team to discuss your operational footprint and static inventory requirements.
              </p>

              {/* CTAs */}
              <div className="mt-8 flex flex-col sm:flex-row items-center gap-3 sm:gap-4">
                <a href="#inquiry-form" className="w-full sm:w-auto">
                  <Button size="lg" className="w-full sm:w-auto" rightIcon={<ArrowRight size={16} />}>
                    Start a Discussion →
                  </Button>
                </a>
                <Link to="/solutions" className="w-full sm:w-auto">
                  <Button variant="secondary" size="lg" className="w-full sm:w-auto" rightIcon={<ExternalLink size={14} />}>
                    Explore Solutions ↗
                  </Button>
                </Link>
              </div>

              <div className="mt-8 pt-6 border-t border-[#E5E5E5]/70 flex flex-wrap items-center gap-4 text-xs text-[#525252]">
                <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-emerald-600" /> Enterprise Ready Architecture</span>
                <span>·</span>
                <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-emerald-600" /> Dedicated Team Response &lt; 24h</span>
              </div>
            </div>

            {/* Right Desk Status Card */}
            <div className="lg:col-span-5">
              <Card className="p-6 bg-white border-[#E5E5E5] shadow-lg">
                <div className="pb-3 border-b border-[#E5E5E5] mb-4 flex items-center justify-between">
                  <span className="text-xs font-mono font-bold uppercase text-[#737373]">
                    COMMUNICATION DESK
                  </span>
                  <Badge variant="active" size="sm">ACTIVE CHANNEL</Badge>
                </div>

                <div className="space-y-3.5">
                  <div className="p-3.5 rounded-lg bg-[#FAFAF9] border border-[#E5E5E5]">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#171717]">Operations &amp; Support Desk</span>
                      <span className="text-[11px] font-semibold text-emerald-700">Online</span>
                    </div>
                    <div className="text-xs text-[#525252] mt-1 flex items-center gap-1.5">
                      <Mail size={13} className="text-[#F97316]" /> support@sodaars.com
                    </div>
                    <div className="text-[10px] text-[#737373] mt-1">Average response time: under 4 business hours</div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-[#FAFAF9] border border-[#E5E5E5]">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-[#171717]">Partnership &amp; Onboarding</span>
                      <span className="text-[11px] font-semibold text-emerald-700">Online</span>
                    </div>
                    <div className="text-xs text-[#525252] mt-1 flex items-center gap-1.5">
                      <Mail size={13} className="text-[#F97316]" /> partners@sodaars.com
                    </div>
                    <div className="text-[10px] text-[#737373] mt-1">Dedicated onboarding specialists for media networks</div>
                  </div>

                  <div className="p-3.5 rounded-lg bg-[#FAFAF9] border border-[#E5E5E5]">
                    <div className="text-xs font-bold text-[#171717]">Desk Hours</div>
                    <div className="text-xs text-[#525252] mt-0.5 flex items-center gap-1.5">
                      <Clock size={13} className="text-[#F97316]" /> Monday – Saturday · 9:30 AM – 6:30 PM IST
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. CHOOSE THE CONVERSATION THAT FITS YOUR NEED                             */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 border-b border-[#E5E5E5] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
              SELECT AN INQUIRY TYPE
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-[#171717]">
              Choose the Conversation That Fits Your Need.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#525252] leading-relaxed">
              We connect your request directly to the appropriate operations, onboarding, or technical desk.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {inquiryTypes.map((inq) => (
              <Card key={inq.step} className="p-6 bg-[#FAFAF9] border-[#E5E5E5] shadow-xs flex flex-col justify-between">
                <div>
                  <div className="w-8 h-8 rounded bg-orange-50 border border-orange-200 text-[#F97316] font-bold text-xs flex items-center justify-center mb-3">
                    {inq.step}
                  </div>
                  <h3 className="font-bold text-base text-[#171717]">{inq.title}</h3>
                  <p className="mt-2 text-xs text-[#525252] leading-relaxed">{inq.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-[#E5E5E5] text-[11px] font-semibold text-[#F97316]">
                  Select Topic Below ↓
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. DIRECT INQUIRY FORM                                                    */}
      {/* ========================================================================= */}
      <section id="inquiry-form" className="py-16 md:py-24 border-b border-[#E5E5E5] bg-[#FAFAF9]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
              DIRECT INQUIRY FORM
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-[#171717]">
              Tell Us What You're Looking For.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#525252] leading-relaxed">
              Submit your inquiry and our operations team will respond with specific platform documentation or schedule an introductory walkthrough.
            </p>
          </div>

          <Card className="p-6 sm:p-10 bg-white border-[#E5E5E5] shadow-md">
            {submitted ? (
              <div className="p-8 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 size={28} />
                </div>
                <h3 className="text-xl font-bold text-[#171717]">Inquiry Submitted Successfully</h3>
                <p className="text-xs sm:text-sm text-[#525252] max-w-md mx-auto leading-relaxed">
                  Thank you, <strong>{fullName}</strong>. Your inquiry has been routed to our operations desk. A SODAARS specialist will contact you at <strong>{email}</strong> within 24 business hours.
                </p>
                <div className="pt-4">
                  <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
                    Send Another Message
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#171717] mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kulkarni"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded border border-[#E5E5E5] focus:outline-none focus:border-[#F97316] bg-white text-[#171717]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#171717] mb-1">
                      Work Email *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="name@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded border border-[#E5E5E5] focus:outline-none focus:border-[#F97316] bg-white text-[#171717]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-[#171717] mb-1">
                      Company / Organization Name
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Apex Media Networks"
                      value={orgName}
                      onChange={(e) => setOrgName(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded border border-[#E5E5E5] focus:outline-none focus:border-[#F97316] bg-white text-[#171717]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#171717] mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 98XXX XXXXX"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded border border-[#E5E5E5] focus:outline-none focus:border-[#F97316] bg-white text-[#171717]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#171717] mb-2">
                    I am interested in:
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {['Provider Platform', 'Marketplace', 'Advertising Resources', 'Enterprise / Partner', 'General Inquiry'].map((topic) => (
                      <button
                        key={topic}
                        type="button"
                        onClick={() => setInterestTopic(topic)}
                        className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                          interestTopic === topic
                            ? 'bg-[#F97316] text-white border-[#F97316]'
                            : 'bg-[#FAFAF9] text-[#525252] border-[#E5E5E5] hover:bg-stone-100'
                        }`}
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#171717] mb-1">
                    Message / Operational Footprint *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Describe your media inventory footprint, inquiry details, or campaign objectives..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3 py-2 text-xs rounded border border-[#E5E5E5] focus:outline-none focus:border-[#F97316] bg-white text-[#171717]"
                  ></textarea>
                </div>

                <div>
                  <Button type="submit" size="lg" className="w-full" rightIcon={<Send size={15} />}>
                    Send Inquiry →
                  </Button>
                </div>

                <div className="text-[11px] text-[#737373] text-center">
                  By submitting this form, you agree to receive communications from SODAARS regarding your operational inquiry.
                </div>
              </form>
            )}
          </Card>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4. CHOOSE HOW YOU'D LIKE TO CONNECT                                       */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 border-b border-[#E5E5E5] bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
              DIRECT CHANNELS
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-[#171717]">
              Choose How You'd Like to Connect.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#525252] leading-relaxed">
              Direct communication desks staffed by outdoor media technology specialists.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-6 bg-[#FAFAF9] border-[#E5E5E5] shadow-xs">
              <div className="w-8 h-8 rounded bg-orange-50 border border-orange-200 text-[#F97316] flex items-center justify-center mb-3">
                <Mail size={16} />
              </div>
              <h3 className="font-bold text-base text-[#171717]">Electronic Correspondence</h3>
              <p className="mt-2 text-xs text-[#525252] leading-relaxed">
                General &amp; Technical Support: <strong className="text-[#171717]">support@sodaars.com</strong><br />
                Partnership &amp; Onboarding: <strong className="text-[#171717]">partners@sodaars.com</strong>
              </p>
            </Card>

            <Card className="p-6 bg-[#FAFAF9] border-[#E5E5E5] shadow-xs">
              <div className="w-8 h-8 rounded bg-orange-50 border border-orange-200 text-[#F97316] flex items-center justify-center mb-3">
                <Clock size={16} />
              </div>
              <h3 className="font-bold text-base text-[#171717]">Direct Desk Coordination</h3>
              <p className="mt-2 text-xs text-[#525252] leading-relaxed">
                Operational Support Hours:<br />
                Monday – Saturday: 9:30 AM – 6:30 PM IST<br />
                Sunday: Emergency On-Call Monitoring
              </p>
            </Card>

            <Card className="p-6 bg-[#FAFAF9] border-[#E5E5E5] shadow-xs">
              <div className="w-8 h-8 rounded bg-orange-50 border border-orange-200 text-[#F97316] flex items-center justify-center mb-3">
                <MapPin size={16} />
              </div>
              <h3 className="font-bold text-base text-[#171717]">Operating Network</h3>
              <p className="mt-2 text-xs text-[#525252] leading-relaxed">
                Pan-India Outdoor Media Infrastructure Platform.<br />
                Headquarters &amp; Engineering Operations: Mumbai, Maharashtra, India.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 5. COMMON QUESTIONS BEFORE YOU REACH OUT (ACCORDION)                      */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-24 border-b border-[#E5E5E5] bg-[#FAFAF9]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#F97316]">
              COMMON QUESTIONS
            </span>
            <h2 className="mt-2 text-2xl sm:text-4xl font-bold tracking-tight text-[#171717]">
              Before You Reach Out.
            </h2>
            <p className="mt-3 text-sm sm:text-base text-[#525252] leading-relaxed">
              Answers to common questions regarding onboarding, platform scoping, and support channels.
            </p>
          </div>

          <div className="space-y-3">
            {contactFaqs.map((faq) => {
              const isOpen = expandedFaq === faq.id;
              return (
                <div key={faq.id} className="border border-[#E5E5E5] rounded-lg bg-white overflow-hidden">
                  <button
                    onClick={() => toggleFaq(faq.id)}
                    className="w-full p-4 sm:p-5 flex items-center justify-between text-left text-sm sm:text-base font-bold text-[#171717] hover:bg-stone-50 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      size={18}
                      className={`text-[#737373] shrink-0 ml-3 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#F97316]' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-5 sm:px-5 sm:pb-6 text-xs sm:text-sm text-[#525252] leading-relaxed border-t border-[#E5E5E5]/60 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 6. BOTTOM CTA                                                             */}
      {/* ========================================================================= */}
      <section className="py-16 md:py-20 bg-[#171717] border-t border-[#262626] text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-orange-500/30 bg-orange-500/10 text-[#F97316] text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles size={13} />
            LET'S CONNECT
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold tracking-tight text-white">
            Have an Outdoor Advertising Requirement?
          </h2>
          <p className="mt-4 text-sm sm:text-base text-[#A3A3A3] max-w-2xl mx-auto leading-relaxed">
            Start a conversation with the SODAARS team and explore how the dedicated media platform fits your operational goals.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
            <a href="#inquiry-form" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto" rightIcon={<ArrowRight size={16} />}>
                Contact Team →
              </Button>
            </a>
            <Link to="/marketplace" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto" rightIcon={<ExternalLink size={14} />}>
                Explore Marketplace ↗
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
