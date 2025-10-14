import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { membersApi, assessmentsApi } from '../../utils/api';

export default function ViewerDashboard() {
  const { data: membersData } = useQuery({
    queryKey: ['members'],
    queryFn: () => membersApi.getAll({ active: true }),
  });

  const { data: assessmentsData } = useQuery({
    queryKey: ['assessments'],
    queryFn: () => assessmentsApi.getAll({ limit: 10 }),
  });

  const visualizations = [
    {
      title: '3D Team Space',
      description: 'Interactive 3D visualization of team relationships',
      icon: '🌐',
      link: '/dashboard/3d',
      gradient: 'from-primary-600 to-primary-800',
    },
    {
      title: 'Circular Network',
      description: 'Network diagram showing team connections',
      icon: '🔵',
      link: '/dashboard/circular',
      gradient: 'from-accent-cyan to-primary-600',
    },
    {
      title: 'Heatmap Analysis',
      description: 'Competency matrix heatmap',
      icon: '🔥',
      link: '/dashboard/heatmap',
      gradient: 'from-accent-rose to-accent-amber',
    },
    {
      title: 'Force Graph',
      description: 'Physics-based network visualization',
      icon: '⚡',
      link: '/dashboard/force',
      gradient: 'from-accent-emerald to-accent-cyan',
    },
    {
      title: 'Scatter Analysis',
      description: 'Competency scatter plots and correlations',
      icon: '📊',
      link: '/dashboard/scatter',
      gradient: 'from-accent-violet to-primary-600',
    },
    {
      title: 'Radar Charts',
      description: 'Member competency comparisons',
      icon: '🎯',
      link: '/dashboard/radar',
      gradient: 'from-accent-amber to-accent-rose',
    },
  ];

  return (
    <div className="min-h-screen bg-bg-900">
      {/* Header */}
      <header className="glass border-b border-bg-600 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gradient">OpsLab Analytics</h1>
              <p className="text-sm text-gray-400 mt-1">Team Dynamics Dashboard</p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-400">
                <span className="font-semibold text-white">{membersData?.pagination.total || 0}</span> Members
              </div>
              <a href="/" className="btn btn-ghost btn-sm">
                Exit
              </a>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12"
        >
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Total Members</p>
                <p className="text-4xl font-bold">{membersData?.pagination.total || 0}</p>
              </div>
              <div className="text-5xl">👥</div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Assessments</p>
                <p className="text-4xl font-bold">{assessmentsData?.pagination.total || 0}</p>
              </div>
              <div className="text-5xl">📊</div>
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 text-sm mb-1">Active Members</p>
                <p className="text-4xl font-bold">{membersData?.data.filter((m) => m.isActive).length || 0}</p>
              </div>
              <div className="text-5xl">✅</div>
            </div>
          </div>
        </motion.div>

        {/* Visualizations Grid */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Visualizations</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {visualizations.map((viz, index) => (
              <motion.div
                key={viz.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Link to={viz.link}>
                  <div className="card hover:shadow-glow transition-all cursor-pointer h-full">
                    <div className={`w-16 h-16 bg-gradient-to-br ${viz.gradient} rounded-xl flex items-center justify-center mb-4 shadow-lg`}>
                      <span className="text-3xl">{viz.icon}</span>
                    </div>
                    <h3 className="text-xl font-bold mb-2">{viz.title}</h3>
                    <p className="text-gray-400 text-sm">{viz.description}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Recent Members */}
        <div className="card">
          <h3 className="text-2xl font-bold mb-6">Team Members</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {membersData?.data.slice(0, 6).map((member) => (
              <motion.div
                key={member.code}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass p-4 rounded-lg hover:shadow-glow transition-all"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
                    <span className="text-xl font-bold">{member.fullName.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold truncate">{member.fullName}</p>
                    <p className="text-sm text-gray-400 truncate">{member.position || 'Team Member'}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
