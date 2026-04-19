import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Search, X, CheckCircle2, Star, MapPin, Briefcase, Clock,
  Send, LogOut, Bell, User, Wrench, ChevronRight, AlertCircle,
  RefreshCw, Calendar, FileText, Info, ShieldAlert, Key
} from 'lucide-react';
import { logout } from '../../app/slices/authSlice';
import './dashboard.css';

const API_BASE_URL = import.meta.env.VITE_FIXIVO_APP_API_URL;

const SERVICE_TYPES = [
  'Plumber', 'Electrician', 'AC Technician', 'Home Cleaner',
  'Painter', 'Carpenter', 'Appliance Repair'
];

function ProviderCard({ provider, onBook }) {
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
          <span>{provider.rating || '—'}</span>
          <span className="customer-meta-label">{provider.reviews ? `(${provider.reviews})` : ''}</span>
        </div>
        {provider.experience && (
          <div className="customer-provider-meta-item">
            <Clock size={14} color="#6366F1" />
            <span>{provider.experience}</span>
          </div>
        )}
        {/* {provider.location && (
          <div className="customer-provider-meta-item">
            <MapPin size={14} color="#10B981" />
            <span>{provider.location}</span>
          </div>
        )} */}
      </div>

      {provider.bio && (
        <p className="customer-provider-bio">{provider.bio}</p>
      )}

      <button onClick={() => onBook(provider)} className="customer-book-btn">
        <Send size={15} />
        Send Request
      </button>
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
  const [activeTab, setActiveTab] = useState(() => {
    return localStorage.getItem('customerActiveTab') || 'explore';
  });
  const [myRequests, setMyRequests] = useState([]);
  const [requestsLoading, setRequestsLoading] = useState(false);
  const [requestsError, setRequestsError] = useState('');

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

  useEffect(() => {
    if (activeTab === 'explore') fetchProviders();
    if (activeTab === 'requests') fetchMyRequests();
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
          <button className="customer-nav-item">
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
              {activeTab === 'explore' ? 'Find Professionals' : 'My Service Requests'}
            </h1>
            <p className="customer-page-sub">
              {activeTab === 'explore'
                ? `${filtered.length} verified provider${filtered.length !== 1 ? 's' : ''} available`
                : `${myRequests.length} request${myRequests.length !== 1 ? 's' : ''} total`
              }
            </p>
          </div>
          <div className="customer-topbar-actions">
            <button className="customer-icon-btn" title="Notifications">
              <Bell size={20} />
            </button>
            <button
              onClick={activeTab === 'explore' ? fetchProviders : fetchMyRequests}
              className="customer-refresh-btn"
            >
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
        </header>

        {activeTab === 'explore' ? (
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
                    />
                  ))}
                </div>
              )}
            </section>
          </>
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
                      <button className="customer-view-details-btn">
                        View Details <ChevronRight size={14} />
                      </button>
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
    </div>
  );
}
