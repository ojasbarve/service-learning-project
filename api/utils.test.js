import test from 'node:test';
import assert from 'node:assert/strict';
import { matchingSpot, normalizeListing, optimizeRouteStops } from './utils.js';

const spots = [
  { id: 'd1', area: 'Station Road', type: 'Public Hospital' },
  { id: 'd5', area: 'Hinjewadi', type: 'Community Shelter' },
  { id: 'd6', area: 'Yerwada', type: 'Community Shelter' },
];

test('matches delivery spots by supplier area with a safe central fallback', () => {
  assert.equal(matchingSpot('Hinjewadi', spots).id, 'd5');
  assert.equal(matchingSpot('Viman Nagar', spots).id, 'd6');
  assert.equal(matchingSpot('Unknown area', spots).id, 'd1');
});

test('normalizes database listing rows for the frontend contract', () => {
  const listing = normalizeListing({
    id: 'l-test', supplier_id: 's1', supplier_name: 'Donor', supplier_area: 'Deccan', supplier_type: 'Restaurant',
    food_type: 'Mixed Meal', quantity_kg: '12.5', listed_at: '2026-10-20T10:00:00.000Z', deadline: '2026-10-20T12:00:00.000Z',
    address: 'Pune', lat: '18.5', lng: '73.8', status: 'Available', volunteer_id: null, volunteer_name: null, notes: 'Veg',
  });
  assert.deepEqual(listing, {
    id: 'l-test', supplierId: 's1', supplierName: 'Donor', supplierArea: 'Deccan', supplierType: 'Restaurant', foodType: 'Mixed Meal',
    quantity: 12.5, listedAt: '2026-10-20T10:00:00.000Z', deadline: '2026-10-20T12:00:00.000Z', address: 'Pune', lat: 18.5, lng: 73.8,
    status: 'Available', volunteerId: null, volunteerAssigned: null, notes: 'Veg',
  });
});

test('keeps completed stops first and keeps each pickup beside its drop', () => {
  const rows = [
    { id: 'drop-b', listing_id: 'b', type: 'drop', lat: 18.52, lng: 73.86, status: 'Pending' },
    { id: 'pickup-a', listing_id: 'a', type: 'pickup', lat: 18.50, lng: 73.84, status: 'Pending' },
    { id: 'completed', listing_id: 'old', type: 'pickup', lat: 18.51, lng: 73.85, status: 'Completed' },
    { id: 'drop-a', listing_id: 'a', type: 'drop', lat: 18.51, lng: 73.85, status: 'Pending' },
    { id: 'pickup-b', listing_id: 'b', type: 'pickup', lat: 18.70, lng: 73.90, status: 'Pending' },
  ];
  assert.deepEqual(optimizeRouteStops(rows).map(stop => stop.id), ['completed', 'pickup-a', 'drop-a', 'pickup-b', 'drop-b']);
});

test('does not lose unpaired route stops', () => {
  const stop = { id: 'manual', listing_id: null, type: 'pickup', status: 'Pending', lat: 18.5, lng: 73.8 };
  assert.deepEqual(optimizeRouteStops([stop]), [stop]);
});
