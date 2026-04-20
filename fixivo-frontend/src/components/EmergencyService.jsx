import { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  AlertTriangle, MapPin, Send, CheckCircle2, X, AlertCircle, Loader
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_FIXIVO_APP_API_URL;

const SERVICE_TYPES = [
  'Plumber', 'Electrician', 'AC Technician', 'Home Cleaner',
  'Painter', 'Carpenter', 'Appliance Repair'
];

export default function EmergencyService() {
  const { accessToken } = useSelector(s => s.auth);

  const [serviceType, setServiceType] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [locating, setLocating] = useState(false);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(null);

  const getLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }
    setLocating(true);
    setError('');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          coordinates: [pos.coords.longitude, pos.coords.latitude]
        });
        setLocating(false);
      },
      (err) => {
        setError('Unable to get your location. Please allow location access.');
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!location) {
      setError('Please share your location first.');
      return;
    }
    if (!serviceType) {
      setError('Please select a service type.');
      return;
    }

    setLoading(true);
    try {
      const token = accessToken || localStorage.getItem('accessToken');
      const res = await fetch(`${API_BASE_URL}/api/request/emergency-service`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          location,
          description: description.trim(),
          serviceType
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to send emergency request');

      setSuccess(data);
      setDescription('');
      setServiceType('');
      setLocation(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="emergency-container">
        <div className="emergency-success-card">
          <CheckCircle2 size={56} color="#10B981" />
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#065F46', marginTop: 12 }}>
            Emergency Request Sent!
          </h3>
          <p style={{ color: '#6B7280', marginTop: 8, textAlign: 'center' }}>
            {success.data?.nearbyProviders
              ? `${success.data.nearbyProviders} nearby provider(s) have been notified.`
              : 'Your emergency has been recorded. We are searching for providers near you.'}
          </p>
          <button
            onClick={() => setSuccess(null)}
            className="emergency-new-btn"
          >
            Send Another Request
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="emergency-container">
      <div className="emergency-header">
        <div className="emergency-header-icon">
          <AlertTriangle size={28} color="#DC2626" />
        </div>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#1F2937' }}>
            Emergency Service Request
          </h2>
          <p style={{ fontSize: '0.875rem', color: '#6B7280', marginTop: 2 }}>
            Get immediate help from nearby service providers
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="emergency-form">
        {error && (
          <div className="emergency-error">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {/* Location */}
        <div className="emergency-field">
          <label className="emergency-label">Your Location *</label>
          {location ? (
            <div className="emergency-location-info">
              <MapPin size={16} color="#10B981" />
              <span style={{ color: '#065F46', fontSize: '0.875rem', fontWeight: 500 }}>
                Location captured ({location.coordinates[1].toFixed(4)}, {location.coordinates[0].toFixed(4)})
              </span>
              <button
                type="button"
                onClick={() => setLocation(null)}
                style={{ marginLeft: 'auto', color: '#6B7280', cursor: 'pointer', background: 'none', border: 'none' }}
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={getLocation}
              disabled={locating}
              className="emergency-locate-btn"
            >
              {locating ? (
                <><Loader size={16} className="animate-spin" /> Getting location…</>
              ) : (
                <><MapPin size={16} /> Share My Location</>
              )}
            </button>
          )}
        </div>

        {/* Service Type */}
        <div className="emergency-field">
          <label className="emergency-label">Service Type *</label>
          <select
            value={serviceType}
            onChange={e => setServiceType(e.target.value)}
            className="emergency-select"
            required
          >
            <option value="">Select service type</option>
            {SERVICE_TYPES.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div className="emergency-field">
          <label className="emergency-label">Description (optional)</label>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="Describe your emergency briefly…"
            rows={3}
            className="emergency-textarea"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="emergency-submit-btn"
        >
          {loading ? (
            <><Loader size={16} className="animate-spin" /> Sending…</>
          ) : (
            <><Send size={16} /> Send Emergency Request</>
          )}
        </button>
      </form>
    </div>
  );
}
