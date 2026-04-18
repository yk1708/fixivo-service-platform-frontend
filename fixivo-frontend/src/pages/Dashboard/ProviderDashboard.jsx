import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  ClipboardList, Clock, CheckCircle2, XCircle, AlertCircle,
  User, Wrench, Calendar, RefreshCw, LogOut, ChevronRight,
  Bell, TrendingUp, Star, Briefcase, Shield, Edit
} from 'lucide-react';
import { logout } from '../../app/slices/authSlice';
import './dashboard.css';

const API_BASE_URL = import.meta.env.VITE_FIXIVO_APP_API_URL || 'http://localhost:5000';

const STATUS_CONFIG = {
  pending:    { label: 'Pending',    color: '#F59E0B', bg: '#FFFBEB', icon: Clock },
  accepted:   { label: 'Accepted',   color: '#10B981', bg: '#ECFDF5', icon: CheckCircle2 },
  rejected:   { label: 'Rejected',   color: '#EF4444', bg: '#FEF2F2', icon: XCircle },
  completed:  { label: 'Completed',  color: '#6366F1', bg: '#EEF2FF', icon: CheckCircle2 },
  cancelled:  { label: 'Cancelled',  color: '#6B7280', bg: '#F9FAFB', icon: XCircle },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const Icon = cfg.icon;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
      style={{ color: cfg.color, background: cfg.bg }}
    >
      <Icon size={12} />
      {cfg.label}
    </span>
  );
}

function StatCard({ icon: Icon, label, value, color, bg }) {
  return (
    <div
      className="provider-stat-card"
      style={{ '--accent': color, '--accent-bg': bg }}
    >
      <div className="provider-stat-icon" style={{ background: bg }}>
        <Icon size={22} style={{ color }} />
      </div>
      <div>
        <p className="provider-stat-value">{value}</p>
        <p className="provider-stat-label">{label}</p>
      </div>
    </div>
  );
}

