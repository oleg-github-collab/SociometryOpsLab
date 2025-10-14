import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { authApi } from '../utils/api';

export default function Landing() {
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await authApi.viewerAuth(password);
      if (response.access) {
        sessionStorage.setItem('viewer_token', response.token);
        toast.success('Access granted!');
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error('Invalid password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-bg-900 via-bg-800 to-primary-900/20 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="text-4xl md:text-5xl font-bold mb-4 text-gradient"
          >
            OpsLab Analytics
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="text-gray-400 text-lg"
          >
            Team Dynamics & Sociometry Platform
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="card"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-2">
                Enter Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="input"
                required
              />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary w-full">
              {loading ? (
                <span className="flex items-center justify-center">
                  <span className="spinner mr-2"></span>
                  Authenticating...
                </span>
              ) : (
                'Access Dashboard'
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-bg-600">
            <a href="/admin/login" className="text-sm text-gray-400 hover:text-primary-400 transition-colors block text-center">
              Admin Login →
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="mt-8 text-center"
        >
          <div className="flex items-center justify-center space-x-6 text-sm text-gray-500">
            <span>🔒 Secure</span>
            <span>📊 Real-time</span>
            <span>📱 Mobile-first</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
