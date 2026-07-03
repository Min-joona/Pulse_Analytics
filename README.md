# Pulse Analytics

A real-time business analytics dashboard built on the MERN stack. Pulse aggregates raw sales events into KPIs, trends, and breakdowns using MongoDB aggregation pipelines, and streams recent activity into a live feed.

**Live demo:** [pulse-analytics-dash.vercel.app](https://pulse-analytics-dash.vercel.app)

## Overview

- **KPI cards** — revenue, orders, average order value, and new customers with period-over-period deltas
- **Revenue trend** — daily time series across selectable 7/30/90-day windows
- **Breakdowns** — revenue by channel, region, device, or category
- **Top products** — best sellers ranked by revenue and units
- **Live activity feed** — most recent transactions, polled continuously
- **Authenticated access** — the dashboard sits behind JWT login

All aggregation happens server-side; the client renders pre-computed series with Recharts.

## Architecture

```
amar-analytics/
├── backend/          Express REST API
│   ├── config/       Database connection (serverless-aware)
│   ├── data/         Deterministic sales-event generator
│   ├── models/       Sale, User schemas
│   └── routes/       /api/stats · /api/auth
└── frontend/         React dashboard (Vite)
    └── src/
        ├── pages/       Login, Dashboard
        └── components/  KPI cards, chart panels
```

## Tech Stack

| Layer      | Technology                                     |
| ---------- | ---------------------------------------------- |
| Frontend   | React 18, Vite, Tailwind CSS, Recharts         |
| Backend    | Node.js, Express, Mongoose aggregation         |
| Database   | MongoDB Atlas                                  |
| Security   | Helmet, rate limiting, input sanitization, JWT |

## Getting Started

**Prerequisites:** Node.js 18+ and a MongoDB connection string.

```bash
# API
cd backend
npm install
cp .env.example .env   # configure environment
npm run seed           # optional: generate ~180 days of sample data
npm run dev

# Dashboard
cd frontend
npm install
npm run dev
```

Environment variables are documented in [`backend/.env.example`](backend/.env.example) and [`frontend/.env.example`](frontend/.env.example).

## API Reference

| Endpoint                        | Description                             |
| ------------------------------- | --------------------------------------- |
| `GET /api/stats/overview`       | KPI totals with previous-period deltas  |
| `GET /api/stats/revenue`        | Daily revenue and order series          |
| `GET /api/stats/breakdown`      | Grouped revenue by dimension            |
| `GET /api/stats/top-products`   | Best-selling products                   |
| `GET /api/stats/live`           | Most recent transactions                |

All stats endpoints require a valid bearer token.

## Author

**Amar Hassen Mohammednur** — [github.com/Min-joona](https://github.com/Min-joona)

## License

MIT
