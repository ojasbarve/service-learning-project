const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api';

async function request(path, { timeoutMs = 10000, ...options } = {}) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  let response;
  try {
    response = await fetch(`${API_BASE}${path}`, {
      ...options,
      cache: 'no-store',
      signal: options.signal || controller.signal,
      headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    });
  } catch (error) {
    throw new Error(error.name === 'AbortError'
      ? 'The live API took too long to respond. Check the server and try again.'
      : 'The live API is unavailable. Check the connection and try again.');
  } finally { clearTimeout(timeout); }
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
  bootstrap: () => request('/bootstrap'),
  health: () => request('/health'),
  listings: (params = {}) => request(`/listings?${new URLSearchParams(params)}`).then(body => asArray(body, 'listings')),
  createListing: data => request('/listings', { method: 'POST', body: JSON.stringify(data), timeoutMs: 30000 }),
  claimListing: (id, volunteerId) => request(`/listings/${id}/claim`, { method: 'POST', body: JSON.stringify({ volunteerId }), timeoutMs: 30000 }),
  volunteers: () => request('/volunteers').then(body => asArray(body, 'volunteers')),
  volunteerRoute: id => request(`/volunteers/${id}/route`).then(body => asArray(body, 'route')),
  volunteerRoutes: () => request('/routes').then(body => body?.routes || {}),
  removeRouteStop: id => request(`/routes/${id}`, { method: 'DELETE', timeoutMs: 30000 }),
  suppliers: () => request('/suppliers').then(body => asArray(body, 'suppliers')),
  deliverySpots: () => request('/delivery-spots').then(body => asArray(body, 'deliverySpots')),
  overview: () => request('/ops/overview'),
  opsSummary: snapshot => request('/llm/ops-summary', { method: 'POST', body: JSON.stringify({ snapshot }) }),
};
