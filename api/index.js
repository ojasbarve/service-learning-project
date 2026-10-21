import { db, withTransaction } from './db.js';
import { badRequest, methodNotAllowed, notFound, normalizeListing, normalizeStop, normalizeVolunteer, sendJson, serverError } from './utils.js';
import { matchingSpot } from './utils.js';

const listingSelect = `SELECT l.*, s.name supplier_name, s.area supplier_area, s.type supplier_type, v.short_name volunteer_name FROM surplus_listings l JOIN suppliers s ON s.id=l.supplier_id LEFT JOIN volunteers v ON v.id=l.volunteer_id`;

async function listListings(req, res) {
  const where = [];
  const params = {};
  if (req.query.status) { where.push('l.status=:status'); params.status = req.query.status; }
  if (req.query.supplierId) { where.push('l.supplier_id=:supplierId'); params.supplierId = req.query.supplierId; }
  const requestedLimit = Number(req.query.limit || 100);
  const limit = Number.isInteger(requestedLimit) ? Math.min(Math.max(requestedLimit, 1), 250) : 100;
  const [rows] = await db().query(`${listingSelect} ${where.length ? `WHERE ${where.join(' AND ')}` : ''} ORDER BY l.created_at DESC LIMIT ${limit}`, params);
  return sendJson(res, 200, rows.map(normalizeListing));
}

async function createListing(req, res) {
  const body = req.body || {};
  const required = ['supplierId', 'foodType', 'quantity', 'deadline'];
  if (required.some(key => body[key] === undefined || body[key] === '')) return badRequest(res, 'supplierId, foodType, quantity, and deadline are required');
  const quantity = Number(body.quantity);
  const deadline = new Date(body.deadline);
  const lat = Number(body.lat);
  const lng = Number(body.lng);
  if (!Number.isFinite(quantity) || quantity <= 0 || Number.isNaN(deadline.getTime())) return badRequest(res, 'quantity must be positive and deadline must be a valid date');
  if ((Number.isFinite(lat) && (lat < -90 || lat > 90)) || (Number.isFinite(lng) && (lng < -180 || lng > 180))) return badRequest(res, 'coordinates are invalid');
  if (deadline <= new Date()) return badRequest(res, 'deadline must be in the future');
  const [suppliers] = await db().query('SELECT * FROM suppliers WHERE id=:id', { id: body.supplierId });
  const supplier = suppliers[0];
  if (!supplier) return notFound(res, 'Supplier not found');
  const id = body.id || `l-${Date.now()}`;
  await db().query(`INSERT INTO surplus_listings (id,supplier_id,food_type,quantity_kg,listed_at,deadline,address,lat,lng,status,notes) VALUES (:id,:supplierId,:foodType,:quantity,NOW(),:deadline,:address,:lat,:lng,'Available',:notes)`, {
    id, supplierId: supplier.id, foodType: String(body.foodType), quantity, deadline,
    address: body.address || supplier.address, lat: Number.isFinite(lat) ? lat : Number(supplier.lat), lng: Number.isFinite(lng) ? lng : Number(supplier.lng), notes: body.notes || null,
  });
  const [rows] = await db().query(`${listingSelect} WHERE l.id=:id`, { id });
  return sendJson(res, 201, normalizeListing(rows[0]));
}

