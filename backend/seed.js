/** Seed the analytics database. Usage: npm run seed */
require('dotenv').config();
const mongoose = require('mongoose');
const runSeed = require('./seedRunner');

runSeed()
  .then((result) => {
    console.log(`✓ Seeded ${result.sales} sales across 180 days + ${result.users} user.`);
    console.log('  Login: admin@pulse.io / admin123');
    return mongoose.connection.close();
  })
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Seed failed:', err.message);
    process.exit(1);
  });
