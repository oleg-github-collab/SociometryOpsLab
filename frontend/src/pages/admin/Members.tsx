import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { membersApi } from '../../utils/api';
import type { Member, MemberFormData } from '../../types';

export default function AdminMembers() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['members', { page, search, limit: 20 }],
    queryFn: () => membersApi.getAll({ page, search, limit: 20 }),
  });

  const createMutation = useMutation({
    mutationFn: membersApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      toast.success('Member created successfully');
      setShowAddModal(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to create member');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: membersApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      toast.success('Member deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to delete member');
    },
  });

  const handleDelete = (code: string) => {
    if (confirm('Are you sure you want to deactivate this member?')) {
      deleteMutation.mutate(code);
    }
  };

  return (
    <div className="min-h-screen bg-bg-900">
      {/* Header */}
      <header className="glass border-b border-bg-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-gradient">Members Management</h1>
            <a href="/admin/dashboard" className="btn btn-ghost">
              ← Back
            </a>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Actions Bar */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Search members..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input w-full md:w-96"
          />
          <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
            + Add Member
          </button>
        </div>

        {/* Members Table */}
        {isLoading ? (
          <div className="flex justify-center items-center py-20">
            <div className="spinner"></div>
          </div>
        ) : (
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-bg-800 border-b border-bg-600">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Code</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Position</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-bg-700">
                  {data?.data.map((member) => (
                    <motion.tr
                      key={member.code}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-bg-800 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono">{member.code}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">{member.fullName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{member.email}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">{member.position || '-'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs ${member.isActive ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                          {member.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                        <button className="text-primary-400 hover:text-primary-300">Edit</button>
                        <button onClick={() => handleDelete(member.code)} className="text-red-400 hover:text-red-300">
                          Delete
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {data && data.pagination.totalPages > 1 && (
              <div className="px-6 py-4 border-t border-bg-700 flex justify-between items-center">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="btn btn-secondary disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="text-sm text-gray-400">
                  Page {page} of {data.pagination.totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(data.pagination.totalPages, p + 1))}
                  disabled={page === data.pagination.totalPages}
                  className="btn btn-secondary disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
