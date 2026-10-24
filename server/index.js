import { db, withTransaction } from './db.js';
import { badRequest, methodNotAllowed, notFound, normalizeListing, normalizeStop, normalizeVolunteer, optimizeRouteStops, sendJson, serverError } from './utils.js';
import { matchingSpot } from './utils.js';

const listingSelect = `SELECT l.*, s.name supplier_name, s.area supplier_area, s.type supplier_type, v.short_name volunteer_name FROM surplus_listings l JOIN suppliers s ON s.id=l.supplier_id LEFT JOIN volunteers v ON v.id=l.volunteer_id`;

async function optimizePendingRoute(connection, volunteerId) {
  const [rows] = await connection.query(
    'SELECT * FROM route_stops WHERE volunteer_id=:volunteerId ORDER BY sequence_order FOR UPDATE',
    { volunteerId },
  );
  const finalOrder = optimizeRouteStops(rows);
  for (let i = 0; i < finalOrder.length; i += 1) {
    await connection.query('UPDATE route_stops SET sequence_order=:nextOrder WHERE id=:id', { nextOrder: 200 + i, id: finalOrder[i].id });
  }
  for (let i = 0; i < finalOrder.length; i += 1) {
    await connection.query('UPDATE route_stops SET sequence_order=:nextOrder WHERE id=:id', { nextOrder: i + 1, id: finalOrder[i].id });
  }
}

async function listListings(req, res) {
  const where = [];
  const params = {};
  if (req.query.status) { where.push('l.status=:status'); params.status = req.query.status; }
  if (req.query.supplierId) { where.push('l.supplier_id=:supplierId'); params.supplierId = req.query.supplierId; }
  const requestedLimit = Number(req.query.limit || 100);
  const limit = Number.isInteger(requestedLimit) ? Math.min(Math.max(requestedLimit, 1), 250) : 100;
  where.push('l.deadline > NOW()');
  const [rows] = await db().query(`${listingSelect} WHERE ${where.join(' AND ')} ORDER BY l.created_at DESC LIMIT ${limit}`, params);
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
    await optimizePendingRoute(connection, volunteerId);
    const [updated] = await connection.query(`${listingSelect} WHERE l.id=:id`, { id: listingId });
    return { status: 200, body: { listing: normalizeListing(updated[0]), volunteer: normalizeVolunteer({ ...volunteer, status: 'En Route', last_update: 'Just now' }), route: [] } };
  });
  return sendJson(res, result.status, result.body);
}

async function route(req, res, volunteerId) {
  const [rows] = await db().query(`SELECT rs.*, s.name supplier_name, s.area supplier_area, s.type supplier_type, l.food_type, l.quantity_kg, l.address listing_address, l.lat listing_lat, l.lng listing_lng
    FROM route_stops rs LEFT JOIN surplus_listings l ON l.id=rs.listing_id LEFT JOIN suppliers s ON s.id=l.supplier_id
    WHERE rs.volunteer_id=:volunteerId AND (rs.listing_id IS NULL OR l.deadline > NOW()) ORDER BY rs.sequence_order`, { volunteerId });
  return sendJson(res, 200, repairRoutePairs(rows).map(normalizeStop));
}

async function allRoutes(req, res) {
  const [rows] = await db().query(`SELECT rs.*, s.name supplier_name, s.area supplier_area, s.type supplier_type, l.food_type, l.quantity_kg, l.address listing_address, l.lat listing_lat, l.lng listing_lng
    FROM route_stops rs LEFT JOIN surplus_listings l ON l.id=rs.listing_id LEFT JOIN suppliers s ON s.id=l.supplier_id
    WHERE rs.listing_id IS NULL OR l.deadline > NOW() ORDER BY rs.volunteer_id, rs.sequence_order`);
  const routes = {};
  for (const row of repairRoutePairs(rows)) {
    if (!routes[row.volunteer_id]) routes[row.volunteer_id] = [];
    routes[row.volunteer_id].push(normalizeStop(row));
  }
  return sendJson(res, 200, { routes });
}

