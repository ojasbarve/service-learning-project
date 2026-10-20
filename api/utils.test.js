import test from 'node:test';
import assert from 'node:assert/strict';
import { matchingSpot, normalizeListing } from './utils.js';

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
