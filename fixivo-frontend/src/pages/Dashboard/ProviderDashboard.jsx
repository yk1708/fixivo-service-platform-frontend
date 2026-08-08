import { useState, useEffect } from 'react';
import ProviderDetails from '../../components/ProviderDetails';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  ClipboardList, Clock, CheckCircle2, XCircle, AlertCircle,
  User, Wrench, Calendar, RefreshCw, LogOut, ChevronRight,
  TrendingUp, Star, Briefcase, Shield, AlertTriangle, Menu, X, Search
} from 'lucide-react';
import { logout } from '../../app/slices/authSlice';
import PageHeader from '../../components/PageHeader';
import NotificationBell from '../../components/NotificationBell';
import EmergencyRequests from '../Tabs/EmergencyRequests';

const API_BASE_URL = import.meta.env.VITE_FIXIVO_APP_API_URL || 'https://fixivo-service-platform-backend.onrender.com';

const STATUS_CONFIG = {
  pending:   { label: 'Pending',   color: '#F59E0B', bg: '#FFFBEB', icon: Clock },
  accepted:  { label: 'Accepted',  color: '#10B981', bg: '#ECFDF5', icon: CheckCircle2 },
  rejected:  { label: 'Rejected',  color: '#EF4444', bg: '#FEF2F2', icon: XCircle },
  completed: { label: 'Completed', color: '#6366F1', bg: '#EEF2FF', icon: CheckCircle2 },
  cancelled: { label: 'Cancelled', color: '#6B7280', bg: '#F9FAFB', icon: XCircle },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const Icon = cfg.icon;
  return (
    <span
      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
      style={{ color: cfg.color, background: cfg.bg }}
    >
      <Icon size={12} />{cfg.label}
    </span>
  );
}

