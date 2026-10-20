// ─── Suppliers ────────────────────────────────────────────────────────────────
export const suppliers = [
  { id: 's1', name: 'Hotel Shreyas', area: 'Deccan', address: 'F.C. Road, Deccan Gymkhana, Pune 411004', type: 'Restaurant', lat: 18.5178, lng: 73.8422, contact: 'Suresh Patil', phone: '+91-20-2567-8901', totalDonated: 847, mealsEnabled: 2350, partnerSince: 'Mar 2025' },
  { id: 's2', name: 'Symbiosis Institute Canteen', area: 'Viman Nagar', address: 'Symbiosis Road, Viman Nagar, Pune 411014', type: 'College Canteen', lat: 18.5634, lng: 73.9194, contact: 'Priya Deshpande', phone: '+91-20-6615-2100', totalDonated: 412, mealsEnabled: 1178, partnerSince: 'Jun 2025' },
  { id: 's3', name: 'The Westin Pune Koregaon Park', area: 'Koregaon Park', address: '36/3-B, Koregaon Park Annex, Mundhwa, Pune 411001', type: 'Hotel Banquet', lat: 18.5362, lng: 73.893, contact: 'Anand Sharma', phone: '+91-20-6681-0000', totalDonated: 1240, mealsEnabled: 3542, partnerSince: 'Jan 2025' },
  { id: 's4', name: 'TCS Hinjewadi Cafeteria', area: 'Hinjewadi', address: 'TCS Campus, Phase 3, Hinjewadi, Pune 411057', type: 'IT Park Canteen', lat: 18.5912, lng: 73.7389, contact: 'Ramesh Kadam', phone: '+91-20-6667-2222', totalDonated: 623, mealsEnabled: 1780, partnerSince: 'Feb 2025' },
  { id: 's5', name: 'MIT WPU Central Canteen', area: 'Kothrud', address: 'Survey No. 124, Paud Road, Kothrud, Pune 411038', type: 'College Canteen', lat: 18.5074, lng: 73.8077, contact: 'Vandana Joshi', phone: '+91-20-7117-7117', totalDonated: 289, mealsEnabled: 825, partnerSince: 'Aug 2025' },
  { id: 's6', name: 'Hotel Durvankur', area: 'Sadashiv Peth', address: '2570, Sadashiv Peth, Near Laxmi Road, Pune 411030', type: 'Restaurant', lat: 18.5128, lng: 73.8567, contact: 'Dilip More', phone: '+91-20-2447-0000', totalDonated: 374, mealsEnabled: 1068, partnerSince: 'Apr 2025' },
  { id: 's7', name: 'Pune Marriott Hotel & Convention Centre', area: 'Senapati Bapat Road', address: 'Baner Pashan Link Road, Pune 411016', type: 'Hotel Banquet', lat: 18.5476, lng: 73.8081, contact: 'Neha Kulkarni', phone: '+91-20-4913-0000', totalDonated: 910, mealsEnabled: 2600, partnerSince: 'Dec 2024' },
  { id: 's8', name: 'COEP Technological University Canteen', area: 'Shivajinagar', address: 'Wellesley Road, Shivajinagar, Pune 411005', type: 'College Canteen', lat: 18.5308, lng: 73.8474, contact: 'Arun Bhosale', phone: '+91-20-2559-3038', totalDonated: 198, mealsEnabled: 565, partnerSince: 'Sep 2025' },
  { id: 's9', name: 'Katakir Bakery', area: 'Camp', address: 'M.G. Road, Camp, Pune 411001', type: 'Bakery', lat: 18.5196, lng: 73.8773, contact: 'Rajesh Iyer', phone: '+91-98222-11223', totalDonated: 156, mealsEnabled: 445, partnerSince: 'Jul 2025' },
  { id: 's10', name: 'Roopali Dhaba', area: 'Fergusson College Road', address: 'FC Road, Shivajinagar, Pune 411005', type: 'Local Dhaba', lat: 18.5236, lng: 73.8397, contact: 'Sunil Shinde', phone: '+91-77890-44321', totalDonated: 234, mealsEnabled: 668, partnerSince: 'May 2025' },
  { id: 's11', name: 'Infosys BPO Cafeteria', area: 'Hinjewadi', address: 'Infosys BPO, Phase 1, Hinjewadi, Pune 411057', type: 'IT Park Canteen', lat: 18.5918, lng: 73.7395, contact: 'Meena Iyer', phone: '+91-20-4141-0000', totalDonated: 512, mealsEnabled: 1462, partnerSince: 'Mar 2025' },
];

