# Nourish.Net (formerly Pune Plate)

> **Real-time food surplus coordination platform built for Sevadeep NGO, Pune.**  
> Built as part of the Service Learning Project — TY CS B, Symbiosis Institute of Technology, Pune.

---

## Project Overview

**Nourish.Net** connects food donors (hotels, corporate cafeterias, college canteens, wedding banquet halls, dhabas, bakeries) with **Sevadeep NGO**'s volunteer distribution network in Pune. 

It replaces unstructured WhatsApp communication with a structured, role-based, real-time coordination dashboard with interactive GIS mapping, urgency badges, and volunteer routing.

---

## Key Features

### 1. Supplier Portal (`/supplier`)
- **Log Surplus (`/supplier/log`)**: Simple form to log surplus meals (quantity in kg, food type, deadline, dietary notes). New listings reflect immediately across volunteer and ops views.
- **My History (`/supplier/history`)**: Log of all past food donations and completion statuses.
- **My Profile (`/supplier/profile`)**: Donor profile with impact statistics (lifetime kg donated, meals enabled) and recent activity.

### 2. Volunteer Portal (`/volunteer`)
- **Available Surplus (`/volunteer/available`)**: Real-time listing queue with countdown urgency timers. Claiming an order updates status across the platform.
- **Today's Route (`/volunteer/route`)**: Sequential stop timeline and interactive Leaflet map showing pickup locations and paired delivery drop points.
- **AI Demand Forecast (`/volunteer/forecast`)**: Predictive demand charts across Pune sectors and upcoming surge event alerts.
- **Distribution Log (`/volunteer/log`)**: Detailed log of completed pickups, deliveries, and delivery performance metrics.

### 3. Sevadeep Ops Command Center (`/ops`)
- **Overview (`/ops/overview`)**: High-level command center with live citywide logistics map, key performance indicators (KPIs), area-wise breakdown, and active dispatch status.
- **Volunteer Route Inspector (`/ops/routes`)**: Dedicated interface to inspect and audit routes for each volunteer separately with individual turn-by-turn timelines and maps.
- **Supply Network Map (`/ops/map`)**: Full-screen GIS map of 26+ donor partner locations categorized across IT parks, wedding halls, restaurants, canteens, bakeries, and dhabas.
- **NGO Partners (`/ops/partners`)**: Searchable and filterable directory of all partner establishments.
- **User Directory (`/ops/profiles`)**: Comprehensive overseer console to inspect both Food Suppliers and Field Volunteers.
- **Reports & Analytics (`/ops/reports`)**: 14-day trend charts, sector-wise demand, and volunteer metrics.

---

## Tech Stack

- **Frontend Framework:** React 18
- **Build Tool:** Vite
- **Styling:** Tailwind CSS + Custom Design System
- **Routing:** React Router v6
- **Maps:** Leaflet.js & React-Leaflet (OpenStreetMap tiles)
- **Charts:** Recharts
- **Icons:** Lucide React
- **State Management:** React Context (`AppContext.jsx` for reactive cross-portal state)

---

## Getting Started

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v18 or higher recommended).

### Installation & Run

1. Navigate to the project directory:
   ```bash
   cd "/Users/ojasb/Desktop/Service Learning/pune-plate"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Launch the local app and API together:
   ```bash
   npm run dev
   ```

4. Open your browser at:
   ```
   http://localhost:3000

   Use `npm run dev:frontend` only when you specifically want the frontend without database-backed API calls.
   ```

### Run the API locally

The API is implemented as Vercel functions. Use Vercel's local runtime when you need database-backed routes:

The API is included when you run `npm run dev`; `npm run dev:api` remains available if you need to start the Vercel runtime separately.

Create `.env` from `.env.example` and set a reachable MySQL `DATABASE_URL`. A local MySQL server works with `vercel dev`; it will not work after deployment because Vercel cannot reach your laptop's `localhost`.

### Optional local AI briefing

The Ops Overview includes an optional local briefing action backed by Ollama. It is disabled by default and sends the current operational snapshot only to your local Ollama server when enabled.

```bash
ollama pull gemma3:4b
```

Set `OLLAMA_ENABLED=true`, `OLLAMA_BASE_URL=http://127.0.0.1:11434`, and `OLLAMA_MODEL=gemma3:4b` in `.env`, then start `npm run dev:api`. This local integration is not available to a deployed Vercel function unless you provide a secured, reachable Ollama endpoint.

### Database setup

```bash
mysql -u root -p < database/schema.sql
mysql -u root -p nourish_net_db < database/seed.sql
mysql -u root -p nourish_net_db < database/performance.sql
```

`database/performance.sql` adds targeted indexes for the live listing queue and volunteer routes. It is intended to be run once on an existing database. Use `EXPLAIN` before adding more indexes because indexes speed reads but add write overhead.

### Deploy to Vercel

This demo intentionally has no login yet. Use the role switcher to test the three shared views from one public URL:

- `/supplier/history` shows a supplier whether a volunteer has claimed its listing.
- `/volunteer/available` shows available listings and lets the volunteer claim one.
- `/ops/overview` and the Ops pages show the shared listings, volunteers, and routes.

All three portals read and write the same database. Do not use the laptop's local MariaDB for production: Vercel needs a hosted MySQL-compatible database.

```bash
npx vercel --prod
```

Before the first production deployment, create the schema and seed data in the hosted database:

```bash
mysql --protocol=TCP -h <host> -P <port> -u <user> -p < database/schema.sql
mysql --protocol=TCP -h <host> -P <port> -u <user> -p nourish_net_db < database/seed.sql
mysql --protocol=TCP -h <host> -P <port> -u <user> -p nourish_net_db < database/performance.sql
```

Add these Vercel Production environment variables, then redeploy:

```text
DATABASE_URL=mysql://<user>:<password>@<host>:<port>/<database>
DATABASE_SSL=true                  # only when required by the provider
DATABASE_SSL_VERIFY=false         # FreeDB uses a self-signed CA; use true for trusted providers
CORS_ORIGIN=https://<your-domain>
OLLAMA_ENABLED=false
```

The same deployed URL works in desktop and mobile browsers; the app's responsive layout switches to a bottom navigation bar on small screens. The local role switcher is a temporary demo control and is intentionally not security.

Health check:

```bash
curl https://your-project.vercel.app/api/health
```

### Verification

```bash
npm run build
npm run lint
npm test
```

The current role switcher is intentionally a demo authentication mode. Before production use with real people, replace it with an identity provider and add authorization checks to every mutation endpoint.

---

## Project Structure

```
pune-plate/
├── public/                 # Static assets
├── src/
│   ├── components/
│   │   ├── layout/         # TopBar, Sidebar, Layout wrappers
│   │   └── ui/             # Reusable UI cards, badges, user switcher, timeline
│   ├── context/
│   │   └── AppContext.jsx  # Global state for listings, volunteers & dynamic routes
│   ├── data/
│   │   └── mockData.js     # Seed data: suppliers, listings, hospitals, delivery spots
│   ├── pages/
│   │   ├── Landing.jsx     # Public homepage
│   │   ├── supplier/       # LogSurplus, SurplusHistory, SupplierProfile
│   │   ├── volunteer/      # AvailableSurplus, TodayRoute, DemandForecast, DistributionLog
│   │   └── ops/            # OpsOverview, OpsVolunteerRoutes, OpsSupplyMap, OpsPartners, OpsProfiles, OpsReports
│   ├── App.jsx             # Route definitions
│   └── main.jsx            # React root with Context & Router providers
├── package.json
└── README.md
```

---

*Sevadeep NGO × Symbiosis Institute of Technology (SIT), Pune*
