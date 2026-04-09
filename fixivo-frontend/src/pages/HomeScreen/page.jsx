import { useState } from 'react';
import { useNavigate } from 'react-router';
import {
  Search, MapPin, ChevronDown, ArrowRight, Star, CheckCircle,
  Shield, Zap, Users, CreditCard, ThumbsUp,
  Droplets, Lightbulb, Wind, SprayCan, PaintBucket, Wrench, Tv, ChevronUp, Quote,
} from 'lucide-react';
import { CategoryCard } from '../../components/CategoryCard';
import { ImageWithFallback } from '../../components/error/error';
import { WorkerCard } from '../../components/WorkerCard';
import { RatingStars } from '../../components/RatingStars';
import * as Accordion from '@radix-ui/react-accordion';

const HERO_IMG = 'https://images.unsplash.com/photo-1770657986086-c1f20eef30ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800';
const PARTNER_IMG = 'https://images.unsplash.com/photo-1652776580385-d16e240a53d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800';

const WORKER_1 = 'https://images.unsplash.com/photo-1606384682764-c3065dbcaf85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400';
const WORKER_2 = 'https://images.unsplash.com/photo-1741418570708-498ebc098b96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400';
const WORKER_3 = 'https://images.unsplash.com/photo-1581578949510-fa7315c4c350?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400';
const WORKER_4 = 'https://images.unsplash.com/photo-1740754699699-c8b4b1635faf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400';
const CUSTOMER_1 = 'https://images.unsplash.com/photo-1657414372770-3f83046b85f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200';
const CUSTOMER_2 = 'https://images.unsplash.com/photo-1664101606938-e664f5852fac?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200';
const CUSTOMER_3 = 'https://images.unsplash.com/photo-1662302392561-b1deecd3579d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200';
const CUSTOMER_4 = 'https://images.unsplash.com/photo-1672075270227-ddf5cb181a79?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200';

const categories = [
  { icon: <Droplets className="w-6 h-6" />, title: 'Plumbing', description: 'Pipe repairs, drain cleaning, tap fixing & water heater installation.', count: '240+', color: '#1E40AF', bgColor: '#EFF6FF', slug: 'plumbing' },
  { icon: <Lightbulb className="w-6 h-6" />, title: 'Electrical', description: 'Wiring, switchboard, fan & light fitting by certified electricians.', count: '185+', color: '#D97706', bgColor: '#FFFBEB', slug: 'electrical' },
  { icon: <Wind className="w-6 h-6" />, title: 'AC Repair', description: 'AC servicing, gas refill, installation & deep cleaning.', count: '120+', color: '#0891B2', bgColor: '#ECFEFF', slug: 'ac-repair' },
  { icon: <SprayCan className="w-6 h-6" />, title: 'Cleaning', description: 'Deep home cleaning, sofa cleaning, bathroom & kitchen sanitization.', count: '310+', color: '#10B981', bgColor: '#ECFDF5', slug: 'cleaning' },
  { icon: <PaintBucket className="w-6 h-6" />, title: 'Painting', description: 'Interior & exterior painting with premium quality paint & finish.', count: '95+', color: '#7C3AED', bgColor: '#F5F3FF', slug: 'painting' },
  { icon: <Wrench className="w-6 h-6" />, title: 'Carpentry', description: 'Furniture assembly, door repair, custom woodwork & more.', count: '140+', color: '#B45309', bgColor: '#FFF7ED', slug: 'carpentry' },
  { icon: <Tv className="w-6 h-6" />, title: 'Appliance Repair', description: 'Washing machine, refrigerator, microwave & TV repair.', count: '200+', color: '#BE185D', bgColor: '#FDF2F8', slug: 'appliance-repair' },
  { icon: <Shield className="w-6 h-6" />, title: 'Pest Control', description: 'Cockroach, rat, termite & bed bug treatment by experts.', count: '75+', color: '#DC2626', bgColor: '#FEF2F2', slug: 'pest-control' },
];

const featuredWorkers = [
  { id: '1', name: 'Rajesh Kumar', profession: 'Master Plumber', rating: 4.8, reviews: 127, experience: '8 yrs', price: '₹299', location: 'Andheri, Mumbai', image: WORKER_1, verified: true, availability: 'Available Today' },
  { id: '2', name: 'Suresh Rathore', profession: 'Senior Electrician', rating: 4.9, reviews: 203, experience: '11 yrs', price: '₹349', location: 'Powai, Mumbai', image: WORKER_2, verified: true, availability: 'Available Today' },
  { id: '3', name: 'Priya Sharma', profession: 'Home Cleaning Expert', rating: 4.7, reviews: 89, experience: '5 yrs', price: '₹249', location: 'Bandra, Mumbai', image: WORKER_3, verified: true, availability: 'Available Tomorrow' },
  { id: '4', name: 'Vinod Patil', profession: 'Master Carpenter', rating: 4.8, reviews: 156, experience: '9 yrs', price: '₹399', location: 'Thane, Mumbai', image: WORKER_4, verified: true, availability: 'Available Today' },
];