// ─── Surplus Listings ──────────────────────────────────────────────────────────
export const surplusListings = [
  // ── Active listings (dynamic deadlines) ──
  { id: 'l1', supplierId: 's1', supplierName: 'Hotel Shreyas', supplierArea: 'Deccan', supplierType: 'Restaurant', foodType: 'Biryani', quantity: 35, listedAt: new Date().toISOString(), deadline: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(), address: 'F.C. Road, Deccan Gymkhana, Pune 411004', lat: 18.5178, lng: 73.8422, status: 'Assigned', volunteerAssigned: 'Ravi K.', notes: 'Chicken biryani, halal. Suitable for ~70 people.' },
  { id: 'l2', supplierId: 's2', supplierName: 'Symbiosis Institute Canteen', supplierArea: 'Viman Nagar', supplierType: 'College Canteen', foodType: 'Mixed Meal', quantity: 22, listedAt: new Date().toISOString(), deadline: new Date(Date.now() + 2.5 * 60 * 60 * 1000).toISOString(), address: 'Symbiosis Road, Viman Nagar, Pune 411014', lat: 18.5634, lng: 73.9194, status: 'Available', volunteerAssigned: null, notes: 'Veg only. Rice + sabzi + dal. Contains onion/garlic.' },
  { id: 'l5', supplierId: 's5', supplierName: 'MIT WPU Central Canteen', supplierArea: 'Kothrud', supplierType: 'College Canteen', foodType: 'Mixed Meal', quantity: 15, listedAt: new Date().toISOString(), deadline: new Date(Date.now() + 3 * 60 * 60 * 1000).toISOString(), address: 'Paud Road, Kothrud, Pune 411038', lat: 18.5074, lng: 73.8077, status: 'Available', volunteerAssigned: null, notes: 'Jain-friendly. Rice, dal, two sabzis. No onion/garlic.' },
  { id: 'l6', supplierId: 's6', supplierName: 'Hotel Durvankur', supplierArea: 'Sadashiv Peth', supplierType: 'Restaurant', foodType: 'Dal/Curry', quantity: 28, listedAt: new Date().toISOString(), deadline: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), address: '2570, Sadashiv Peth, Pune 411030', lat: 18.5128, lng: 73.8567, status: 'Available', volunteerAssigned: null, notes: 'Dal rice set meals. Suitable for ~55 people.' },
  { id: 'l7', supplierId: 's7', supplierName: 'Pune Marriott Hotel', supplierArea: 'Senapati Bapat Road', supplierType: 'Hotel Banquet', foodType: 'Bread/Roti', quantity: 80, listedAt: new Date().toISOString(), deadline: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), address: 'Baner Pashan Link Rd, Pune 411016', lat: 18.5476, lng: 73.8081, status: 'Available', volunteerAssigned: null, notes: 'Naan and bread rolls from wedding reception. ~250 portions.' },
  { id: 'l8', supplierId: 's8', supplierName: 'COEP Technological University Canteen', supplierArea: 'Shivajinagar', supplierType: 'College Canteen', foodType: 'Mixed Meal', quantity: 18, listedAt: new Date().toISOString(), deadline: new Date(Date.now() + 45 * 60 * 1000).toISOString(), address: 'Wellesley Road, Shivajinagar, Pune 411005', lat: 18.5308, lng: 73.8474, status: 'Available', volunteerAssigned: null, notes: 'Lunch leftovers. Rice, dal, sabzi. Veg only.' },
  { id: 'l9', supplierId: 's11', supplierName: 'Infosys BPO Canteen', supplierArea: 'Hinjewadi', supplierType: 'IT Park Canteen', foodType: 'Mixed Meal', quantity: 60, listedAt: new Date().toISOString(), deadline: new Date(Date.now() + 50 * 60 * 1000).toISOString(), address: 'Infosys BPO, Phase 1, Hinjewadi, Pune 411057', lat: 18.5912, lng: 73.7389, status: 'Available', volunteerAssigned: null, notes: 'Large cafeteria clearance. South Indian + North Indian options.' },
  { id: 'l10', supplierId: 's3', supplierName: 'Local Wedding — Karve Nagar Hall', supplierArea: 'Karve Nagar', supplierType: 'Wedding Hall', foodType: 'Full Thali', quantity: 120, listedAt: new Date().toISOString(), deadline: new Date(Date.now() + 5 * 60 * 60 * 1000).toISOString(), address: 'Karve Road, Karve Nagar, Pune 411052', lat: 18.499, lng: 73.8201, status: 'Available', volunteerAssigned: null, notes: 'Full wedding thali — 6 items. Veg. Suitable for ~200 people.' },
  { id: 'l11', supplierId: 's9', supplierName: 'Katakir Bakery', supplierArea: 'Camp', supplierType: 'Bakery', foodType: 'Bakery Items', quantity: 12, listedAt: new Date().toISOString(), deadline: new Date(Date.now() + 1.5 * 60 * 60 * 1000).toISOString(), address: 'M.G. Road, Camp, Pune 411001', lat: 18.5196, lng: 73.8773, status: 'Available', volunteerAssigned: null, notes: 'Unsold bread loaves, buns, and dinner rolls. Must pick up before closing.' },
  { id: 'l12', supplierId: 's10', supplierName: 'Roopali Dhaba', supplierArea: 'FC Road', supplierType: 'Local Dhaba', foodType: 'Dal/Curry', quantity: 18, listedAt: new Date().toISOString(), deadline: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(), address: 'FC Road, Shivajinagar, Pune 411005', lat: 18.5236, lng: 73.8397, status: 'Available', volunteerAssigned: null, notes: 'Dal fry and sabzi. Suitable for ~36 people.' },
  { id: 'l13', supplierId: 's4', supplierName: 'TCS Hinjewadi Cafeteria', supplierArea: 'Hinjewadi', supplierType: 'IT Park Canteen', foodType: 'Cooked Rice', quantity: 45, listedAt: new Date().toISOString(), deadline: new Date(Date.now() + 2.5 * 60 * 60 * 1000).toISOString(), address: 'TCS Campus Phase 3, Hinjewadi, Pune 411057', lat: 18.5920, lng: 73.7382, status: 'Available', volunteerAssigned: null, notes: 'Plain steamed rice from lunch service. No accompaniments.' },

  // ── Historical listings (completed) ──
  { id: 'h1', supplierId: 's1', supplierName: 'Hotel Shreyas', supplierArea: 'Deccan', supplierType: 'Restaurant', foodType: 'Mixed Meal', quantity: 40, listedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), deadline: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(), address: 'F.C. Road, Deccan Gymkhana, Pune 411004', lat: 18.5178, lng: 73.8422, status: 'Distributed', volunteerAssigned: 'Ravi K.', notes: 'Lunch leftovers.' },
  { id: 'h2', supplierId: 's3', supplierName: 'The Westin Pune Koregaon Park', supplierArea: 'Koregaon Park', supplierType: 'Hotel Banquet', foodType: 'Full Thali', quantity: 200, listedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(), deadline: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000).toISOString(), address: 'Koregaon Park Annex, Mundhwa, Pune 411001', lat: 18.5362, lng: 73.893, status: 'Distributed', volunteerAssigned: 'Sneha T.', notes: 'Wedding banquet surplus.' },
  { id: 'h3', supplierId: 's4', supplierName: 'TCS Hinjewadi Cafeteria', supplierArea: 'Hinjewadi', supplierType: 'IT Park Canteen', foodType: 'Dal/Curry', quantity: 55, listedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), deadline: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(), address: 'TCS Campus Phase 3, Hinjewadi, Pune 411057', lat: 18.5912, lng: 73.7389, status: 'Picked Up', volunteerAssigned: 'Amit D.', notes: 'Dal and curry from cafeteria.' },
  { id: 'h4', supplierId: 's2', supplierName: 'Symbiosis Institute Canteen', supplierArea: 'Viman Nagar', supplierType: 'College Canteen', foodType: 'Mixed Meal', quantity: 30, listedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(), deadline: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(), address: 'Symbiosis Road, Viman Nagar, Pune 411014', lat: 18.5634, lng: 73.9194, status: 'Distributed', volunteerAssigned: 'Ravi K.', notes: 'Veg meals from canteen.' },
  { id: 'h5', supplierId: 's6', supplierName: 'Hotel Durvankur', supplierArea: 'Sadashiv Peth', supplierType: 'Restaurant', foodType: 'Biryani', quantity: 25, listedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), deadline: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(), address: '2570, Sadashiv Peth, Pune 411030', lat: 18.5128, lng: 73.8567, status: 'Distributed', volunteerAssigned: 'Priya M.', notes: 'Veg biryani.' },
  { id: 'h6', supplierId: 's9', supplierName: 'Katakir Bakery', supplierArea: 'Camp', supplierType: 'Bakery', foodType: 'Bakery Items', quantity: 8, listedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), deadline: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000 + 1.5 * 60 * 60 * 1000).toISOString(), address: 'M.G. Road, Camp, Pune 411001', lat: 18.5196, lng: 73.8773, status: 'Picked Up', volunteerAssigned: 'Amit D.', notes: 'Bread and buns.' },
  { id: 'h7', supplierId: 's7', supplierName: 'Pune Marriott Hotel', supplierArea: 'Senapati Bapat Road', supplierType: 'Hotel Banquet', foodType: 'Full Thali', quantity: 150, listedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(), deadline: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000).toISOString(), address: 'Baner Pashan Link Rd, Pune 411016', lat: 18.5476, lng: 73.8081, status: 'Distributed', volunteerAssigned: 'Ravi K.', notes: 'Conference dinner surplus.' },
  { id: 'h8', supplierId: 's10', supplierName: 'Roopali Dhaba', supplierArea: 'FC Road', supplierType: 'Local Dhaba', foodType: 'Dal/Curry', quantity: 20, listedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), deadline: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(), address: 'FC Road, Shivajinagar, Pune 411005', lat: 18.5236, lng: 73.8397, status: 'Picked Up', volunteerAssigned: 'Sneha T.', notes: 'Dal and sabzi.' },
  { id: 'h9', supplierId: 's5', supplierName: 'MIT WPU Central Canteen', supplierArea: 'Kothrud', supplierType: 'College Canteen', foodType: 'Mixed Meal', quantity: 32, listedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), deadline: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 3 * 60 * 60 * 1000).toISOString(), address: 'Paud Road, Kothrud, Pune 411038', lat: 18.5074, lng: 73.8077, status: 'Distributed', volunteerAssigned: 'Kunal B.', notes: 'Jain-friendly canteen meals.' },
  { id: 'h10', supplierId: 's11', supplierName: 'Infosys BPO Cafeteria', supplierArea: 'Hinjewadi', supplierType: 'IT Park Canteen', foodType: 'Mixed Meal', quantity: 75, listedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(), deadline: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000 + 2 * 60 * 60 * 1000).toISOString(), address: 'Infosys BPO, Phase 1, Hinjewadi, Pune 411057', lat: 18.5918, lng: 73.7395, status: 'Distributed', volunteerAssigned: 'Ravi K.', notes: 'Friday evening cafeteria clearance.' },
];

