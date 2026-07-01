import { ArrowDownRight, ArrowUpRight } from 'lucide-react';

export default function KpiCard({ label, value, delta, prefix = '', icon: Icon, accent = 'sky' }) {
  const up = delta >= 0;
  const accentMap = { sky: 'text-sky', mint: 'text-mint', amber: 'text-amber', violet: 'text-violet' };
  return (
    <div className="card">
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-400">{label}</span>
        {Icon && <Icon size={18} className={accentMap[accent]} />}
      </div>
      <p className="mt-3 text-3xl font-bold text-white">
        {prefix}
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
      <div className={`mt-2 flex items-center gap-1 text-xs font-medium ${up ? 'text-mint' : 'text-rose'}`}>
        {up ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        {Math.abs(delta)}% <span className="text-slate-500">vs prev. period</span>
      </div>
    </div>
  );
}
