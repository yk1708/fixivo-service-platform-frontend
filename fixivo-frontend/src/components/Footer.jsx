import { Link } from 'react-router';
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa';
import { Wrench, MapPin, Phone, Mail } from 'lucide-react';
export function Footer() {
  return (
    <footer className="bg-[#0F172A] text-gray-400" style={{ fontFamily: "'Inter', sans-serif" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-[#1E40AF] rounded-xl flex items-center justify-center">
                <Wrench className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl text-white" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}>
                Fixivo
              </span>
            </div>
            <p className="text-sm leading-relaxed mb-6 max-w-xs">
              India's most trusted home services platform. Connecting verified professionals with homeowners across the country.
            </p>
            <div className="flex flex-col gap-3 text-sm mb-6">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#F97316]" />
                <span>Mumbai, Maharashtra, India</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#F97316]" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#F97316]" />
                <span>support@fixivo.in</span>
              </div>
            </div>
            {/* Social Icons */}
            <div className="flex items-center gap-3">
              {[FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-9 h-9 bg-white/10 rounded-xl flex items-center justify-center hover:bg-[#1E40AF] transition-colors duration-200"
                >
                  <Icon className="w-4 h-4 text-gray-400 hover:text-white" />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white text-sm mb-5" style={{ fontWeight: 600 }}>Services</h4>
            <ul className="flex flex-col gap-3 text-sm">
              {['Plumbing', 'Electrical', 'AC Repair', 'Cleaning', 'Painting', 'Carpentry', 'Appliance Repair'].map(s => (
                <li key={s}>
                  <Link
                    to={`/services/${s.toLowerCase().replace(' ', '-')}`}
                    className="hover:text-[#F97316] transition-colors"
                  >
                    {s}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white text-sm mb-5" style={{ fontWeight: 600 }}>Company</h4>
            <ul className="flex flex-col gap-3 text-sm">
              {[
                { label: 'About Us', to: '#' },
                { label: 'How It Works', to: '#' },
                { label: 'Careers', to: '#' },
                { label: 'Press', to: '#' },
                { label: 'Blog', to: '#' },
                { label: 'Become a Partner', to: '/become-partner' },
              ].map(item => (
                <li key={item.label}>
                  <Link to={item.to} className="hover:text-[#F97316] transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white text-sm mb-5" style={{ fontWeight: 600 }}>Support</h4>
            <ul className="flex flex-col gap-3 text-sm">
              {[
                { label: 'Help Center', to: '#' },
                { label: 'Contact Us', to: '#' },
                { label: 'Privacy Policy', to: '#' },
                { label: 'Terms of Service', to: '#' },
                { label: 'Refund Policy', to: '#' },
                { label: 'Cookie Policy', to: '#' },
              ].map(item => (
                <li key={item.label}>
                  <Link to={item.to} className="hover:text-[#F97316] transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* App Downloads */}
        <div className="border-t border-white/10 pt-8 pb-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm">Download the Fixivo App</p>
            <div className="flex items-center gap-3">
              <a href="#" className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors px-4 py-2.5 rounded-xl">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white"><path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.7 9.05 7.43c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.39-1.32 2.76-2.54 3.96M12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25"/></svg>
                <div className="text-left">
                  <div className="text-[10px] text-gray-400">Download on the</div>
                  <div className="text-xs text-white" style={{ fontWeight: 600 }}>App Store</div>
                </div>
              </a>
              <a href="#" className="flex items-center gap-2 bg-white/10 hover:bg-white/20 transition-colors px-4 py-2.5 rounded-xl">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-white"><path d="m12.954 11.616 2.957-2.957L6.36 3.291c-.633-.342-1.226-.39-1.66-.09l8.254 8.415zm3.461 3.462 3.074-1.729c.6-.336.929-.812.929-1.34s-.329-1.004-.929-1.34l-2.131-1.198-3.31 3.31 2.367 2.297zM4.1 4.002c-.064.197-.1.417-.1.658v14.705c0 .381.084.709.236.97l8.097-8.202L4.1 4.002zm8.854 8.745-8.212 8.322c.437.314 1.04.271 1.675-.074l10.03-5.634-3.493-2.614z"/></svg>
                <div className="text-left">
                  <div className="text-[10px] text-gray-400">Get it on</div>
                  <div className="text-xs text-white" style={{ fontWeight: 600 }}>Google Play</div>
                </div>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-gray-500">
          <p>© 2026 Fixivo Technologies Pvt. Ltd. All rights reserved.</p>
          <p>Made with ❤️ in India 🇮🇳</p>
        </div>
      </div>
    </footer>
  );
}
