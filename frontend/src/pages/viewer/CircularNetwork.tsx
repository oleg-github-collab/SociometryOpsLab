import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { membersApi } from '../../utils/api';

export default function CircularNetwork() {
  const { data: membersData } = useQuery({
    queryKey: ['members'],
    queryFn: () => membersApi.getAll({ active: true }),
  });

  // Mock circular layout calculation
  const members = membersData?.data || [];
  const radius = 200;
  const centerX = 300;
  const centerY = 300;

  const positions = members.map((_, index) => {
    const angle = (index / members.length) * 2 * Math.PI;
    return {
      x: centerX + radius * Math.cos(angle),
      y: centerY + radius * Math.sin(angle),
    };
  });

  return (
    <div className="min-h-screen bg-bg-900">
      {/* Header */}
      <header className="glass border-b border-bg-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gradient">Circular Network</h1>
              <p className="text-sm text-gray-400 mt-1">Team connections visualization</p>
            </div>
            <a href="/dashboard" className="btn btn-ghost">
              ← Back
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex items-center justify-center py-12">
        <div className="relative">
          <svg width="600" height="600" className="overflow-visible">
            {/* Connections (simplified) */}
            {positions.map((pos, i) =>
              positions.slice(i + 1).map((targetPos, j) => (
                <motion.line
                  key={`${i}-${j}`}
                  x1={pos.x}
                  y1={pos.y}
                  x2={targetPos.x}
                  y2={targetPos.y}
                  stroke="rgba(99, 102, 241, 0.2)"
                  strokeWidth="1"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1, delay: i * 0.1 }}
                />
              ))
            )}

            {/* Nodes */}
            {positions.map((pos, i) => (
              <g key={i}>
                <motion.circle
                  cx={pos.x}
                  cy={pos.y}
                  r="20"
                  fill="#6366f1"
                  stroke="#fff"
                  strokeWidth="2"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 0.5 + i * 0.1, type: 'spring', stiffness: 200 }}
                  className="cursor-pointer hover:fill-primary-400 transition-all"
                />
                <motion.text
                  x={pos.x}
                  y={pos.y + 35}
                  textAnchor="middle"
                  fill="#fff"
                  fontSize="12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1 + i * 0.1 }}
                >
                  {members[i]?.fullName.split(' ')[0] || `M${i + 1}`}
                </motion.text>
              </g>
            ))}
          </svg>
        </div>
      </main>
    </div>
  );
}