export default function ProviderDashboard() {
  const { user, provider, accessToken } = useSelector(s => s.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [confirmRejectId, setConfirmRejectId] = useState(null);

  // Redirect if profile not complete
  useEffect(() => {
    if (!provider?.isVerified) {
      navigate('/dashboard', { replace: true });
    }
  }, [provider?.isVerified, navigate]);

  const fetchRequests = async () => {
    setLoading(true);
    setError('');
    try {
      const token = accessToken || localStorage.getItem('accessToken');
      const res = await fetch(`${API_BASE_URL}/api/request/see-requests-inside-provider-dashboard`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (!res.ok) throw new Error((await res.json()).message || 'Failed to fetch requests');
      const data = await res.json();
      setRequests(data.requests || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptRequest = async (requestId) => {
    if (!provider?.isVerified) {
      alert('Please complete your profile before accepting requests.');
      navigate('/dashboard');
      return;
    }

    setLoading(true);
    try {
      const token = accessToken || localStorage.getItem('accessToken');
      const res = await fetch(`${API_BASE_URL}/api/request/accept-request/${requestId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ requestId })
      });
      if (!res.ok) throw new Error((await res.json()).message || 'Failed to accept request');
      await fetchRequests(); 
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRejectRequest = async (requestId) => {
    setLoading(true);
    try{
      const token = accessToken || localStorage.getItem('accessToken');
      const res = await fetch(`${API_BASE_URL}/api/request/reject-request/${requestId}`,{
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ requestId })
      });
      if (!res.ok) throw new Error((await res.json()).message || 'Failed to reject request');
      await fetchRequests(); 
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { fetchRequests(); }, []);

  const filtered = filter === 'all' ? requests : requests.filter(r => r.status === filter);

  const stats = {
    total:     requests.length,
    pending:   requests.filter(r => r.status === 'pending').length,
    accepted:  requests.filter(r => r.status === 'accepted').length,
    completed: requests.filter(r => r.status === 'completed').length,
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };



  return (
    <div className="provider-dashboard">
      {/* Sidebar */}
      <aside className="provider-sidebar">
        <div className="provider-sidebar-logo">
          <div className="provider-logo-icon">
            <Wrench size={20} color="#fff" />
          </div>
          <span className="provider-logo-text">Fixivo</span>
        </div>

        <nav className="provider-nav">
          <div className="provider-nav-section">
            <p className="provider-nav-label">Overview</p>
            <button className="provider-nav-item active">
              <ClipboardList size={18} />
              My Requests
            </button>
            <button className="provider-nav-item">
              <TrendingUp size={18} />
              Analytics
            </button>
            <button className="provider-nav-item">
              <Star size={18} />
              Reviews
            </button>
            <button className="provider-nav-item">
              <Briefcase size={18} />
              My Services
            </button>
          </div>
        </nav>

        <div className="provider-sidebar-footer">
          <div className="provider-sidebar-user">
            <div className="provider-sidebar-avatar">
              {user?.name?.[0]?.toUpperCase() || 'P'}
            </div>
            <div>
              <p className="provider-sidebar-name">{user?.name || 'Provider'}</p>
              <p className="provider-sidebar-role">Service Provider</p>
            </div>
          </div>
          <button onClick={handleLogout} className="provider-logout-btn" title="Logout">
            <LogOut size={18} />
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="provider-main">
        {/* Top Bar */}
        <header className="provider-topbar">
          <div>
            <h1 className="provider-page-title">Dashboard</h1>
            <p className="provider-page-sub">Welcome back, {user?.name || 'Provider'}! 👋</p>
          </div>
          <div className="provider-topbar-actions">
            {/* Profile Verification Status */}
            <div className="flex items-center gap-2 px-3 py-2 bg-green-50 border border-green-200 rounded-lg">
              <Shield size={18} className="text-green-600" />
              <span className="text-sm font-semibold text-green-700">Profile Verified</span>
            </div>
            <button className="provider-icon-btn" title="Notifications">
              <Bell size={20} />
              {stats.pending > 0 && (
                <span className="provider-notif-badge">{stats.pending}</span>
              )}
            </button>
            <button onClick={fetchRequests} className="provider-refresh-btn">
              <RefreshCw size={16} />
              Refresh
            </button>
          </div>
        </header>

        {/* Stats Row */}
        <section className="provider-stats-row">
          <StatCard icon={ClipboardList} label="Total Requests" value={stats.total}  color="#6366F1" bg="#EEF2FF" />
          <StatCard icon={Clock}         label="Pending"        value={stats.pending} color="#F59E0B" bg="#FFFBEB" />
          <StatCard icon={CheckCircle2}  label="Accepted"       value={stats.accepted} color="#10B981" bg="#ECFDF5" />
          <StatCard icon={Star}          label="Completed"      value={stats.completed} color="#F97316" bg="#FFF7ED" />
        </section>

        {/* Filter Tabs */}
        <div className="provider-filter-tabs">
          {['all', 'pending', 'accepted', 'completed', 'rejected'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`provider-filter-tab ${filter === f ? 'active' : ''}`}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
              {f !== 'all' && requests.filter(r => r.status === f).length > 0 && (
                <span className="provider-filter-count">
                  {requests.filter(r => r.status === f).length}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Requests List */}
        <section className="provider-requests-section">
          {loading ? (
            <div className="provider-loading">
              <div className="provider-spinner" />
              <p>Loading your requests…</p>
            </div>
          ) : error ? (
            <div className="provider-error">
              <AlertCircle size={40} color="#EF4444" />
              <p>{error}</p>
              <button onClick={fetchRequests} className="provider-retry-btn">Try Again</button>
            </div>
          ) : filtered.length === 0 ? (
            <div className="provider-empty">
              <ClipboardList size={56} color="#D1D5DB" />
              <h3>No requests yet</h3>
              <p>When customers send you service requests, they'll appear here.</p>
            </div>
          ) : (
            <div className="provider-requests-grid">
              {filtered.map(req => {
                const customer = req.customerId;
                const scheduledDate = req.scheduledTime
                  ? new Date(req.scheduledTime).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                  : null;
                return (
                  <div key={req._id} className="provider-request-card">
                    <div className="provider-request-header">
                      <div className="provider-request-avatar">
                        {customer?.name?.[0]?.toUpperCase() || <User size={20} />}
                      </div>
                      <div className="provider-request-customer">
                        <p className="provider-customer-name">{customer?.name || 'Customer'}</p>
                        <p className="provider-customer-email">{customer?.email || ''}</p>
                      </div>
                      <StatusBadge status={req.status} />
                    </div>

                    <div className="provider-request-body">
                      <div className="provider-request-row">
                        <Wrench size={15} className="provider-request-icon" />
                        <div>
                          <p className="provider-request-field-label">Service</p>
                          <p className="provider-request-field">{req.serviceType}</p>
                        </div>
                      </div>
                      <div className="provider-request-row">
                        <AlertCircle size={15} className="provider-request-icon" />
                        <div>
                          <p className="provider-request-field-label">Details</p>
                          <p className="provider-request-field">{req.details}</p>
                        </div>
                      </div>
                      {scheduledDate && (
                        <div className="provider-request-row">
                          <Calendar size={15} className="provider-request-icon" />
                          <div>
                            <p className="provider-request-field-label">Scheduled</p>
                            <p className="provider-request-field">{scheduledDate}</p>
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="provider-request-footer">
                      <div className="provider-request-meta">
                        <span className="provider-request-date">
                          {new Date(req.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                      
                      <div className="provider-request-actions">
                        {req.status === 'pending' ? (
                          <>
                            <button 
                              onClick={() => handleAcceptRequest(req._id)}
                              className="provider-action-btn accept"
                            >
                              Accept
                            </button>
                            <button 
                              onClick={() => setConfirmRejectId(req._id)}
                              className="provider-action-btn reject"
                            >
                              Reject
                            </button>
                          </>
                        ) : (
                          <button className="provider-view-btn">
                            View Details <ChevronRight size={14} />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      {/* Rejection Confirmation Modal */}
      {confirmRejectId && (
        <div className="modal-overlay" onClick={() => setConfirmRejectId(null)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-icon-wrap reject">
                <AlertCircle size={24} color="#EF4444" />
              </div>
              <h2 className="modal-title">Reject Request?</h2>
              <p className="modal-sub">This action cannot be undone. The customer will be notified.</p>
            </div>
            
            <div className="modal-footer">
              <button 
                className="modal-cancel-btn"
                onClick={() => setConfirmRejectId(null)}
              >
                Cancel
              </button>
              <button 
                className="modal-confirm-btn reject"
                onClick={() => {
                  handleRejectRequest(confirmRejectId);
                  setConfirmRejectId(null);
                }}
              >
                Yes, Reject
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
