import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  CheckCircle, TrendingUp, Clock, Shield, Users, Star,
  ChevronRight, Upload, Phone, Mail, MapPin, Briefcase,
  ArrowRight, BadgeCheck
} from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

const PARTNER_HERO = 'https://images.unsplash.com/photo-1652776580385-d16e240a53d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900';
const WORKER_1 = 'https://images.unsplash.com/photo-1606384682764-c3065dbcaf85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=300';
const WORKER_2 = 'https://images.unsplash.com/photo-1741418570708-498ebc098b96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=300';
const WORKER_3 = 'https://images.unsplash.com/photo-1740754699699-c8b4b1635faf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=300';

const whyJoin = [
  { icon: <TrendingUp className="w-6 h-6" />, title: 'Earn More', desc: 'Top professionals earn ₹80,000–₹1,20,000/month with a consistent flow of bookings.', color: '#10B981', bg: '#ECFDF5' },
  { icon: <Clock className="w-6 h-6" />, title: 'Flexible Hours', desc: 'Work on your own schedule. Accept bookings when you want, decline when you don\'t.', color: '#1E40AF', bg: '#EFF6FF' },
  { icon: <Users className="w-6 h-6" />, title: 'Grow Your Client Base', desc: 'Get access to thousands of verified customers in your locality looking for your skill.', color: '#7C3AED', bg: '#F5F3FF' },
  { icon: <Shield className="w-6 h-6" />, title: 'Insurance Coverage', desc: 'All Fixivo partners are covered under our professional indemnity insurance plan.', color: '#F97316', bg: '#FFF7ED' },
  { icon: <Star className="w-6 h-6" />, title: 'Build Your Reputation', desc: 'Earn reviews, badges, and rankings. Top partners get featured on our homepage.', color: '#D97706', bg: '#FFFBEB' },
  { icon: <BadgeCheck className="w-6 h-6" />, title: 'Verified Badge', desc: 'Become a Fixivo-verified professional and gain immediate customer trust.', color: '#0891B2', bg: '#ECFEFF' },
];

const steps = [
  { step: '01', title: 'Fill Application Form', desc: 'Complete the online registration form with your professional details.', color: '#1E40AF' },
  { step: '02', title: 'Upload Documents', desc: 'Submit your ID proof, skill certificate, and professional photos.', color: '#7C3AED' },
  { step: '03', title: 'Skill Verification', desc: 'Our team will verify your skills through a brief test or video call.', color: '#0891B2' },
  { step: '04', title: 'Profile Goes Live', desc: 'After approval, your profile is published and you start getting bookings!', color: '#10B981' },
];

const earnings = [
  { profession: 'Plumber', min: '₹40K', max: '₹90K', color: '#1E40AF' },
  { profession: 'Electrician', min: '₹45K', max: '₹1.1L', color: '#D97706' },
  { profession: 'AC Technician', min: '₹50K', max: '₹1.2L', color: '#0891B2' },
  { profession: 'Home Cleaner', min: '₹30K', max: '₹70K', color: '#10B981' },
  { profession: 'Carpenter', min: '₹45K', max: '₹1.0L', color: '#7C3AED' },
  { profession: 'Painter', min: '₹35K', max: '₹80K', color: '#F97316' },
];

const testimonials = [
  { name: 'Rajesh Kumar', profession: 'Plumber', earnings: '₹92,000/month', image: WORKER_1, text: 'Fixivo changed my life. Before, I struggled to find consistent work. Now I earn more than double with a steady stream of bookings.' },
  { name: 'Suresh Rathore', profession: 'Electrician', earnings: '₹1.1L/month', image: WORKER_2, text: 'Best decision I made was to join Fixivo. The platform is easy to use, customers are genuine, and payments are always on time.' },
  { name: 'Vinod Patil', profession: 'Carpenter', earnings: '₹85,000/month', image: WORKER_3, text: 'I was skeptical at first, but Fixivo really delivers. I get 8-12 bookings per week and have built a great reputation on the platform.' },
];

const documents = [
  { name: 'Government Photo ID', desc: 'Aadhaar Card, PAN Card, or Voter ID', required: true },
  { name: 'Address Proof', desc: 'Utility bill, Aadhaar, or Bank Statement', required: true },
  { name: 'Skill Certificate', desc: 'ITI certificate, trade license, or equivalent', required: false },
  { name: 'Professional Photo', desc: 'Recent clear passport-size photo in uniform', required: true },
  { name: 'Bank Details', desc: 'Cancelled cheque or passbook for payment', required: true },
  { name: 'Police Clearance', desc: 'Background verification certificate', required: false },
];

