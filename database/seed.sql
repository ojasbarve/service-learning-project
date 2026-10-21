USE nourish_net_db;

START TRANSACTION;

-- mockData.js contains no account credentials, so users is intentionally empty.
-- Supplier/volunteer user_id values remain nullable until the API creates accounts.

INSERT INTO suppliers
  (id, name, area, address, type, lat, lng, contact_person, phone, total_donated_kg, meals_enabled, partner_since)
VALUES
  ('s1', 'Hotel Shreyas', 'Deccan', 'F.C. Road, Deccan Gymkhana, Pune 411004', 'Restaurant', 18.517800, 73.842200, 'Suresh Patil', '+91-20-2567-8901', 847, 2350, 'Mar 2025'),
  ('s2', 'Symbiosis Institute Canteen', 'Viman Nagar', 'Symbiosis Road, Viman Nagar, Pune 411014', 'College Canteen', 18.563400, 73.919400, 'Priya Deshpande', '+91-20-6615-2100', 412, 1178, 'Jun 2025'),
  ('s3', 'The Westin Pune Koregaon Park', 'Koregaon Park', '36/3-B, Koregaon Park Annex, Mundhwa, Pune 411001', 'Hotel Banquet', 18.536200, 73.893000, 'Anand Sharma', '+91-20-6681-0000', 1240, 3542, 'Jan 2025'),
  ('s4', 'TCS Hinjewadi Cafeteria', 'Hinjewadi', 'TCS Campus, Phase 3, Hinjewadi, Pune 411057', 'IT Park Canteen', 18.591200, 73.738900, 'Ramesh Kadam', '+91-20-6667-2222', 623, 1780, 'Feb 2025'),
  ('s5', 'MIT WPU Central Canteen', 'Kothrud', 'Survey No. 124, Paud Road, Kothrud, Pune 411038', 'College Canteen', 18.507400, 73.807700, 'Vandana Joshi', '+91-20-7117-7117', 289, 825, 'Aug 2025'),
  ('s6', 'Hotel Durvankur', 'Sadashiv Peth', '2570, Sadashiv Peth, Near Laxmi Road, Pune 411030', 'Restaurant', 18.512800, 73.856700, 'Dilip More', '+91-20-2447-0000', 374, 1068, 'Apr 2025'),
  ('s7', 'Pune Marriott Hotel & Convention Centre', 'Senapati Bapat Road', 'Baner Pashan Link Road, Pune 411016', 'Hotel Banquet', 18.547600, 73.808100, 'Neha Kulkarni', '+91-20-4913-0000', 910, 2600, 'Dec 2024'),
  ('s8', 'COEP Technological University Canteen', 'Shivajinagar', 'Wellesley Road, Shivajinagar, Pune 411005', 'College Canteen', 18.530800, 73.847400, 'Arun Bhosale', '+91-20-2559-3038', 198, 565, 'Sep 2025'),
  ('s9', 'Katakir Bakery', 'Camp', 'M.G. Road, Camp, Pune 411001', 'Bakery', 18.519600, 73.877300, 'Rajesh Iyer', '+91-98222-11223', 156, 445, 'Jul 2025'),
  ('s10', 'Roopali Dhaba', 'Fergusson College Road', 'FC Road, Shivajinagar, Pune 411005', 'Local Dhaba', 18.523600, 73.839700, 'Sunil Shinde', '+91-77890-44321', 234, 668, 'May 2025'),
  ('s11', 'Infosys BPO Cafeteria', 'Hinjewadi', 'Infosys BPO, Phase 1, Hinjewadi, Pune 411057', 'IT Park Canteen', 18.591800, 73.739500, 'Meena Iyer', '+91-20-4141-0000', 512, 1462, 'Mar 2025');

INSERT INTO volunteers
  (id, name, short_name, zone, status, phone, vehicle_type, vehicle_number, completed_today, total_deliveries, joined_date, last_update)
