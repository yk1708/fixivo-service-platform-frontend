const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000';

// ── Token Management ──
export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('accessToken');
}

export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('refreshToken');
}

export function getStoredUser(): { _id: string; name: string; email: string; role: string } | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('user');
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

export function getStoredProvider(): any | null {
  if (typeof window === 'undefined') return null;
  const raw = localStorage.getItem('provider');
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}

export function isLoggedIn(): boolean {
  return !!getAccessToken() && !!getStoredUser();
}

export function clearAuth(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  localStorage.removeItem('provider');
}

// ── Authenticated Fetch ──
async function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  const token = getAccessToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  let response = await fetch(url, { ...options, headers });

  // If 403 (expired token), try refreshing
  if (response.status === 403) {
    const refreshToken = getRefreshToken();
    if (refreshToken) {
      const refreshRes = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      });
      if (refreshRes.ok) {
        const data = await refreshRes.json();
        localStorage.setItem('accessToken', data.accessToken);
        headers['Authorization'] = `Bearer ${data.accessToken}`;
        response = await fetch(url, { ...options, headers });
      } else {
        clearAuth();
      }
    }
  }

  return response;
}

// ── Auth API ──
export async function logout(): Promise<void> {
  try {
    await authFetch(`${API_BASE_URL}/auth/logout`, { method: 'POST' });
  } catch {
    // ignore errors on logout
  }
  clearAuth();
}

// ── Provider / Customer API ──
export interface ProviderData {
  _id: string;
  userId: { _id: string; name: string; email: string } | string;
  name: string;
  email: string;
  phone: string;
  serviceType: string;
  experience: number;
  rating: number;
  location: {
    type: string;
    coordinates: number[];
  };
  availability: string;
  isVerified: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export async function getVerifiedProviders(): Promise<ProviderData[]> {
  const res = await fetch(`${API_BASE_URL}/api/customer/verified-providers`);
  if (!res.ok) throw new Error('Failed to fetch providers');
  const data = await res.json();
  return data.providers || data;
}

// ── Service Request API ──
export interface SendRequestPayload {
  providerId: string;
  requestDetails: {
    serviceType: string;
    details: string;
    scheduledTime?: string;
  };
}

export async function sendServiceRequest(payload: SendRequestPayload) {
  const res = await authFetch(`${API_BASE_URL}/api/request/send-request`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to send request');
  return data;
}

export async function getCustomerRequests() {
  const res = await authFetch(`${API_BASE_URL}/api/request/customer-requests`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch requests');
  return data.requests;
}

export async function acceptRequest(requestId: string) {
  const res = await authFetch(`${API_BASE_URL}/api/request/accept-request/${requestId}`, {
    method: 'POST',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to accept request');
  return data;
}

export async function rejectRequest(requestId: string) {
  const res = await authFetch(`${API_BASE_URL}/api/request/reject-request/${requestId}`, {
    method: 'POST',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to reject request');
  return data;
}

export async function sendEmergencyRequest(payload: {
  location: { coordinates: number[] };
  serviceType: string;
  description?: string;
}) {
  const res = await authFetch(`${API_BASE_URL}/api/request/emergency-service`, {
    method: 'POST',
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to send emergency request');
  return data;
}

// ── Provider Profile API ──
export async function completeProviderProfile(payload: {
  experience: number;
  availability: string;
}) {
  const res = await authFetch(`${API_BASE_URL}/api/provider/complete-profile`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to complete profile');
  return data;
}

// ── Helper: Map backend provider to frontend Worker type ──
export function providerToWorker(provider: ProviderData) {
  const userId = typeof provider.userId === 'object' ? provider.userId : null;
  return {
    id: provider._id,
    name: userId?.name || provider.name || 'Professional',
    profession: provider.serviceType || 'Service Professional',
    rating: provider.rating || 0,
    reviews: 0,
    experience: provider.experience ? `${provider.experience} yrs` : 'N/A',
    price: '₹299',
    location: provider.location?.coordinates
      ? `${provider.location.coordinates[1]?.toFixed(2)}, ${provider.location.coordinates[0]?.toFixed(2)}`
      : 'Location not set',
    image: 'https://images.unsplash.com/photo-1606384682764-c3065dbcaf85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=400',
    verified: provider.isVerified,
    availability: provider.availability || 'Available',
    email: userId?.email || provider.email || '',
    phone: provider.phone || '',
    serviceType: provider.serviceType || '',
  };
}