// Older demo imports occasionally contained a drop without its pickup row.
// Keep the data read-only and repair the presentation from the linked listing.
function repairRoutePairs(rows) {
  const byListing = new Map();
  for (const row of rows) {
    if (row.listing_id) {
      if (!byListing.has(row.listing_id)) byListing.set(row.listing_id, []);
      byListing.get(row.listing_id).push(row);
    }
  }
  const repaired = [...rows];
  for (const [listingId, pair] of byListing) {
    if (pair.some(row => row.type === 'pickup')) continue;
    const drop = pair.find(row => row.type === 'drop');
    if (!drop || drop.listing_lat == null) continue;
    repaired.push({
      ...drop,
      id: `demo-pickup-${listingId}`,
      type: 'pickup',
      category: drop.supplier_type || 'Food partner',
      name: drop.supplier_name || 'Food partner',
      area: drop.supplier_area || drop.area,
      detail: `${Number(drop.quantity_kg)} kg (${drop.food_type || 'Surplus food'})`,
      address: drop.listing_address || drop.address,
      lat: drop.listing_lat,
      lng: drop.listing_lng,
      sequence_order: Number(drop.sequence_order) - 0.1,
    });
  }

  // Legacy demo rows were imported without listing_id. Give each drop-only
  // route a stable pickup anchor so the public demo never shows an impossible
  // "0 pickups / N drops" route.
  const demoPickups = {
    v1: ['Infosys BPO Canteen', 'IT Park Canteen', 'Hinjewadi', '60 kg (Mixed Meal)', 18.5912, 73.7389, 'Phase 1, Hinjewadi'],
    v2: ['The Westin Pune', 'Hotel Banquet', 'Koregaon Park', '45 kg (Bread/Roti)', 18.5362, 73.893, 'Koregaon Park Annex'],
    v3: ['COEP Technological University', 'College Canteen', 'Shivajinagar', '18 kg (Mixed Meal)', 18.5308, 73.8474, 'Wellesley Road, Shivajinagar'],
    v4: ['German Bakery', 'Bakery', 'Koregaon Park', '25 kg (Breads & Rolls)', 18.5345, 73.8952, 'North Main Road, Koregaon Park'],
    v5: ['MIT WPU Central Canteen', 'College Canteen', 'Kothrud', '15 kg (Mixed Meal)', 18.5074, 73.8077, 'Paud Road, Kothrud'],
    v6: ['Hotel Durvankur', 'Restaurant', 'Sadashiv Peth', '28 kg (Dal/Curry)', 18.5128, 73.8567, '2570, Sadashiv Peth'],
  };
  const byVolunteer = new Map();
  for (const row of repaired) {
    if (!byVolunteer.has(row.volunteer_id)) byVolunteer.set(row.volunteer_id, []);
    byVolunteer.get(row.volunteer_id).push(row);
  }
  for (const [volunteerId, volunteerRows] of byVolunteer) {
    if (volunteerRows.some(row => row.type === 'pickup')) continue;
    const drop = volunteerRows.find(row => row.type === 'drop');
    const pickup = demoPickups[volunteerId];
    if (!drop || !pickup) continue;
    repaired.push({
      ...drop,
      id: `demo-pickup-${volunteerId}-${drop.id}`,
      listing_id: null,
      type: 'pickup',
      category: pickup[1],
      name: pickup[0],
      area: pickup[2],
      detail: pickup[3],
      address: pickup[6],
      lat: pickup[4],
      lng: pickup[5],
      sequence_order: Number(drop.sequence_order) - 0.1,
    });
  }
  return repaired.sort((a, b) => Number(a.sequence_order) - Number(b.sequence_order));
}

