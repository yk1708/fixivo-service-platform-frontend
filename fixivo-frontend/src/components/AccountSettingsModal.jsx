import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { X, Camera, Key, RefreshCw, Eye, EyeOff } from 'lucide-react';

export default function AccountSettingsModal({ isOpen, onClose, initialTab = 'profile' }) {
  const { user } = useSelector(s => s.auth);
  const [activeTab, setActiveTab] = useState(initialTab);

  // Edit mode state
  const [isEditing, setIsEditing] = useState(false);

  // Profile form state
  const nameParts = (user?.name || '').split(' ');
  const [firstName, setFirstName] = useState(nameParts[0] || '');
  const [lastName, setLastName] = useState(nameParts.slice(1).join(' ') || '');
  const [dob, setDob] = useState('');
  const [phone, setPhone] = useState(user?.phone || '');
  const [location, setLocation] = useState(user?.address || user?.location || '');
  const [bio, setBio] = useState('');

  // Change PIN state
  const [currentPin, setCurrentPin] = useState('');
  const [newPin, setNewPin] = useState('');
  const [confirmPin, setConfirmPin] = useState('');
  const [showCurrentPin, setShowCurrentPin] = useState(false);
  const [showNewPin, setShowNewPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-[100] flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-3xl shadow-2xl overflow-hidden my-6 border border-slate-100 flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="px-6 pt-5 pb-3 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-baseline gap-2">
              <h2 className="text-lg font-extrabold text-slate-900">Account Settings</h2>
              <span className="text-xs text-slate-400 font-medium">Manage your profile and security preferences</span>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors cursor-pointer border-none">
            <X size={18} />
          </button>
        </div>

        {/* Modal Tabs Header */}
        <div className="px-6 bg-slate-50/50 border-b border-slate-100 flex gap-6 text-sm font-semibold shrink-0">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-2.5 border-b-2 transition-all cursor-pointer bg-transparent border-none ${
              activeTab === 'profile'
                ? 'border-blue-700 text-blue-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Profile
          </button>
          <button
            onClick={() => setActiveTab('setting')}
            className={`py-2.5 border-b-2 transition-all cursor-pointer bg-transparent border-none ${
              activeTab === 'setting'
                ? 'border-blue-700 text-blue-700 font-bold'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            Setting
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {activeTab === 'profile' && (
            <>
              {/* Profile Card Header */}
              <div className="bg-slate-50/60 rounded-2xl p-4 border border-slate-100 flex items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-indigo-600 text-white font-bold text-xl flex items-center justify-center shadow-md">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <button className="absolute bottom-0 right-0 w-6 h-6 bg-slate-800 text-white rounded-full flex items-center justify-center shadow border-2 border-white cursor-pointer hover:bg-slate-700">
                    <Camera size={12} />
                  </button>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{user?.name || 'User Name'}</h3>
                  <p className="text-xs text-slate-400 font-medium">{location || 'Pune, India'}</p>
                </div>
              </div>

              {/* Personal Information Form */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <h4 className="font-bold text-slate-800 text-sm">Personal Information</h4>
                  {isEditing ? (
                    <button
                      onClick={() => setIsEditing(false)}
                      className="text-xs text-slate-400 hover:text-slate-600 font-semibold cursor-pointer border-none bg-transparent"
                    >
                      ✕ Cancel
                    </button>
                  ) : (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="text-xs text-blue-700 hover:text-blue-800 font-bold cursor-pointer border-none bg-transparent"
                    >
                      ✎ Edit
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">First Name</label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-medium outline-none transition-all ${
                        isEditing
                          ? 'border-slate-200 text-slate-800 bg-white focus:border-blue-700 focus:ring-1 focus:ring-blue-700'
                          : 'border-slate-100 text-slate-600 bg-slate-50/70'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Last Name</label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-medium outline-none transition-all ${
                        isEditing
                          ? 'border-slate-200 text-slate-800 bg-white focus:border-blue-700 focus:ring-1 focus:ring-blue-700'
                          : 'border-slate-100 text-slate-600 bg-slate-50/70'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Date of Birth</label>
                    <input
                      type="date"
                      disabled={!isEditing}
                      value={dob}
                      onChange={(e) => setDob(e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-medium outline-none transition-all ${
                        isEditing
                          ? 'border-slate-200 text-slate-800 bg-white focus:border-blue-700 focus:ring-1 focus:ring-blue-700'
                          : 'border-slate-100 text-slate-600 bg-slate-50/70'
                      }`}
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Email Address</label>
                    <div className="relative flex items-center">
                      <input
                        type="email"
                        disabled
                        value={user?.email || ''}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-medium text-slate-500 outline-none pr-16"
                      />
                      {isEditing && (
                        <button className="absolute right-2 text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-1 rounded-md hover:bg-blue-100 cursor-pointer">
                          Update
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Phone Number</label>
                    <div className="relative flex items-center">
                      <input
                        type="text"
                        disabled={!isEditing}
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-medium outline-none transition-all pr-16 ${
                          isEditing
                            ? 'border-slate-200 text-slate-800 bg-white focus:border-blue-700 focus:ring-1 focus:ring-blue-700'
                            : 'border-slate-100 text-slate-600 bg-slate-50/70'
                        }`}
                      />
                      {isEditing && (
                        <button className="absolute right-2 text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-1 rounded-md hover:bg-blue-100 cursor-pointer">
                          Update
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Location</label>
                    <input
                      type="text"
                      disabled={!isEditing}
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-medium outline-none transition-all ${
                        isEditing
                          ? 'border-slate-200 text-slate-800 bg-white focus:border-blue-700 focus:ring-1 focus:ring-blue-700'
                          : 'border-slate-100 text-slate-600 bg-slate-50/70'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">About / Bio</label>
                  <textarea
                    rows={3}
                    disabled={!isEditing}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    placeholder="Tell us about yourself..."
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-xs font-medium outline-none transition-all ${
                      isEditing
                        ? 'border-slate-200 text-slate-800 bg-white focus:border-blue-700 focus:ring-1 focus:ring-blue-700'
                        : 'border-slate-100 text-slate-600 bg-slate-50/70'
                    }`}
                  />
                  <span className="text-[10px] text-slate-400 block text-right mt-1">{bio.length}/300</span>
                </div>

                {isEditing && (
                  <div className="flex justify-end pt-2">
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-6 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs cursor-pointer shadow-md border-none transition-all"
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
            </>
          )}

          {activeTab === 'setting' && (
            <>
              {/* Change PIN Section */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-4">
                <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                  <Key size={16} className="text-slate-600" />
                  <h4 className="font-bold text-slate-800 text-sm">Change PIN</h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Current PIN</label>
                    <div className="relative">
                      <input
                        type={showCurrentPin ? 'text' : 'password'}
                        value={currentPin}
                        onChange={(e) => setCurrentPin(e.target.value)}
                        placeholder="Current 4-digit PIN"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 outline-none focus:border-blue-700 pr-9"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPin(!showCurrentPin)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 border-none bg-transparent cursor-pointer"
                      >
                        {showCurrentPin ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">New PIN</label>
                    <div className="relative">
                      <input
                        type={showNewPin ? 'text' : 'password'}
                        value={newPin}
                        onChange={(e) => setNewPin(e.target.value)}
                        placeholder="New 4-digit PIN"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 outline-none focus:border-blue-700 pr-9"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPin(!showNewPin)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 border-none bg-transparent cursor-pointer"
                      >
                        {showNewPin ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">Confirm New PIN</label>
                    <div className="relative">
                      <input
                        type={showConfirmPin ? 'text' : 'password'}
                        value={confirmPin}
                        onChange={(e) => setConfirmPin(e.target.value)}
                        placeholder="Confirm new PIN"
                        className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 outline-none focus:border-blue-700 pr-9"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPin(!showConfirmPin)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 border-none bg-transparent cursor-pointer"
                      >
                        {showConfirmPin ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 border border-amber-200/60 rounded-xl p-3 text-xs text-amber-800 flex items-center gap-2">
                  <RefreshCw size={14} className="text-amber-600 shrink-0" />
                  <span>PIN must be exactly 4 digits. Avoid patterns like 1234 or your birth year.</span>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <button className="text-xs text-blue-700 font-semibold hover:underline bg-transparent border-none cursor-pointer">
                    Forgot current PIN?
                  </button>
                  <button className="px-5 py-2 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs cursor-pointer shadow-md border-none transition-all">
                    Change PIN
                  </button>
                </div>
              </div>

              {/* Reset PIN Section */}
              <div className="bg-white rounded-2xl border border-slate-100 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-2.5">
                  <RefreshCw size={16} className="text-slate-600 shrink-0" />
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm">Reset PIN</h4>
                    <p className="text-xs text-slate-400">Forgot your PIN? We'll send a one-time code to your registered email or phone to verify your identity.</p>
                  </div>
                </div>
                <button className="px-4 py-2 rounded-xl border border-blue-700 text-blue-700 font-bold text-xs hover:bg-blue-50 cursor-pointer bg-transparent whitespace-nowrap shrink-0">
                  Reset PIN
                </button>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between shrink-0 text-xs text-slate-400">
          <span>© Powered by <strong className="text-blue-700 font-semibold">Fixivo</strong> 2026</span>
          <button onClick={onClose} className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold text-xs border-none cursor-pointer">
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