// ─── Volunteers ───────────────────────────────────────────────────────────────
export const volunteers = [
  { id: 'v1', name: 'Ravi Kadam', shortName: 'Ravi K.', zone: 'Hinjewadi', status: 'En Route', phone: '+91-98456-11234', lastUpdate: '5 min ago', assignedListings: ['l1', 'l9'], completedToday: 4, totalDeliveries: 87, vehicleType: 'Tata Ace Mini Truck', vehicleNumber: 'MH 12 QZ 4412', joinedDate: 'Nov 2024' },
  { id: 'v2', name: 'Priya Mhaskar', shortName: 'Priya M.', zone: 'Yerwada', status: 'Distributing', phone: '+91-91234-55678', lastUpdate: '12 min ago', assignedListings: [], completedToday: 2, totalDeliveries: 54, vehicleType: 'Maruti Eeco Cargo', vehicleNumber: 'MH 12 AB 9081', joinedDate: 'Jan 2025' },
  { id: 'v3', name: 'Amit Deshmukh', shortName: 'Amit D.', zone: 'Shivajinagar', status: 'Available', phone: '+91-77890-23456', lastUpdate: '2 min ago', assignedListings: ['l8'], completedToday: 1, totalDeliveries: 63, vehicleType: 'Hero Electric Scooter', vehicleNumber: 'MH 14 EV 2209', joinedDate: 'Feb 2025' },
  { id: 'v4', name: 'Sneha Tambe', shortName: 'Sneha T.', zone: 'Koregaon Park', status: 'Available', phone: '+91-83456-78900', lastUpdate: 'Just now', assignedListings: [], completedToday: 3, totalDeliveries: 41, vehicleType: 'Mahindra Bolero Pickup', vehicleNumber: 'MH 12 RN 7654', joinedDate: 'Mar 2025' },
  { id: 'v5', name: 'Kunal Bhavsar', shortName: 'Kunal B.', zone: 'Kothrud', status: 'Available', phone: '+91-92345-67890', lastUpdate: '8 min ago', assignedListings: [], completedToday: 0, totalDeliveries: 29, vehicleType: 'Honda Activa 125', vehicleNumber: 'MH 12 KL 8731', joinedDate: 'May 2025' },
  { id: 'v6', name: 'Meera Gokhale', shortName: 'Meera G.', zone: 'Deccan', status: 'Offline', phone: '+91-99001-23456', lastUpdate: '1 hr ago', assignedListings: [], completedToday: 0, totalDeliveries: 18, vehicleType: 'TVS King Auto', vehicleNumber: 'MH 12 TR 1120', joinedDate: 'Jun 2025' },
];

