export function sendJson(res, status, body) {
  res.status(status).setHeader('Content-Type', 'application/json').json(body);
}

export function methodNotAllowed(res, allowed) {
  res.setHeader('Allow', allowed.join(', '));
  return sendJson(res, 405, { error: 'Method not allowed' });
}

export function badRequest(res, message) {
  return sendJson(res, 400, { error: message });
}

export function notFound(res, message = 'Not found') {
  return sendJson(res, 404, { error: message });
}

export function serverError(res, error) {
  console.error(error);
  return sendJson(res, 500, { error: 'Internal server error' });
}

export function normalizeListing(row) {
  return {
    id: row.id,
    supplierId: row.supplier_id,
    supplierName: row.supplier_name,
    supplierArea: row.supplier_area,
    supplierType: row.supplier_type,
    foodType: row.food_type,
    quantity: Number(row.quantity_kg),
    listedAt: row.listed_at,
    deadline: row.deadline,
    address: row.address,
    lat: Number(row.lat),
    lng: Number(row.lng),
    status: row.status,
    volunteerId: row.volunteer_id,
    volunteerAssigned: row.volunteer_name,
    notes: row.notes,
  };
}

export function normalizeVolunteer(row) {
  return {
    id: row.id, name: row.name, shortName: row.short_name, zone: row.zone,
    status: row.status, phone: row.phone, vehicleType: row.vehicle_type,
    vehicleNumber: row.vehicle_number, completedToday: row.completed_today,
    totalDeliveries: row.total_deliveries, joinedDate: row.joined_date,
    lastUpdate: row.last_update, assignedListings: Array.isArray(row.assigned_listings) ? row.assigned_listings : (row.assigned_listings ? String(row.assigned_listings).split(',') : []),
  };
}

export function normalizeStop(row) {
  return {
    id: row.id, listingId: row.listing_id, type: row.type, category: row.category,
    name: row.name, area: row.area, detail: row.detail, address: row.address,
    lat: Number(row.lat), lng: Number(row.lng), sequenceOrder: row.sequence_order,
    status: row.status,
  };
}

export function matchingSpot(area, spots) {
  const norm = (area || '').toLowerCase();
  if (norm.includes('hinjewadi') || norm.includes('wakad')) return spots.find(s => s.id === 'd5') || spots[0];
  if (norm.includes('yerwada') || norm.includes('viman')) return spots.find(s => s.id === 'd6') || spots[0];
  if (norm.includes('shivajinagar') || norm.includes('fc') || norm.includes('deccan')) return spots.find(s => s.id === 'd4') || spots[0];
  if (norm.includes('koregaon') || norm.includes('mundhwa')) return spots.find(s => s.id === 'd8') || spots[0];
  if (norm.includes('kothrud') || norm.includes('karve') || norm.includes('katraj')) return spots.find(s => s.id === 'd3') || spots[0];
  return spots[0];
}

function squaredDistance(a, b) {
  const lat = Number(a.lat) - Number(b.lat);
  const lng = Number(a.lng) - Number(b.lng);
  return (lat * lat) + (lng * lng);
}

export function optimizeRouteStops(rows) {
  const completed = rows.filter(stop => stop.status === 'Completed');
  const pending = rows.filter(stop => stop.status !== 'Completed');
  const pairs = new Map();
  for (const stop of pending) {
    if (!stop.listing_id) continue;
    if (!pairs.has(stop.listing_id)) pairs.set(stop.listing_id, []);
    pairs.get(stop.listing_id).push(stop);
  }

  const ordered = [];
  let cursor = completed.at(-1) || pending[0];
  while (pairs.size) {
    let nextId;
    let nextPair;
    for (const [listingId, pair] of pairs) {
      const pickup = pair.find(stop => stop.type === 'pickup');
      if (pickup && (!nextPair || squaredDistance(cursor || pickup, pickup) < squaredDistance(cursor || pickup, nextPair.find(stop => stop.type === 'pickup')))) {
        nextId = listingId;
        nextPair = pair;
      }
    }
    if (!nextPair) break;
    pairs.delete(nextId);
    const pickup = nextPair.find(stop => stop.type === 'pickup');
    const drop = nextPair.find(stop => stop.type === 'drop');
    if (pickup) ordered.push(pickup);
    if (drop) ordered.push(drop);
    cursor = drop || pickup || cursor;
  }
  return [...completed, ...ordered, ...pending.filter(stop => !stop.listing_id)];
}
