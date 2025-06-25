import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import ManagerDashboard from './pages/dashboard/ManagerDashboard';
import EngineerDashboard from './pages/dashboard/EngineerDashboard';
import CreateProjectPage from './pages/projects/CreateProjectPage';
import CreateAssignmentPage from './pages/assignments/CreateAssignmentPage';
import ProjectsPage from './pages/projects/ProjectsPage';
import AssignmentsPage from './pages/assignments/AssignmentsPage';
import TeamPage from './pages/team/TeamPage';
import AnalyticsPage from './pages/analytics/AnalyticsPage';
import EditProjectPage from './pages/projects/EditProjectPage';
import EditAssignmentPage from './pages/assignments/EditAssignmentPage';
import LoadingSpinner from './components/common/LoadingSpinner';

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated, loading, user } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
};

// Role-based Route Component
const RoleRoute: React.FC<{
    children: React.ReactNode;
    allowedRoles: string[];
}> = ({ children, allowedRoles }) => {
    const { user } = useAuth();

    if (!user || !allowedRoles.includes(user.role)) {
        return <Navigate to="/dashboard" replace />;
    }

    return <>{children}</>;
};

// Dashboard Component that routes based on user role
const Dashboard: React.FC = () => {
    const { user } = useAuth();

    if (user?.role === 'manager') {
        return <ManagerDashboard />;
    }

    return <EngineerDashboard />;
};

const ProfilePage: React.FC = () => (
    <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Profile</h2>
        <p className="text-gray-600">Profile management page coming soon...</p>
    </div>
);

const App: React.FC = () => {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    {/* Public routes */}
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/signup" element={<SignupPage />} />

                    {/* Protected routes */}
                    <Route
                        path="/"
                        element={
                            <ProtectedRoute>
                                <Layout />
                            </ProtectedRoute>
                        }
                    >
                        <Route index element={<Navigate to="/dashboard" replace />} />
                        <Route path="dashboard" element={<Dashboard />} />

                        {/* Manager-only routes */}
                        <Route
                            path="team"
                            element={
                                <RoleRoute allowedRoles={['manager']}>
                                    <TeamPage />
                                </RoleRoute>
                            }
                        />
                        <Route
                            path="projects"
                            element={
                                <RoleRoute allowedRoles={['manager']}>
                                    <ProjectsPage />
                                </RoleRoute>
                            }
                        />
                        <Route
                            path="projects/new"
                            element={
                                <RoleRoute allowedRoles={['manager']}>
                                    <CreateProjectPage />
                                </RoleRoute>
                            }
                        />
                        <Route
                            path="projects/:id/edit"
                            element={
                                <RoleRoute allowedRoles={['manager']}>
                                    <EditProjectPage />
                                </RoleRoute>
                            }
                        />
                        <Route
                            path="analytics"
                            element={
                                <RoleRoute allowedRoles={['manager']}>
                                    <AnalyticsPage />
                                </RoleRoute>
                            }
                        />

                        {/* Shared routes */}
                        <Route
                            path="assignments"
                            element={
                                <RoleRoute allowedRoles={['manager', 'engineer']}>
                                    <AssignmentsPage />
                                </RoleRoute>
                            }
                        />
                        <Route
                            path="assignments/new"
                            element={
                                <RoleRoute allowedRoles={['manager']}>
                                    <CreateAssignmentPage />
                                </RoleRoute>
                            }
                        />
                        <Route
                            path="assignments/:id/edit"
                            element={
                                <RoleRoute allowedRoles={['manager']}>
                                    <EditAssignmentPage />
                                </RoleRoute>
                            }
                        />
                        <Route path="profile" element={<ProfilePage />} />
                    </Route>

                    {/* Catch all route */}
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
};

export default App; 