// ─── Distribution Zones ────────────────────────────────────────────────────────
export const distributionZones = [
  { id: 'z1', name: 'Hinjewadi Construction Camp', area: 'West', lat: 18.5912, lng: 73.7389, avgDaily: 35, todayEst: 48, trend: '+37%', priority: 'High' },
  { id: 'z2', name: 'Yerwada Resettlement Colony', area: 'East', lat: 18.5494, lng: 73.9078, avgDaily: 40, todayEst: 42, trend: '+5%', priority: 'Medium' },
  { id: 'z3', name: 'Tadiwala Road Slum Cluster', area: 'Central', lat: 18.5166, lng: 73.8699, avgDaily: 30, todayEst: 35, trend: '+17%', priority: 'Medium' },
  { id: 'z4', name: 'Koregaon Park Migrant Site', area: 'East', lat: 18.5362, lng: 73.893, avgDaily: 18, todayEst: 23, trend: '+28%', priority: 'High' },
  { id: 'z5', name: 'Bibwewadi Settlement', area: 'South', lat: 18.4897, lng: 73.8564, avgDaily: 22, todayEst: null, trend: null, priority: 'No data' },
];

// ─── Demand History ────────────────────────────────────────────────────────────
export const demandHistory = [
  { date: 'Sep 17', packets: 102, isProjection: false },
  { date: 'Sep 18', packets: 88, isProjection: false },
  { date: 'Sep 19', packets: 115, isProjection: false },
  { date: 'Sep 20', packets: 130, isProjection: false },
  { date: 'Sep 21', packets: 96, isProjection: false },
  { date: 'Sep 22', packets: 80, isProjection: false },
  { date: 'Sep 23', packets: 72, isProjection: false },
  { date: 'Sep 24', packets: 108, isProjection: false },
  { date: 'Sep 25', packets: 91, isProjection: false },
  { date: 'Sep 26', packets: 122, isProjection: false },
  { date: 'Sep 27', packets: 138, isProjection: false },
  { date: 'Sep 28', packets: 100, isProjection: false },
  { date: 'Sep 29', packets: 88, isProjection: false },
  { date: 'Sep 30', packets: 95, isProjection: false },
];

