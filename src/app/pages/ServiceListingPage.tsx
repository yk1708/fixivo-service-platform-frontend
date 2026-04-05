import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { SlidersHorizontal, X, ChevronDown, MapPin, Search, Filter, CheckCircle } from 'lucide-react';
import { WorkerCard, Worker } from '../components/WorkerCard';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { getVerifiedProviders, providerToWorker, sendServiceRequest, isLoggedIn } from '../lib/api';

const WORKER_IMAGES = [
  'https://images.unsplash.com/photo-1606384682764-c3065dbcaf85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
  'https://images.unsplash.com/photo-1741418570708-498ebc098b96?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
  'https://images.unsplash.com/photo-1581578949510-fa7315c4c350?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
  'https://images.unsplash.com/photo-1740754699699-c8b4b1635faf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
  'https://images.unsplash.com/photo-1758798157512-f0a864c696c9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
  'https://images.unsplash.com/photo-1688372199140-cade7ae820fe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
];

// Workers are fetched from the backend API

const sortOptions = ['Relevance', 'Rating: High to Low', 'Price: Low to High', 'Price: High to Low', 'Most Reviewed'];

const categoryTitles: Record<string, string> = {
  all: 'All Services',
  plumbing: 'Plumbing Services',
  electrical: 'Electrical Services',
  'ac-repair': 'AC Repair & Servicing',
  cleaning: 'Home Cleaning Services',
  painting: 'Painting Services',
  carpentry: 'Carpentry Services',
  'appliance-repair': 'Appliance Repair',
  'pest-control': 'Pest Control',
};

