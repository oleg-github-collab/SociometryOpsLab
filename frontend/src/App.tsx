import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './stores/authStore';

// Pages
import Landing from './pages/Landing';
import AdminLogin from './pages/admin/Login';
import AdminDashboard from './pages/admin/Dashboard';
import AdminMembers from './pages/admin/Members';
import AdminAssessments from './pages/admin/Assessments';
import ViewerDashboard from './pages/viewer/Dashboard';
import Dashboard3D from './pages/viewer/Dashboard3D';
import CircularNetwork from './pages/viewer/CircularNetwork';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuthStore();

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Admin Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/members"
            element={
              <ProtectedRoute>
                <AdminMembers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/assessments"
            element={
              <ProtectedRoute>
                <AdminAssessments />
              </ProtectedRoute>
            }
          />

          {/* Viewer Routes */}
          <Route path="/dashboard" element={<ViewerDashboard />} />
          <Route path="/dashboard/3d" element={<Dashboard3D />} />
          <Route path="/dashboard/circular" element={<CircularNetwork />} />

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>

      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1c1c27',
            color: '#fff',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          },
          success: {
            iconTheme: {
              primary: '#10b981',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#f43f5e',
              secondary: '#fff',
            },
          },
        }}
      />
    </QueryClientProvider>
  );
}

export default App;
