import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Search, X, CheckCircle2, Star, MapPin, Briefcase, Clock,
  Send, LogOut, Bell, User, Wrench, ChevronRight, AlertCircle,
  RefreshCw, Calendar, FileText, Info, ShieldAlert, Key, AlertTriangle
} from 'lucide-react';
import { logout } from '../../app/slices/authSlice';
import NotificationBell from '../../components/NotificationBell';
import EmergencyService from '../../components/EmergencyService';
import './dashboard.css';

const API_BASE_URL = import.meta.env.VITE_FIXIVO_APP_API_URL;

const SERVICE_TYPES = [
  'Plumber', 'Electrician', 'AC Technician', 'Home Cleaner',
  'Painter', 'Carpenter', 'Appliance Repair'
];

function ProviderCard({ provider, onBook, onViewProfile }) {
  const user = provider.userId;
  const initial = user?.name?.[0]?.toUpperCase() || 'P';

  return (
    <div className="customer-provider-card">
      <div className="customer-provider-card-header">
        <div className="customer-provider-avatar">{initial}</div>
        <div className="customer-provider-info">
          <div className="customer-provider-name-row">
            <p className="customer-provider-name">{user?.name || 'Provider'}</p>
            {provider.isVerified && (
              <span className="customer-verified-badge">
                <CheckCircle2 size={11} /> Verified
              </span>
            )}
          </div>
          <p className="customer-provider-service">
            <Briefcase size={12} style={{ display: 'inline', marginRight: 4 }} />
            {provider.serviceType || 'General Services'}
          </p>
        </div>
      </div>

      <div className="customer-provider-meta">
        <div className="customer-provider-meta-item">
          <Star size={14} color="#F59E0B" />
          <span>{provider.averageRating || '—'}</span>
          <span className="customer-meta-label">{provider.reviewCount ? `(${provider.reviewCount})` : ''}</span>
        </div>
        {provider.experience && (
          <div className="customer-provider-meta-item">
            <Clock size={14} color="#6366F1" />
            <span>{provider.experience} Yrs Exp.</span>
          </div>
        )}
      </div>

      {provider.bio && (
        <p className="customer-provider-bio">{provider.bio}</p>
      )}

      <div className="customer-provider-actions">
        <button onClick={() => onViewProfile(provider._id)} className="customer-view-profile-btn">
          <User size={15} />
          Profile
        </button>
        <button onClick={() => onBook(provider)} className="customer-book-btn">
          <Send size={15} />
          Book
        </button>
      </div>
    </div>
  );
}

