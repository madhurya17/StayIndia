import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Mail, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function AdminLogin() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role !== 'admin') {
        toast.error('Not an admin account. Use the regular login page.');
        return;
      }
      toast.success('Welcome, Admin!');
      navigate('/admin');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Admin login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary-900 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-accent-400 text-primary-900 flex items-center justify-center mx-auto mb-4">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-white">Admin Portal</h1>
          <p className="text-primary-300 mt-1">StayIndia Administration</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-primary-800 rounded-2xl p-8 shadow-xl border border-primary-700">
          <div className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-primary-200 mb-1.5">Admin Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@stayindia.com"
                  className="w-full pl-10 pr-4 py-3 bg-primary-700 border border-primary-600 rounded-xl text-white text-sm placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-accent-400 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-primary-200 mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-primary-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full pl-10 pr-4 py-3 bg-primary-700 border border-primary-600 rounded-xl text-white text-sm placeholder-primary-400 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-accent-400 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-accent-400 text-primary-900 rounded-xl font-semibold hover:bg-accent-300 transition-all duration-200 disabled:opacity-60"
            >
              {loading ? 'Signing in...' : 'Admin Sign In'}
            </button>
          </div>
        </form>

        <div className="mt-6 p-4 bg-primary-800/50 rounded-xl border border-primary-700">
          <p className="text-xs text-primary-300 font-medium mb-1">Admin Credentials:</p>
          <p className="text-xs text-primary-400">admin@stayindia.com / admin123</p>
        </div>
      </div>
    </div>
  );
}
