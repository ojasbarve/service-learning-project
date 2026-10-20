CREATE DATABASE IF NOT EXISTS nourish_net_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE nourish_net_db;

SET FOREIGN_KEY_CHECKS = 0;
DROP VIEW IF EXISTS active_surplus_listings;
DROP VIEW IF EXISTS volunteer_route_overview;
DROP TABLE IF EXISTS route_stops;
DROP TABLE IF EXISTS surplus_listings;
DROP TABLE IF EXISTS distribution_zones;
DROP TABLE IF EXISTS surge_events;
DROP TABLE IF EXISTS delivery_spots;
DROP TABLE IF EXISTS volunteers;
DROP TABLE IF EXISTS suppliers;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1;

CREATE TABLE users (
  id VARCHAR(20) PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(30) NOT NULL DEFAULT 'volunteer',
  avatar VARCHAR(500),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_users_role CHECK (role IN ('admin', 'coordinator', 'supplier', 'volunteer'))
) ENGINE = InnoDB;

CREATE TABLE suppliers (
  id VARCHAR(20) PRIMARY KEY,
  user_id VARCHAR(20) UNIQUE,
  name VARCHAR(180) NOT NULL,
  area VARCHAR(120) NOT NULL,
  address VARCHAR(255) NOT NULL,
  type VARCHAR(80) NOT NULL,
  lat DECIMAL(9, 6) NOT NULL,
  lng DECIMAL(9, 6) NOT NULL,
  contact_person VARCHAR(150) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  total_donated_kg DECIMAL(10, 2) NOT NULL DEFAULT 0,
  meals_enabled INT UNSIGNED NOT NULL DEFAULT 0,
  partner_since VARCHAR(20) NOT NULL,
  CONSTRAINT fk_suppliers_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT chk_suppliers_lat CHECK (lat BETWEEN -90 AND 90),
  CONSTRAINT chk_suppliers_lng CHECK (lng BETWEEN -180 AND 180),
  CONSTRAINT chk_suppliers_totals CHECK (total_donated_kg >= 0 AND meals_enabled >= 0)
) ENGINE = InnoDB;

CREATE TABLE volunteers (
  id VARCHAR(20) PRIMARY KEY,
  user_id VARCHAR(20) UNIQUE,
  name VARCHAR(150) NOT NULL,
  short_name VARCHAR(80) NOT NULL,
  zone VARCHAR(120) NOT NULL,
  status VARCHAR(30) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  vehicle_type VARCHAR(100) NOT NULL,
  vehicle_number VARCHAR(30) NOT NULL,
  completed_today INT UNSIGNED NOT NULL DEFAULT 0,
  total_deliveries INT UNSIGNED NOT NULL DEFAULT 0,
  joined_date VARCHAR(20) NOT NULL,
  last_update VARCHAR(30) NOT NULL,
  CONSTRAINT fk_volunteers_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT chk_volunteers_status CHECK (status IN ('En Route', 'Distributing', 'Available', 'Offline'))
) ENGINE = InnoDB;

CREATE TABLE delivery_spots (
  id VARCHAR(20) PRIMARY KEY,
  name VARCHAR(180) NOT NULL,
  type VARCHAR(80) NOT NULL,
  area VARCHAR(120) NOT NULL,
  lat DECIMAL(9, 6) NOT NULL,
  lng DECIMAL(9, 6) NOT NULL,
  description VARCHAR(255) NOT NULL,
  icon VARCHAR(16) NOT NULL,
  contact_person VARCHAR(150) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  CONSTRAINT chk_delivery_spots_lat CHECK (lat BETWEEN -90 AND 90),
  CONSTRAINT chk_delivery_spots_lng CHECK (lng BETWEEN -180 AND 180)
) ENGINE = InnoDB;

CREATE TABLE surplus_listings (
  id VARCHAR(20) PRIMARY KEY,
  supplier_id VARCHAR(20) NOT NULL,
  food_type VARCHAR(80) NOT NULL,
  quantity_kg DECIMAL(10, 2) NOT NULL,
  listed_at DATETIME NOT NULL,
  deadline DATETIME NOT NULL,
  address VARCHAR(255) NOT NULL,
  lat DECIMAL(9, 6) NOT NULL,
  lng DECIMAL(9, 6) NOT NULL,
  status VARCHAR(30) NOT NULL DEFAULT 'Available',
  volunteer_id VARCHAR(20),
  notes TEXT,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_listings_supplier FOREIGN KEY (supplier_id) REFERENCES suppliers(id),
  CONSTRAINT fk_listings_volunteer FOREIGN KEY (volunteer_id) REFERENCES volunteers(id) ON DELETE SET NULL,
  CONSTRAINT chk_listings_quantity CHECK (quantity_kg > 0),
  CONSTRAINT chk_listings_deadline CHECK (deadline >= listed_at),
  CONSTRAINT chk_listings_status CHECK (status IN ('Available', 'Assigned', 'Picked Up', 'Distributed', 'Expired', 'Cancelled')),
  CONSTRAINT chk_listings_lat CHECK (lat BETWEEN -90 AND 90),
  CONSTRAINT chk_listings_lng CHECK (lng BETWEEN -180 AND 180)
) ENGINE = InnoDB;