export const weekForecast = [
  { day: 'Mon', packets: 110, isToday: false, isProjection: false },
  { day: 'Tue', packets: 98, isToday: false, isProjection: false },
  { day: 'Wed', packets: 125, isToday: false, isProjection: false },
  { day: 'Thu', packets: 148, isToday: false, isProjection: false },
  { day: 'Fri', packets: 132, isToday: false, isProjection: false },
  { day: 'Sat', packets: 105, isToday: false, isProjection: true },
  { day: 'Sun', packets: 95, isToday: true, isProjection: true },
];

// ─── Upcoming Surge Events ─────────────────────────────────────────────────────
export const upcomingEvents = [
  { id: 'e1', icon: '🎊', title: 'Navratri Community Feast — Laxmi Road', date: 'Oct 2, 2026', expectedSurplus: '+200 kg', alertBy: 'Sep 30', type: 'Festival', recurring: false },
  { id: 'e2', icon: '🍽', title: 'IT Park Canteen Clearance — Hinjewadi', date: 'Every Friday 7:00 PM', expectedSurplus: '+80 kg', alertBy: null, type: 'Recurring', recurring: true },
  { id: 'e3', icon: '💒', title: 'Wedding Season Peak', date: 'Oct 15 – 30, 2026', expectedSurplus: '+400 kg over 2 weeks', alertBy: 'Oct 12', type: 'Seasonal', recurring: false },
];

