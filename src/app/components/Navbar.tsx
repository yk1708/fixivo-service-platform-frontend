import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router';
import { Menu, X, MapPin, ChevronDown, Wrench, LogOut, User } from 'lucide-react';
import { isLoggedIn, getStoredUser, logout } from '../lib/api';

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    setLoggedIn(isLoggedIn());
    const user = getStoredUser();
    if (user) setUserName(user.name);
  }, []);

  const handleLogout = async () => {
    await logout();
    setLoggedIn(false);
    setUserName('');
    navigate('/');
  };

  const categories = [
    'Plumbing', 'Electrical', 'AC Repair', 'Cleaning', 'Painting', 'Carpentry', 'Appliance Repair',
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-8 h-8 bg-[#1E40AF] rounded-xl flex items-center justify-center">
              <Wrench className="w-4 h-4 text-white" />
            </div>
            <span
              className="text-xl text-[#1E40AF]"
              style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}
            >
              Fixivo
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-gray-600 hover:text-[#1E40AF] transition-colors text-sm"
              style={{ fontWeight: 500 }}
            >
              Home
            </Link>
            <div className="relative group">
              <button className="flex items-center gap-1 text-gray-600 hover:text-[#1E40AF] transition-colors text-sm" style={{ fontWeight: 500 }}>
                Services <ChevronDown className="w-3 h-3" />
              </button>
              <div className="absolute top-full left-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                {categories.map((cat) => (
                  <Link
                    key={cat}
                    to={`/services/${cat.toLowerCase().replace(' ', '-')}`}
                    className="block px-4 py-2.5 text-sm text-gray-600 hover:text-[#1E40AF] hover:bg-blue-50 transition-colors"
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </div>
            <Link
              to="/become-partner"
              className="text-gray-600 hover:text-[#1E40AF] transition-colors text-sm"
              style={{ fontWeight: 500 }}
            >
              For Professionals
            </Link>
          </div>

          {/* Location */}
          <div className="hidden lg:flex items-center gap-1.5 text-sm text-gray-500 cursor-pointer hover:text-[#1E40AF] transition-colors bg-gray-50 px-3 py-2 rounded-xl border border-gray-100">
            <MapPin className="w-3.5 h-3.5 text-[#F97316]" />
            <span style={{ fontWeight: 500 }}>Mumbai</span>
            <ChevronDown className="w-3 h-3" />
          </div>

          {/* Desktop CTAs */}
          <div className="hidden md:flex items-center gap-2">
            {loggedIn ? (
              <>
                <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-xl border border-gray-100">
                  <User className="w-4 h-4 text-[#1E40AF]" />
                  <span className="text-sm text-gray-700" style={{ fontWeight: 500 }}>{userName}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-1.5 px-4 py-2 text-red-500 border border-red-200 rounded-xl text-sm hover:bg-red-50 transition-all duration-200"
                  style={{ fontWeight: 500 }}
                >
                  <LogOut className="w-3.5 h-3.5" />
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="px-4 py-2 text-[#1E40AF] border border-[#1E40AF] rounded-xl text-sm hover:bg-[#1E40AF] hover:text-white transition-all duration-200"
                  style={{ fontWeight: 500 }}
                >
                  Login
                </Link>
                <Link
                  to="/login?tab=signup"
                  className="px-4 py-2 bg-[#1E40AF] text-white rounded-xl text-sm hover:bg-blue-900 transition-all duration-200 shadow-sm"
                  style={{ fontWeight: 500 }}
                >
                  Sign Up
                </Link>
              </>
            )}
            <Link
              to="/become-partner"
              className="px-4 py-2 bg-[#F97316] text-white rounded-xl text-sm hover:bg-orange-600 transition-all duration-200 shadow-sm"
              style={{ fontWeight: 500 }}
            >
              Become a Partner
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100 bg-white">
            <div className="flex flex-col gap-1">
              <Link
                to="/"
                className="px-2 py-2.5 text-gray-600 text-sm rounded-lg hover:bg-gray-50 transition-colors"
                style={{ fontWeight: 500 }}
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/services/all"
                className="px-2 py-2.5 text-gray-600 text-sm rounded-lg hover:bg-gray-50 transition-colors"
                style={{ fontWeight: 500 }}
                onClick={() => setIsMenuOpen(false)}
              >
                Services
              </Link>
              <Link
                to="/become-partner"
                className="px-2 py-2.5 text-gray-600 text-sm rounded-lg hover:bg-gray-50 transition-colors"
                style={{ fontWeight: 500 }}
                onClick={() => setIsMenuOpen(false)}
              >
                For Professionals
              </Link>
              <div className="flex items-center gap-1.5 px-2 py-2.5 text-sm text-gray-500 border-t border-gray-100 mt-1">
                <MapPin className="w-3.5 h-3.5 text-[#F97316]" />
                <span>Mumbai</span>
              </div>
              {loggedIn ? (
                <div className="flex flex-col gap-2 pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-2 px-2 py-2.5 text-sm text-gray-700">
                    <User className="w-4 h-4 text-[#1E40AF]" />
                    <span style={{ fontWeight: 500 }}>{userName}</span>
                  </div>
                  <button
                    onClick={() => { handleLogout(); setIsMenuOpen(false); }}
                    className="py-2.5 text-center text-red-500 border border-red-200 rounded-xl text-sm"
                    style={{ fontWeight: 500 }}
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex gap-2 pt-2 border-t border-gray-100">
                  <Link
                    to="/login"
                    className="flex-1 py-2.5 text-center text-[#1E40AF] border border-[#1E40AF] rounded-xl text-sm"
                    style={{ fontWeight: 500 }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/login?tab=signup"
                    className="flex-1 py-2.5 text-center bg-[#1E40AF] text-white rounded-xl text-sm"
                    style={{ fontWeight: 500 }}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </div>
              )}
              <Link
                to="/become-partner"
                className="py-2.5 text-center bg-[#F97316] text-white rounded-xl text-sm mt-1"
                style={{ fontWeight: 500 }}
                onClick={() => setIsMenuOpen(false)}
              >
                Become a Partner
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
