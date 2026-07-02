import { useState } from 'react';
import { Activity } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { login } = useAuth();
  const [form, setForm] = useState({ email: 'admin@pulse.io', password: 'admin123' });
  const [busy, setBusy] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      await login(form.email, form.password);
      toast.success('Welcome back');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="grid min-h-screen place-items-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center gap-3">
          <img src="/favicon.png" alt="" className="h-11 w-11 rounded-xl bg-white p-1" />
          <div>
            <h1 className="text-2xl font-bold text-white">Pulse</h1>
            <p className="text-xs text-slate-400">Analytics Dashboard</p>
          </div>
        </div>

        <div className="card">
          <h2 className="text-lg font-semibold text-white">Sign in</h2>
          <form onSubmit={submit} className="mt-5 space-y-4">
            <input className="input" type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
            <input className="input" type="password" placeholder="Password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
            <button disabled={busy} className="btn-primary w-full">{busy ? 'Signing in…' : 'Sign in'}</button>
          </form>
          <p className="mt-4 text-xs text-slate-400">Demo: admin@pulse.io / admin123 (prefilled)</p>
        </div>
      </div>
    </div>
  );
}