function ReviewModal({ requestId, provider, onClose, onSuccess }) {
  const { accessToken } = useSelector(s => s.auth);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const token = accessToken || localStorage.getItem('accessToken');
      const res = await fetch(`${API_BASE_URL}/api/review/submit-review`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ requestId, rating, comment })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to submit review');
      setSuccess(true);
      setTimeout(() => { onSuccess(); onClose(); }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl animate-in fade-in zoom-in duration-300" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Rate Service</h2>
            <p className="text-sm text-gray-500 mt-1">How was your experience with {provider?.name || 'the professional'}?</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-200 rounded-full transition-colors text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>

        {success ? (
          <div className="p-12 flex flex-col items-center text-center animate-in slide-in-from-bottom-4 duration-500">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
              <CheckCircle2 size={40} className="text-green-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Thank You!</h3>
            <p className="text-gray-600">Your feedback helps us maintain high quality service.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {error && (
              <div className="p-3 bg-red-50 border border-red-100 text-red-600 rounded-xl text-sm flex items-center gap-2">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <div className="flex flex-col items-center gap-4 py-4">
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map(num => (
                  <button
                    key={num}
                    type="button"
                    onClick={() => setRating(num)}
                    className="transition-all duration-200 transform hover:scale-110 active:scale-95"
                  >
                    <Star 
                      size={36} 
                      className={`${num <= rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-none'}`} 
                    />
                  </button>
                ))}
              </div>
              <p className="text-sm font-semibold text-amber-600 bg-amber-50 px-4 py-1 rounded-full">
                {rating === 5 ? 'Excellent! 🤩' : rating === 4 ? 'Very Good! 😊' : rating === 3 ? 'Good! 🙂' : rating === 2 ? 'Fair 😐' : 'Poor ☹️'}
              </p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700">Write a Review (optional)</label>
              <textarea
                value={comment}
                onChange={e => setComment(e.target.value)}
                placeholder="Share your experience with others…"
                rows={4}
                className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none text-gray-800 placeholder:text-gray-400"
              />
            </div>

            <button 
              type="submit" 
              disabled={loading} 
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 text-white font-bold rounded-xl shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <><RefreshCw className="animate-spin" size={18} /> Submitting…</>
              ) : (
                'Submit Review'
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

function ProviderProfileModal({ providerId, onClose, onBook }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(false);

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      setReviewsLoading(true);
      try {
        // Fetch Provider Basic Info
        const res = await fetch(`${API_BASE_URL}/api/customer/provider/${providerId}`);
        if (!res.ok) throw new Error('Failed to fetch provider profile');
        const json = await res.json();
        setData(json);

        // Fetch Provider Reviews separately as per backend logic
        const revRes = await fetch(`${API_BASE_URL}/api/review/provider/${providerId}`);
        if (revRes.ok) {
          const revData = await revRes.json();
          setReviews(revData.reviews || []);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
        setReviewsLoading(false);
      }
    };
    if (providerId) fetchProfileData();
  }, [providerId]);

  if (!providerId) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box profile-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">Provider Profile</h2>
          <button onClick={onClose} className="modal-close-btn"><X size={20} /></button>
        </div>

        {loading ? (
          <div className="modal-loading">
            <div className="customer-spinner" />
            <p>Loading profile…</p>
          </div>
        ) : error ? (
          <div className="modal-error">
            <AlertCircle size={24} />
            <p>{error}</p>
          </div>
        ) : data && (
          <div className="profile-content">
            <div className="profile-hero">
              <div className="profile-avatar">
                {data.provider.name?.[0]?.toUpperCase() || 'P'}
              </div>
              <div className="profile-main-info">
                <h3>{data.provider.name}</h3>
                <p className="profile-service-type">{data.provider.serviceType}</p>
                <div className="profile-badges">
                  {data.provider.isVerified && (
                    <span className="customer-verified-badge">
                      <CheckCircle2 size={12} /> Verified Professional
                    </span>
                  )}
                  <span className="profile-exp-badge">
                    <Clock size={12} /> {data.provider.experience} Years Experience
                  </span>
                </div>
              </div>
            </div>

            <div className="profile-stats-grid">
              <div className="profile-stat-item">
                <Star size={20} color="#F59E0B" fill="#F59E0B" />
                <div className="profile-stat-details">
                  <span className="profile-stat-value">{data.provider.averageRating || 'N/A'}</span>
                  <span className="profile-stat-label">Average Rating</span>
                </div>
              </div>
              <div className="profile-stat-item">
                <FileText size={20} color="#6366F1" />
                <div className="profile-stat-details">
                  <span className="profile-stat-value">{data.provider.reviewCount || 0}</span>
                  <span className="profile-stat-label">Total Reviews</span>
                </div>
              </div>
              <div className="profile-stat-item">
                <MapPin size={20} color="#10B981" />
                <div className="profile-stat-details">
                  <span className="profile-stat-value">Available</span>
                  <span className="profile-stat-label">{data.provider.availability || 'Full Time'}</span>
                </div>
              </div>
            </div>

            <div className="profile-section">
              <h4 className="section-title">Contact Information</h4>
              <div className="profile-contact-list">
                <div className="contact-item">
                  <Bell size={16} />
                  <span>{data.provider.email}</span>
                </div>
                {data.provider.phone && (
                  <div className="contact-item">
                    <CheckCircle2 size={16} />
                    <span>{data.provider.phone}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="profile-section">
              <h4 className="section-title">Customer Reviews ({reviews.length})</h4>
              {reviewsLoading ? (
                <div className="flex justify-center py-8">
                  <RefreshCw className="animate-spin text-indigo-600" size={24} />
                </div>
              ) : reviews.length === 0 ? (
                <p className="empty-reviews text-gray-500 text-center py-8 italic bg-gray-50 rounded-xl">No reviews yet for this provider.</p>
              ) : (
                <div className="space-y-4 mt-4">
                  {reviews.map(review => (
                    <div key={review._id} className="p-4 bg-gray-50 rounded-2xl border border-gray-100 hover:border-indigo-100 transition-colors">
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-xs">
                            {review.customerId?.name?.[0]?.toUpperCase() || 'C'}
                          </div>
                          <div>
                            <span className="block font-bold text-gray-900 text-sm">{review.customerId?.name || 'Customer'}</span>
                            <span className="block text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Verified Client</span>
                          </div>
                        </div>
                        <div className="flex gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              size={12} 
                              className={`${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-none'}`} 
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed mb-3 pl-11">{review.comment || 'No comment provided.'}</p>
                      <div className="flex justify-between items-center pl-11 border-t border-gray-100 pt-3">
                        <span className="text-[10px] text-gray-400 flex items-center gap-1">
                          <Calendar size={10} />
                          {new Date(review.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                        </span>
                        {review.requestId?.serviceType && (
                          <span className="text-[10px] bg-white px-2 py-0.5 rounded-full border border-gray-100 text-gray-500 font-medium italic">
                            Service: {review.requestId.serviceType}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <button 
              onClick={() => { onClose(); onBook(data.provider); }} 
              className="profile-book-btn"
            >
              <Send size={18} /> Book This Professional
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function RequestModal({ provider, onClose, onSuccess }) {
  const { accessToken } = useSelector(s => s.auth);
  const [serviceType, setServiceType] = useState(provider.serviceType || '');
  const [details, setDetails] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!serviceType || !details.trim()) {
      setError('Service type and details are required.');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const token = accessToken || localStorage.getItem('accessToken');
      const res = await fetch(`${API_BASE_URL}/api/request/send-request`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          providerId: provider._id,
          requestDetails: {
            serviceType,
            details,
            scheduledTime: scheduledTime || null
          }
        })
      });
      if (!res.ok) throw new Error((await res.json()).message || 'Failed to send request');
      setSuccess(true);
      setTimeout(() => { onSuccess(); onClose(); }, 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Send Service Request</h2>
            <p className="modal-sub">To: {provider.userId?.name || 'Provider'}</p>
          </div>
          <button onClick={onClose} className="modal-close-btn"><X size={20} /></button>
        </div>

        {success ? (
          <div className="modal-success">
            <CheckCircle2 size={52} color="#10B981" />
            <h3>Request Sent!</h3>
            <p>Your request has been sent to the provider.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="modal-form">
            {error && (
              <div className="modal-error">
                <AlertCircle size={16} />
                {error}
              </div>
            )}

            <div className="modal-field">
              <label className="modal-label">Service Type *</label>
              <select
                value={serviceType}
                onChange={e => setServiceType(e.target.value)}
                className="modal-select"
                required
              >
                <option value="">Select a service type</option>
                {SERVICE_TYPES.map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            <div className="modal-field">
              <label className="modal-label">Request Details *</label>
              <textarea
                value={details}
                onChange={e => setDetails(e.target.value)}
                placeholder="Describe what you need help with…"
                rows={4}
                className="modal-textarea"
                required
              />
            </div>

            <div className="modal-field">
              <label className="modal-label">
                <Calendar size={14} style={{ display: 'inline', marginRight: 4 }} />
                Preferred Date & Time (optional)
              </label>
              <input
                type="datetime-local"
                value={scheduledTime}
                onChange={e => setScheduledTime(e.target.value)}
                className="modal-input"
              />
            </div>

            <button type="submit" disabled={loading} className="modal-submit-btn">
              {loading ? (
                <><div className="btn-spinner" /> Sending…</>
              ) : (
                <><Send size={16} /> Send Request</>
              )}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default function CustomerDashboard() {
  const { user, accessToken } = useSelector(s => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [selectedService, setSelectedService] = useState('all');
  const [bookingProvider, setBookingProvider] = useState(null);
  const [viewingProfileId, setViewingProfileId] = useState(null);
  const [ratingRequest, setRatingRequest] = useState(null);
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('customerActiveTab') || 'explore';
  });
  const [myRequests, setMyRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [requestsError, setRequestsError] = useState('');
  
  const [myReviews, setMyReviews] = useState([]);
  const [myReviewsLoading, setMyReviewsLoading] = useState(false);
  const [myReviewsError, setMyReviewsError] = useState('');

  // Save active tab to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('customerActiveTab', activeTab);
  }, [activeTab]);

  const fetchProviders = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_BASE_URL}/api/customer/verified-providers`);
      if (!res.ok) throw new Error((await res.json()).message || 'Failed to fetch providers');
      const data = await res.json();
      setProviders(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyRequests = async () => {
    setRequestsLoading(true);
    setRequestsError('');
    try {
      const token = accessToken || localStorage.getItem('accessToken');
      const res = await fetch(`${API_BASE_URL}/api/request/customer-requests-status`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error((await res.json()).message || 'Failed to fetch requests');
      const data = await res.json();
      console.log("customer dashboard requests data",data);
      setMyRequests(data.requests || []);
      
    } catch (err) {
      setRequestsError(err.message);
    } finally {
      setRequestsLoading(false);
    }
  };

  const fetchMyReviews = async () => {
    setMyReviewsLoading(true);
    setMyReviewsError('');
    try {
      const token = accessToken || localStorage.getItem('accessToken');
      const res = await fetch(`${API_BASE_URL}/api/review/my-reviews`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (!res.ok) throw new Error((await res.json()).message || 'Failed to fetch reviews');
      const data = await res.json();
      setMyReviews(data.reviews || []);
    } catch (err) {
      setMyReviewsError(err.message);
    } finally {
      setMyReviewsLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'explore') fetchProviders();
    if (activeTab === 'requests') fetchMyRequests();
    if (activeTab === 'reviews') fetchMyReviews();
  }, [accessToken, activeTab]);

  const filtered = providers.filter(p => {
    const name = p.userId?.name?.toLowerCase() || '';
    const svc = p.serviceType?.toLowerCase() || '';
    const q = search.toLowerCase();
    const matchSearch = !q || name.includes(q) || svc.includes(q);
    const matchService = selectedService === 'all' || svc === selectedService.toLowerCase();
    return matchSearch && matchService;
  });

  const serviceTypes = ['all', ...new Set(providers.map(p => p.serviceType).filter(Boolean))];

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="customer-dashboard">
      {/* Sidebar */}
      <aside className="customer-sidebar">
        <div className="customer-sidebar-logo">
          <div className="customer-logo-icon">
            <Wrench size={20} color="#fff" />
          </div>
          <span className="customer-logo-text">Fixivo</span>
        </div>

        <nav className="customer-nav">
          <p className="customer-nav-label">Main Menu</p>
          <button
            className={`customer-nav-item ${activeTab === 'explore' ? 'active' : ''}`}
            onClick={() => setActiveTab('explore')}
          >
            <User size={18} /> Find Providers
          </button>
          <button
            className={`customer-nav-item ${activeTab === 'requests' ? 'active' : ''}`}
            onClick={() => setActiveTab('requests')}
          >
            <FileText size={18} /> My Requests
          </button>
          <button
            className={`customer-nav-item ${activeTab === 'emergency' ? 'active' : ''}`}
            onClick={() => setActiveTab('emergency')}
          >
            <AlertTriangle size={18} /> Emergency
          </button>
          <button 
            className={`customer-nav-item ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            <Star size={18} /> Reviews
          </button>
        </nav>

        <div className="customer-sidebar-footer">
          <div className="customer-sidebar-user">
            <div className="customer-sidebar-avatar">
              {user?.name?.[0]?.toUpperCase() || 'C'}
            </div>
            <div>
              <p className="customer-sidebar-name">{user?.name || 'Customer'}</p>
              <p className="customer-sidebar-role">Customer</p>
            </div>
          </div>
          <button onClick={handleLogout} className="customer-logout-btn" title="Logout">
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="customer-main">
        {/* Topbar */}
        <header className="customer-topbar">
          <div>
            <h1 className="customer-page-title">
              {activeTab === 'explore' ? 'Find Professionals' : activeTab === 'emergency' ? 'Emergency Service' : activeTab === 'reviews' ? 'My Reviews' : 'My Service Requests'}
            </h1>
            <p className="customer-page-sub">
              {activeTab === 'explore'
                ? `${filtered.length} verified provider${filtered.length !== 1 ? 's' : ''} available`
                : activeTab === 'emergency'
                ? 'Request urgent help from nearby providers'
                : activeTab === 'reviews'
                ? `You have shared ${myReviews.length} review${myReviews.length !== 1 ? 's' : ''}`
                : `${myRequests.length} request${myRequests.length !== 1 ? 's' : ''} total`
              }
            </p>
          </div>
          <div className="customer-topbar-actions">
            <NotificationBell />
            <button
              onClick={activeTab === 'explore' ? fetchProviders : fetchMyRequests}
              className="customer-refresh-btn"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
        </header>

        {activeTab === 'emergency' ? (
          <EmergencyService />
        ) : activeTab === 'explore' ? (
          <>
            {/* Search & Filter */}
            <div className="customer-search-bar">
              <div className="customer-search-input-wrap">
                <Search size={18} className="customer-search-icon" />
                <input
                  type="text"
                  placeholder="Search by name or service…"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="customer-search-input"
                />
                {search && (
                  <button onClick={() => setSearch('')} className="customer-search-clear">
                    <X size={16} />
                  </button>
                )}
              </div>
            </div>

            {/* Service Filter Pills */}
            <div className="customer-service-pills">
              {serviceTypes.map(s => (
                <button
                  key={s}
                  onClick={() => setSelectedService(s)}
                  className={`customer-pill ${selectedService === s ? 'active' : ''}`}
                >
                  {s === 'all' ? '✨ All Services' : s}
                </button>
              ))}
            </div>

            {/* Providers Grid */}
            <section className="customer-providers-section">
              {loading ? (
                <div className="customer-loading">
                  <div className="customer-spinner" />
                  <p>Loading providers…</p>
                </div>
              ) : error ? (
                <div className="customer-error">
                  <AlertCircle size={40} color="#EF4444" />
                  <p>{error}</p>
                  <button onClick={fetchProviders} className="customer-retry-btn">Try Again</button>
                </div>
              ) : filtered.length === 0 ? (
                <div className="customer-empty">
                  <User size={56} color="#D1D5DB" />
                  <h3>No providers found</h3>
                  <p>Try adjusting your search or filter.</p>
                </div>
              ) : (
                <div className="customer-providers-grid">
                  {filtered.map(provider => (
                    <ProviderCard
                      key={provider._id}
                      provider={provider}
                      onBook={setBookingProvider}
                      onViewProfile={setViewingProfileId}
                    />
                  ))}
                </div>
              )}
            </section>
          </>
        ) : activeTab === 'reviews' ? (
          <section className="p-6">
            {myReviewsLoading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <RefreshCw className="animate-spin text-indigo-600 mb-4" size={40} />
                <p className="text-gray-500 font-medium">Loading your reviews…</p>
              </div>
            ) : myReviewsError ? (
              <div className="bg-red-50 border border-red-100 rounded-2xl p-8 text-center">
                <AlertCircle size={48} className="text-red-500 mx-auto mb-4" />
                <p className="text-red-800 font-semibold mb-4">{myReviewsError}</p>
                <button onClick={fetchMyReviews} className="px-6 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition-colors">
                  Try Again
                </button>
              </div>
            ) : myReviews.length === 0 ? (
              <div className="bg-white border border-dashed border-gray-200 rounded-3xl p-20 text-center shadow-sm">
                <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Star size={40} className="text-gray-300" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">No reviews shared yet</h3>
                <p className="text-gray-500 mb-8 max-w-sm mx-auto">
                  Your feedback helps providers improve and helps other customers make better choices.
                </p>
                <button onClick={() => setActiveTab('requests')} className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg shadow-indigo-100 hover:bg-indigo-700 transition-all">
                  Go to Completed Requests
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {myReviews.map(review => (
                  <div key={review._id} className="bg-white rounded-3xl border border-gray-100 p-6 shadow-sm hover:shadow-md transition-all group">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center text-white font-black text-lg shadow-inner group-hover:rotate-3 transition-transform">
                          {review.providerId?.name?.[0]?.toUpperCase() || 'P'}
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">{review.providerId?.name || 'Provider'}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                              {review.requestId?.serviceType || 'Service'}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-0.5 bg-amber-50 p-1.5 rounded-xl">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            size={14} 
                            className={`${i < review.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-none'}`} 
                          />
                        ))}
                      </div>
                    </div>
                    
                    <div className="bg-gray-50/50 rounded-2xl p-4 mb-4 min-h-[80px]">
                      <p className="text-gray-600 text-sm italic leading-relaxed">
                        "{review.comment || 'You didn\'t leave a written comment for this service.'}"
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-50 text-[11px] font-semibold text-gray-400 uppercase tracking-widest">
                      <div className="flex items-center gap-1.5">
                        <Calendar size={12} />
                        {new Date(review.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                      </div>
                      <div className="flex items-center gap-1.5 text-indigo-500">
                        <CheckCircle2 size={12} />
                        Verified Review
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        ) : (
          /* My Requests Tab Content */
          <section className="customer-requests-section">
            {requestsLoading ? (
              <div className="customer-loading">
                <div className="customer-spinner" />
                <p>Fetching your requests…</p>
              </div>
            ) : requestsError ? (
              <div className="customer-error">
                <AlertCircle size={40} color="#EF4444" />
                <p>{requestsError}</p>
                <button onClick={fetchMyRequests} className="customer-retry-btn">Try Again</button>
              </div>
            ) : myRequests.length === 0 ? (
              <div className="customer-empty">
                <FileText size={56} color="#D1D5DB" />
                <h3>No requests yet</h3>
                <p>Start by finding a professional to help you.</p>
                <button onClick={() => setActiveTab('explore')} className="customer-retry-btn">
                  Explore Providers
                </button>
              </div>
            ) : (
              <div className="customer-requests-list">
                {myRequests.map(req => (
                  <div key={req._id} className="customer-request-card-alt">
                    <div className="customer-req-header">
                      <div className="customer-req-provider-info">
                        <div className="customer-req-avatar">
                          {req.providerId?.name?.[0]?.toUpperCase() || 'P'}
                        </div>
                        <div>
                          <p className="customer-req-provider-name">{req.providerId?.name || 'Unknown Provider'}</p>
                          <p className="customer-req-service">{req.requestDetails?.serviceType || 'General Service'}</p>
                        </div>
                      </div>
                      <div className={`customer-status-badge ${req.status?.toLowerCase()}`}>
                        {req.status}
                      </div>
                    </div>

                    <div className="customer-req-body">
                      <div className="customer-req-detail-item">
                        <Info size={14} />
                        <p>{req.requestDetails?.details}</p>
                      </div>
                      {req.requestDetails?.scheduledTime && (
                        <div className="customer-req-detail-item">
                          <Clock size={14} />
                          <span>Scheduled: {new Date(req.requestDetails.scheduledTime).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                        </div>
                      )}
                      <div className="customer-req-detail-item">
                        <Calendar size={14} />
                        <span>Created: {(req.createdAt || req.updatedAt) ? new Date(req.createdAt || req.updatedAt).toLocaleDateString() : 'N/A'}</span>
                      </div>
                    </div>

                    {req.otp && req.status !== 'completed' && (
                      <div className="customer-otp-card">
                        <div className="customer-otp-header">
                          <ShieldAlert size={14} />
                          <span>Completion OTP</span>
                        </div>
                        <div className="customer-otp-value">{req.otp}</div>
                        <p className="customer-otp-hint">Share this code with the provider only when the work is done.</p>
                      </div>
                    )}

                    <div className="customer-req-footer">
                      <div className="customer-req-contact">
                        {req.providerId?.phone && (
                          <p><span>Phone:</span> {req.providerId.phone}</p>
                        )}
                        {req.providerId?.email && (
                          <p><span>Email:</span> {req.providerId.email}</p>
                        )}
                      </div>
                      <div className="customer-req-actions-alt">
                        {!req.hasBeenReviewed && req.status === 'completed' && (
                          <button 
                            onClick={() => setRatingRequest(req)}
                            className="customer-rate-btn"
                          >
                            <Star size={14} /> Rate Service
                          </button>
                        )}
                        <button className="customer-view-details-btn">
                          View Details <ChevronRight size={14} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      {bookingProvider && (
        <RequestModal
          provider={bookingProvider}
          onClose={() => setBookingProvider(null)}
          onSuccess={() => {
            fetchMyRequests();
            fetchProviders();
          }}
        />
      )}

      {viewingProfileId && (
        <ProviderProfileModal
          providerId={viewingProfileId}
          onClose={() => setViewingProfileId(null)}
          onBook={setBookingProvider}
        />
      )}

      {ratingRequest && (
        <ReviewModal
          requestId={ratingRequest._id}
          provider={ratingRequest.providerId}
          onClose={() => setRatingRequest(null)}
          onSuccess={() => {
            fetchMyRequests();
            fetchProviders();
          }}
        />
      )}
    </div>
  );
}