async function claimListing(req, res, listingId) {
  const volunteerId = req.body?.volunteerId;
  if (!volunteerId) return badRequest(res, 'volunteerId is required');
  const result = await withTransaction(async connection => {
    const [listings] = await connection.query(`${listingSelect} WHERE l.id=:id FOR UPDATE`, { id: listingId });
    const listing = listings[0];
    if (!listing) return { status: 404, body: { error: 'Listing not found' } };
    if (listing.status !== 'Available') return { status: 409, body: { error: 'Listing is no longer available' } };
    if (new Date(listing.deadline) <= new Date()) return { status: 409, body: { error: 'Listing has expired' } };
    const [volunteers] = await connection.query('SELECT * FROM volunteers WHERE id=:id FOR UPDATE', { id: volunteerId });
    const volunteer = volunteers[0];
    if (!volunteer) return { status: 404, body: { error: 'Volunteer not found' } };
    const [spots] = await connection.query('SELECT * FROM delivery_spots ORDER BY id');
    const spot = matchingSpot(listing.supplier_area, spots);
    const [maxRows] = await connection.query('SELECT COALESCE(MAX(sequence_order),0) max_order FROM route_stops WHERE volunteer_id=:volunteerId', { volunteerId });
    const start = Number(maxRows[0].max_order) + 1;
    await connection.query('UPDATE surplus_listings SET status="Assigned", volunteer_id=:volunteerId WHERE id=:id', { volunteerId, id: listingId });
    await connection.query('UPDATE volunteers SET status="En Route", last_update="Just now" WHERE id=:volunteerId', { volunteerId });
    const detail = `${Number(listing.quantity_kg)} kg (${listing.food_type})`;
    await connection.query(`INSERT INTO route_stops (id,volunteer_id,listing_id,type,category,name,area,detail,address,lat,lng,sequence_order,status) VALUES (:pickupId,:volunteerId,:listingId,'pickup',:category,:pickupName,:area,:detail,:address,:pickupLat,:pickupLng,:pickupOrder,'Pending'),(:dropId,:volunteerId,:listingId,'drop',:dropCategory,:dropName,:dropArea,:dropDetail,:dropAddress,:dropLat,:dropLng,:dropOrder,'Pending')`, {
      pickupId: `r-p-${listingId}-${Date.now()}`, dropId: `r-d-${listingId}-${Date.now() + 1}`, volunteerId, listingId,
      category: listing.supplier_type, pickupName: listing.supplier_name, area: listing.supplier_area, detail, address: listing.address, pickupLat: listing.lat, pickupLng: listing.lng, pickupOrder: start,
      dropCategory: spot.type, dropName: spot.name, dropArea: spot.area, dropDetail: `${Math.round(Number(listing.quantity_kg) * 2.5)} meal packets`, dropAddress: `${spot.name}, ${spot.area}`, dropLat: spot.lat, dropLng: spot.lng, dropOrder: start + 1,
    });
    const [updated] = await connection.query(`${listingSelect} WHERE l.id=:id`, { id: listingId });
    return { status: 200, body: { listing: normalizeListing(updated[0]), volunteer: normalizeVolunteer({ ...volunteer, status: 'En Route', last_update: 'Just now' }), route: [] } };
  });
  return sendJson(res, result.status, result.body);
}

async function route(req, res, volunteerId) {
  const [rows] = await db().query('SELECT * FROM route_stops WHERE volunteer_id=:volunteerId ORDER BY sequence_order', { volunteerId });
  return sendJson(res, 200, rows.map(normalizeStop));
}

async function allRoutes(req, res) {
  const [rows] = await db().query('SELECT * FROM route_stops ORDER BY volunteer_id, sequence_order');
  const routes = {};
  for (const row of rows) {
    if (!routes[row.volunteer_id]) routes[row.volunteer_id] = [];
    routes[row.volunteer_id].push(normalizeStop(row));
  }
  return sendJson(res, 200, { routes });
}