VALUES
  ('v1', 'Ravi Kadam', 'Ravi K.', 'Hinjewadi', 'En Route', '+91-98456-11234', 'Tata Ace Mini Truck', 'MH 12 QZ 4412', 4, 87, 'Nov 2024', '5 min ago'),
  ('v2', 'Priya Mhaskar', 'Priya M.', 'Yerwada', 'Distributing', '+91-91234-55678', 'Maruti Eeco Cargo', 'MH 12 AB 9081', 2, 54, 'Jan 2025', '12 min ago'),
  ('v3', 'Amit Deshmukh', 'Amit D.', 'Shivajinagar', 'Available', '+91-77890-23456', 'Hero Electric Scooter', 'MH 14 EV 2209', 1, 63, 'Feb 2025', '2 min ago'),
  ('v4', 'Sneha Tambe', 'Sneha T.', 'Koregaon Park', 'Available', '+91-83456-78900', 'Mahindra Bolero Pickup', 'MH 12 RN 7654', 3, 41, 'Mar 2025', 'Just now'),
  ('v5', 'Kunal Bhavsar', 'Kunal B.', 'Kothrud', 'Available', '+91-92345-67890', 'Honda Activa 125', 'MH 12 KL 8731', 0, 29, 'May 2025', '8 min ago'),
  ('v6', 'Meera Gokhale', 'Meera G.', 'Deccan', 'Offline', '+91-99001-23456', 'TVS King Auto', 'MH 12 TR 1120', 0, 18, 'Jun 2025', '1 hr ago');

INSERT INTO delivery_spots
  (id, name, type, area, lat, lng, description, icon, contact_person, phone)
VALUES
  ('d1', 'Sassoon General Hospital Relief Center', 'Public Hospital', 'Station Road', 18.526400, 73.873200, 'Destitute patient & family meal counter', 'hospital', 'Dr. Kulkarni', '+91-20-2612-8000'),
  ('d2', 'KEM Hospital Patient Attendant Hub', 'Public Hospital', 'Rasta Peth', 18.520800, 73.868200, 'Evening patient attendants meal distribution', 'hospital', 'Sister Mary', '+91-20-6603-7300'),
  ('d3', 'Bharati Hospital Community Kitchen', 'Public Hospital', 'Dhankawadi / Katraj', 18.457500, 73.850800, 'Free meal counter for patient relatives', 'hospital', 'Sunil Rao', '+91-20-2437-3226'),
  ('d4', 'Sancheti Relief Center', 'Public Hospital', 'Shivajinagar', 18.530200, 73.850200, 'Daily noon and night hot meals', 'hospital', 'Anil K.', '+91-20-2899-9999'),
  ('d5', 'Ekta Nagar Construction Camp', 'Community Shelter', 'Hinjewadi', 18.587000, 73.743000, 'Migrant construction workers cluster', 'shelter', 'Manoj Yadav', '+91-98765-43210'),
  ('d6', 'Yerwada Resettlement Colony', 'Community Shelter', 'Yerwada', 18.549400, 73.907800, 'Underprivileged families daily distribution', 'shelter', 'Rehana Shaikh', '+91-99887-11223'),
  ('d7', 'Tadiwala Road Community Center', 'Community Shelter', 'Tadiwala Road', 18.516600, 73.869900, 'Evening community dinner distribution', 'shelter', 'Ganesh Shinde', '+91-98223-99881'),
  ('d8', 'Koregaon Park Migrant Labor Site', 'Community Shelter', 'Mundhwa', 18.542000, 73.897000, 'Daily dinner packet drop zone', 'shelter', 'Vijay K.', '+91-98440-22119');

INSERT INTO surplus_listings
  (id, supplier_id, food_type, quantity_kg, listed_at, deadline, address, lat, lng, status, volunteer_id, notes)