CREATE TABLE route_stops (
  id VARCHAR(30) PRIMARY KEY,
  volunteer_id VARCHAR(20) NOT NULL,
  listing_id VARCHAR(20),
  type VARCHAR(20) NOT NULL,
  category VARCHAR(80) NOT NULL,
  name VARCHAR(180) NOT NULL,
  area VARCHAR(120) NOT NULL,
  detail VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  lat DECIMAL(9, 6) NOT NULL,
  lng DECIMAL(9, 6) NOT NULL,
  sequence_order TINYINT UNSIGNED NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'Pending',
  CONSTRAINT fk_route_stops_volunteer FOREIGN KEY (volunteer_id) REFERENCES volunteers(id),
  CONSTRAINT fk_route_stops_listing FOREIGN KEY (listing_id) REFERENCES surplus_listings(id) ON DELETE SET NULL,
  CONSTRAINT chk_route_stops_type CHECK (type IN ('pickup', 'drop')),
  CONSTRAINT chk_route_stops_status CHECK (status IN ('Pending', 'In Progress', 'Completed', 'Skipped')),
  CONSTRAINT chk_route_stops_lat CHECK (lat BETWEEN -90 AND 90),
  CONSTRAINT chk_route_stops_lng CHECK (lng BETWEEN -180 AND 180),
  UNIQUE KEY uq_route_stop_order (volunteer_id, sequence_order)
) ENGINE = InnoDB;

CREATE TABLE distribution_zones (
  id VARCHAR(20) PRIMARY KEY,
  name VARCHAR(180) NOT NULL,
  area VARCHAR(80) NOT NULL,
  lat DECIMAL(9, 6) NOT NULL,
  lng DECIMAL(9, 6) NOT NULL,
  avg_daily DECIMAL(10, 2) NOT NULL,
  today_est DECIMAL(10, 2),
  trend VARCHAR(20),
  priority VARCHAR(20) NOT NULL,
  CONSTRAINT chk_zones_lat CHECK (lat BETWEEN -90 AND 90),
  CONSTRAINT chk_zones_lng CHECK (lng BETWEEN -180 AND 180),
  CONSTRAINT chk_zones_values CHECK (avg_daily >= 0 AND (today_est IS NULL OR today_est >= 0)),
  CONSTRAINT chk_zones_priority CHECK (priority IN ('High', 'Medium', 'Low', 'No data'))
) ENGINE = InnoDB;

CREATE TABLE surge_events (
  id VARCHAR(20) PRIMARY KEY,
  icon VARCHAR(16) NOT NULL,
  title VARCHAR(255) NOT NULL,
  date_str VARCHAR(100) NOT NULL,
  expected_surplus VARCHAR(80) NOT NULL,
  alert_by VARCHAR(40),
  type VARCHAR(30) NOT NULL,
  recurring BOOLEAN NOT NULL DEFAULT FALSE
) ENGINE = InnoDB;

CREATE INDEX idx_suppliers_area ON suppliers (area);
CREATE INDEX idx_volunteers_status_zone ON volunteers (status, zone);
CREATE INDEX idx_delivery_spots_area ON delivery_spots (area);
CREATE INDEX idx_listings_status_deadline ON surplus_listings (status, deadline);
CREATE INDEX idx_listings_supplier ON surplus_listings (supplier_id);
CREATE INDEX idx_listings_volunteer ON surplus_listings (volunteer_id);
CREATE INDEX idx_route_stops_volunteer_order ON route_stops (volunteer_id, sequence_order);
CREATE INDEX idx_route_stops_listing ON route_stops (listing_id);
CREATE INDEX idx_route_stops_status ON route_stops (status);
CREATE INDEX idx_distribution_zones_priority ON distribution_zones (priority);
CREATE INDEX idx_surge_events_date ON surge_events (date_str);

CREATE VIEW active_surplus_listings AS
SELECT
  l.id,
  l.supplier_id,
  s.name AS supplier_name,
  s.area AS supplier_area,
  l.food_type,
  l.quantity_kg,
  l.listed_at,
  l.deadline,
  l.address,
  l.lat,
  l.lng,
  l.status,
  l.volunteer_id,
  v.short_name AS volunteer_name,
  l.notes,
  l.created_at
FROM surplus_listings AS l
JOIN suppliers AS s ON s.id = l.supplier_id
LEFT JOIN volunteers AS v ON v.id = l.volunteer_id
WHERE l.status IN ('Available', 'Assigned');

CREATE VIEW volunteer_route_overview AS
SELECT
  r.id,
  r.volunteer_id,
  v.short_name AS volunteer_name,
  r.listing_id,
  r.type,
  r.category,
  r.name,
  r.area,
  r.detail,
  r.address,
  r.lat,
  r.lng,
  r.sequence_order,
  r.status
FROM route_stops AS r
JOIN volunteers AS v ON v.id = r.volunteer_id;
