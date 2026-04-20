import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { Bell, X, Check, AlertTriangle, MessageSquare, Star, FileText } from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_FIXIVO_APP_API_URL;

const TYPE_CONFIG = {
  emergency: { icon: AlertTriangle, color: '#DC2626', bg: '#FEF2F2', label: 'Emergency' },
  request:   { icon: FileText,      color: '#F59E0B', bg: '#FFFBEB', label: 'Request' },
  message:   { icon: MessageSquare, color: '#3B82F6', bg: '#EFF6FF', label: 'Message' },
  review:    { icon: Star,          color: '#8B5CF6', bg: '#F5F3FF', label: 'Review' },
};

export default function NotificationBell() {
  const { accessToken } = useSelector(s => s.auth);
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const token = accessToken || localStorage.getItem('accessToken');
      const res = await fetch(`${API_BASE_URL}/api/notification`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to fetch notifications');
      const data = await res.json();
      setNotifications(data.notifications || []);
    } catch (err) {
      console.error('Notification fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [accessToken]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  const markAsRead = async (id) => {
    try {
      const token = accessToken || localStorage.getItem('accessToken');
      await fetch(`${API_BASE_URL}/api/notification/${id}/read`, {
        method: 'PATCH',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setNotifications(prev =>
        prev.map(n => n._id === id ? { ...n, isRead: true, readAt: new Date() } : n)
      );
    } catch (err) {
      console.error('Mark read error:', err);
    }
  };

  const timeAgo = (date) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

  return (
    <div className="notif-bell-wrapper" ref={dropdownRef}>
      <button
        className="notif-bell-btn"
        onClick={() => { setOpen(o => !o); if (!open) fetchNotifications(); }}
        title="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span className="notif-bell-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>
        )}
      </button>

      {open && (
        <div className="notif-dropdown">
          <div className="notif-dropdown-header">
            <h3 style={{ fontWeight: 700, fontSize: '0.95rem' }}>Notifications</h3>
            <button onClick={() => setOpen(false)} className="notif-close-btn">
              <X size={16} />
            </button>
          </div>

          <div className="notif-dropdown-body">
            {loading && notifications.length === 0 ? (
              <div className="notif-empty">Loading…</div>
            ) : notifications.length === 0 ? (
              <div className="notif-empty">
                <Bell size={32} color="#D1D5DB" />
                <p>No notifications yet</p>
              </div>
            ) : (
              notifications.map(n => {
                const cfg = TYPE_CONFIG[n.type] || TYPE_CONFIG.request;
                const Icon = cfg.icon;
                return (
                  <div
                    key={n._id}
                    className={`notif-item ${n.isRead ? '' : 'unread'}`}
                    onClick={() => !n.isRead && markAsRead(n._id)}
                  >
                    <div className="notif-item-icon" style={{ background: cfg.bg }}>
                      <Icon size={16} style={{ color: cfg.color }} />
                    </div>
                    <div className="notif-item-content">
                      <p className="notif-item-msg">{n.message}</p>
                      <span className="notif-item-time">{timeAgo(n.createdAt)}</span>
                    </div>
                    {!n.isRead && (
                      <div className="notif-unread-dot" />
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}