export function ServiceListingPage() {
  const { category } = useParams();
  const navigate = useNavigate();
  const [allWorkers, setAllWorkers] = useState<Worker[]>([]);
  const [loadingWorkers, setLoadingWorkers] = useState(true);
  const [sortBy, setSortBy] = useState('Relevance');
  const [minRating, setMinRating] = useState(0);
  const [availableOnly, setAvailableOnly] = useState(false);
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [priceRange, setPriceRange] = useState(500);
  const [currentPage, setCurrentPage] = useState(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [requestModal, setRequestModal] = useState<{ open: boolean; workerId: string; workerName: string; serviceType: string }>({ open: false, workerId: '', workerName: '', serviceType: '' });
  const [requestDetails, setRequestDetails] = useState('');
  const [requestStatus, setRequestStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [requestError, setRequestError] = useState('');

  useEffect(() => {
    setLoadingWorkers(true);
    getVerifiedProviders()
      .then(providers => {
        const workers = providers.map((p, i) => ({
          ...providerToWorker(p),
          image: WORKER_IMAGES[i % WORKER_IMAGES.length],
        }));
        setAllWorkers(workers);
      })
      .catch(() => {
        setAllWorkers([]);
      })
      .finally(() => setLoadingWorkers(false));
  }, []);

  const handleSendRequest = (workerId: string) => {
    if (!isLoggedIn()) {
      navigate('/login');
      return;
    }
    const worker = allWorkers.find(w => w.id === workerId);
    setRequestModal({
      open: true,
      workerId,
      workerName: worker?.name || 'Professional',
      serviceType: worker?.profession || 'Service',
    });
  };

  const handleConfirmRequest = async () => {
    if (!requestDetails.trim()) {
      setRequestError('Please describe what you need.');
      return;
    }
    setRequestStatus('sending');
    setRequestError('');
    try {
      await sendServiceRequest({
        providerId: requestModal.workerId,
        requestDetails: {
          serviceType: requestModal.serviceType,
          details: requestDetails,
        },
      });
      setRequestStatus('success');
    } catch (err: any) {
      setRequestError(err.message || 'Failed to send request');
      setRequestStatus('error');
    }
  };

  const title = categoryTitles[category || 'all'] || 'All Services';
  const workersPerPage = 6;

  const filtered = allWorkers.filter(w => {
    // Filter by category (match serviceType)
    if (category && category !== 'all') {
      const catLower = category.replace(/-/g, ' ').toLowerCase();
      if (!w.profession.toLowerCase().includes(catLower) &&
          !(w as any).serviceType?.toLowerCase().includes(catLower)) return false;
    }
    if (minRating > 0 && w.rating < minRating) return false;
    if (availableOnly && !w.availability.toLowerCase().includes('today')) return false;
    if (verifiedOnly && !w.verified) return false;
    const price = parseInt(w.price.replace('₹', ''));
    if (!isNaN(price) && price > priceRange) return false;
    if (searchQuery && !w.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
      !w.profession.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  const totalPages = Math.ceil(filtered.length / workersPerPage);
  const paginatedWorkers = filtered.slice((currentPage - 1) * workersPerPage, currentPage * workersPerPage);

  const FilterSidebar = () => (
    <div className="space-y-6">
      {/* Rating Filter */}
      <div>
        <h4 className="text-gray-900 text-sm mb-3" style={{ fontWeight: 700 }}>Minimum Rating</h4>
        <div className="space-y-2">
          {[4.5, 4.0, 3.5, 0].map((r) => (
            <label key={r} className="flex items-center gap-2 cursor-pointer group">
              <input
                type="radio"
                name="rating"
                checked={minRating === r}
                onChange={() => setMinRating(r)}
                className="accent-[#1E40AF]"
              />
              <span className="text-sm text-gray-600 group-hover:text-[#1E40AF] transition-colors">
                {r === 0 ? 'Any Rating' : `${r}★ & above`}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h4 className="text-gray-900 text-sm mb-3" style={{ fontWeight: 700 }}>Max Price per hour</h4>
        <input
          type="range"
          min={100}
          max={1000}
          step={50}
          value={priceRange}
          onChange={(e) => setPriceRange(parseInt(e.target.value))}
          className="w-full accent-[#1E40AF]"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>₹100</span>
          <span className="text-[#1E40AF]" style={{ fontWeight: 600 }}>₹{priceRange}</span>
          <span>₹1000</span>
        </div>
      </div>

      {/* Availability */}
      <div>
        <h4 className="text-gray-900 text-sm mb-3" style={{ fontWeight: 700 }}>Availability</h4>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={availableOnly}
            onChange={(e) => setAvailableOnly(e.target.checked)}
            className="accent-[#1E40AF] w-4 h-4"
          />
          <span className="text-sm text-gray-600">Available Today Only</span>
        </label>
      </div>

      {/* Verified Only */}
      <div>
        <h4 className="text-gray-900 text-sm mb-3" style={{ fontWeight: 700 }}>Verification</h4>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={verifiedOnly}
            onChange={(e) => setVerifiedOnly(e.target.checked)}
            className="accent-[#1E40AF] w-4 h-4"
          />
          <span className="text-sm text-gray-600">Verified Professionals Only</span>
        </label>
      </div>

      {/* Distance */}
      <div>
        <h4 className="text-gray-900 text-sm mb-3" style={{ fontWeight: 700 }}>Distance</h4>
        <div className="space-y-2">
          {['Within 2 km', 'Within 5 km', 'Within 10 km', 'Any Distance'].map((d) => (
            <label key={d} className="flex items-center gap-2 cursor-pointer">
              <input type="radio" name="distance" className="accent-[#1E40AF]" defaultChecked={d === 'Within 5 km'} />
              <span className="text-sm text-gray-600">{d}</span>
            </label>
          ))}
        </div>
      </div>

      <button
        onClick={() => { setMinRating(0); setAvailableOnly(false); setVerifiedOnly(false); setPriceRange(500); }}
        className="w-full py-2.5 border border-gray-200 text-gray-500 rounded-xl text-sm hover:border-[#1E40AF] hover:text-[#1E40AF] transition-colors"
        style={{ fontWeight: 500 }}
      >
        Clear All Filters
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F9FAFB]" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Breadcrumb & Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                <button onClick={() => navigate('/')} className="hover:text-[#1E40AF] transition-colors">Home</button>
                <span>/</span>
                <span className="text-gray-700" style={{ fontWeight: 500 }}>Services</span>
                <span>/</span>
                <span className="text-[#1E40AF]" style={{ fontWeight: 600 }}>{title}</span>
              </div>
              <h1 className="text-2xl text-gray-900" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}>
                {title}
              </h1>
              <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
                <MapPin className="w-3.5 h-3.5 text-[#F97316]" />
                <span>Mumbai, Maharashtra</span>
                <span>·</span>
                <span>{filtered.length} professionals found</span>
              </div>
            </div>

            {/* Search bar */}
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 w-full sm:w-64">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search professionals..."
                className="bg-transparent text-sm text-gray-700 outline-none w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar (Desktop) */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <div className="flex items-center gap-2 mb-6">
                <SlidersHorizontal className="w-4 h-4 text-[#1E40AF]" />
                <h3 className="text-gray-900" style={{ fontWeight: 700 }}>Filters</h3>
              </div>
              <FilterSidebar />
            </div>
          </aside>

          {/* Main Content */}
          <div className="flex-1 min-w-0">
            {/* Sort & Mobile Filter bar */}
            <div className="flex items-center justify-between mb-6 gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-500">{filtered.length} results</span>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setIsMobileFilterOpen(true)}
                  className="lg:hidden flex items-center gap-2 bg-white border border-gray-200 px-4 py-2.5 rounded-xl text-sm hover:border-[#1E40AF] transition-colors"
                  style={{ fontWeight: 500 }}
                >
                  <Filter className="w-4 h-4" /> Filters
                </button>
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-white border border-gray-200 text-gray-700 text-sm px-4 py-2.5 pr-8 rounded-xl outline-none hover:border-[#1E40AF] transition-colors cursor-pointer"
                    style={{ fontWeight: 500 }}
                  >
                    {sortOptions.map(o => <option key={o} value={o}>{o}</option>)}
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Worker Grid */}
            {paginatedWorkers.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {paginatedWorkers.map((worker) => (
                  <WorkerCard key={worker.id} worker={worker} onRequest={handleSendRequest} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="text-gray-300 text-6xl mb-4">🔍</div>
                <h3 className="text-gray-700 text-lg mb-2" style={{ fontWeight: 600 }}>No professionals found</h3>
                <p className="text-gray-400 text-sm">Try adjusting your filters or search query.</p>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 text-sm bg-white border border-gray-200 rounded-xl disabled:opacity-40 hover:border-[#1E40AF] hover:text-[#1E40AF] transition-colors"
                  style={{ fontWeight: 500 }}
                >
                  ← Previous
                </button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`w-10 h-10 text-sm rounded-xl transition-colors ${currentPage === page
                      ? 'bg-[#1E40AF] text-white shadow-sm'
                      : 'bg-white border border-gray-200 text-gray-600 hover:border-[#1E40AF]'
                      }`}
                    style={{ fontWeight: 500 }}
                  >
                    {page}
                  </button>
                ))}
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="px-4 py-2 text-sm bg-white border border-gray-200 rounded-xl disabled:opacity-40 hover:border-[#1E40AF] hover:text-[#1E40AF] transition-colors"
                  style={{ fontWeight: 500 }}
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileFilterOpen(false)}></div>
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-gray-900" style={{ fontWeight: 700 }}>Filters</h3>
              <button onClick={() => setIsMobileFilterOpen(false)}>
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <FilterSidebar />
            <button
              onClick={() => setIsMobileFilterOpen(false)}
              className="w-full mt-6 py-3.5 bg-[#1E40AF] text-white rounded-2xl"
              style={{ fontWeight: 600 }}
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}

      {/* Send Request Modal */}
      {requestModal.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => { setRequestModal({ ...requestModal, open: false }); setRequestStatus('idle'); setRequestError(''); setRequestDetails(''); }}></div>
          <div className="relative bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            {requestStatus === 'success' ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-[#ECFDF5] rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle className="w-8 h-8 text-[#10B981]" />
                </div>
                <h3 className="text-xl text-gray-900 mb-2" style={{ fontWeight: 700 }}>Request Sent!</h3>
                <p className="text-gray-500 text-sm mb-6">Your request has been sent to {requestModal.workerName}.</p>
                <button
                  onClick={() => { setRequestModal({ ...requestModal, open: false }); setRequestStatus('idle'); setRequestDetails(''); }}
                  className="px-8 py-3 bg-[#1E40AF] text-white rounded-2xl text-sm"
                  style={{ fontWeight: 700 }}
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <h3 className="text-xl text-gray-900 mb-2 text-center" style={{ fontWeight: 700 }}>Send Request</h3>
                <p className="text-gray-500 text-sm mb-4 text-center">Send a service request to {requestModal.workerName}</p>
                <div className="mb-4">
                  <label className="block text-gray-700 text-xs mb-1.5" style={{ fontWeight: 600 }}>Describe your requirement *</label>
                  <textarea
                    rows={3}
                    placeholder="E.g., Need pipe repair in bathroom..."
                    value={requestDetails}
                    onChange={e => setRequestDetails(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-700 outline-none focus:border-[#1E40AF] focus:bg-white transition-all resize-none"
                  />
                </div>
                {requestError && <div className="text-red-500 text-xs mb-3 text-center">{requestError}</div>}
                <div className="flex gap-3">
                  <button
                    onClick={() => { setRequestModal({ ...requestModal, open: false }); setRequestStatus('idle'); setRequestError(''); setRequestDetails(''); }}
                    className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-2xl text-sm"
                    style={{ fontWeight: 500 }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmRequest}
                    disabled={requestStatus === 'sending'}
                    className="flex-1 py-3 bg-[#1E40AF] text-white rounded-2xl text-sm disabled:opacity-60"
                    style={{ fontWeight: 700 }}
                  >
                    {requestStatus === 'sending' ? 'Sending...' : 'Send Request'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