const howItWorks = [
  { step: '01', title: 'Select Service', desc: 'Choose from 50+ home services available in your area.', icon: <Search className="w-6 h-6" />, color: '#1E40AF' },
  { step: '02', title: 'Choose Professional', desc: 'Browse verified profiles, ratings & compare prices.', icon: <Users className="w-6 h-6" />, color: '#7C3AED' },
  { step: '03', title: 'Chat & Confirm', desc: 'Discuss requirements, confirm charges before booking.', icon: <ThumbsUp className="w-6 h-6" />, color: '#0891B2' },
  { step: '04', title: 'Work Completed', desc: 'Professional arrives on time and completes the job.', icon: <CheckCircle className="w-6 h-6" />, color: '#10B981' },
  { step: '05', title: 'Pay & Rate', desc: 'Pay securely after satisfaction. Rate your experience.', icon: <CreditCard className="w-6 h-6" />, color: '#F97316' },
];

const whyChoose = [
  { icon: <BadgeCheckIcon />, title: 'Verified Professionals', desc: 'Every professional is background-checked & skill-verified before onboarding.', color: '#1E40AF', bg: '#EFF6FF' },
  { icon: <StarIcon />, title: 'Transparent Ratings', desc: 'Real reviews from real customers. No fake ratings, ever.', color: '#D97706', bg: '#FFFBEB' },
  { icon: <ShieldIcon />, title: 'Secure Payments', desc: 'Pay only after job completion. 100% secure payment gateway.', color: '#10B981', bg: '#ECFDF5' },
  { icon: <MapPinIcon />, title: 'Area-Based Matching', desc: 'Get professionals within 5 km of your location, always.', color: '#7C3AED', bg: '#F5F3FF' },
  { icon: <ZapIcon />, title: 'Fast Booking', desc: 'Book a professional in under 2 minutes, 24/7 availability.', color: '#F97316', bg: '#FFF7ED' },
];

const testimonials = [
  { name: 'Anita Desai', location: 'Mumbai', rating: 5, text: 'Rajesh from Fixivo fixed my bathroom leakage in just 45 minutes. Super professional and very clean work. Definitely recommending to all my friends!', image: CUSTOMER_1, service: 'Plumbing' },
  { name: 'Karan Mehta', location: 'Pune', rating: 5, text: 'Booked an AC servicing through Fixivo. The technician was on time, explained everything clearly, and the pricing was very transparent. Great experience!', image: CUSTOMER_2, service: 'AC Repair' },
  { name: 'Amit Singh', location: 'Delhi', rating: 4, text: 'Used Fixivo for home cleaning before Diwali. The team was thorough and professional. My house looks brand new. Will definitely use again!', image: CUSTOMER_3, service: 'Cleaning' },
  { name: 'Meera Nair', location: 'Bangalore', rating: 5, text: 'Got my entire home painted through Fixivo. The painter was skilled, on schedule, and the finish is absolutely beautiful. Worth every rupee!', image: CUSTOMER_4, service: 'Painting' },
];

const faqs = [
  { q: 'How do I book a service on Fixivo?', a: 'Simply search for the service you need, browse available professionals in your area, select one based on ratings and price, and click "Send Request". You can also chat with the professional before confirming.' },
  { q: 'How does payment work?', a: 'Fixivo operates on a "Pay after service" model. You only pay once the job is completed to your satisfaction. We accept UPI, debit/credit cards, net banking, and cash.' },
  { q: 'How are professionals verified on Fixivo?', a: 'Every professional undergoes a rigorous 3-step verification: Government ID verification, skill assessment test, and background police check. Only verified professionals appear on our platform.' },
  { q: 'Can I cancel or reschedule a booking?', a: 'Yes, you can cancel or reschedule up to 2 hours before the scheduled appointment with no charges. Cancellations within 2 hours may incur a small fee of ₹50.' },
  { q: 'What if I am not satisfied with the service?', a: 'Fixivo offers a 100% Satisfaction Guarantee. If you\'re not happy with the work, we\'ll send another professional free of charge or provide a full refund.' },
];