VALUES
  ('l1', 's1', 'Biryani', 35, NOW(), NOW() + INTERVAL 3 HOUR, 'F.C. Road, Deccan Gymkhana, Pune 411004', 18.517800, 73.842200, 'Assigned', 'v1', 'Chicken biryani, halal. Suitable for ~70 people.'),
  ('l2', 's2', 'Mixed Meal', 22, NOW(), NOW() + INTERVAL 2 HOUR + INTERVAL 30 MINUTE, 'Symbiosis Road, Viman Nagar, Pune 411014', 18.563400, 73.919400, 'Available', NULL, 'Veg only. Rice + sabzi + dal. Contains onion/garlic.'),
  ('l5', 's5', 'Mixed Meal', 15, NOW(), NOW() + INTERVAL 3 HOUR, 'Paud Road, Kothrud, Pune 411038', 18.507400, 73.807700, 'Available', NULL, 'Jain-friendly. Rice, dal, two sabzis. No onion/garlic.'),
  ('l6', 's6', 'Dal/Curry', 28, NOW(), NOW() + INTERVAL 2 HOUR, '2570, Sadashiv Peth, Pune 411030', 18.512800, 73.856700, 'Available', NULL, 'Dal rice set meals. Suitable for ~55 people.'),
  ('l7', 's7', 'Bread/Roti', 80, NOW(), NOW() + INTERVAL 4 HOUR, 'Baner Pashan Link Rd, Pune 411016', 18.547600, 73.808100, 'Available', NULL, 'Naan and bread rolls from wedding reception. ~250 portions.'),
  ('l8', 's8', 'Mixed Meal', 18, NOW(), NOW() + INTERVAL 45 MINUTE, 'Wellesley Road, Shivajinagar, Pune 411005', 18.530800, 73.847400, 'Available', 'v3', 'Lunch leftovers. Rice, dal, sabzi. Veg only.'),
  ('l9', 's11', 'Mixed Meal', 60, NOW(), NOW() + INTERVAL 50 MINUTE, 'Infosys BPO, Phase 1, Hinjewadi, Pune 411057', 18.591200, 73.738900, 'Available', 'v1', 'Large cafeteria clearance. South Indian + North Indian options.'),
  ('l10', 's3', 'Full Thali', 120, NOW(), NOW() + INTERVAL 5 HOUR, 'Karve Road, Karve Nagar, Pune 411052', 18.499000, 73.820100, 'Available', NULL, 'Full wedding thali — 6 items. Veg. Suitable for ~200 people.'),
  ('l11', 's9', 'Bakery Items', 12, NOW(), NOW() + INTERVAL 1 HOUR + INTERVAL 30 MINUTE, 'M.G. Road, Camp, Pune 411001', 18.519600, 73.877300, 'Available', NULL, 'Unsold bread loaves, buns, and dinner rolls. Must pick up before closing.'),
  ('l12', 's10', 'Dal/Curry', 18, NOW(), NOW() + INTERVAL 2 HOUR, 'FC Road, Shivajinagar, Pune 411005', 18.523600, 73.839700, 'Available', NULL, 'Dal fry and sabzi. Suitable for ~36 people.'),
  ('l13', 's4', 'Cooked Rice', 45, NOW(), NOW() + INTERVAL 2 HOUR + INTERVAL 30 MINUTE, 'TCS Campus Phase 3, Hinjewadi, Pune 411057', 18.592000, 73.738200, 'Available', NULL, 'Plain steamed rice from lunch service. No accompaniments.'),
  ('h1', 's1', 'Mixed Meal', 40, NOW() - INTERVAL 2 DAY, NOW() - INTERVAL 2 DAY + INTERVAL 3 HOUR, 'F.C. Road, Deccan Gymkhana, Pune 411004', 18.517800, 73.842200, 'Distributed', 'v1', 'Lunch leftovers.'),
  ('h2', 's3', 'Full Thali', 200, NOW() - INTERVAL 3 DAY, NOW() - INTERVAL 3 DAY + INTERVAL 4 HOUR, 'Koregaon Park Annex, Mundhwa, Pune 411001', 18.536200, 73.893000, 'Distributed', 'v4', 'Wedding banquet surplus.'),
  ('h3', 's4', 'Dal/Curry', 55, NOW() - INTERVAL 1 DAY, NOW() - INTERVAL 1 DAY + INTERVAL 2 HOUR, 'TCS Campus Phase 3, Hinjewadi, Pune 411057', 18.591200, 73.738900, 'Picked Up', 'v3', 'Dal and curry from cafeteria.'),
  ('h4', 's2', 'Mixed Meal', 30, NOW() - INTERVAL 4 DAY, NOW() - INTERVAL 4 DAY + INTERVAL 3 HOUR, 'Symbiosis Road, Viman Nagar, Pune 411014', 18.563400, 73.919400, 'Distributed', 'v1', 'Veg meals from canteen.'),
  ('h5', 's6', 'Biryani', 25, NOW() - INTERVAL 5 DAY, NOW() - INTERVAL 5 DAY + INTERVAL 2 HOUR, '2570, Sadashiv Peth, Pune 411030', 18.512800, 73.856700, 'Distributed', 'v2', 'Veg biryani.'),
  ('h6', 's9', 'Bakery Items', 8, NOW() - INTERVAL 1 DAY, NOW() - INTERVAL 1 DAY + INTERVAL 1 HOUR + INTERVAL 30 MINUTE, 'M.G. Road, Camp, Pune 411001', 18.519600, 73.877300, 'Picked Up', 'v3', 'Bread and buns.'),
  ('h7', 's7', 'Full Thali', 150, NOW() - INTERVAL 6 DAY, NOW() - INTERVAL 6 DAY + INTERVAL 5 HOUR, 'Baner Pashan Link Rd, Pune 411016', 18.547600, 73.808100, 'Distributed', 'v1', 'Conference dinner surplus.'),
  ('h8', 's10', 'Dal/Curry', 20, NOW() - INTERVAL 2 DAY, NOW() - INTERVAL 2 DAY + INTERVAL 2 HOUR, 'FC Road, Shivajinagar, Pune 411005', 18.523600, 73.839700, 'Picked Up', 'v4', 'Dal and sabzi.'),
  ('h9', 's5', 'Mixed Meal', 32, NOW() - INTERVAL 7 DAY, NOW() - INTERVAL 7 DAY + INTERVAL 3 HOUR, 'Paud Road, Kothrud, Pune 411038', 18.507400, 73.807700, 'Distributed', 'v5', 'Jain-friendly canteen meals.'),
  ('h10', 's11', 'Mixed Meal', 75, NOW() - INTERVAL 8 DAY, NOW() - INTERVAL 8 DAY + INTERVAL 2 HOUR, 'Infosys BPO, Phase 1, Hinjewadi, Pune 411057', 18.591800, 73.739500, 'Distributed', 'v1', 'Friday evening cafeteria clearance.');

