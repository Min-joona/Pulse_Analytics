import { useEffect, useState, useCallback } from 'react';
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';
import { Activity, DollarSign, ShoppingCart, Receipt, UserPlus, LogOut, RefreshCw } from 'lucide-react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import KpiCard from '../components/KpiCard';

const RANGES = [
  { label: '7D', days: 7 },
  { label: '30D', days: 30 },
  { label: '90D', days: 90 },
];
const COLORS = ['#38bdf8', '#34d399', '#fbbf24', '#a78bfa', '#fb7185', '#60a5fa'];

const money = (n) => '$' + Number(n).toLocaleString(undefined, { maximumFractionDigits: 0 });

function Panel({ title, action, children, className = '' }) {
  return (
    <div className={`card ${className}`}>
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-semibold text-white">{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
}

const tooltipStyle = {
  contentStyle: { background: '#16223c', border: '1px solid #22304f', borderRadius: 12, color: '#e2e8f0' },
  labelStyle: { color: '#94a3b8' },
};

export default function Dashboard() {
  const { user, logout } = useAuth();
  const [days, setDays] = useState(30);
  const [breakdownBy, setBreakdownBy] = useState('channel');
  const [data, setData] = useState(null);
  const [live, setLive] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    const [overview, revenue, breakdown, category, topProducts] = await Promise.all([
      api.get(`/api/stats/overview?days=${days}`),
      api.get(`/api/stats/revenue?days=${days}`),
      api.get(`/api/stats/breakdown?days=${days}&by=${breakdownBy}`),
      api.get(`/api/stats/breakdown?days=${days}&by=category`),
      api.get(`/api/stats/top-products?days=${days}`),
    ]);
    setData({
      overview: overview.data,
      revenue: revenue.data.map((d) => ({ ...d, label: d.date.slice(5) })),
      breakdown: breakdown.data,
      category: category.data,
      topProducts: topProducts.data,
    });
    setLoading(false);
  }, [days, breakdownBy]);

  useEffect(() => { setLoading(true); load(); }, [load]);

  // Live feed — poll every 5s
  useEffect(() => {
    let active = true;
    const tick = () => api.get('/api/stats/live?limit=10').then(({ data }) => active && setLive(data));
    tick();
    const id = setInterval(tick, 5000);
    return () => { active = false; clearInterval(id); };
  }, []);

  return (
    <div className="min-h-screen">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-line bg-base/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-sky text-base"><Activity size={18} /></div>
            <div>
              <h1 className="font-bold text-white leading-tight">Pulse</h1>
              <p className="text-[11px] text-slate-500">Store performance overview</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden rounded-lg border border-line p-1 sm:flex">
              {RANGES.map((r) => (
                <button
                  key={r.days}
                  onClick={() => setDays(r.days)}
                  className={`rounded-md px-3 py-1 text-xs font-medium transition ${days === r.days ? 'bg-sky text-base' : 'text-slate-400 hover:text-white'}`}
                >
                  {r.label}
                </button>
              ))}
            </div>
            <button onClick={() => load()} className="grid h-9 w-9 place-items-center rounded-lg border border-line text-slate-400 hover:text-white" aria-label="Refresh">
              <RefreshCw size={16} />
            </button>
            <span className="hidden text-sm text-slate-400 md:inline">{user?.name}</span>
            <button onClick={logout} className="grid h-9 w-9 place-items-center rounded-lg border border-line text-slate-400 hover:text-white" aria-label="Log out">
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-6">
        {loading || !data ? (
          <div className="grid place-items-center py-32">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-line border-t-sky" />
          </div>
        ) : (
          <div className="space-y-6">
            {/* KPIs */}
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <KpiCard label="Revenue" prefix="$" value={data.overview.revenue.value} delta={data.overview.revenue.delta} icon={DollarSign} accent="sky" />
              <KpiCard label="Orders" value={data.overview.orders.value} delta={data.overview.orders.delta} icon={ShoppingCart} accent="mint" />
              <KpiCard label="Avg order value" prefix="$" value={data.overview.aov.value} delta={data.overview.aov.delta} icon={Receipt} accent="amber" />
              <KpiCard label="New customers" value={data.overview.newCustomers.value} delta={data.overview.newCustomers.delta} icon={UserPlus} accent="violet" />
            </div>

            {/* Revenue trend */}
            <Panel title={`Revenue — last ${days} days`}>
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={data.revenue} margin={{ left: -10, right: 8 }}>
                  <defs>
                    <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.4} />
                      <stop offset="100%" stopColor="#38bdf8" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#22304f" vertical={false} />
                  <XAxis dataKey="label" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} minTickGap={24} />
                  <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} tickFormatter={money} />
                  <Tooltip {...tooltipStyle} formatter={(v) => money(v)} />
                  <Area type="monotone" dataKey="revenue" stroke="#38bdf8" strokeWidth={2} fill="url(#rev)" />
                </AreaChart>
              </ResponsiveContainer>
            </Panel>

            <div className="grid gap-6 lg:grid-cols-3">
              {/* Breakdown bar */}
              <Panel
                title="Revenue by"
                className="lg:col-span-2"
                action={
                  <select value={breakdownBy} onChange={(e) => setBreakdownBy(e.target.value)} className="rounded-md border border-line bg-panel2 px-2 py-1 text-xs text-slate-300">
                    <option value="channel">Channel</option>
                    <option value="region">Region</option>
                    <option value="device">Device</option>
                    <option value="category">Category</option>
                  </select>
                }
              >
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={data.breakdown} margin={{ left: -10, right: 8 }}>
                    <CartesianGrid stroke="#22304f" vertical={false} />
                    <XAxis dataKey="label" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                    <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} tickFormatter={money} />
                    <Tooltip {...tooltipStyle} cursor={{ fill: '#ffffff08' }} formatter={(v) => money(v)} />
                    <Bar dataKey="revenue" radius={[6, 6, 0, 0]}>
                      {data.breakdown.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Panel>

              {/* Category donut */}
              <Panel title="Sales by category">
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie data={data.category} dataKey="revenue" nameKey="label" innerRadius={55} outerRadius={90} paddingAngle={3}>
                      {data.category.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                    </Pie>
                    <Tooltip {...tooltipStyle} formatter={(v) => money(v)} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              </Panel>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {/* Top products */}
              <Panel title="Top products" className="lg:col-span-2">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="text-left text-slate-500">
                      <tr>
                        <th className="pb-2 font-medium">Product</th>
                        <th className="pb-2 font-medium">Category</th>
                        <th className="pb-2 text-right font-medium">Units</th>
                        <th className="pb-2 text-right font-medium">Revenue</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.topProducts.map((p) => (
                        <tr key={p.product} className="border-t border-line/60">
                          <td className="py-2.5 text-white">{p.product}</td>
                          <td className="py-2.5 text-slate-400">{p.category}</td>
                          <td className="py-2.5 text-right text-slate-300">{p.units}</td>
                          <td className="py-2.5 text-right font-medium text-mint">{money(p.revenue)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Panel>

              {/* Live feed */}
              <Panel
                title="Live activity"
                action={<span className="flex items-center gap-1.5 text-[11px] text-mint"><span className="h-2 w-2 animate-pulse rounded-full bg-mint" />live</span>}
              >
                <ul className="no-scrollbar max-h-[260px] space-y-3 overflow-y-auto">
                  {live.map((s) => (
                    <li key={s._id} className="flex items-center justify-between gap-2 text-sm">
                      <div className="min-w-0">
                        <p className="truncate text-slate-200">{s.product}</p>
                        <p className="text-[11px] text-slate-500">{s.region} · {s.channel}</p>
                      </div>
                      <span className="shrink-0 font-medium text-mint">{money(s.amount)}</span>
                    </li>
                  ))}
                  {live.length === 0 && <li className="text-sm text-slate-500">Waiting for events…</li>}
                </ul>
              </Panel>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
