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
```

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