export function BecomePartnerPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '', phone: '', email: '', password: '', city: '', profession: '', experience: '', about: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!formData.name || !formData.email || !formData.password || !formData.phone || !formData.profession || !formData.city) {
        throw new Error('Please fill in all required fields');
      }

      const response = await fetch(`${API_BASE_URL}/auth/provider/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          phone: formData.phone,
          serviceType: formData.profession,
          location: formData.city,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Registration failed');

      // Store user and provider data
      localStorage.setItem('user', JSON.stringify(data.user));
      if (data.provider) {
        localStorage.setItem('provider', JSON.stringify(data.provider));
      }

      setSubmitted(true);
    } catch (err: any) {
      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F9FAFB]" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Hero */}
      <section className="relative bg-gradient-to-r from-[#1E3A8A] to-[#1D4ED8] overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src={PARTNER_HERO}
            alt="Partner with Fixivo"
            className="w-full h-full object-cover opacity-20"
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur px-4 py-2 rounded-full border border-white/20 mb-6">
              <span className="w-2 h-2 bg-[#F97316] rounded-full"></span>
              <span className="text-white text-sm" style={{ fontWeight: 500 }}>Now Accepting New Partners — Limited Slots!</span>
            </div>
            <h1
              className="text-4xl lg:text-5xl xl:text-6xl text-white mb-6"
              style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800 }}
            >
              Grow Your Income with <span className="text-[#F97316]">Fixivo</span>
            </h1>
            <p className="text-xl text-blue-100 mb-10 leading-relaxed max-w-2xl">
              Join 2,400+ skilled professionals earning ₹40K–₹1.2L per month.
              More bookings. Flexible hours. Guaranteed payments. Zero hassle.
            </p>
            <div className="flex flex-wrap gap-4">
              <a
                href="#apply"
                className="inline-flex items-center gap-2 bg-[#F97316] text-white px-8 py-4 rounded-2xl hover:bg-orange-600 transition-colors shadow-lg text-lg"
                style={{ fontWeight: 700 }}
              >
                Apply Now — It's Free <ArrowRight className="w-5 h-5" />
              </a>
              <div className="flex items-center gap-4 text-white/80 text-sm">
                {['No joining fee', 'Earn from day 1', '24/7 support'].map(p => (
                  <div key={p} className="flex items-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-[#10B981]" />
                    <span>{p}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            {[
              { value: '2,400+', label: 'Active Partners', color: '#1E40AF' },
              { value: '₹80K', label: 'Avg Monthly Earnings', color: '#10B981' },
              { value: '50,000+', label: 'Jobs Completed', color: '#F97316' },
              { value: '4.8★', label: 'Avg Partner Rating', color: '#D97706' },
            ].map(stat => (
              <div key={stat.label}>
                <div className="text-2xl mb-1" style={{ fontWeight: 800, color: stat.color }}>{stat.value}</div>
                <div className="text-gray-500 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Why Join */}
      <section className="py-16 lg:py-20 bg-[#F9FAFB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[#F97316] text-sm uppercase tracking-wider" style={{ fontWeight: 700 }}>BENEFITS</span>
            <h2 className="text-3xl lg:text-4xl text-gray-900 mt-2 mb-4" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}>
              Why Join Fixivo?
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Everything you need to grow your professional services business in India.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyJoin.map(item => (
              <div key={item.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 group">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform" style={{ backgroundColor: item.bg, color: item.color }}>
                  {item.icon}
                </div>
                <h3 className="text-gray-900 text-base mb-2" style={{ fontWeight: 700 }}>{item.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Earnings Potential */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[#F97316] text-sm uppercase tracking-wider" style={{ fontWeight: 700 }}>EARNINGS</span>
            <h2 className="text-3xl lg:text-4xl text-gray-900 mt-2 mb-4" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}>
              Earnings Potential
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              See how much professionals like you earn every month on Fixivo.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {earnings.map(item => (
              <div key={item.profession} className="bg-[#F9FAFB] rounded-2xl p-5 border border-gray-100 hover:border-gray-200 transition-colors">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-gray-900" style={{ fontWeight: 700 }}>{item.profession}</h4>
                  <TrendingUp className="w-5 h-5" style={{ color: item.color }} />
                </div>
                <div className="flex items-end gap-2">
                  <span className="text-2xl" style={{ fontWeight: 800, color: item.color }}>{item.max}</span>
                  <span className="text-gray-400 text-sm mb-0.5">/month</span>
                </div>
                <div className="text-gray-500 text-xs mt-1">Starting from {item.min}/month</div>
                <div className="mt-3 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: '75%', backgroundColor: item.color }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-[#F9FAFB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[#F97316] text-sm uppercase tracking-wider" style={{ fontWeight: 700 }}>PROCESS</span>
            <h2 className="text-3xl lg:text-4xl text-gray-900 mt-2 mb-4" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}>
              How It Works
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
            <div className="hidden lg:block absolute top-10 left-[12.5%] right-[12.5%] h-0.5 bg-gray-200 z-0"></div>
            {steps.map((step, index) => (
              <div key={step.step} className="relative z-10 flex flex-col items-center text-center">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-4 shadow-md" style={{ backgroundColor: step.color }}>
                  <span className="text-2xl text-white" style={{ fontWeight: 800 }}>{step.step}</span>
                </div>
                <h3 className="text-gray-900 text-sm mb-2" style={{ fontWeight: 700 }}>{step.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{step.desc}</p>
                {index < steps.length - 1 && (
                  <ChevronRight className="w-5 h-5 text-gray-300 hidden lg:block absolute -right-3 top-7" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Testimonials */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[#F97316] text-sm uppercase tracking-wider" style={{ fontWeight: 700 }}>SUCCESS STORIES</span>
            <h2 className="text-3xl lg:text-4xl text-gray-900 mt-2 mb-4" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}>
              Our Partners Love Fixivo
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {testimonials.map(t => (
              <div key={t.name} className="bg-[#F9FAFB] rounded-2xl p-6 border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <ImageWithFallback
                    src={t.image}
                    alt={t.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-gray-900 text-sm" style={{ fontWeight: 700 }}>{t.name}</div>
                    <div className="text-gray-500 text-xs">{t.profession}</div>
                    <div className="text-[#10B981] text-xs mt-0.5" style={{ fontWeight: 600 }}>{t.earnings}</div>
                  </div>
                </div>
                <p className="text-gray-600 text-sm leading-relaxed italic">"{t.text}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Required Documents */}
      <section className="py-16 bg-[#F9FAFB]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-[#F97316] text-sm uppercase tracking-wider" style={{ fontWeight: 700 }}>DOCUMENTS</span>
            <h2 className="text-3xl text-gray-900 mt-2 mb-4" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}>
              Required Documents (KYC)
            </h2>
          </div>

          <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            {documents.map((doc, i) => (
              <div key={doc.name} className={`flex items-center gap-4 px-6 py-4 ${i < documents.length - 1 ? 'border-b border-gray-100' : ''}`}>
                <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Upload className="w-4 h-4 text-[#1E40AF]" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-900 text-sm" style={{ fontWeight: 600 }}>{doc.name}</span>
                    {doc.required && (
                      <span className="bg-red-50 text-red-500 text-xs px-1.5 py-0.5 rounded" style={{ fontWeight: 600 }}>Required</span>
                    )}
                    {!doc.required && (
                      <span className="bg-gray-50 text-gray-400 text-xs px-1.5 py-0.5 rounded" style={{ fontWeight: 500 }}>Optional</span>
                    )}
                  </div>
                  <span className="text-gray-500 text-xs">{doc.desc}</span>
                </div>
                <CheckCircle className="w-5 h-5 text-gray-200" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="apply" className="py-16 lg:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <span className="text-[#F97316] text-sm uppercase tracking-wider" style={{ fontWeight: 700 }}>APPLY NOW</span>
            <h2 className="text-3xl lg:text-4xl text-gray-900 mt-2 mb-4" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}>
              Start Your Application
            </h2>
            <p className="text-gray-500">
              Fill out this quick form and our team will contact you within 24 hours.
            </p>
          </div>

          {submitted ? (
            <div className="bg-[#ECFDF5] rounded-3xl p-12 text-center border border-[#10B981]/20">
              <div className="w-20 h-20 bg-[#10B981] rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl text-gray-900 mb-3" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}>
                Application Submitted!
              </h3>
              <p className="text-gray-600 mb-6">
                Thank you for applying to join Fixivo. Our onboarding team will review your application and
                contact you within 24 business hours.
              </p>
              <button
                onClick={() => navigate('/')}
                className="px-8 py-3 bg-[#1E40AF] text-white rounded-2xl hover:bg-blue-900 transition-colors"
                style={{ fontWeight: 600 }}
              >
                Back to Home
              </button>
            </div>
          ) : (
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-gray-700 text-xs mb-1.5" style={{ fontWeight: 600 }}>Full Name *</label>
                    <div className="relative">
                      <input
                        type="text"
                        required
                        placeholder="Your full name"
                        value={formData.name}
                        onChange={e => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-700 outline-none focus:border-[#1E40AF] focus:bg-white transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-700 text-xs mb-1.5" style={{ fontWeight: 600 }}>Phone Number *</label>
                    <div className="relative">
                      <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="tel"
                        required
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={e => setFormData({ ...formData, phone: e.target.value })}
                        className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-700 outline-none focus:border-[#1E40AF] focus:bg-white transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-700 text-xs mb-1.5" style={{ fontWeight: 600 }}>Email Address *</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="email"
                        required
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={e => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-700 outline-none focus:border-[#1E40AF] focus:bg-white transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-700 text-xs mb-1.5" style={{ fontWeight: 600 }}>Password *</label>
                    <div className="relative">
                      <input
                        type="password"
                        required
                        placeholder="Create a password"
                        value={formData.password}
                        onChange={e => setFormData({ ...formData, password: e.target.value })}
                        className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-700 outline-none focus:border-[#1E40AF] focus:bg-white transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-700 text-xs mb-1.5" style={{ fontWeight: 600 }}>City / Location *</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        required
                        placeholder="e.g., Mumbai, Pune"
                        value={formData.city}
                        onChange={e => setFormData({ ...formData, city: e.target.value })}
                        className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-700 outline-none focus:border-[#1E40AF] focus:bg-white transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-700 text-xs mb-1.5" style={{ fontWeight: 600 }}>Profession / Skill *</label>
                    <div className="relative">
                      <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 z-10" />
                      <select
                        required
                        value={formData.profession}
                        onChange={e => setFormData({ ...formData, profession: e.target.value })}
                        className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-700 outline-none focus:border-[#1E40AF] focus:bg-white transition-all appearance-none"
                      >
                        <option value="">Select your profession</option>
                        {['Plumber', 'Electrician', 'AC Technician', 'Home Cleaner', 'Painter', 'Carpenter', 'Appliance Repair Technician', 'Pest Control Expert'].map(p => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-700 text-xs mb-1.5" style={{ fontWeight: 600 }}>Years of Experience *</label>
                    <select
                      required
                      value={formData.experience}
                      onChange={e => setFormData({ ...formData, experience: e.target.value })}
                      className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-700 outline-none focus:border-[#1E40AF] focus:bg-white transition-all appearance-none"
                    >
                      <option value="">Select experience</option>
                      {['Less than 1 year', '1-2 years', '3-5 years', '5-8 years', '8-10 years', '10+ years'].map(e => (
                        <option key={e} value={e}>{e}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 text-xs mb-1.5" style={{ fontWeight: 600 }}>Tell Us About Yourself</label>
                  <textarea
                    rows={4}
                    placeholder="Briefly describe your skills, past experience, and why you want to join Fixivo..."
                    value={formData.about}
                    onChange={e => setFormData({ ...formData, about: e.target.value })}
                    className="w-full px-4 py-3.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-700 outline-none focus:border-[#1E40AF] focus:bg-white transition-all resize-none"
                  />
                </div>

                <div className="bg-[#EFF6FF] rounded-2xl p-4 flex items-start gap-3">
                  <input type="checkbox" required id="terms" className="accent-[#1E40AF] mt-1" />
                  <label htmlFor="terms" className="text-gray-600 text-xs leading-relaxed cursor-pointer">
                    I agree to the{' '}
                    <span className="text-[#1E40AF]" style={{ fontWeight: 600 }}>Terms of Service</span>{' '}
                    and{' '}
                    <span className="text-[#1E40AF]" style={{ fontWeight: 600 }}>Privacy Policy</span>{' '}
                    of Fixivo. I confirm that all information provided is accurate and I consent to a background verification check.
                  </label>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-2xl">
                    {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-[#F97316] text-white rounded-2xl hover:bg-orange-600 transition-colors shadow-md text-base disabled:opacity-60"
                  style={{ fontWeight: 700 }}
                >
                  {loading ? 'Submitting...' : 'Submit Application — It\'s Free!'} <ArrowRight className="w-5 h-5 inline ml-2" />
                </button>
              </form>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
