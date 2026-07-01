const mongoose = require('mongoose');

// One document per order/transaction — the raw event the dashboard aggregates.
const saleSchema = new mongoose.Schema({
  date: { type: Date, required: true, index: true },
  amount: { type: Number, required: true },
  quantity: { type: Number, default: 1 },
  product: { type: String, required: true },
  category: { type: String, required: true, index: true },
  channel: { type: String, required: true }, // Organic, Paid, Social, Email, Referral, Direct
  region: { type: String, required: true }, // North America, Europe, ...
  device: { type: String, required: true }, // Desktop, Mobile, Tablet
  newCustomer: { type: Boolean, default: false },
});

module.exports = mongoose.models.Sale || mongoose.model('Sale', saleSchema);