-- listing_id is linked only where the route source has an exact current-listing match.
INSERT INTO route_stops
  (id, volunteer_id, listing_id, type, category, name, area, detail, address, lat, lng, sequence_order, status)
VALUES
  ('r-v1-1', 'v1', 'l9', 'pickup', 'IT Park Canteen', 'Infosys BPO Canteen', 'Hinjewadi', '60 kg (Mixed Meal)', 'Phase 1, Hinjewadi', 18.591200, 73.738900, 1, 'Pending'),
  ('r-v1-2', 'v1', NULL, 'drop', 'Community Shelter', 'Ekta Nagar Construction Camp', 'Hinjewadi', '150 meal packets', 'Ekta Nagar, Hinjewadi', 18.587000, 73.743000, 2, 'Pending'),
  ('r-v1-3', 'v1', 'l1', 'pickup', 'Restaurant', 'Hotel Shreyas', 'Deccan', '35 kg (Biryani)', 'F.C. Road, Deccan Gymkhana', 18.517800, 73.842200, 3, 'Pending'),
  ('r-v1-4', 'v1', NULL, 'drop', 'Public Hospital', 'Sassoon General Hospital Relief Center', 'Station Road', '85 meal packets', 'Near Pune Railway Station', 18.526400, 73.873200, 4, 'Pending'),
  ('r-v2-1', 'v2', NULL, 'pickup', 'Hotel Banquet', 'The Westin Pune', 'Koregaon Park', '45 kg (Bread/Roti)', 'Koregaon Park Annex', 18.536200, 73.893000, 1, 'Pending'),
  ('r-v2-2', 'v2', NULL, 'drop', 'Community Shelter', 'Yerwada Resettlement Colony', 'Yerwada', '110 meal packets', 'Yerwada Cluster', 18.549400, 73.907800, 2, 'Pending'),
  ('r-v2-3', 'v2', NULL, 'drop', 'Public Hospital', 'KEM Hospital Patient Attendant Hub', 'Rasta Peth', '50 meal packets', 'Rasta Peth, Pune', 18.520800, 73.868200, 3, 'Pending'),
  ('r-v3-1', 'v3', 'l8', 'pickup', 'College Canteen', 'COEP Technological University', 'Shivajinagar', '18 kg (Mixed Meal)', 'Wellesley Road, Shivajinagar', 18.530800, 73.847400, 1, 'Pending'),
  ('r-v3-2', 'v3', NULL, 'drop', 'Public Hospital', 'Sancheti Relief Center', 'Shivajinagar', '45 meal packets', 'Shivajinagar, Pune', 18.530200, 73.850200, 2, 'Pending'),
  ('r-v3-3', 'v3', NULL, 'drop', 'Community Shelter', 'Tadiwala Road Community Center', 'Tadiwala Road', '30 meal packets', 'Tadiwala Road', 18.516600, 73.869900, 3, 'Pending'),
  ('r-v4-1', 'v4', NULL, 'pickup', 'Bakery', 'German Bakery', 'Koregaon Park', '25 kg (Breads & Rolls)', 'North Main Road, Koregaon Park', 18.534500, 73.895200, 1, 'Pending'),
  ('r-v4-2', 'v4', NULL, 'drop', 'Community Shelter', 'Koregaon Park Migrant Labor Site', 'Mundhwa', '60 meal packets', 'Mundhwa Bridge Site', 18.542000, 73.897000, 2, 'Pending'),
  ('r-v5-1', 'v5', 'l5', 'pickup', 'College Canteen', 'MIT WPU Central Canteen', 'Kothrud', '15 kg (Mixed Meal)', 'Paud Road, Kothrud', 18.507400, 73.807700, 1, 'Pending'),
  ('r-v5-2', 'v5', NULL, 'drop', 'Public Hospital', 'Bharati Hospital Community Kitchen', 'Katraj', '40 meal packets', 'Pune-Satara Road, Katraj', 18.457500, 73.850800, 2, 'Pending'),
  ('r-v6-1', 'v6', 'l6', 'pickup', 'Restaurant', 'Hotel Durvankur', 'Sadashiv Peth', '28 kg (Dal/Curry)', '2570, Sadashiv Peth', 18.512800, 73.856700, 1, 'Pending'),
  ('r-v6-2', 'v6', NULL, 'drop', 'Public Hospital', 'Sassoon General Hospital Relief Center', 'Station Road', '70 meal packets', 'Near Pune Railway Station', 18.526400, 73.873200, 2, 'Pending');

