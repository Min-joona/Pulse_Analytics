// Generates realistic time-series sales data for the dashboard.
const CATEGORIES = ['Electronics', 'Fashion', 'Home', 'Beauty', 'Sports', 'Books'];
const PRODUCTS = {
  Electronics: ['Wireless Earbuds', 'Smart Watch', '4K Monitor', 'Mechanical Keyboard', 'Action Camera'],
  Fashion: ['Leather Jacket', 'Running Shoes', 'Denim Jeans', 'Wool Coat', 'Silk Scarf'],
  Home: ['Table Lamp', 'Ceramic Vase', 'Throw Blanket', 'Coffee Grinder', 'Wall Clock'],
  Beauty: ['Vitamin C Serum', 'Matte Lipstick', 'Face Cream', 'Hair Oil', 'Perfume'],
  Sports: ['Yoga Mat', 'Dumbbell Set', 'Water Bottle', 'Resistance Bands', 'Foam Roller'],
  Books: ['Atomic Habits', 'Deep Work', 'The Alchemist', 'Sapiens', 'Clean Code'],
};
const CHANNELS = ['Organic', 'Paid Search', 'Social', 'Email', 'Referral', 'Direct'];
const CHANNEL_WEIGHTS = [0.28, 0.22, 0.18, 0.12, 0.1, 0.1];
const REGIONS = ['North America', 'Europe', 'Asia', 'South America', 'Africa', 'Oceania'];
const REGION_WEIGHTS = [0.34, 0.28, 0.2, 0.08, 0.06, 0.04];
const DEVICES = ['Desktop', 'Mobile', 'Tablet'];
const DEVICE_WEIGHTS = [0.45, 0.47, 0.08];

const pick = (arr, weights) => {
  const r = Math.random();
  let acc = 0;
  for (let i = 0; i < arr.length; i++) {
    acc += weights[i];
    if (r <= acc) return arr[i];
  }
  return arr[arr.length - 1];
};
const rand = (a, b) => a + Math.random() * (b - a);

function generateSales(days = 180) {
  const sales = [];
  const now = new Date();
  for (let d = days - 1; d >= 0; d--) {
    const date = new Date(now);
    date.setDate(now.getDate() - d);
    date.setHours(0, 0, 0, 0);

    // Trend up over time + weekly seasonality (weekends busier) + noise
    const trend = 1 + (days - d) / days * 0.8;
    const dow = date.getDay();
    const weekend = dow === 0 || dow === 6 ? 1.25 : 1;
    const base = 26 * trend * weekend * rand(0.8, 1.2);
    const orders = Math.max(3, Math.round(base));

    for (let o = 0; o < orders; o++) {
      const category = CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)];
      const product = PRODUCTS[category][Math.floor(Math.random() * PRODUCTS[category].length)];
      const quantity = Math.random() < 0.7 ? 1 : Math.ceil(rand(1, 4));
      const unit = { Electronics: rand(40, 400), Fashion: rand(30, 250), Home: rand(20, 150), Beauty: rand(12, 90), Sports: rand(15, 180), Books: rand(10, 45) }[category];
      const ts = new Date(date);
      ts.setHours(Math.floor(rand(6, 23)), Math.floor(rand(0, 59)));
      sales.push({
        date: ts,
        amount: +(unit * quantity).toFixed(2),
        quantity,
        product,
        category,
        channel: pick(CHANNELS, CHANNEL_WEIGHTS),
        region: pick(REGIONS, REGION_WEIGHTS),
        device: pick(DEVICES, DEVICE_WEIGHTS),
        newCustomer: Math.random() < 0.38,
      });
    }
  }
  return sales;
}

module.exports = { generateSales, CATEGORIES, CHANNELS, REGIONS, DEVICES, PRODUCTS };
