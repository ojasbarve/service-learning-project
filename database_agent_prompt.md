# Task Prompt: MySQL Database Creation for Nourish.Net (Sevadeep NGO)

You are tasked with creating the complete MySQL relational database for the **Nourish.Net** platform (a real-time food surplus coordination web application for Sevadeep NGO, Pune).

> **Important Constraint:** Only the database layer (schema, tables, constraints, indexes, views, and seed data) needs to be created now. The backend API integration will be done later.

---

### Project Context
- **Codebase Path:** `/Users/ojasb/Desktop/Service Learning/pune-plate`
- **Data Source File:** Inspect `/Users/ojasb/Desktop/Service Learning/pune-plate/src/data/mockData.js` to see exact attributes, entities, relationships, and seed data records.
- **DBMS:** MySQL (Homebrew installed on macOS at `/opt/homebrew/bin/mysql`).
- **Database Name:** `nourish_net_db`

---

### Instructions for Agent

1. **Verify / Start MySQL Service:**
   Check MySQL status via:
   ```bash
   brew services list | grep mysql
   ```
   Start if stopped: `brew services start mysql`

2. **Database Schema Design (`schema.sql`):**
   Create a SQL script `schema.sql` inside a new directory `/Users/ojasb/Desktop/Service Learning/pune-plate/database/` with:
   - `CREATE DATABASE IF NOT EXISTS nourish_net_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`
   - Use proper data types, Primary Keys, Foreign Keys with `ON DELETE CASCADE` or `SET NULL`, `NOT NULL` constraints, timestamps (`created_at`, `updated_at`), and indexes on foreign keys and search columns.

