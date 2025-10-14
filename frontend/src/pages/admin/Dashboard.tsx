import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { membersApi, assessmentsApi } from '../../utils/api';
import { useAuthStore } from '../../stores/authStore';

export default function AdminDashboard() {
  const { user, logout } = useAuthStore();

  const { data: membersData } = useQuery({
    queryKey: ['members', { limit: 1 }],
    queryFn: () => membersApi.getAll({ limit: 1 }),
  });

  const { data: assessmentsData } = useQuery({
    queryKey: ['assessments', { limit: 1 }],
    queryFn: () => assessmentsApi.getAll({ limit: 1 }),
  });

  const stats = [
    {
      label: 'Total Members',
      value: membersData?.pagination.total || 0,
      icon: '👥',
      color: 'primary',
      link: '/admin/members',
    },
    {
      label: 'Assessments',
      value: assessmentsData?.pagination.total || 0,
      icon: '📊',
      color: 'cyan',
      link: '/admin/assessments',
    },
    {
      label: 'Active Members',
      value: membersData?.data.filter((m) => m.isActive).length || 0,
      icon: '✅',
      color: 'emerald',
      link: '/admin/members',
    },
  ];

  return (
    <div className="min-h-screen bg-bg-900">
      {/* Header */}
      <header className="glass border-b border-bg-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-bold text-gradient">OpsLab Admin</h1>
              <span className="text-sm text-gray-400">Welcome, {user?.username}</span>
            </div>
            <button onClick={logout} className="btn btn-ghost">
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h2 className="text-3xl font-bold mb-8">Dashboard</h2>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Link to={stat.link}>
                  <div className="card hover:shadow-glow transition-all cursor-pointer">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-gray-400 text-sm mb-1">{stat.label}</p>
                        <p className="text-4xl font-bold">{stat.value}</p>
                      </div>
                      <div className="text-5xl">{stat.icon}</div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Link to="/admin/members" className="btn btn-primary">
                Manage Members
              </Link>
              <Link to="/admin/assessments" className="btn btn-secondary">
                Add Assessment
              </Link>
              <Link to="/dashboard" className="btn btn-ghost">
                View Analytics
              </Link>
              <Link to="/dashboard/3d" className="btn btn-ghost">
                3D Visualization
              </Link>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
