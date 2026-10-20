const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
  });
  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/json')) {
    throw new Error('Live API is unavailable. Start the Vercel development server to load database data.');
  }
  const body = await response.json();
  if (!response.ok) throw new Error(body.error || `Request failed (${response.status})`);
  return body;
}

function asArray(body, key) {
  if (Array.isArray(body)) return body;
  if (Array.isArray(body?.[key])) return body[key];
  if (Array.isArray(body?.data)) return body.data;
  return [];
}

export const api = {
  health: () => request('/health'),
  listings: (params = {}) => request(`/listings?${new URLSearchParams(params)}`).then(body => asArray(body, 'listings')),
  createListing: data => request('/listings', { method: 'POST', body: JSON.stringify(data) }),
  claimListing: (id, volunteerId) => request(`/listings/${id}/claim`, { method: 'POST', body: JSON.stringify({ volunteerId }) }),
  volunteers: () => request('/volunteers').then(body => asArray(body, 'volunteers')),
  volunteerRoute: id => request(`/volunteers/${id}/route`).then(body => asArray(body, 'route')),
  suppliers: () => request('/suppliers').then(body => asArray(body, 'suppliers')),
  deliverySpots: () => request('/delivery-spots').then(body => asArray(body, 'deliverySpots')),
  overview: () => request('/ops/overview'),
};
