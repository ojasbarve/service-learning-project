# 🍱 Nourish.Net (formerly Pune Plate)

> **Real-time food surplus coordination platform built for Sevadeep NGO, Pune.**  
> Built as part of the Service Learning Project — TY CS B, Symbiosis Institute of Technology, Pune.

---

## 📌 Project Overview

**Nourish.Net** connects food donors (hotels, corporate cafeterias, college canteens, wedding banquet halls, dhabas, bakeries) with **Sevadeep NGO**'s volunteer distribution network in Pune. 

It replaces unstructured WhatsApp communication with a structured, role-based, real-time coordination dashboard with interactive GIS mapping, urgency badges, and volunteer routing.

---

## 🚀 Key Features

### 🏪 1. Supplier Portal (`/supplier`)
- **Log Surplus (`/supplier/log`)**: Simple form to log surplus meals (quantity in kg, food type, deadline, dietary notes). New listings reflect immediately across volunteer and ops views.
- **My History (`/supplier/history`)**: Log of all past food donations and completion statuses.
- **My Profile (`/supplier/profile`)**: Donor profile with impact statistics (lifetime kg donated, meals enabled) and recent activity.

### 🚴 2. Volunteer Portal (`/volunteer`)
- **Available Surplus (`/volunteer/available`)**: Real-time listing queue with countdown urgency timers. Claiming an order updates status across the platform.
- **Today's Route (`/volunteer/route`)**: Sequential stop timeline and interactive Leaflet map showing pickup locations (green 📦) and paired delivery drop points (hospitals 🏥 & community shelters ⛺).
- **AI Demand Forecast (`/volunteer/forecast`)**: Predictive demand charts across Pune sectors and upcoming surge event alerts.
- **Distribution Log (`/volunteer/log`)**: Detailed log of completed pickups, deliveries, and delivery performance metrics.

### 🏢 3. Sevadeep Ops Command Center (`/ops`)
- **Overview (`/ops/overview`)**: High-level command center with live citywide logistics map, key performance indicators (KPIs), area-wise breakdown, and active dispatch status.
- **Volunteer Route Inspector (`/ops/routes`)**: Dedicated interface to inspect and audit routes for each volunteer separately with individual turn-by-turn timelines and maps.
- **Supply Network Map (`/ops/map`)**: Full-screen GIS map of 26+ donor partner locations categorized across IT parks, wedding halls, restaurants, canteens, bakeries, and dhabas.
- **NGO Partners (`/ops/partners`)**: Searchable and filterable directory of all partner establishments.
- **User Directory (`/ops/profiles`)**: Comprehensive overseer console to inspect both Food Suppliers and Field Volunteers.
- **Reports & Analytics (`/ops/reports`)**: 14-day trend charts, sector-wise demand, and volunteer metrics.

---

## 🛠️ Tech Stack

- **Frontend Framework:** React 18
- **Build Tool:** Vite
- **Styling:** Tailwind CSS + Custom Design System
- **Routing:** React Router v6
- **Maps:** Leaflet.js & React-Leaflet (OpenStreetMap tiles)
- **Charts:** Recharts
- **Icons:** Lucide React
- **State Management:** React Context (`AppContext.jsx` for reactive cross-portal state)

---

## 💻 Getting Started

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

3. Launch the frontend-only development server:
   ```bash
   npm run dev
   ```

4. Open your browser at:
   ```
   http://localhost:5173
   ```

### Run the API locally

The API is implemented as Vercel functions. Use Vercel's local runtime when you need database-backed routes:

```bash
npx vercel dev
```

Create `.env` from `.env.example` and set a reachable MySQL `DATABASE_URL`. A local MySQL server works with `vercel dev`; it will not work after deployment because Vercel cannot reach your laptop's `localhost`.

### Database setup

```bash
mysql -u root -p < database/schema.sql
mysql -u root -p nourish_net_db < database/seed.sql
```

### Deploy to Vercel

```bash
npx vercel --prod
```

Add `DATABASE_URL`, `DATABASE_SSL=true` when required by the provider, and `CORS_ORIGIN` in Vercel's Production environment. Redeploy after changing environment variables.

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

## 📁 Project Structure

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
