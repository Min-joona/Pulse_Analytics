/** Seed the analytics database. Usage: npm run seed */
require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const Sale = require('./models/Sale');
const User = require('./models/User');
const { generateSales } = require('./data/generate');

const run = async () => {
  try {
    await connectDB();
    await Promise.all([Sale.deleteMany(), User.deleteMany()]);

    await User.create({ name: 'Amar Hassen', email: 'admin@pulse.io', password: 'admin123' });

    const sales = generateSales(180);
    await Sale.insertMany(sales);

    console.log(`✓ Seeded ${sales.length} sales across 180 days + 1 user.`);
    console.log('  Login: admin@pulse.io / admin123');
    await mongoose.connection.close();
    process.exit(0);
  } catch (err) {
    console.error('Seed failed:', err.message);
    process.exit(1);
  }
};

run();
