import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import {
  MapPin, Clock, BadgeCheck, Star, Phone, MessageCircle,
  Calendar, ChevronLeft, Award, Briefcase, ThumbsUp, Share2
} from 'lucide-react';
import { RatingStars } from '../components/RatingStars';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { getVerifiedProviders, sendServiceRequest, isLoggedIn, ProviderData } from '../lib/api';

const DEFAULT_IMG = 'https://images.unsplash.com/photo-1606384682764-c3065dbcaf85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600';

const availableSlots = [
  { date: 'Today', slots: ['10:00 AM', '12:00 PM', '3:00 PM', '5:00 PM'] },
  { date: 'Tomorrow', slots: ['9:00 AM', '11:00 AM', '2:00 PM', '4:00 PM'] },
  { date: 'Wed, 20 Feb', slots: ['10:00 AM', '1:00 PM', '3:00 PM'] },
];

export function WorkerProfilePage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'about' | 'services' | 'reviews'>('about');
  const [selectedDate, setSelectedDate] = useState(availableSlots[0].date);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [provider, setProvider] = useState<ProviderData | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookingDetails, setBookingDetails] = useState('');
  const [bookingStatus, setBookingStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');
  const [bookingError, setBookingError] = useState('');

  useEffect(() => {
    getVerifiedProviders()
      .then(providers => {
        const found = providers.find(p => p._id === id);
        setProvider(found || null);
      })
      .catch(() => setProvider(null))
      .finally(() => setLoading(false));
  }, [id]);

  const handleBooking = async () => {
    if (!isLoggedIn()) {
      navigate('/login');
      return;
    }
    if (!provider || !bookingDetails.trim()) {
      setBookingError('Please provide details about the service you need.');
      return;
    }
    setBookingStatus('sending');
    setBookingError('');
    try {
      await sendServiceRequest({
        providerId: provider._id,
        requestDetails: {
          serviceType: provider.serviceType,
          details: bookingDetails,
          scheduledTime: selectedSlot ? `${selectedDate} ${selectedSlot}` : undefined,
        },
      });
      setBookingStatus('success');
    } catch (err: any) {
      setBookingError(err.message || 'Failed to send request');
      setBookingStatus('error');
    }
  };

  const currentSlots = availableSlots.find(s => s.date === selectedDate)?.slots || [];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
        <div className="text-gray-400">Loading professional profile...</div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9FAFB] gap-4">
        <div className="text-gray-500 text-lg">Professional not found</div>
        <button onClick={() => navigate(-1)} className="text-[#1E40AF] text-sm hover:underline">Go Back</button>
      </div>
    );
  }

  const providerName = typeof provider.userId === 'object' ? provider.userId.name : provider.name || 'Professional';
  const providerEmail = typeof provider.userId === 'object' ? provider.userId.email : provider.email || '';

  return (
    <div className="min-h-screen bg-[#F9FAFB]" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Back nav */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#1E40AF] transition-colors"
            style={{ fontWeight: 500 }}
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Listings
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Header */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="h-32 bg-gradient-to-r from-[#1E40AF] to-[#1D4ED8] relative">
                <div className="absolute inset-0 opacity-10">
                  <div className="w-full h-full" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
                </div>
              </div>
              <div className="px-6 pb-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-end gap-4 -mt-12 mb-4">
                  <div className="relative">
                    <ImageWithFallback
                      src={DEFAULT_IMG}
                      alt={providerName}
                      className="w-24 h-24 rounded-2xl object-cover border-4 border-white shadow-lg"
                    />
                    {provider.isVerified && (
                      <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-[#10B981] rounded-full flex items-center justify-center border-2 border-white">
                        <BadgeCheck className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <h1 className="text-2xl text-gray-900" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}>{providerName}</h1>
                      {provider.isVerified && (
                        <span className="flex items-center gap-1 bg-[#ECFDF5] text-[#10B981] text-xs px-2 py-0.5 rounded-full" style={{ fontWeight: 600 }}>
                          <BadgeCheck className="w-3 h-3" /> Verified
                        </span>
                      )}
                    </div>
                    <p className="text-[#1E40AF] text-sm mb-2" style={{ fontWeight: 600 }}>{provider.serviceType}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-[#F97316]" />
                        <span>{provider.location?.coordinates ? `${provider.location.coordinates[1]?.toFixed(2)}, ${provider.location.coordinates[0]?.toFixed(2)}` : 'Location not set'}</span>
                      </div>
                      {provider.experience && (
                        <div className="flex items-center gap-1">
                          <Briefcase className="w-3.5 h-3.5 text-[#1E40AF]" />
                          <span>{provider.experience} yrs experience</span>
                        </div>
                      )}
                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-[#10B981]" />
                        <span className="text-[#10B981]" style={{ fontWeight: 500 }}>{provider.availability || 'Available'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mt-auto">
                    <button className="p-2.5 border border-gray-200 rounded-xl hover:border-[#1E40AF] transition-colors">
                      <Share2 className="w-4 h-4 text-gray-500" />
                    </button>
                  </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-4 gap-4 pt-4 border-t border-gray-100">
                  {[
                    { icon: <Star className="w-4 h-4 text-amber-400" />, value: String(provider.rating || 0), label: 'Rating' },
                    { icon: <ThumbsUp className="w-4 h-4 text-[#10B981]" />, value: '0', label: 'Reviews' },
                    { icon: <Briefcase className="w-4 h-4 text-[#1E40AF]" />, value: provider.experience ? `${provider.experience}+` : 'N/A', label: 'Experience' },
                    { icon: <Award className="w-4 h-4 text-[#F97316]" />, value: provider.isVerified ? 'Verified' : 'Pending', label: 'Status' },
                  ].map(stat => (
                    <div key={stat.label} className="text-center">
                      <div className="flex justify-center mb-1">{stat.icon}</div>
                      <div className="text-gray-900 text-sm" style={{ fontWeight: 700 }}>{stat.value}</div>
                      <div className="text-gray-400 text-xs">{stat.label}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="flex border-b border-gray-100">
                {(['about', 'services', 'reviews'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`flex-1 py-4 text-sm capitalize transition-colors ${activeTab === tab
                      ? 'text-[#1E40AF] border-b-2 border-[#1E40AF] bg-blue-50/50'
                      : 'text-gray-500 hover:text-gray-700'
                      }`}
                    style={{ fontWeight: activeTab === tab ? 600 : 500 }}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {/* About Tab */}
                {activeTab === 'about' && (
                  <div className="space-y-5">
                    <div>
                      <h3 className="text-gray-900 text-base mb-3" style={{ fontWeight: 700 }}>About Professional</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {providerName} is a verified {provider.serviceType} professional
                        {provider.experience ? ` with ${provider.experience} years of experience` : ''}.
                        {provider.availability ? ` Currently ${provider.availability.toLowerCase()}.` : ''}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-gray-900 text-sm mb-3" style={{ fontWeight: 700 }}>Service Type</h4>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-[#EFF6FF] text-[#1E40AF] text-xs px-3 py-1.5 rounded-xl" style={{ fontWeight: 500 }}>
                          {provider.serviceType}
                        </span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      {[
                        { label: 'Email', value: providerEmail || 'Not provided' },
                        { label: 'Phone', value: provider.phone || 'Not provided' },
                        { label: 'Experience', value: provider.experience ? `${provider.experience} years` : 'Not specified' },
                        { label: 'Rating', value: provider.rating ? `${provider.rating} / 5` : 'No ratings yet' },
                      ].map(item => (
                        <div key={item.label} className="bg-gray-50 rounded-xl p-3">
                          <div className="text-gray-400 text-xs mb-1">{item.label}</div>
                          <div className="text-gray-800 text-sm" style={{ fontWeight: 600 }}>{item.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Services Tab */}
                {activeTab === 'services' && (
                  <div className="space-y-3">
                    <h3 className="text-gray-900 text-base mb-4" style={{ fontWeight: 700 }}>Services Offered</h3>
                    <div
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl hover:bg-blue-50 transition-colors group"
                    >
                      <div>
                        <div className="text-gray-900 text-sm" style={{ fontWeight: 600 }}>{provider.serviceType}</div>
                        <div className="text-gray-400 text-xs mt-0.5">Contact for pricing</div>
                      </div>
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => setShowBookingModal(true)}
                          className="px-4 py-2 bg-[#1E40AF] text-white text-xs rounded-xl hover:bg-blue-900 transition-colors"
                          style={{ fontWeight: 600 }}
                        >
                          Book
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Reviews Tab */}
                {activeTab === 'reviews' && (
                  <div className="space-y-5">
                    <div className="flex items-center gap-6 p-4 bg-gray-50 rounded-2xl">
                      <div className="text-center">
                        <div className="text-5xl text-gray-900 mb-1" style={{ fontWeight: 800 }}>{provider.rating || 0}</div>
                        <RatingStars rating={provider.rating || 0} size="md" />
                        <div className="text-gray-400 text-xs mt-1">0 reviews</div>
                      </div>
                    </div>
                    <div className="text-center py-8 text-gray-400 text-sm">
                      No reviews yet. Be the first to review this professional!
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className="space-y-6">
            {/* Book Now Card */}
            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <span className="text-gray-500 text-xs">Service Type</span>
                  <div className="text-xl text-[#1E40AF]" style={{ fontWeight: 800 }}>{provider.serviceType}</div>
                </div>
                <RatingStars rating={provider.rating || 0} size="sm" showNumber />
              </div>

              <div className="mb-5">
                <h4 className="text-gray-900 text-sm mb-3" style={{ fontWeight: 600 }}>Select Date</h4>
                <div className="flex gap-2">
                  {availableSlots.map(slot => (
                    <button
                      key={slot.date}
                      onClick={() => { setSelectedDate(slot.date); setSelectedSlot(''); }}
                      className={`flex-1 py-2 text-xs rounded-xl transition-colors ${selectedDate === slot.date
                        ? 'bg-[#1E40AF] text-white'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      style={{ fontWeight: 500 }}
                    >
                      {slot.date}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-gray-900 text-sm mb-3" style={{ fontWeight: 600 }}>Select Time Slot</h4>
                <div className="grid grid-cols-2 gap-2">
                  {currentSlots.map(slot => (
                    <button
                      key={slot}
                      onClick={() => setSelectedSlot(slot)}
                      className={`py-2.5 text-xs rounded-xl border transition-colors ${selectedSlot === slot
                        ? 'border-[#1E40AF] bg-[#EFF6FF] text-[#1E40AF]'
                        : 'border-gray-200 text-gray-600 hover:border-[#1E40AF]'
                        }`}
                      style={{ fontWeight: 500 }}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setShowBookingModal(true)}
                className="w-full py-3.5 bg-[#1E40AF] text-white rounded-2xl hover:bg-blue-900 transition-colors shadow-md"
                style={{ fontWeight: 700 }}
              >
                <Calendar className="w-4 h-4 inline mr-2" />
                Book Now
              </button>

              <div className="flex gap-2 mt-3">
                <button className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-2xl text-sm hover:border-[#1E40AF] hover:text-[#1E40AF] transition-colors flex items-center justify-center gap-1.5">
                  <MessageCircle className="w-4 h-4" />
                  <span style={{ fontWeight: 500 }}>Chat</span>
                </button>
                <button className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-2xl text-sm hover:border-[#10B981] hover:text-[#10B981] transition-colors flex items-center justify-center gap-1.5">
                  <Phone className="w-4 h-4" />
                  <span style={{ fontWeight: 500 }}>Call</span>
                </button>
              </div>

              <div className="mt-5 p-3 bg-[#ECFDF5] rounded-xl flex items-center gap-2">
                <BadgeCheck className="w-4 h-4 text-[#10B981] flex-shrink-0" />
                <span className="text-xs text-[#065F46]" style={{ fontWeight: 500 }}>
                  100% Satisfaction Guarantee. Pay only after job completion.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Booking Confirmation Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => { setShowBookingModal(false); setBookingStatus('idle'); setBookingError(''); }}></div>
          <div className="relative bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl">
            {bookingStatus === 'success' ? (
              <div className="text-center">
                <div className="w-16 h-16 bg-[#ECFDF5] rounded-full flex items-center justify-center mx-auto mb-4">
                  <BadgeCheck className="w-8 h-8 text-[#10B981]" />
                </div>
                <h3 className="text-xl text-gray-900 mb-2" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}>
                  Request Sent!
                </h3>
                <p className="text-gray-500 text-sm mb-6">Your service request has been sent to {providerName}. They will respond shortly.</p>
                <button
                  onClick={() => { setShowBookingModal(false); setBookingStatus('idle'); }}
                  className="px-8 py-3 bg-[#1E40AF] text-white rounded-2xl text-sm"
                  style={{ fontWeight: 700 }}
                >
                  Done
                </button>
              </div>
            ) : (
              <>
                <div className="text-center mb-6">
                  <div className="w-16 h-16 bg-[#ECFDF5] rounded-full flex items-center justify-center mx-auto mb-4">
                    <BadgeCheck className="w-8 h-8 text-[#10B981]" />
                  </div>
                  <h3 className="text-xl text-gray-900 mb-2" style={{ fontFamily: "'Poppins', sans-serif", fontWeight: 700 }}>
                    Send Service Request
                  </h3>
                  <p className="text-gray-500 text-sm">Describe what you need and send a request to {providerName}.</p>
                </div>
                <div className="bg-gray-50 rounded-2xl p-4 mb-4 space-y-3">
                  {[
                    { label: 'Professional', value: providerName },
                    { label: 'Service', value: provider.serviceType },
                    { label: 'Date', value: selectedDate || availableSlots[0].date },
                    { label: 'Time', value: selectedSlot || 'Flexible' },
                  ].map(item => (
                    <div key={item.label} className="flex justify-between text-sm">
                      <span className="text-gray-500">{item.label}</span>
                      <span className="text-gray-900" style={{ fontWeight: 600 }}>{item.value}</span>
                    </div>
                  ))}
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700 text-xs mb-1.5" style={{ fontWeight: 600 }}>Describe your requirement *</label>
                  <textarea
                    rows={3}
                    placeholder="E.g., Need pipe repair in bathroom, leaking tap..."
                    value={bookingDetails}
                    onChange={e => setBookingDetails(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl text-sm text-gray-700 outline-none focus:border-[#1E40AF] focus:bg-white transition-all resize-none"
                  />
                </div>
                {bookingError && (
                  <div className="text-red-500 text-xs mb-3 text-center">{bookingError}</div>
                )}
                <div className="flex gap-3">
                  <button
                    onClick={() => { setShowBookingModal(false); setBookingStatus('idle'); setBookingError(''); }}
                    className="flex-1 py-3 border border-gray-200 text-gray-600 rounded-2xl text-sm"
                    style={{ fontWeight: 500 }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleBooking}
                    disabled={bookingStatus === 'sending'}
                    className="flex-1 py-3 bg-[#1E40AF] text-white rounded-2xl text-sm disabled:opacity-60"
                    style={{ fontWeight: 700 }}
                  >
                    {bookingStatus === 'sending' ? 'Sending...' : 'Send Request'}
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