INSERT INTO distribution_zones
  (id, name, area, lat, lng, avg_daily, today_est, trend, priority)
VALUES
  ('z1', 'Hinjewadi Construction Camp', 'West', 18.591200, 73.738900, 35, 48, '+37%', 'High'),
  ('z2', 'Yerwada Resettlement Colony', 'East', 18.549400, 73.907800, 40, 42, '+5%', 'Medium'),
  ('z3', 'Tadiwala Road Slum Cluster', 'Central', 18.516600, 73.869900, 30, 35, '+17%', 'Medium'),
  ('z4', 'Koregaon Park Migrant Site', 'East', 18.536200, 73.893000, 18, 23, '+28%', 'High'),
  ('z5', 'Bibwewadi Settlement', 'South', 18.489700, 73.856400, 22, NULL, NULL, 'No data');

INSERT INTO surge_events
  (id, icon, title, date_str, expected_surplus, alert_by, type, recurring)
VALUES
  ('e1', 'festival', 'Navratri Community Feast — Laxmi Road', 'Oct 2, 2026', '+200 kg', 'Sep 30', 'Festival', FALSE),
  ('e2', 'meal', 'IT Park Canteen Clearance — Hinjewadi', 'Every Friday 7:00 PM', '+80 kg', NULL, 'Recurring', TRUE),
  ('e3', 'season', 'Wedding Season Peak', 'Oct 15 – 30, 2026', '+400 kg over 2 weeks', 'Oct 12', 'Seasonal', FALSE);

COMMIT;