async function localOpsSummary(req, res) {
  if (process.env.OLLAMA_ENABLED !== 'true') return sendJson(res, 503, { error: 'Local AI is disabled. Set OLLAMA_ENABLED=true to enable it.' });
  const snapshot = req.body?.snapshot;
  if (!snapshot || typeof snapshot !== 'object') return badRequest(res, 'snapshot is required');
  const baseUrl = (process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434').replace(/\/$/, '');
  const model = process.env.OLLAMA_MODEL || 'gemma3:4b';
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    const response = await fetch(`${baseUrl}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      signal: controller.signal,
      body: JSON.stringify({
        model,
        stream: false,
        format: 'json',
        messages: [
          { role: 'system', content: 'You are an operations assistant for a Pune food rescue NGO. Return concise, practical JSON with keys headline, priorities (array of strings), and note. Do not invent facts.' },
          { role: 'user', content: `Review this live operations snapshot and identify the most important next actions:\n${JSON.stringify(snapshot).slice(0, 12000)}` },
        ],
      }),
    });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) return sendJson(res, 502, { error: body.error || 'Local AI request failed' });
    let content = body.message?.content || '';
    try { content = JSON.parse(content); } catch { content = { headline: 'Local briefing', priorities: [content], note: '' }; }
    return sendJson(res, 200, { model, briefing: content });
  } catch (error) {
    return sendJson(res, 503, { error: error.name === 'AbortError' ? 'Local AI request timed out' : 'Local AI is unavailable. Start Ollama and ensure the selected model is installed.' });
  } finally { clearTimeout(timeout); }
}

export default async function handler(req, res) {
  try {
    res.setHeader('Cache-Control', 'no-store');
    res.setHeader('Access-Control-Allow-Origin', process.env.CORS_ORIGIN || '*');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') return res.status(204).end();
    const rawRoute = req.query.route;
    const parts = (Array.isArray(rawRoute) ? rawRoute : String(rawRoute || '').split('/')).filter(Boolean);
    const [resource, id, action] = parts;
    if (resource === 'health' && req.method === 'GET') {
      try { await db().query('SELECT 1'); return sendJson(res, 200, { ok: true, database: 'connected' }); }
      catch { return sendJson(res, 503, { ok: false, database: 'unavailable' }); }
    }
    if (resource === 'routes' && !id && req.method === 'GET') return allRoutes(req, res);
    if (resource === 'llm' && id === 'ops-summary' && req.method === 'POST') return localOpsSummary(req, res);
    if (resource === 'listings' && !id && req.method === 'GET') return listListings(req, res);
    if (resource === 'listings' && !id && req.method === 'POST') return createListing(req, res);
    if (resource === 'listings' && id && action === 'claim' && req.method === 'POST') return claimListing(req, res, id);
    if (resource === 'volunteers' && !id && req.method === 'GET') { const [rows] = await db().query('SELECT v.*, GROUP_CONCAT(l.id) assigned_listings FROM volunteers v LEFT JOIN surplus_listings l ON l.volunteer_id=v.id AND l.status IN ("Assigned","Picked Up") GROUP BY v.id ORDER BY v.id'); return sendJson(res, 200, rows.map(row => normalizeVolunteer({ ...row, assigned_listings: row.assigned_listings ? String(row.assigned_listings).split(',') : [] }))); }
    if (resource === 'volunteers' && id && action === 'route' && req.method === 'GET') return route(req, res, id);
    if (resource === 'suppliers' && req.method === 'GET') { const [rows] = await db().query('SELECT * FROM suppliers ORDER BY id'); return sendJson(res, 200, rows.map(row => ({ ...row, totalDonated: Number(row.total_donated_kg), mealsEnabled: row.meals_enabled, contact: row.contact_person, partnerSince: row.partner_since }))); }
    if (resource === 'delivery-spots' && req.method === 'GET') { const [rows] = await db().query('SELECT * FROM delivery_spots ORDER BY id'); return sendJson(res, 200, rows.map(row => ({ ...row, lat: Number(row.lat), lng: Number(row.lng), contact: row.contact_person }))); }
    if (resource === 'ops' && id === 'overview' && req.method === 'GET') {
      const [stats] = await db().query(`SELECT (SELECT COALESCE(SUM(quantity_kg),0) FROM surplus_listings WHERE status='Distributed') total_kg, (SELECT COUNT(*) FROM surplus_listings WHERE status IN ('Available','Assigned')) active_listings, (SELECT COUNT(*) FROM volunteers WHERE status <> 'Offline') active_volunteers, (SELECT COUNT(*) FROM volunteers) total_volunteers`);
      const [listings] = await db().query(`${listingSelect} WHERE l.status IN ('Available','Assigned')`);
      const [spots] = await db().query('SELECT * FROM delivery_spots ORDER BY id');
      const [volunteers] = await db().query('SELECT * FROM volunteers ORDER BY id');
      return sendJson(res, 200, { ...stats[0], totalKg: Number(stats[0].total_kg), activeListings: Number(stats[0].active_listings), activeVolunteers: Number(stats[0].active_volunteers), mapMarkers: [...listings.map(normalizeListing), ...spots.map(s => ({ ...s, lat: Number(s.lat), lng: Number(s.lng), markerType: 'delivery' }))], volunteers: volunteers.map(normalizeVolunteer) });
    }
    return methodNotAllowed(res, ['GET', 'POST']);
  } catch (error) { return serverError(res, error); }
}