function StatCard({ icon: Icon, label, value, color, bg }) {
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 flex items-center gap-3 sm:gap-3.5 shadow-sm border border-slate-100 transition-all hover:-translate-y-0.5 hover:shadow-md">
      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: bg }}>
        <Icon size={20} style={{ color }} />
      </div>
      <div>
        <p className="text-2xl sm:text-[28px] font-extrabold text-slate-900 leading-none">{value}</p>
        <p className="text-xs text-slate-400 mt-1 font-medium">{label}</p>
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
  const [filter, setFilter] = useState(() => localStorage.getItem('providerFilterTab') || 'all');
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmRejectId, setConfirmRejectId] = useState(null);
  const [viewRequestId, setViewRequestId] = useState(null);
  const [activeTab, setActiveTab] = useState('requests');
  const [sidebarOpen, setSidebarOpen] = useState(false); // mobile sidebar toggle

  useEffect(() => { localStorage.setItem('providerFilterTab', filter); }, [filter]);

  useEffect(() => {
    if (!provider?.isVerified) navigate('/dashboard', { replace: true });
  }, [provider?.isVerified, navigate]);

  const fetchRequests = async () => {
    setLoading(true); setError('');
    try {
      const token = accessToken || localStorage.getItem('accessToken');
      const res = await fetch(`${API_BASE_URL}/api/request/see-requests-inside-provider-dashboard`, {
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
      });
      if (!res.ok) throw new Error((await res.json()).message || 'Failed to fetch requests');
      const data = await res.json();
      setRequests(data.requests || []);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const handleAcceptRequest = async (requestId) => {
    if (!provider?.isVerified) { alert('Please complete your profile first.'); navigate('/dashboard'); return; }
    setLoading(true);
    try {
      const token = accessToken || localStorage.getItem('accessToken');
      const res = await fetch(`${API_BASE_URL}/api/request/accept-request/${requestId}`, {
        method: 'POST', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId })
      });
      if (!res.ok) throw new Error((await res.json()).message || 'Failed to accept');
      await fetchRequests();
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  const handleRejectRequest = async (requestId) => {
    setLoading(true);
    try {
      const token = accessToken || localStorage.getItem('accessToken');
      const res = await fetch(`${API_BASE_URL}/api/request/reject-request/${requestId}`, {
        method: 'POST', headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId })
      });
      if (!res.ok) throw new Error((await res.json()).message || 'Failed to reject');
      await fetchRequests();
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchRequests(); }, []);

  const filtered = requests.filter(r => {
    const matchesStatus = filter === 'all' || r.status === filter;
    const q = searchTerm.toLowerCase().trim();
    const matchesSearch = !q || 
      (r.customerId?.name && r.customerId.name.toLowerCase().includes(q)) ||
      (r.customerId?.email && r.customerId.email.toLowerCase().includes(q)) ||
      (r.serviceType && r.serviceType.toLowerCase().includes(q)) ||
      (r.details && r.details.toLowerCase().includes(q));
    return matchesStatus && matchesSearch;
  });
  const stats = {
    total: requests.length,
    pending: requests.filter(r => r.status === 'pending').length,
    accepted: requests.filter(r => r.status === 'accepted').length,
    completed: requests.filter(r => r.status === 'completed').length,
  };
  const handleLogout = () => { dispatch(logout()); navigate('/login'); };

  const NavBtn = ({ tab, icon, label }) => (
    <button
      onClick={() => { setActiveTab(tab); setSidebarOpen(false); }}
      className={`flex items-center gap-2.5 w-full px-3.5 py-2.5 rounded-xl text-sm mb-0.5 transition-all text-left border-none cursor-pointer
        ${activeTab === tab ? 'bg-white/[0.18] text-white font-semibold' : 'bg-transparent text-white/65 hover:bg-white/10 hover:text-white font-medium'}`}
    >
      {icon}{label}
    </button>
  );

  const SidebarContent = () => (
    <>
      <div className="flex items-center gap-2.5 px-6 mb-8 pt-1">
        <div className="w-9 h-9 bg-white/20 rounded-[10px] flex items-center justify-center">
          <Wrench size={20} color="#fff" />
        </div>
        <span className="text-xl font-extrabold text-white">Fixivo</span>
      </div>

      <nav className="flex-1 px-3 overflow-y-auto">
        <div className="mb-6">
          <p className="text-[10px] font-bold text-white/45 tracking-[0.12em] uppercase px-3 mb-2">Overview</p>
          <NavBtn tab="requests"    icon={<ClipboardList size={18} />} label="My Requests" />
          <NavBtn tab="emergencies" icon={<AlertTriangle size={18} className={activeTab !== 'emergencies' ? 'text-red-400' : ''} />} label="Emergency Requests" />
          <NavBtn tab="analytics"   icon={<TrendingUp size={18} />}    label="Analytics" />
          <NavBtn tab="reviews"     icon={<Star size={18} />}          label="Reviews" />
          <NavBtn tab="services"    icon={<Briefcase size={18} />}     label="My Services" />
        </div>
      </nav>
    </>
  );

  return (
    <div className="flex min-h-screen bg-slate-100 font-sans">

      {/* ── Mobile overlay backdrop ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar — desktop: fixed; mobile: slide-in drawer ── */}
      <aside
        className={`
          fixed inset-y-0 left-0 z-40 flex flex-col py-6
          bg-gradient-to-b from-[#1E3A8A] to-[#1E40AF]
          transition-transform duration-300 ease-in-out
          w-[250px]
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0
        `}
      >
        {/* Close button — mobile only */}
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-white/10 rounded-lg text-white"
        >
          <X size={18} />
        </button>

        <SidebarContent />
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 lg:ml-[250px] overflow-y-auto min-h-screen bg-slate-50">

        {/* ── Page Header Component ── */}
        <PageHeader
          title={
            activeTab === 'requests'
              ? 'My Requests'
              : activeTab === 'emergencies'
              ? 'Emergency Requests'
              : activeTab.charAt(0).toUpperCase() + activeTab.slice(1)
          }
          onMenuClick={() => setSidebarOpen(true)}
        />

        <div className="p-4 sm:p-5 lg:p-6 pt-0">

        {activeTab === 'requests' && (
          <>
            {/* ── Filter tabs & Search Bar ── */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
              {/* Filter tabs */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
                {['all', 'pending', 'accepted', 'completed', 'rejected'].map(f => {
                  const count = f === 'all' ? requests.length : requests.filter(r => r.status === f).length;
                  return (
                    <button key={f} onClick={() => setFilter(f)}
                      className={`flex items-center gap-1.5 px-4 sm:px-[18px] py-2 rounded-[10px] text-[13px] font-medium cursor-pointer transition-all border whitespace-nowrap shrink-0
                        ${filter === f ? 'bg-blue-700 border-blue-700 text-white font-semibold shadow-sm' : 'bg-white border-slate-200 text-slate-600 hover:border-blue-700 hover:text-blue-700'}`}>
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                      {count > 0 && (
                        <span className={`text-[11px] font-bold px-[7px] py-0.5 rounded-full min-w-[20px] text-center
                          ${filter === f ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-500'}`}>
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Search Box */}
              <div className="relative w-full sm:w-64">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search customer, service..."
                  className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-xs text-slate-700 outline-none focus:border-blue-700 focus:ring-1 focus:ring-blue-700 shadow-sm transition-all placeholder:text-slate-400"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600 font-bold"
                  >
                    ✕
                  </button>
                )}
              </div>
            </div>

            {/* ── Table view ── */}
            <section>
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400 text-center">
                  <div className="w-10 h-10 border-[3px] border-slate-200 border-t-blue-700 rounded-full animate-spin" />
                  <p className="text-sm">Loading your requests…</p>
                </div>
              ) : error ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400 text-center">
                  <AlertCircle size={40} color="#EF4444" /><p className="text-sm">{error}</p>
                  <button onClick={fetchRequests} className="mt-2 px-6 py-2.5 bg-blue-700 text-white border-none rounded-[10px] font-semibold cursor-pointer">Try Again</button>
                </div>
              ) : filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400 text-center">
                  <ClipboardList size={56} color="#D1D5DB" />
                  <h3 className="text-lg font-bold text-slate-500">No requests yet</h3>
                  <p className="text-sm">When customers send you service requests, they'll appear here.</p>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-slate-50/80 border-b border-slate-200 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                          <th className="py-3.5 px-4 sm:px-6">Customer</th>
                          <th className="py-3.5 px-4 sm:px-6">Service</th>
                          {/* <th className="py-3.5 px-4 sm:px-6">Details</th> */}
                          <th className="py-3.5 px-4 sm:px-6">Scheduled / Date</th>
                          <th className="py-3.5 px-4 sm:px-6">Status</th>
                          <th className="py-3.5 px-4 sm:px-6 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 text-sm font-medium text-slate-700">
                        {filtered.map(req => {
                          const customer = req.customerId;
                          const scheduledDate = req.scheduledTime
                            ? new Date(req.scheduledTime).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                            : null;
                          const createdDate = new Date(req.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

                          return (
                            <tr key={req._id} className="hover:bg-slate-50/60 transition-colors">
                              <td className="py-4 px-4 sm:px-6">
                                <div className="flex items-center gap-3">
                                  <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-700 text-white font-bold text-sm flex items-center justify-center shrink-0">
                                    {customer?.name?.[0]?.toUpperCase() || <User size={16} />}
                                  </div>
                                  <div className="min-w-0">
                                    <p className="font-bold text-slate-900 truncate">{customer?.name || 'Customer'}</p>
                                    <p className="text-xs text-slate-400 truncate">{customer?.email || ''}</p>
                                  </div>
                                </div>
                              </td>
                              <td className="py-4 px-4 sm:px-6 whitespace-nowrap text-slate-900 font-semibold">
                                {req.serviceType}
                              </td>
                              {/* <td className="py-4 px-4 sm:px-6 max-w-xs truncate text-slate-600" title={req.details}>
                                {req.details}
                              </td> */}
                              <td className="py-4 px-4 sm:px-6 whitespace-nowrap text-xs text-slate-500">
                                {scheduledDate ? (
                                  <div>
                                    <p className="font-semibold text-slate-700">{scheduledDate}</p>
                                    <p className="text-[11px] text-slate-400">Created: {createdDate}</p>
                                  </div>
                                ) : (
                                  createdDate
                                )}
                              </td>
                              <td className="py-4 px-4 sm:px-6 whitespace-nowrap">
                                <StatusBadge status={req.status} />
                              </td>
                              <td className="py-4 px-4 sm:px-6 whitespace-nowrap text-right">
                                <div className="flex items-center justify-end gap-2">
                                  {req.status === 'pending' ? (
                                    <>
                                      <button
                                        onClick={() => handleAcceptRequest(req._id)}
                                        className="px-3.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer bg-blue-700 text-white border-none transition-all hover:bg-blue-900"
                                      >
                                        Accept
                                      </button>
                                      <button
                                        onClick={() => setConfirmRejectId(req._id)}
                                        className="px-3.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer bg-red-50 text-red-500 border-none transition-all hover:bg-red-500 hover:text-white"
                                      >
                                        Reject
                                      </button>
                                    </>
                                  ) : (
                                    <button
                                      onClick={() => setViewRequestId(req._id)}
                                      className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 bg-blue-50 border-none rounded-lg px-3 py-1.5 cursor-pointer transition-all hover:bg-blue-700 hover:text-white"
                                    >
                                      View Details <ChevronRight size={14} />
                                    </button>
                                  )}
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </section>
          </>
        )}

        {activeTab === 'emergencies' && <EmergencyRequests />}

        {activeTab === 'analytics' && (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400 text-center">
            <TrendingUp size={56} color="#D1D5DB" />
            <h3 className="text-lg font-bold text-slate-500">Analytics coming soon</h3>
            <p className="text-sm">We are working on bringing you detailed insights into your performance.</p>
          </div>
        )}
        {activeTab === 'reviews' && (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400 text-center">
            <Star size={56} color="#D1D5DB" />
            <h3 className="text-lg font-bold text-slate-500">Reviews coming soon</h3>
            <p className="text-sm">See what your customers are saying about your services.</p>
          </div>
        )}
        {activeTab === 'services' && (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400 text-center">
            <Briefcase size={56} color="#D1D5DB" />
            <h3 className="text-lg font-bold text-slate-500">Service Management coming soon</h3>
            <p className="text-sm">Update your offerings and pricing here.</p>
          </div>
        )}
        </div>
      </main>

      {/* ── Reject confirmation modal ── */}
      {confirmRejectId && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-[4px] z-[200] flex items-center justify-center p-4 sm:p-6"
          onClick={() => setConfirmRejectId(null)}>
          <div className="bg-white rounded-3xl w-full max-w-[480px] p-5 sm:p-7 shadow-[0_20px_60px_rgba(0,0,0,0.18)]"
            onClick={e => e.stopPropagation()}>
            <div className="mb-6">
              <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mb-5">
                <AlertCircle size={24} color="#EF4444" />
              </div>
              <h2 className="text-xl font-extrabold text-slate-900">Reject Request?</h2>
              <p className="text-[13px] text-slate-500 mt-0.5">This action cannot be undone. The customer will be notified.</p>
            </div>
            <div className="flex gap-3 mt-8">
              <button className="flex-1 py-3 rounded-xl bg-slate-100 border-none font-semibold text-slate-500 cursor-pointer transition-all hover:bg-slate-200 hover:text-slate-700"
                onClick={() => setConfirmRejectId(null)}>Cancel</button>
              <button className="flex-[1.5] py-3 rounded-xl border-none font-bold text-white cursor-pointer bg-red-500 transition-all hover:bg-red-600 hover:shadow-[0_4px_12px_rgba(239,68,68,0.25)]"
                onClick={() => { handleRejectRequest(confirmRejectId); setConfirmRejectId(null); }}>Yes, Reject</button>
            </div>
          </div>
        </div>
      )}

      {viewRequestId && (
        <ProviderDetails requestId={viewRequestId} onClose={() => setViewRequestId(null)}
          onSuccess={() => { setViewRequestId(null); fetchRequests(); }} />
      )}
    </div>
  );
}