function BadgeCheckIcon() { return <CheckCircle className="w-7 h-7" />; }
function StarIcon() { return <Star className="w-7 h-7" />; }
function ShieldIcon() { return <Shield className="w-7 h-7" />; }
function MapPinIcon() { return <MapPin className="w-7 h-7" />; }
function ZapIcon() { return <Zap className="w-7 h-7" />; }

export function HomePage() {
  const navigate = useNavigate();
  const [selectedService, setSelectedService] = useState('');
  const [location, setLocation] = useState('');
  const [openFaq, setOpenFaq] = useState('');

  const handleSearch = () => {
    const slug = selectedService
      ? selectedService.toLowerCase().replace(' ', '-')
      : 'all';
    navigate(`/services/${slug}`);
  };

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* ── HERO ── */}
      <section className="bg-gradient-to-br from-[#1E3A8A] via-[#1E40AF] to-[#1D4ED8] text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur px-4 py-2 rounded-full border border-white/20">
                <span className="w-2 h-2 bg-[#10B981] rounded-full animate-pulse"></span>
                <span className="text-sm" style={{ fontWeight: 500 }}>2,400+ Verified Professionals Across India</span>
              </div>

              <h1
                className="text-4xl lg:text-5xl xl:text-6xl text-white leading-tight"
                style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800 }}
              >
                Book Trusted<br />
                <span className="text-[#F97316]">Home Services</span><br />
                Near You
              </h1>

              <p className="text-lg text-blue-100 max-w-lg leading-relaxed">
                Verified professionals for plumbing, electrical, cleaning & more.
                Fast booking, transparent pricing, guaranteed satisfaction.
              </p>

              {/* Search Bar */}
              {/* <div className="bg-white rounded-2xl p-3 shadow-2xl flex flex-col sm:flex-row gap-2">
                <div className="flex items-center gap-2 flex-1 px-3 py-2 bg-gray-50 rounded-xl">
                  <Search className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <select
                    className="w-full bg-transparent text-gray-700 text-sm outline-none"
                    style={{ fontWeight: 500 }}
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                  >
                    <option value="">Select Service</option>
                    {['Plumbing', 'Electrical', 'AC Repair', 'Cleaning', 'Painting', 'Carpentry', 'Appliance Repair', 'Pest Control'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div className="flex items-center gap-2 flex-1 px-3 py-2 bg-gray-50 rounded-xl">
                  <MapPin className="w-4 h-4 text-[#F97316] flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Enter your location"
                    className="w-full bg-transparent text-gray-700 text-sm outline-none"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
                <button
                  onClick={handleSearch}
                  className="px-6 py-3 bg-[#F97316] text-white rounded-xl hover:bg-orange-600 transition-colors whitespace-nowrap shadow-sm"
                  style={{ fontWeight: 600 }}
                >
                  Find Professionals
                </button>
              </div> */}

              {/* Stats */}
              <div className="flex items-center gap-8 pt-2">
                {[
                  { value: '50,000+', label: 'Happy Customers' },
                  { value: '2,400+', label: 'Professionals' },
                  { value: '4.8★', label: 'Avg. Rating' },
                ].map(stat => (
                  <div key={stat.label}>
                    <div className="text-2xl text-white" style={{ fontWeight: 800 }}>{stat.value}</div>
                    <div className="text-sm text-blue-200" style={{ fontWeight: 400 }}>{stat.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right */}
            <div className="relative hidden lg:block">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                <ImageWithFallback
                  src={HERO_IMG}
                  alt="Home services professional"
                  className="w-full h-[480px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#1E40AF]/40 to-transparent"></div>
              </div>
              {/* Floating cards */}
              <div className="absolute -left-8 bottom-16 bg-white rounded-2xl p-4 shadow-xl border border-gray-100 flex items-center gap-3">
                <div className="w-10 h-10 bg-[#ECFDF5] rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-[#10B981]" />
                </div>
                <div>
                  <div className="text-sm text-gray-900" style={{ fontWeight: 700 }}>Job Completed!</div>
                  <div className="text-xs text-gray-500">Plumbing • 45 mins ago</div>
                </div>
              </div>
              <div className="absolute -right-4 top-12 bg-white rounded-2xl p-4 shadow-xl border border-gray-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">
                    {[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />)}
                  </div>
                </div>
                <div className="text-xs text-gray-600" style={{ fontWeight: 500 }}>Excellent Service!</div>
                <div className="text-xs text-gray-400">by Anita D.</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── POPULAR CATEGORIES ── */}
      <section className="py-16 lg:py-20 bg-[#F9FAFB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[#F97316] text-sm uppercase tracking-wider" style={{ fontWeight: 700 }}>SERVICES</span>
            <h2
              className="text-3xl lg:text-4xl text-gray-900 mt-2 mb-4"
              style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}
            >
              Popular Categories
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              From plumbing to pest control, find the right professional for every home need.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
            {categories.map((cat) => (
              <CategoryCard key={cat.slug} {...cat} />
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section id="how-it-works" className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="text-[#F97316] text-sm uppercase tracking-wider" style={{ fontWeight: 700 }}>PROCESS</span>
            <h2
              className="text-3xl lg:text-4xl text-gray-900 mt-2 mb-4"
              style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}
            >
              How Fixivo Works
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Book a professional in 5 easy steps. Fast, transparent, reliable.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-6 relative">
            {/* Connector line (desktop only) */}
            <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-gray-100 z-0"></div>

            {howItWorks.map((step, index) => (
              <div key={step.step} className="relative z-10 flex flex-col items-center text-center group">
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-md group-hover:scale-110 transition-transform duration-300"
                  style={{ backgroundColor: step.color, color: 'white' }}
                >
                  {step.icon}
                </div>
                <div
                  className="w-7 h-7 rounded-full flex items-center justify-center text-white text-xs mb-3"
                  style={{ backgroundColor: step.color, fontWeight: 700 }}
                >
                  {step.step}
                </div>
                <h3 className="text-gray-900 text-sm mb-2" style={{ fontWeight: 700 }}>{step.title}</h3>
                <p className="text-gray-500 text-xs leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── WHY CHOOSE FIXIVO ── */}
      <section className="py-16 lg:py-20 bg-[#F9FAFB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-[#F97316] text-sm uppercase tracking-wider" style={{ fontWeight: 700 }}>WHY US</span>
              <h2
                className="text-3xl lg:text-4xl text-gray-900 mt-2 mb-4"
                style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}
              >
                Why Choose <span className="text-[#1E40AF]">Fixivo?</span>
              </h2>
              <p className="text-gray-500 mb-10 leading-relaxed">
                We're not just a platform. We're your trusted home service partner —
                built for India, designed for reliability.
              </p>
              <div className="space-y-4">
                {whyChoose.map((item) => (
                  <div
                    key={item.title}
                    className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group"
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform"
                      style={{ backgroundColor: item.bg, color: item.color }}
                    >
                      {item.icon}
                    </div>
                    <div>
                      <h4 className="text-gray-900 text-sm mb-1" style={{ fontWeight: 700 }}>{item.title}</h4>
                      <p className="text-gray-500 text-xs leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative hidden lg:block">
              <div className="relative">
                <div className="absolute -top-4 -left-4 w-full h-full bg-[#1E40AF]/10 rounded-3xl"></div>
                <div className="relative rounded-3xl overflow-hidden shadow-2xl">
                  <ImageWithFallback
                    src={PARTNER_IMG}
                    alt="Why choose Fixivo"
                    className="w-full h-[500px] object-cover"
                  />
                </div>
              </div>
              {/* Stats overlay */}
              <div className="absolute bottom-8 left-0 right-0 mx-6">
                <div className="bg-white/95 backdrop-blur rounded-2xl p-5 shadow-xl grid grid-cols-3 gap-4">
                  {[
                    { value: '99%', label: 'Satisfaction Rate' },
                    { value: '< 2 min', label: 'Booking Time' },
                    { value: '50K+', label: 'Jobs Done' },
                  ].map(stat => (
                    <div key={stat.label} className="text-center">
                      <div className="text-[#1E40AF] text-xl" style={{ fontWeight: 800 }}>{stat.value}</div>
                      <div className="text-gray-500 text-xs mt-0.5">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FEATURED PROFESSIONALS ── */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12 gap-4">
            <div>
              <span className="text-[#F97316] text-sm uppercase tracking-wider" style={{ fontWeight: 700 }}>PROFESSIONALS</span>
              <h2
                className="text-3xl lg:text-4xl text-gray-900 mt-2"
                style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}
              >
                Featured Professionals
              </h2>
            </div>
            <button
              onClick={() => navigate('/services/all')}
              className="flex items-center gap-2 text-[#1E40AF] text-sm hover:gap-3 transition-all"
              style={{ fontWeight: 600 }}
            >
              View All <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredWorkers.map((worker) => (
              <WorkerCard key={worker.id} worker={worker} />
            ))}
          </div>
        </div>
      </section>

      {/* ── BECOME A PARTNER ── */}
      <section className="py-16 bg-gradient-to-r from-[#1E40AF] to-[#1D4ED8] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <span
                className="inline-block bg-white/20 text-white text-xs uppercase tracking-wider px-3 py-1.5 rounded-full mb-6"
                style={{ fontWeight: 600 }}
              >
                FOR PROFESSIONALS
              </span>
              <h2
                className="text-3xl lg:text-4xl text-white mb-5"
                style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800 }}
              >
                Grow Your Business<br />
                with <span className="text-[#F97316]">Fixivo</span>
              </h2>
              <p className="text-blue-100 text-lg mb-8 leading-relaxed">
                Join 2,400+ professionals earning ₹40,000–₹1,20,000/month.
                Get verified, get bookings, get paid — on your own schedule.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-10">
                {[
                  { value: '₹80K', label: 'Avg Monthly Earnings' },
                  { value: '2,400+', label: 'Active Partners' },
                  { value: '0%', label: 'Commission for 1st month' },
                  { value: '24/7', label: 'Support Available' },
                ].map(stat => (
                  <div key={stat.label} className="bg-white/10 rounded-2xl p-4">
                    <div className="text-2xl text-white mb-1" style={{ fontWeight: 800 }}>{stat.value}</div>
                    <div className="text-blue-200 text-xs">{stat.label}</div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => navigate('/become-partner')}
                className="inline-flex items-center gap-2 bg-[#F97316] text-white px-8 py-4 rounded-2xl hover:bg-orange-600 transition-colors shadow-lg"
                style={{ fontWeight: 700 }}
              >
                Join as Professional <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            <div className="relative hidden lg:flex justify-end">
              <div className="relative w-full max-w-md">
                <div className="absolute inset-0 bg-white/10 rounded-3xl transform rotate-3"></div>
                <ImageWithFallback
                  src={PARTNER_IMG}
                  alt="Become a partner"
                  className="relative rounded-3xl w-full h-[400px] object-cover shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-16 lg:py-20 bg-[#F9FAFB]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[#F97316] text-sm uppercase tracking-wider" style={{ fontWeight: 700 }}>TESTIMONIALS</span>
            <h2
              className="text-3xl lg:text-4xl text-gray-900 mt-2 mb-4"
              style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}
            >
              What Our Customers Say
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Real reviews from real homeowners across India.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {testimonials.map((t) => (
              <div
                key={t.name}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow relative"
              >
                <Quote className="w-8 h-8 text-[#1E40AF]/10 absolute top-4 right-4" />
                <RatingStars rating={t.rating} size="sm" />
                <p className="text-gray-600 text-sm leading-relaxed mt-4 mb-5">{t.text}</p>
                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <ImageWithFallback
                    src={t.image}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-gray-900 text-sm" style={{ fontWeight: 700 }}>{t.name}</div>
                    <div className="text-gray-400 text-xs">{t.location} · {t.service}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-16 lg:py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="text-[#F97316] text-sm uppercase tracking-wider" style={{ fontWeight: 700 }}>FAQ</span>
            <h2
              className="text-3xl lg:text-4xl text-gray-900 mt-2 mb-4"
              style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}
            >
              Frequently Asked Questions
            </h2>
          </div>

          <Accordion.Root
            type="single"
            collapsible
            value={openFaq}
            onValueChange={setOpenFaq}
            className="space-y-3"
          >
            {faqs.map((faq, i) => (
              <Accordion.Item
                key={i}
                value={`faq-${i}`}
                className="bg-[#F9FAFB] rounded-2xl border border-gray-100 overflow-hidden"
              >
                <Accordion.Trigger className="w-full flex items-center justify-between px-6 py-5 text-left group">
                  <span className="text-gray-900 text-sm pr-4" style={{ fontWeight: 600 }}>{faq.q}</span>
                  <div className={`flex-shrink-0 w-7 h-7 rounded-full flex items-center justify-center transition-colors ${openFaq === `faq-${i}` ? 'bg-[#1E40AF] text-white' : 'bg-gray-200 text-gray-500'}`}>
                    {openFaq === `faq-${i}` ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </Accordion.Trigger>
                <Accordion.Content className="px-6 pb-5 text-gray-500 text-sm leading-relaxed data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0">
                  {faq.a}
                </Accordion.Content>
              </Accordion.Item>
            ))}
          </Accordion.Root>
        </div>
      </section>

      {/* ── MOBILE STICKY CTA ── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-white border-t border-gray-100 px-4 py-3 shadow-lg">
        <button
          onClick={() => navigate('/services/all')}
          className="w-full py-3.5 bg-[#1E40AF] text-white rounded-2xl shadow-lg"
          style={{ fontWeight: 700 }}
        >
          Book a Service Now →
        </button>
      </div>
    </div>
  );
}
