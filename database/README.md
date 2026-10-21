# Nourish.Net database

MySQL/MariaDB database layer for the Nourish.Net surplus-food coordination platform.

## Connection

```bash
mysql -u root nourish_net_db
```

Database: `nourish_net_db`  
Character set: `utf8mb4`  
Local default port: `3306`

Apply from the project root:

```bash
mysql -u root < database/schema.sql
mysql -u root nourish_net_db < database/seed.sql
mysql -u root nourish_net_db < database/performance.sql
```

The performance script is for an existing database and adds targeted indexes for the live listing queue and volunteer route reads. Run it once after seeding. Use `EXPLAIN` to verify query plans before adding further indexes.

## Local MySQL / MariaDB

The app works with regular MySQL and MySQL-compatible MariaDB. On macOS, check that your local server is listening on port `3306`, then use your existing MySQL username and password:

```bash
mysql --protocol=TCP -h 127.0.0.1 -P 3306 -u root -p
```

Load the schema and seed data from the project directory:

```bash
mysql --protocol=TCP -h 127.0.0.1 -P 3306 -u root -p < database/schema.sql
mysql --protocol=TCP -h 127.0.0.1 -P 3306 -u root -p nourish_net_db < database/seed.sql
mysql --protocol=TCP -h 127.0.0.1 -P 3306 -u root -p nourish_net_db < database/performance.sql
```

Set the local project `.env` without a `DATABASE_URL` so the separate MySQL variables are used:

```env
DATABASE_URL=
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_actual_mysql_password
DB_NAME=nourish_net_db
DATABASE_SSL=false
```

Then run `npm run dev:api` and check `http://localhost:5175/api/health`. A working connection returns `{ "ok": true, "database": "connected" }`.

## MySQL for a public Vercel deployment

Your laptop's MySQL server is local only. Vercel cannot connect to `127.0.0.1` on your Mac. For a public deployment, use any hosted MySQL provider and put its host, port, user, password, and database into Vercel Environment Variables. Railway is only one option; it is not a different database. Keep `OLLAMA_ENABLED=false` in Vercel because your local Ollama server is also not reachable from Vercel.

Do not run `schema.sql` against an existing production database without a backup: it intentionally drops and rebuilds the application tables.

`schema.sql` is repeatable but rebuilds these tables, so it replaces existing data in this database. To remove the database completely:

```bash
mysql -u root < database/rollback.sql
```

## Tables

| Table | Purpose |
| --- | --- |
| `users` | Future authenticated accounts and roles. The mock data has no credentials, so this table starts empty. |
| `suppliers` | Food donors and supplier contact/location details. |
| `volunteers` | Volunteer status, vehicle, delivery totals, and current zone. |
| `delivery_spots` | Hospitals and community shelters receiving food. |
| `surplus_listings` | Active and historical food-surplus offers, deadlines, assignments, and notes. |
| `route_stops` | Ordered pickup/drop stops for each volunteer route. |
| `distribution_zones` | Demand estimates and priority by distribution area. |
| `surge_events` | Upcoming or recurring events that may increase surplus. |

Views:

- `active_surplus_listings` joins active listings to supplier and volunteer names.
- `volunteer_route_overview` joins route stops to volunteer display names.

Seed totals from `src/data/mockData.js`: 0 users, 11 suppliers, 6 volunteers, 8 delivery spots, 21 listings (11 active + 10 historical), 16 route stops, 5 distribution zones, and 3 surge events.