async function removeRouteStop(req, res, stopId) {
  const result = await withTransaction(async connection => {
    const [rows] = await connection.query('SELECT * FROM route_stops WHERE id=:stopId FOR UPDATE', { stopId });
    let stop = rows[0];
    if (!stop && String(stopId).startsWith('demo-pickup-')) {
      const parts = String(stopId).split('-');
      const [linked] = parts.length === 3
        ? await connection.query('SELECT * FROM route_stops WHERE listing_id=:listingId ORDER BY sequence_order FOR UPDATE', { listingId: parts[2] })
        : await connection.query('SELECT * FROM route_stops WHERE id=:linkedStopId FOR UPDATE', { linkedStopId: parts.slice(3).join('-') });
      stop = linked[0];
    }
    if (!stop) return { status: 404, body: { error: 'Route stop not found' } };
    if (stop.status === 'Completed') return { status: 409, body: { error: 'Completed stops cannot be removed' } };

    if (stop.listing_id) {
      await connection.query('UPDATE surplus_listings SET status="Cancelled", volunteer_id=NULL WHERE id=:listingId AND status IN ("Assigned","Picked Up")', { listingId: stop.listing_id });
      await connection.query('DELETE FROM route_stops WHERE listing_id=:listingId', { listingId: stop.listing_id });
    } else {
      await connection.query('DELETE FROM route_stops WHERE id=:stopId', { stopId });
    }

    const [remaining] = await connection.query('SELECT id FROM route_stops WHERE volunteer_id=:volunteerId ORDER BY sequence_order, id', { volunteerId: stop.volunteer_id });
    for (let i = 0; i < remaining.length; i += 1) {
      await connection.query('UPDATE route_stops SET sequence_order=:nextOrder WHERE id=:id', { nextOrder: 200 + i, id: remaining[i].id });
    }
    for (let i = 0; i < remaining.length; i += 1) {
      await connection.query('UPDATE route_stops SET sequence_order=:nextOrder WHERE id=:id', { nextOrder: i + 1, id: remaining[i].id });
    }

    const [active] = await connection.query('SELECT COUNT(*) count FROM surplus_listings WHERE volunteer_id=:volunteerId AND status IN ("Assigned","Picked Up")', { volunteerId: stop.volunteer_id });
    if (Number(active[0].count) === 0) await connection.query('UPDATE volunteers SET status="Available", last_update="Just now" WHERE id=:volunteerId', { volunteerId: stop.volunteer_id });
    return { status: 200, body: { removed: true, listingId: stop.listing_id, volunteerId: stop.volunteer_id } };
  });
  return sendJson(res, result.status, result.body);
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
    const routeFromUrl = String(req.url || '').split('?')[0].replace(/^\/?api\/?/, '');
    const rawRoute = req.query.route ?? routeFromUrl;
    const parts = (Array.isArray(rawRoute) ? rawRoute : String(rawRoute || '').split('/')).filter(Boolean);
    const [resource, id, action] = parts;
    if (resource === 'health' && req.method === 'GET') {
      try { await db().query('SELECT 1'); return sendJson(res, 200, { ok: true, database: 'connected' }); }
      catch { return sendJson(res, 503, { ok: false, database: 'unavailable' }); }
    }
    if (resource === 'routes' && !id && req.method === 'GET') return allRoutes(req, res);
    if (resource === 'routes' && id && req.method === 'DELETE') return removeRouteStop(req, res, id);
    if (resource === 'llm' && id === 'ops-summary' && req.method === 'POST') return localOpsSummary(req, res);
    if (resource === 'listings' && !id && req.method === 'GET') return listListings(req, res);
    if (resource === 'listings' && !id && req.method === 'POST') return createListing(req, res);
    if (resource === 'listings' && id && action === 'claim' && req.method === 'POST') return claimListing(req, res, id);
    if (resource === 'volunteers' && !id && req.method === 'GET') { const [rows] = await db().query('SELECT v.*, (SELECT GROUP_CONCAT(l.id) FROM surplus_listings l WHERE l.volunteer_id=v.id AND l.status IN ("Assigned","Picked Up")) assigned_listings FROM volunteers v ORDER BY v.id'); return sendJson(res, 200, rows.map(row => normalizeVolunteer({ ...row, assigned_listings: row.assigned_listings ? String(row.assigned_listings).split(',') : [] }))); }
    if (resource === 'volunteers' && id && action === 'route' && req.method === 'GET') return route(req, res, id);
    if (resource === 'suppliers' && req.method === 'GET') { const [rows] = await db().query('SELECT * FROM suppliers ORDER BY id'); return sendJson(res, 200, rows.map(row => ({ ...row, totalDonated: Number(row.total_donated_kg), mealsEnabled: row.meals_enabled, contact: row.contact_person, partnerSince: row.partner_since }))); }
    if (resource === 'delivery-spots' && req.method === 'GET') { const [rows] = await db().query('SELECT * FROM delivery_spots ORDER BY id'); return sendJson(res, 200, rows.map(row => ({ ...row, lat: Number(row.lat), lng: Number(row.lng), contact: row.contact_person }))); }
    if (resource === 'ops' && id === 'overview' && req.method === 'GET') {
      const [stats] = await db().query(`SELECT (SELECT COALESCE(SUM(quantity_kg),0) FROM surplus_listings WHERE status='Distributed') total_kg, (SELECT COUNT(*) FROM surplus_listings WHERE status IN ('Available','Assigned') AND deadline > NOW()) active_listings, (SELECT COUNT(*) FROM volunteers WHERE status <> 'Offline') active_volunteers, (SELECT COUNT(*) FROM volunteers) total_volunteers`);
      const [listings] = await db().query(`${listingSelect} WHERE l.status IN ('Available','Assigned') AND l.deadline > NOW()`);
      const [spots] = await db().query('SELECT * FROM delivery_spots ORDER BY id');
      const [volunteers] = await db().query('SELECT * FROM volunteers ORDER BY id');
      return sendJson(res, 200, { ...stats[0], totalKg: Number(stats[0].total_kg), activeListings: Number(stats[0].active_listings), activeVolunteers: Number(stats[0].active_volunteers), mapMarkers: [...listings.map(normalizeListing), ...spots.map(s => ({ ...s, lat: Number(s.lat), lng: Number(s.lng), markerType: 'delivery' }))], volunteers: volunteers.map(normalizeVolunteer) });
    }
    return methodNotAllowed(res, ['GET', 'POST']);
  } catch (error) { return serverError(res, error); }
}
