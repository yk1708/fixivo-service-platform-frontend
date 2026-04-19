import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import {
    X, User, Mail, Phone, Calendar, Clock, Wrench,
    Info, CheckCircle2, AlertCircle, ShieldCheck, Lock
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_FIXIVO_APP_API_URL || 'http://localhost:5000';

export default function ProviderDetails({ requestId, onClose, onSuccess }) {
    const { accessToken } = useSelector(s => s.auth);
    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');


    const [otpStep, setOtpStep] = useState(false); 
    const [otp, setOtp] = useState('');
    const [otpLoading, setOtpLoading] = useState(false);
    const [otpError, setOtpError] = useState('');
    const [otpSuccess, setOtpSuccess] = useState(false);

    const fetchRequestDetails = async () => {
        setLoading(true);
        setError('');
        try {
            const token = accessToken || localStorage.getItem('accessToken');
            const res = await fetch(`${API_BASE_URL}/api/request/see-requests-inside-provider-dashboard`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!res.ok) throw new Error('Failed to load request details');
            const data = await res.json();
            const found = data.requests.find(r => r._id === requestId);
            if (!found) throw new Error('Request not found');
            setRequest(found);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequestDetails();
    }, [requestId]);

    const handleStartCompletion = async () => {
        setOtpLoading(true);
        setOtpError('');
        try {
            const token = accessToken || localStorage.getItem('accessToken');
            const res = await fetch(`${API_BASE_URL}/api/provider/complete-work/${requestId}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await res.json();

            if (res.status === 400 && data.message?.toLowerCase().includes('already generated')) {
                setOtpStep(true);
                return;
            }

            if (!res.ok) throw new Error(data.message || 'Failed to generate OTP');
            
            setOtpStep(true);
        } catch (err) {
            setOtpError(err.message);
        } finally {
            setOtpLoading(false);
        }
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        if (otp.length !== 6) {
            setOtpError('Please enter a 6-digit OTP');
            return;
        }
        setOtpLoading(true);
        setOtpError('');
        try {
            const token = accessToken || localStorage.getItem('accessToken');
            const res = await fetch(`${API_BASE_URL}/api/provider/verify-otp/${requestId}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ otp })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Verification failed');

            setOtpSuccess(true);
            setTimeout(() => {
                onSuccess();
            }, 1500);
        } catch (err) {
            setOtpError(err.message);
        } finally {
            setOtpLoading(false);
        }
    };

    if (!requestId) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-box details-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                    <div>
                        <h2 className="modal-title">Service Details</h2>
                        <p className="modal-sub">Request ID: {requestId.slice(-8).toUpperCase()}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="modal-close-btn"
                        disabled={otpLoading || loading}
                    >
                        <X size={20} />
                    </button>
                </div>

                {loading ? (
                    <div className="provider-loading">
                        <div className="provider-spinner" />
                        <p>Loading details...</p>
                    </div>
                ) : error ? (
                    <div className="provider-error">
                        <AlertCircle size={40} color="#EF4444" />
                        <p>{error}</p>
                    </div>
                ) : !request ? (
                    <p>Request not found.</p>
                ) : otpStep ? (
                    <div className="otp-container">
                        {otpSuccess ? (
                            <div className="modal-success">
                                <ShieldCheck size={52} color="#10B981" />
                                <h3>Work Completed!</h3>
                                <p>The service has been marked as completed successfully.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleVerifyOtp} className="otp-form">
                                <div className="otp-icon-wrap">
                                    <Lock size={32} color="#6366F1" />
                                </div>
                                <h3>Verify Completion</h3>
                                <p>Please enter the 6-digit OTP sent to the customer to complete this work.</p>

                                {otpError && <div className="modal-error" style={{ marginBottom: '16px' }}><AlertCircle size={16} />{otpError}</div>}

                                <input
                                    type="text"
                                    maxLength={6}
                                    placeholder="000000"
                                    value={otp}
                                    onChange={e => {
                                        setOtp(e.target.value.replace(/\D/g, ''));
                                        if (otpError) setOtpError('');
                                    }}
                                    className="otp-input"
                                    disabled={otpLoading}
                                    autoFocus
                                />

                                <div className="modal-footer">
                                    <button
                                        type="button"
                                        className="modal-cancel-btn"
                                        disabled={otpLoading}
                                        onClick={() => {
                                            setOtpStep(false);
                                            setOtpError('');
                                        }}
                                    >
                                        Back
                                    </button>
                                    <button type="submit" className="modal-submit-btn" disabled={otpLoading}>
                                        {otpLoading ? 'Verifying...' : 'Verify & Complete'}
                                    </button>
                                </div>
                            </form>
                        )}
                    </div>
                ) : (
                    <div className="details-content">
                        <div className="details-grid">
                            <section className="details-section">
                                <h4 className="details-section-title">Customer Information</h4>
                                <div className="info-card">
                                    <div className="info-row">
                                        <User size={16} />
                                        <span>{request.customerId?.name || 'N/A'}</span>
                                    </div>
                                    <div className="info-row">
                                        <Mail size={16} />
                                        <span>{request.customerId?.email || 'N/A'}</span>
                                    </div>
                                </div>
                            </section>

                            <section className="details-section">
                                <h4 className="details-section-title">Service Info</h4>
                                <div className="info-card">
                                    <div className="info-row">
                                        <Wrench size={16} />
                                        <span className="font-semibold">{request.serviceType || request.requestDetails?.serviceType}</span>
                                    </div>
                                    <div className="info-row">
                                        <Info size={16} />
                                        <p className="text-sm">{request.details || request.requestDetails?.details}</p>
                                    </div>
                                </div>
                            </section>

                            <section className="details-section">
                                <h4 className="details-section-title">Schedule & Status</h4>
                                <div className="info-card">
                                    <div className="info-row">
                                        <Calendar size={16} />
                                        <span>{new Date(request.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}</span>
                                    </div>
                                    {request.requestDetails?.scheduledTime && (
                                        <div className="info-row">
                                            <Clock size={16} />
                                            <span>Scheduled: {new Date(request.requestDetails.scheduledTime).toLocaleString()}</span>
                                        </div>
                                    )}
                                    <div className="info-row mt-2">
                                        <span className="text-xs uppercase font-bold text-gray-400">Status:</span>
                                        <span className={`status-pill ${request.status}`}>{request.status}</span>
                                    </div>
                                </div>
                            </section>
                        </div>

                        <div className="modal-footer">
                            <button onClick={onClose} className="modal-cancel-btn">Close</button>
                            {request.status === 'accepted' && (
                                <button
                                    onClick={handleStartCompletion}
                                    disabled={otpLoading}
                                    className="modal-submit-btn complete-btn"
                                >
                                    {otpLoading ? 'Generating OTP...' : 'Complete Work'}
                                </button>
                            )}
                            {request.status === 'completed' && (
                                <div className="completed-badge">
                                    <CheckCircle2 size={16} />
                                    Work Completed
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
