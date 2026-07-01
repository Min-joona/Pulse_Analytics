# Pulse — MERN Analytics Dashboard

[![MERN](https://img.shields.io/badge/Stack-MERN-brightgreen)](#)
[![Recharts](https://img.shields.io/badge/Charts-Recharts-8884d8)](#)

A real-time-style analytics dashboard: KPI cards with period-over-period deltas,
revenue trend, breakdowns by channel / region / device / category, a top-products
table, and a live activity feed. Data is aggregated server-side with MongoDB
aggregation pipelines.

> Built by **Amar Hassen Mohammednur** as part of a full-stack portfolio.

## ✨ Features

- **KPI cards** — revenue, orders, average order value, new customers (with % change vs previous period)
- **Revenue trend** — daily area chart, switchable 7 / 30 / 90-day ranges
- **Breakdowns** — bar chart by channel, region, device, or category
- **Category donut** and **top-products** table
- **Live activity feed** — polls the latest transactions every 5s
- **JWT-gated** dashboard, dark UI, fully responsive

## 🧱 Tech Stack

React 18 · Vite · Tailwind CSS · Recharts · Node.js · Express · Mongoose · MongoDB · JWT

## 🚀 Getting Started

### Backend
```bash
cd backend
npm install
cp .env.example .env      # set MONGODB_URI + JWT_SECRET
npm run seed              # generates ~180 days of sales (thousands of records)
npm run dev               # http://localhost:5001
```

### Frontend
```bash
cd frontend
npm install
npm run dev               # http://localhost:5173
```

**Login:** `admin@pulse.io` / `admin123`

## 📊 API

| Endpoint | Description |
|----------|-------------|
| `GET /api/stats/overview?days=` | KPI totals + deltas |
| `GET /api/stats/revenue?days=` | Daily revenue/orders series |
| `GET /api/stats/breakdown?days=&by=` | Group by channel/region/category/device |
| `GET /api/stats/top-products?days=` | Best sellers |
| `GET /api/stats/live?limit=` | Most recent transactions |

## ☁️ Deployment

Two Vercel projects — `backend/` (serverless API, env: `MONGODB_URI`, `JWT_SECRET`,
`ALLOWED_ORIGINS`, `VERCEL=1`) and `frontend/` (env: `VITE_API_URL`). Seed once against Atlas.

## 📄 License
MIT
