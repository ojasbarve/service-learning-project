USE nourish_net_db;

-- Run once against an existing database. These indexes match the live queue,
-- volunteer route, and status dashboards. Verify with EXPLAIN before adding
-- further indexes; every index increases write cost.
CREATE INDEX idx_listings_status_created ON surplus_listings (status, created_at);
CREATE INDEX idx_route_stops_volunteer_status ON route_stops (volunteer_id, status, sequence_order);
