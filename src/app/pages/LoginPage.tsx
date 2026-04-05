'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Phone, Mail, Lock, ArrowLeft, Wrench, CheckCircle, Loader, MapPin } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';


const ILLUSTRATION = 'https://images.unsplash.com/photo-1587813723351-a43ed2cae4d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=900';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

type LoginType = 'customer' | 'worker';
type FormMode = 'login' | 'signup';

interface FormData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  serviceType?: string;
  location?: string;
}

export default function LoginPage() {
  const router = useRouter();
  const [loginType, setLoginType] = useState<LoginType>('customer');
  const [formMode, setFormMode] = useState<FormMode>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    password: '',
    phone: '',
    serviceType: '',
    location: '',
  });

  const isSignup = formMode === 'signup';

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Validation
      if (!formData.email || !formData.password) {
        throw new Error('Email and Password are required');
      }
      
      if (isSignup && !formData.name) {
        throw new Error('Name is required for signup');
      }

      if (isSignup && loginType === 'worker' && !formData.serviceType) {
        throw new Error('Service Type is required for professionals');
      }

      if (isSignup) {
        // Handle Signup
        const endpoint = loginType === 'customer' 
          ? `${API_BASE_URL}/auth/customer/register` 
          : `${API_BASE_URL}/auth/provider/register`;
        
        const body = loginType === 'customer'
          ? {
              name: formData.name,
              email: formData.email,
              password: formData.password,
            }
          : {
              name: formData.name,
              email: formData.email,
              password: formData.password,
              phone: formData.phone,
              serviceType: formData.serviceType,
              location: formData.location,
            };

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        });

        let data;
        try {
          data = await response.json();
        } catch (parseError) {
          const text = await response.text();
          console.error('Failed to parse response:', text);
          throw new Error(`Invalid response from server: ${text}`);
        }

        if (!response.ok) {
          const errorMsg = data.message || data.error || JSON.stringify(data) || 'Registration failed';
          throw new Error(errorMsg);
        }

        // For signup, store user data
        localStorage.setItem('user', JSON.stringify(data.user));
        if (data.provider) {
          localStorage.setItem('provider', JSON.stringify(data.provider));
        }
        
        setSuccess(`Account created successfully! Redirecting...`);
        setTimeout(() => router.push('/'), 2000);
      } else {
        // Handle Login
        const endpoint = loginType === 'customer'
          ? `${API_BASE_URL}/auth/customer/login`
          : `${API_BASE_URL}/auth/provider/login`;

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
          }),
        });

        let data;
        try {
          data = await response.json();
        } catch (parseError) {
          const text = await response.text();
          console.error('Failed to parse login response:', text);
          throw new Error(`Invalid response from server: ${text}`);
        }

        if (!response.ok) throw new Error(data.message || 'Login failed');

        // Store tokens and user data
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);
        localStorage.setItem('user', JSON.stringify(data.user));
        if (data.provider) {
          localStorage.setItem('provider', JSON.stringify(data.provider));
        }

        setSuccess('Login successful! Redirecting...');
        setTimeout(() => router.push('/'), 1500);
      }
    } catch (err: any) {      console.error('Auth error:', err);      setError(err.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Left Illustration Panel */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-[#1E40AF]">
        <ImageWithFallback
          src={ILLUSTRATION}
          alt="Fixivo services"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />
        <div className="relative z-10 flex flex-col justify-between p-12 w-full">
          {/* Logo */}
          <button onClick={() => router.push('/')} className="flex items-center gap-2">
            <div className="w-9 h-9 bg-white rounded-xl flex items-center justify-center">
              <Wrench className="w-5 h-5 text-[#1E40AF]" />
            </div>
            <span className="text-2xl text-white" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}>
              Fixivo
            </span>
          </button>

          {/* Center text */}
          <div>
            <h2
              className="text-4xl text-white mb-4"
              style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 800 }}
            >
              Your Home,<br />
              Our Expertise.
            </h2>
            <p className="text-blue-200 text-lg mb-10 leading-relaxed">
              Connect with 2,400+ verified professionals for all your home service needs.
            </p>

            {/* Trust points */}
            <div className="space-y-4">
              {[
                'Verified & background-checked professionals',
                'Book in under 2 minutes',
                'Pay only after job completion',
                '50,000+ happy customers across India',
              ].map(point => (
                <div key={point} className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-[#10B981] rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-blue-100 text-sm" style={{ fontWeight: 400 }}>{point}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom rating strip */}
          <div className="flex items-center gap-4 bg-white/15 backdrop-blur-sm rounded-2xl p-4">
            <div className="text-center">
              <div className="text-white text-xl" style={{ fontWeight: 800 }}>4.8★</div>
              <div className="text-blue-200 text-xs">App Rating</div>
            </div>
            <div className="w-px h-10 bg-white/20"></div>
            <div className="text-center">
              <div className="text-white text-xl" style={{ fontWeight: 800 }}>50K+</div>
              <div className="text-blue-200 text-xs">Happy Customers</div>
            </div>
            <div className="w-px h-10 bg-white/20"></div>
            <div className="text-center">
              <div className="text-white text-xl" style={{ fontWeight: 800 }}>99%</div>
              <div className="text-blue-200 text-xs">Satisfaction Rate</div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Form Panel */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 bg-[#F9FAFB]">
        <div className="w-full max-w-md">
          {/* Mobile back button */}
          <button
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#1E40AF] transition-colors mb-8 lg:hidden"
            style={{ fontWeight: 500 }}
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>

          {/* Mobile Logo */}
          <div className="flex items-center gap-2 mb-8 lg:hidden">
            <div className="w-8 h-8 bg-[#1E40AF] rounded-xl flex items-center justify-center">
              <Wrench className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl text-[#1E40AF]" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}>Fixivo</span>
          </div>

          {/* Role Tabs */}
          <div className="flex bg-gray-200 rounded-2xl p-1 mb-8">
            <button
              onClick={() => {
                setLoginType('customer');
                setError('');
                setSuccess('');
                setFormData({ name: '', email: '', password: '', phone: '', serviceType: '', location: '' });
              }}
              className={`flex-1 py-3 rounded-xl text-sm transition-all ${loginType === 'customer'
                ? 'bg-white text-[#1E40AF] shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
                }`}
              style={{ fontWeight: loginType === 'customer' ? 700 : 500 }}
            >
              Customer
            </button>
            <button
              onClick={() => {
                setLoginType('worker');
                setError('');
                setSuccess('');
                setFormData({ name: '', email: '', password: '', phone: '', serviceType: '', location: '' });
              }}
              className={`flex-1 py-3 rounded-xl text-sm transition-all ${loginType === 'worker'
                ? 'bg-white text-[#1E40AF] shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
                }`}
              style={{ fontWeight: loginType === 'worker' ? 700 : 500 }}
            >
              Professional
            </button>
          </div>

          <div className="mb-6">
            <h1
              className="text-2xl text-gray-900 mb-1"
              style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}
            >
              {isSignup ? 'Create Account' : 'Welcome Back!'}
            </h1>
            <p className="text-gray-500 text-sm">
              {isSignup
                ? `Sign up as a ${loginType === 'customer' ? 'customer' : 'service professional'}`
                : `Login to your ${loginType === 'customer' ? 'customer' : 'professional'} account`
              }
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-2xl text-red-700 text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-2xl text-green-700 text-sm">
              {success}
            </div>
          )}

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            {isSignup && (
              <div>
                <label className="block text-gray-700 text-xs mb-1.5" style={{ fontWeight: 600 }}>Full Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm text-gray-700 outline-none focus:border-[#1E40AF] focus:ring-2 focus:ring-[#1E40AF]/10 transition-all"
                  disabled={loading}
                />
              </div>
            )}

            <div>
              <label className="block text-gray-700 text-xs mb-1.5" style={{ fontWeight: 600 }}>Email Address *</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm text-gray-700 outline-none focus:border-[#1E40AF] focus:ring-2 focus:ring-[#1E40AF]/10 transition-all"
                  disabled={loading}
                />
              </div>
            </div>

            <div>
              <label className="block text-gray-700 text-xs mb-1.5" style={{ fontWeight: 600 }}>Password *</label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  className="w-full pl-11 pr-11 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm text-gray-700 outline-none focus:border-[#1E40AF] focus:ring-2 focus:ring-[#1E40AF]/10 transition-all"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  disabled={loading}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {isSignup && loginType === 'worker' && (
              <>
                <div>
                  <label className="block text-gray-700 text-xs mb-1.5" style={{ fontWeight: 600 }}>Service Type (Profession) *</label>
                  <select 
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm text-gray-700 outline-none focus:border-[#1E40AF] transition-all"
                    disabled={loading}
                  >
                    <option value="">Select your profession</option>
                    <option value="Plumber">Plumber</option>
                    <option value="Electrician">Electrician</option>
                    <option value="AC Technician">AC Technician</option>
                    <option value="Home Cleaner">Home Cleaner</option>
                    <option value="Painter">Painter</option>
                    <option value="Carpenter">Carpenter</option>
                    <option value="Appliance Repair">Appliance Repair</option>
                  </select>
                </div>

                <div>
                  <label className="block text-gray-700 text-xs mb-1.5" style={{ fontWeight: 600 }}>Phone Number</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <Phone className="w-4 h-4" />
                    </div>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+91 98765 43210"
                      className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm text-gray-700 outline-none focus:border-[#1E40AF] focus:ring-2 focus:ring-[#1E40AF]/10 transition-all"
                      disabled={loading}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-700 text-xs mb-1.5" style={{ fontWeight: 600 }}>Location</label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      placeholder="Your service location"
                      className="w-full pl-11 pr-4 py-3.5 bg-white border border-gray-200 rounded-2xl text-sm text-gray-700 outline-none focus:border-[#1E40AF] focus:ring-2 focus:ring-[#1E40AF]/10 transition-all"
                      disabled={loading}
                    />
                  </div>
                </div>
              </>
            )}

            {!isSignup && !loginType && (
              <div className="flex justify-end">
                <button type="button" className="text-[#1E40AF] text-xs hover:underline" style={{ fontWeight: 500 }}>
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-[#1E40AF] text-white rounded-2xl hover:bg-blue-900 transition-colors shadow-sm disabled:opacity-50 flex items-center justify-center gap-2"
              style={{ fontWeight: 700 }}
            >
              {loading && <Loader className="w-4 h-4 animate-spin" />}
              {isSignup ? 'Create Account' : 'Login'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-5">
            {isSignup ? 'Already have an account? ' : "Don't have an account? "}
            <button
              onClick={() => {
                setFormMode(isSignup ? 'login' : 'signup');
                setError('');
                setFormData({ name: '', email: '', password: '', phone: '', serviceType: '', location: '' });
              }}
              className="text-[#1E40AF] hover:underline"
              style={{ fontWeight: 600 }}
            >
              {isSignup ? 'Login' : 'Sign Up'}
            </button>
          </p>

          {loginType === 'worker' && !isSignup && (
            <p className="text-center text-xs text-gray-400 mt-3">
              Want to join as a professional?{' '}
              <button
                onClick={() => {
                  setFormMode('signup');
                  setLoginType('worker');
                }}
                className="text-[#F97316]"
                style={{ fontWeight: 600 }}
              >
                Apply Now →
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
