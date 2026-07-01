const express = require('express');
const Sale = require('../models/Sale');
const { protect } = require('../middleware/auth');

const router = express.Router();

// All stats routes require auth.
router.use(protect);

const rangeStart = (days) => {
  const d = new Date();
  d.setDate(d.getDate() - days);
  d.setHours(0, 0, 0, 0);
  return d;
};

// GET /api/stats/overview?days=30 — KPI cards with period-over-period deltas
router.get('/overview', async (req, res) => {
  try {
    const days = Number(req.query.days) || 30;
    const start = rangeStart(days);
    const prevStart = rangeStart(days * 2);

    const agg = async (from, to) => {
      const match = { date: { $gte: from } };
      if (to) match.date.$lt = to;
      const [r] = await Sale.aggregate([
        { $match: match },
        {
          $group: {
            _id: null,
            revenue: { $sum: '$amount' },
            orders: { $sum: 1 },
            units: { $sum: '$quantity' },
            newCustomers: { $sum: { $cond: ['$newCustomer', 1, 0] } },
          },
        },
      ]);
      return r || { revenue: 0, orders: 0, units: 0, newCustomers: 0 };
    };

    const current = await agg(start);
    const previous = await agg(prevStart, start);
    const pct = (c, p) => (p === 0 ? 100 : +(((c - p) / p) * 100).toFixed(1));

    res.json({
      revenue: { value: +current.revenue.toFixed(2), delta: pct(current.revenue, previous.revenue) },
      orders: { value: current.orders, delta: pct(current.orders, previous.orders) },
      aov: {
        value: current.orders ? +(current.revenue / current.orders).toFixed(2) : 0,
        delta: pct(
          current.orders ? current.revenue / current.orders : 0,
          previous.orders ? previous.revenue / previous.orders : 0
        ),
      },
      newCustomers: { value: current.newCustomers, delta: pct(current.newCustomers, previous.newCustomers) },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET /api/stats/revenue?days=30 — daily revenue & orders time series
router.get('/revenue', async (req, res) => {
  const days = Number(req.query.days) || 30;
  const data = await Sale.aggregate([
    { $match: { date: { $gte: rangeStart(days) } } },
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
        revenue: { $sum: '$amount' },
        orders: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
    { $project: { _id: 0, date: '$_id', revenue: { $round: ['$revenue', 2] }, orders: 1 } },
  ]);
  res.json(data);
});

// GET /api/stats/breakdown?days=30&by=channel|region|category|device
router.get('/breakdown', async (req, res) => {
  const days = Number(req.query.days) || 30;
  const field = ['channel', 'region', 'category', 'device'].includes(req.query.by)
    ? req.query.by
    : 'channel';
  const data = await Sale.aggregate([
    { $match: { date: { $gte: rangeStart(days) } } },
    { $group: { _id: `$${field}`, revenue: { $sum: '$amount' }, orders: { $sum: 1 } } },
    { $sort: { revenue: -1 } },
    { $project: { _id: 0, label: '$_id', revenue: { $round: ['$revenue', 2] }, orders: 1 } },
  ]);
  res.json(data);
});

// GET /api/stats/top-products?days=30
router.get('/top-products', async (req, res) => {
  const days = Number(req.query.days) || 30;
  const data = await Sale.aggregate([
    { $match: { date: { $gte: rangeStart(days) } } },
    {
      $group: {
        _id: { product: '$product', category: '$category' },
        revenue: { $sum: '$amount' },
        units: { $sum: '$quantity' },
      },
    },
    { $sort: { revenue: -1 } },
    { $limit: 8 },
    {
      $project: {
        _id: 0,
        product: '$_id.product',
        category: '$_id.category',
        revenue: { $round: ['$revenue', 2] },
        units: 1,
      },
    },
  ]);
  res.json(data);
});

// GET /api/stats/live — most recent transactions (for the live feed)
router.get('/live', async (req, res) => {
  const limit = Number(req.query.limit) || 12;
  const data = await Sale.find().sort({ date: -1 }).limit(limit).lean();
  res.json(data);
});

module.exports = router;
