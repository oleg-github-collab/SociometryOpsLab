import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { assessmentsApi } from '../../utils/api';
import { format } from 'date-fns';

export default function AdminAssessments() {
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['assessments', { page, limit: 20 }],
    queryFn: () => assessmentsApi.getAll({ page, limit: 20 }),
  });

  return (
    <div className="min-h-screen bg-bg-900">
      {/* Header */}
      <header className="glass border-b border-bg-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gradient">Assessments</h1>
            <a href="/admin/dashboard" className="btn btn-ghost">
              ← Back
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Assessment History</h2>
          <button className="btn btn-primary">+ Add Assessment</button>
        </div>

        {/* Assessments List */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="spinner"></div>
          </div>
        ) : (
          <div className="space-y-4">
            {data?.data.map((assessment) => (
              <motion.div
                key={assessment.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card hover:shadow-glow transition-all cursor-pointer"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Assessment #{assessment.id}</h3>
                    <div className="space-y-1 text-sm text-gray-400">
                      <p>Respondent: {assessment.respondentCode}</p>
                      <p>Date: {format(new Date(assessment.timestamp), 'PPP')}</p>
                      {assessment.fillTimeMinutes && <p>Duration: {assessment.fillTimeMinutes} minutes</p>}
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button className="btn btn-ghost btn-sm">View</button>
                    <button className="btn btn-ghost btn-sm text-red-400">Delete</button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