// ─── Designated Delivery Spots (Hospitals & Community Shelters) ────────────────
export const deliverySpots = [
  { id: 'd1', name: 'Sassoon General Hospital Relief Center', type: 'Public Hospital', area: 'Station Road', lat: 18.5264, lng: 73.8732, description: 'Destitute patient & family meal counter', icon: '🏥', contact: 'Dr. Kulkarni', phone: '+91-20-2612-8000' },
  { id: 'd2', name: 'KEM Hospital Patient Attendant Hub', type: 'Public Hospital', area: 'Rasta Peth', lat: 18.5208, lng: 73.8682, description: 'Evening patient attendants meal distribution', icon: '🏥', contact: 'Sister Mary', phone: '+91-20-6603-7300' },
  { id: 'd3', name: 'Bharati Hospital Community Kitchen', type: 'Public Hospital', area: 'Dhankawadi / Katraj', lat: 18.4575, lng: 73.8508, description: 'Free meal counter for patient relatives', icon: '🏥', contact: 'Sunil Rao', phone: '+91-20-2437-3226' },
  { id: 'd4', name: 'Sancheti Relief Center', type: 'Public Hospital', area: 'Shivajinagar', lat: 18.5302, lng: 73.8502, description: 'Daily noon and night hot meals', icon: '🏥', contact: 'Anil K.', phone: '+91-20-2899-9999' },
  { id: 'd5', name: 'Ekta Nagar Construction Camp', type: 'Community Shelter', area: 'Hinjewadi', lat: 18.5870, lng: 73.7430, description: 'Migrant construction workers cluster', icon: '⛺', contact: 'Manoj Yadav', phone: '+91-98765-43210' },
  { id: 'd6', name: 'Yerwada Resettlement Colony', type: 'Community Shelter', area: 'Yerwada', lat: 18.5494, lng: 73.9078, description: 'Underprivileged families daily distribution', icon: '⛺', contact: 'Rehana Shaikh', phone: '+91-99887-11223' },
  { id: 'd7', name: 'Tadiwala Road Community Center', type: 'Community Shelter', area: 'Tadiwala Road', lat: 18.5166, lng: 73.8699, description: 'Evening community dinner distribution', icon: '⛺', contact: 'Ganesh Shinde', phone: '+91-98223-99881' },
  { id: 'd8', name: 'Koregaon Park Migrant Labor Site', type: 'Community Shelter', area: 'Mundhwa', lat: 18.5420, lng: 73.8970, description: 'Daily dinner packet drop zone', icon: '⛺', contact: 'Vijay K.', phone: '+91-98440-22119' },
];

// Helper to find a suitable delivery spot for a given area
export function getMatchingDeliverySpot(area) {
  const norm = (area || '').toLowerCase();
  if (norm.includes('hinjewadi') || norm.includes('wakad')) return deliverySpots[4]; // Ekta Nagar
  if (norm.includes('yerwada') || norm.includes('viman')) return deliverySpots[5]; // Yerwada Colony
  if (norm.includes('shivajinagar') || norm.includes('fc') || norm.includes('deccan')) return deliverySpots[3]; // Sancheti
  if (norm.includes('koregaon') || norm.includes('mundhwa')) return deliverySpots[7]; // Koregaon Migrant
  if (norm.includes('kothrud') || norm.includes('karve') || norm.includes('katraj')) return deliverySpots[2]; // Bharati Hospital
  return deliverySpots[0]; // Sassoon General Hospital as central default
}

