import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { api } from '../services/api';
import { suppliers as fallbackSuppliers, volunteers as fallbackVolunteers, surplusListings as fallbackListings, deliverySpots as fallbackDeliverySpots, initialVolunteerRoutes as fallbackRoutes } from '../data/mockData';

const AppCtx = createContext(null);

export const USERS = {
  suppliers: [
    { id: 's1', name: 'Hotel Shreyas', role: 'supplier', supplierId: 's1', avatar: 'HS' },
    { id: 's2', name: 'Symbiosis Canteen', role: 'supplier', supplierId: 's2', avatar: 'SC' },
    { id: 's4', name: 'TCS Hinjewadi', role: 'supplier', supplierId: 's4', avatar: 'TH' },
  ],
  volunteers: [
    { id: 'v1', name: 'Ravi Kadam', role: 'volunteer', volunteerId: 'v1', avatar: 'RK' },
    { id: 'v3', name: 'Amit Deshmukh', role: 'volunteer', volunteerId: 'v3', avatar: 'AD' },
  ],
  ops: [{ id: 'ops1', name: 'Sevadeep Coordinator', role: 'ops', avatar: 'OP' }],
};

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(USERS.ops[0]);
  const [listings, setListings] = useState(fallbackListings);
  const [volunteers, setVolunteers] = useState(fallbackVolunteers);
  const [suppliers, setSuppliers] = useState(fallbackSuppliers);
  const [deliverySpots, setDeliverySpots] = useState(fallbackDeliverySpots);
  const [routes, setRoutes] = useState(fallbackRoutes);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [lastSyncedAt, setLastSyncedAt] = useState(null);
  const refreshInFlight = useRef(false);

  const refresh = useCallback(async () => {
    if (refreshInFlight.current) return;
    refreshInFlight.current = true;
    try {
      const [nextListings, nextVolunteers, nextSuppliers, nextSpots] = await Promise.all([
        api.listings(), api.volunteers(), api.suppliers(), api.deliverySpots(),
      ]);
      setListings(nextListings); setVolunteers(nextVolunteers); setSuppliers(nextSuppliers); setDeliverySpots(nextSpots);
      const nextRoutes = await api.volunteerRoutes();
      setRoutes(nextRoutes); setError(''); setLastSyncedAt(new Date());
    } catch (err) { setError(err.message); }
    finally { setLoading(false); refreshInFlight.current = false; }
  }, []);

  useEffect(() => { refresh(); const timer = setInterval(refresh, 30000); return () => clearInterval(timer); }, [refresh]);

  async function claimListing(listingId, volunteerId) { await api.claimListing(listingId, volunteerId); await refresh(); }
  async function removeRouteStop(stopId) { const result = await api.removeRouteStop(stopId); await refresh(); return result; }
  async function addListing(listing) {
    const created = await api.createListing({ ...listing, quantity: listing.quantity, supplierId: listing.supplierId });
    await refresh(); return created;
  }
  function getVolunteerRoute(volunteerId) { return routes[volunteerId] || []; }

  return <AppCtx.Provider value={{ currentUser, setCurrentUser, listings, volunteers, suppliers, deliverySpots, routes, loading, error, lastSyncedAt, refresh, claimListing, addListing, removeRouteStop, getVolunteerRoute }}>{children}</AppCtx.Provider>;
}

export function useApp() { return useContext(AppCtx); }
