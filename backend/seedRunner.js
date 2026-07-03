/** Core seed logic, reused by the CLI (seed.js) and the guarded /api/seed route. */
const connectDB = require('./config/db');
const Sale = require('./models/Sale');
const User = require('./models/User');
const { generateSales } = require('./data/generate');

async function runSeed() {
  await connectDB();
  await Promise.all([Sale.deleteMany(), User.deleteMany()]);

  await User.create({ name: 'Amar Hassen', email: 'admin@pulse.io', password: 'admin123' });
  const sales = generateSales(180);
  await Sale.insertMany(sales);

  return { users: 1, sales: sales.length };
}

module.exports = runSeed;