// ─── Initial Volunteer Routes (individual routes for each volunteer) ───────────
export const initialVolunteerRoutes = {
  v1: [
    { id: 'r-v1-1', type: 'pickup', category: 'IT Park Canteen', name: 'Infosys BPO Canteen', area: 'Hinjewadi', detail: '60 kg (Mixed Meal)', lat: 18.5912, lng: 73.7389, address: 'Phase 1, Hinjewadi' },
    { id: 'r-v1-2', type: 'drop', category: 'Community Shelter', name: 'Ekta Nagar Construction Camp', area: 'Hinjewadi', detail: '150 meal packets', lat: 18.5870, lng: 73.7430, address: 'Ekta Nagar, Hinjewadi' },
    { id: 'r-v1-3', type: 'pickup', category: 'Restaurant', name: 'Hotel Shreyas', area: 'Deccan', detail: '35 kg (Biryani)', lat: 18.5178, lng: 73.8422, address: 'F.C. Road, Deccan Gymkhana' },
    { id: 'r-v1-4', type: 'drop', category: 'Public Hospital', name: 'Sassoon General Hospital Relief Center', area: 'Station Road', detail: '85 meal packets', lat: 18.5264, lng: 73.8732, address: 'Near Pune Railway Station' },
  ],
  v2: [
    { id: 'r-v2-1', type: 'pickup', category: 'Hotel Banquet', name: 'The Westin Pune', area: 'Koregaon Park', detail: '45 kg (Bread/Roti)', lat: 18.5362, lng: 73.893, address: 'Koregaon Park Annex' },
    { id: 'r-v2-2', type: 'drop', category: 'Community Shelter', name: 'Yerwada Resettlement Colony', area: 'Yerwada', detail: '110 meal packets', lat: 18.5494, lng: 73.9078, address: 'Yerwada Cluster' },
    { id: 'r-v2-3', type: 'drop', category: 'Public Hospital', name: 'KEM Hospital Patient Attendant Hub', area: 'Rasta Peth', detail: '50 meal packets', lat: 18.5208, lng: 73.8682, address: 'Rasta Peth, Pune' },
  ],
  v3: [
    { id: 'r-v3-1', type: 'pickup', category: 'College Canteen', name: 'COEP Technological University', area: 'Shivajinagar', detail: '18 kg (Mixed Meal)', lat: 18.5308, lng: 73.8474, address: 'Wellesley Road, Shivajinagar' },
    { id: 'r-v3-2', type: 'drop', category: 'Public Hospital', name: 'Sancheti Relief Center', area: 'Shivajinagar', detail: '45 meal packets', lat: 18.5302, lng: 73.8502, address: 'Shivajinagar, Pune' },
    { id: 'r-v3-3', type: 'drop', category: 'Community Shelter', name: 'Tadiwala Road Community Center', area: 'Tadiwala Road', detail: '30 meal packets', lat: 18.5166, lng: 73.8699, address: 'Tadiwala Road' },
  ],
  v4: [
    { id: 'r-v4-1', type: 'pickup', category: 'Bakery', name: 'German Bakery', area: 'Koregaon Park', detail: '25 kg (Breads & Rolls)', lat: 18.5345, lng: 73.8952, address: 'North Main Road, Koregaon Park' },
    { id: 'r-v4-2', type: 'drop', category: 'Community Shelter', name: 'Koregaon Park Migrant Labor Site', area: 'Mundhwa', detail: '60 meal packets', lat: 18.5420, lng: 73.8970, address: 'Mundhwa Bridge Site' },
  ],
  v5: [
    { id: 'r-v5-1', type: 'pickup', category: 'College Canteen', name: 'MIT WPU Central Canteen', area: 'Kothrud', detail: '15 kg (Mixed Meal)', lat: 18.5074, lng: 73.8077, address: 'Paud Road, Kothrud' },
    { id: 'r-v5-2', type: 'drop', category: 'Public Hospital', name: 'Bharati Hospital Community Kitchen', area: 'Katraj', detail: '40 meal packets', lat: 18.4575, lng: 73.8508, address: 'Pune-Satara Road, Katraj' },
  ],
  v6: [
    { id: 'r-v6-1', type: 'pickup', category: 'Restaurant', name: 'Hotel Durvankur', area: 'Sadashiv Peth', detail: '28 kg (Dal/Curry)', lat: 18.5128, lng: 73.8567, address: '2570, Sadashiv Peth' },
    { id: 'r-v6-2', type: 'drop', category: 'Public Hospital', name: 'Sassoon General Hospital Relief Center', area: 'Station Road', detail: '70 meal packets', lat: 18.5264, lng: 73.8732, address: 'Near Pune Railway Station' },
  ],
};

export const todayRouteStops = initialVolunteerRoutes.v1;