3. **Required Tables & Specifications:**

   - **`users`**:
     - `id` VARCHAR(50) PRIMARY KEY (or INT AUTO_INCREMENT)
     - `name` VARCHAR(150) NOT NULL
     - `email` VARCHAR(150) UNIQUE NOT NULL
     - `password_hash` VARCHAR(255) NULL (for future auth)
     - `role` ENUM('supplier', 'volunteer', 'ops') NOT NULL
     - `avatar` VARCHAR(10) DEFAULT '👤'
     - `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP

   - **`suppliers`** (Food Donors):
     - `id` VARCHAR(50) PRIMARY KEY (e.g. 's1', 's2')
     - `user_id` VARCHAR(50) NULL (FK -> `users.id`)
     - `name` VARCHAR(150) NOT NULL
     - `area` VARCHAR(100) NOT NULL
     - `address` TEXT NOT NULL
     - `type` ENUM('Restaurant', 'College Canteen', 'IT Park Canteen', 'Hotel Banquet', 'Bakery', 'Local Dhaba', 'Corporate Cafeteria') NOT NULL
     - `lat` DECIMAL(10, 6) NOT NULL
     - `lng` DECIMAL(10, 6) NOT NULL
     - `contact_person` VARCHAR(100) NOT NULL
     - `phone` VARCHAR(30) NOT NULL
     - `total_donated_kg` INT DEFAULT 0
     - `meals_enabled` INT DEFAULT 0
     - `partner_since` VARCHAR(50) DEFAULT '2025'

   - **`volunteers`** (Field Delivery Drivers):
     - `id` VARCHAR(50) PRIMARY KEY (e.g. 'v1', 'v2')
     - `user_id` VARCHAR(50) NULL (FK -> `users.id`)
     - `name` VARCHAR(150) NOT NULL
     - `short_name` VARCHAR(50) NOT NULL
     - `zone` VARCHAR(100) NOT NULL
     - `status` ENUM('Available', 'En Route', 'Distributing', 'Offline') DEFAULT 'Available'
     - `phone` VARCHAR(30) NOT NULL
     - `vehicle_type` VARCHAR(100) NOT NULL
     - `vehicle_number` VARCHAR(50) NOT NULL
     - `completed_today` INT DEFAULT 0
     - `total_deliveries` INT DEFAULT 0
     - `joined_date` VARCHAR(50) DEFAULT '2025'
     - `last_update` VARCHAR(50) DEFAULT 'Just now'

   - **`delivery_spots`** (Public Hospitals & Community Shelters):
     - `id` VARCHAR(50) PRIMARY KEY (e.g. 'd1', 'd2')
     - `name` VARCHAR(150) NOT NULL
     - `type` ENUM('Public Hospital', 'Community Shelter', 'Labor Camp', 'Slum Cluster') NOT NULL
     - `area` VARCHAR(100) NOT NULL
     - `lat` DECIMAL(10, 6) NOT NULL
     - `lng` DECIMAL(10, 6) NOT NULL
     - `description` TEXT
     - `icon` VARCHAR(10) DEFAULT '📍'
     - `contact_person` VARCHAR(100)
     - `phone` VARCHAR(30)

   - **`surplus_listings`** (Logged Food Batches):
     - `id` VARCHAR(50) PRIMARY KEY (e.g. 'l1', 'l2', or generated)
     - `supplier_id` VARCHAR(50) NOT NULL (FK -> `suppliers.id` ON DELETE CASCADE)
     - `food_type` VARCHAR(100) NOT NULL
     - `quantity_kg` DECIMAL(8, 2) NOT NULL
     - `listed_at` DATETIME NOT NULL
     - `deadline` DATETIME NOT NULL
     - `address` TEXT NOT NULL
     - `lat` DECIMAL(10, 6) NOT NULL
     - `lng` DECIMAL(10, 6) NOT NULL
     - `status` ENUM('Available', 'Assigned', 'Picked Up', 'Distributed', 'Expired') DEFAULT 'Available'
     - `volunteer_id` VARCHAR(50) NULL (FK -> `volunteers.id` ON DELETE SET NULL)
     - `notes` TEXT NULL
     - `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP

   - **`route_stops`** (Volunteer Transit Schedule):
     - `id` VARCHAR(50) PRIMARY KEY
     - `volunteer_id` VARCHAR(50) NOT NULL (FK -> `volunteers.id` ON DELETE CASCADE)
     - `listing_id` VARCHAR(50) NULL (FK -> `surplus_listings.id` ON DELETE SET NULL)
     - `type` ENUM('pickup', 'drop') NOT NULL
     - `category` VARCHAR(100) NOT NULL
     - `name` VARCHAR(150) NOT NULL
     - `area` VARCHAR(100) NOT NULL
     - `detail` VARCHAR(150) NOT NULL
     - `address` TEXT NOT NULL
     - `lat` DECIMAL(10, 6) NOT NULL
     - `lng` DECIMAL(10, 6) NOT NULL
     - `sequence_order` INT NOT NULL DEFAULT 1
     - `status` ENUM('Pending', 'In Transit', 'Completed') DEFAULT 'Pending'

   - **`distribution_zones`** (Zone Logistics):
     - `id` VARCHAR(50) PRIMARY KEY
     - `name` VARCHAR(150) NOT NULL
     - `area` VARCHAR(50) NOT NULL
     - `lat` DECIMAL(10, 6) NOT NULL
     - `lng` DECIMAL(10, 6) NOT NULL
     - `avg_daily` INT NOT NULL
     - `today_est` INT NULL
     - `trend` VARCHAR(20) NULL
     - `priority` ENUM('High', 'Medium', 'Low', 'No data') DEFAULT 'Medium'

   - **`surge_events`** (Upcoming Supply Surge Events):
     - `id` VARCHAR(50) PRIMARY KEY
     - `icon` VARCHAR(10)
     - `title` VARCHAR(200) NOT NULL
     - `date_str` VARCHAR(100) NOT NULL
     - `expected_surplus` VARCHAR(100) NOT NULL
     - `alert_by` VARCHAR(100) NULL
     - `type` VARCHAR(50) NOT NULL
     - `recurring` BOOLEAN DEFAULT FALSE

4. **Seed Data (`seed.sql`):**
   - Populate each table using the actual, rich data from `/Users/ojasb/Desktop/Service Learning/pune-plate/src/data/mockData.js`:
     - 11 Suppliers
     - 6 Volunteers
     - 8 Delivery Spots (Sassoon, KEM, Bharati Hospital, Sancheti, etc.)
     - All 13 Active + 10 Historical Listings
     - Initial Route stops for each volunteer
     - 5 Distribution Zones
     - 3 Upcoming Surge Events
     - Seed initial User accounts corresponding to `USERS` in `AppContext.jsx`

5. **Execution & Verification:**
   - Execute the SQL scripts in MySQL:
     ```bash
     mysql -u root < database/schema.sql
     mysql -u root nourish_net_db < database/seed.sql
     ```
   - Run verification queries (e.g. `SELECT table_name, table_rows FROM information_schema.tables WHERE table_schema = 'nourish_net_db';`) to confirm all tables and records are created properly.
   - Leave documentation in `/Users/ojasb/Desktop/Service Learning/pune-plate/database/README.md` on how to connect and run migrations.
