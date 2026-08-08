import React, { useState, useRef, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Menu, User, HelpCircle, Share2, Languages, LogOut } from 'lucide-react';
import NotificationBell from './NotificationBell';
import { logout } from '../app/slices/authSlice';

export default function PageHeader({ title: customTitle, breadcrumb: customBreadcrumb, onMenuClick }) {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(s => s.auth);
  const [profileOpen, setProfileOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  // Generate dynamic breadcrumb segments from current location pathname
  const pathSegments = location.pathname.split('/').filter(Boolean);

  // Format segment name nicely (e.g. "provider-dashboard" -> "Provider Dashboard")
  const formatName = (segment) => {
    return segment
      .replace(/-/g, ' ')
      .replace(/([a-z])([A-Z])/g, '$1 $2')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const breadcrumbItems = pathSegments.map((segment, index) => {
    const path = `/${pathSegments.slice(0, index + 1).join('/')}`;
    return {
      name: formatName(segment),
      path,
      isLast: index === pathSegments.length - 1
    };
  });

  return (
    <header className="flex items-center justify-between py-3 px-4 sm:px-6 bg-white border-b border-slate-200 sticky top-0 z-30 mb-4">
      {/* Left side: Hamburger menu (mobile) + Dynamic Breadcrumb navigation */}
      <div className="flex items-center gap-3">
        {onMenuClick && (
          <button
            onClick={onMenuClick}
            className="lg:hidden w-9 h-9 flex items-center justify-center bg-slate-50 hover:bg-slate-100 rounded-lg border border-slate-200 text-slate-600 transition-colors"
          >
            <Menu size={18} />
          </button>
        )}
        
        <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-500">
          {customBreadcrumb ? (
            <>
              <span className="hover:text-slate-800 transition-colors cursor-pointer">{customBreadcrumb}</span>
              {customTitle && customTitle !== customBreadcrumb && (
                <>
                  <span className="text-slate-300">/</span>
                  <span className="font-semibold text-slate-900">{customTitle}</span>
                </>
              )}
            </>
          ) : (
            <>
              <Link to="/dashboard" className="hover:text-slate-800 transition-colors">
                Dashboard
              </Link>
              {breadcrumbItems.map((item) => (
                <React.Fragment key={item.path}>
                  <span className="text-slate-300">/</span>
                  {item.isLast ? (
                    <span className="font-semibold text-slate-900">
                      {customTitle || item.name}
                    </span>
                  ) : (
                    <Link to={item.path} className="hover:text-slate-800 transition-colors">
                      {item.name}
                    </Link>
                  )}
                </React.Fragment>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Right side: Action icons & Profile Circle Avatar */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        <button title="Help & Support" className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg text-amber-600 hover:bg-amber-50 border border-transparent transition-colors">
          <HelpCircle size={18} />
        </button>

        <NotificationBell />

        <button title="Share" className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 border border-transparent transition-colors">
          <Share2 size={18} />
        </button>

        <button title="Language" className="w-8 h-8 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 border border-slate-200 transition-colors">
          <Languages size={17} />
        </button>

        {/* Profile Option Dropdown */}
        <div className="ml-1 pl-2 border-l border-slate-200 relative" ref={dropdownRef}>
          <button
            onClick={() => setProfileOpen(prev => !prev)}
            title="Profile"
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-indigo-600 text-white font-bold text-sm border border-indigo-700 flex items-center justify-center hover:bg-indigo-700 transition-all shadow-sm cursor-pointer"
          >
            {user?.name?.[0]?.toUpperCase() || <User size={20} />}
          </button>

          {profileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-slate-100 py-1 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-sm font-bold text-slate-800 truncate">{user?.name || 'User Profile'}</p>
                <p className="text-xs text-slate-400 truncate">{user?.email || 'Service Provider'}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-red-600 hover:bg-red-50 text-left cursor-pointer transition-colors"
              >
                <LogOut size={15} />
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