// ─── Supply Network Partners (for map) ────────────────────────────────────────
export const supplyNetworkPartners = [
  // IT Park Canteens
  { id: 'p1', name: 'Infosys BPO Canteen', type: 'IT Park Canteen', lat: 18.5918, lng: 73.7395, area: 'Hinjewadi', active: true },
  { id: 'p2', name: 'TCS Hinjewadi Cafeteria', type: 'IT Park Canteen', lat: 18.5912, lng: 73.7389, area: 'Hinjewadi', active: true },
  { id: 'p3', name: 'Wipro Campus Cafeteria', type: 'IT Park Canteen', lat: 18.5921, lng: 73.7412, area: 'Hinjewadi', active: true },
  { id: 'p4', name: 'Cognizant Cafeteria', type: 'IT Park Canteen', lat: 18.5524, lng: 73.7834, area: 'Baner', active: false },
  // Wedding Halls
  { id: 'p5', name: 'Karve Nagar Mangal Karyalay', type: 'Wedding Hall', lat: 18.499, lng: 73.8201, area: 'Karve Nagar', active: true },
  { id: 'p6', name: 'Sinhagad Road Banquet Hall', type: 'Wedding Hall', lat: 18.4821, lng: 73.8153, area: 'Sinhagad Road', active: false },
  { id: 'p7', name: 'Rohan Banquet Hall', type: 'Wedding Hall', lat: 18.5565, lng: 73.7890, area: 'Baner', active: true },
  { id: 'p8', name: 'Westin Pune Convention Hall', type: 'Wedding Hall', lat: 18.5362, lng: 73.893, area: 'Koregaon Park', active: true },
  // Hotel Restaurants
  { id: 'p9', name: 'Hotel Shreyas', type: 'Hotel Restaurant', lat: 18.5178, lng: 73.8422, area: 'Deccan', active: true },
  { id: 'p10', name: 'Hotel Durvankur', type: 'Hotel Restaurant', lat: 18.5128, lng: 73.8567, area: 'Sadashiv Peth', active: true },
  { id: 'p11', name: 'Pune Marriott Restaurant', type: 'Hotel Restaurant', lat: 18.5476, lng: 73.8081, area: 'Baner', active: true },
  { id: 'p12', name: 'Hotel Sinhagad', type: 'Hotel Restaurant', lat: 18.5093, lng: 73.8195, area: 'Swargate', active: false },
  // College Canteens
  { id: 'p13', name: 'COEP Canteen', type: 'College Canteen', lat: 18.5308, lng: 73.8474, area: 'Shivajinagar', active: true },
  { id: 'p14', name: 'Symbiosis Institute Canteen', type: 'College Canteen', lat: 18.5634, lng: 73.9194, area: 'Viman Nagar', active: true },
  { id: 'p15', name: 'MIT WPU Canteen', type: 'College Canteen', lat: 18.5074, lng: 73.8077, area: 'Kothrud', active: true },
  { id: 'p16', name: 'Fergusson College Canteen', type: 'College Canteen', lat: 18.5236, lng: 73.8397, area: 'Shivajinagar', active: false },
  // Local Dhabas
  { id: 'p17', name: 'Roopali Dhaba', type: 'Local Dhaba', lat: 18.5236, lng: 73.8397, area: 'FC Road', active: true },
  { id: 'p18', name: 'Vaishali Restaurant', type: 'Local Dhaba', lat: 18.5248, lng: 73.8413, area: 'FC Road', active: true },
  { id: 'p19', name: 'Durvankur Dhaba', type: 'Local Dhaba', lat: 18.5130, lng: 73.8570, area: 'Sadashiv Peth', active: true },
  { id: 'p20', name: 'Dorabjees Restaurant', type: 'Local Dhaba', lat: 18.5192, lng: 73.8768, area: 'Camp', active: false },
  // Corporate Cafeterias
  { id: 'p21', name: 'Bajaj Auto Corporate Cafeteria', type: 'Corporate Cafeteria', lat: 18.5142, lng: 73.8598, area: 'Akurdi', active: true },
  { id: 'p22', name: 'Thermax Corporate Cafeteria', type: 'Corporate Cafeteria', lat: 18.5721, lng: 73.7798, area: 'Pimpri', active: false },
  { id: 'p23', name: 'Force Motors Cafeteria', type: 'Corporate Cafeteria', lat: 18.5633, lng: 73.8024, area: 'Akurdi', active: true },
  // Bakeries
  { id: 'p24', name: 'Katakir Bakery', type: 'Bakery', lat: 18.5196, lng: 73.8773, area: 'Camp', active: true },
  { id: 'p25', name: 'German Bakery', type: 'Bakery', lat: 18.5345, lng: 73.8952, area: 'Koregaon Park', active: true },
  { id: 'p26', name: 'Kayani Bakery', type: 'Bakery', lat: 18.5195, lng: 73.8763, area: 'Camp', active: false },
];
