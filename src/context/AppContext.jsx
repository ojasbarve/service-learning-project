import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { api } from '../services/api';
import { suppliers as fallbackSuppliers, volunteers as fallbackVolunteers, surplusListings as fallbackListings, deliverySpots as fallbackDeliverySpots, initialVolunteerRoutes as fallbackRoutes } from '../data/mockData';
import { USERS } from './users';

const AppCtx = createContext(null);

function keepRouteDemoCoherent(nextRoutes) {
  const repaired = { ...nextRoutes };
  for (const [volunteerId, fallback] of Object.entries(fallbackRoutes)) {
    const live = repaired[volunteerId];
    const hasDropOnlyData = live?.some(stop => stop.type === 'drop') && !live.some(stop => stop.type === 'pickup');
    if (hasDropOnlyData) repaired[volunteerId] = fallback;
  }
  return repaired;
}

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(USERS.ops[0]);
  const [listings, setListings] = useState(fallbackListings);
  const [volunteers, setVolunteers] = useState(fallbackVolunteers);
  const [suppliers, setSuppliers] = useState(fallbackSuppliers);
  const [deliverySpots, setDeliverySpots] = useState(fallbackDeliverySpots);
  const [routes, setRoutes] = useState(fallbackRoutes);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');
  const [lastSyncedAt, setLastSyncedAt] = useState(null);
  const refreshInFlight = useRef(false);

  const refresh = useCallback(async () => {
    if (refreshInFlight.current) return;
    refreshInFlight.current = true;
    setRefreshing(true);
    try {
      // FreeDB permits only a few simultaneous sessions. Keep the demo's
      // refresh burst serial so two browsers do not exhaust the shared cap.
      const snapshot = await api.bootstrap();
      const nextListings = snapshot.listings || [];
      const nextVolunteers = snapshot.volunteers || [];
      const nextSuppliers = snapshot.suppliers || [];
      const nextSpots = snapshot.deliverySpots || [];
      setListings(nextListings); setVolunteers(nextVolunteers); setSuppliers(nextSuppliers); setDeliverySpots(nextSpots);
      const nextRoutes = snapshot.routes || {};
      setRoutes(keepRouteDemoCoherent(nextRoutes)); setError(''); setLastSyncedAt(new Date());
    } catch (err) { setError(err.message); }
    finally { setLoading(false); setRefreshing(false); refreshInFlight.current = false; }
  }, []);

  useEffect(() => { refresh(); const timer = setInterval(refresh, 30000); return () => clearInterval(timer); }, [refresh]);

  async function claimListing(listingId, volunteerId) { await api.claimListing(listingId, volunteerId); await refresh(); }
  async function removeRouteStop(stopId) { const result = await api.removeRouteStop(stopId); await refresh(); return result; }
  async function addListing(listing) {
    const created = await api.createListing({ ...listing, quantity: listing.quantity, supplierId: listing.supplierId });
    await refresh(); return created;
  }
  function getVolunteerRoute(volunteerId) { return routes[volunteerId] || []; }

  return <AppCtx.Provider value={{ currentUser, setCurrentUser, listings, volunteers, suppliers, deliverySpots, routes, loading, refreshing, error, lastSyncedAt, refresh, claimListing, addListing, removeRouteStop, getVolunteerRoute }}>{children}</AppCtx.Provider>;
}

export function useApp() { return useContext(AppCtx); }
