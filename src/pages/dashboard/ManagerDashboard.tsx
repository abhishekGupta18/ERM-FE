import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Users,
    FolderOpen,
    Calendar,
    TrendingUp,
    AlertTriangle,
    Plus,
    Eye
} from 'lucide-react';
import { apiService } from '../../services/api';
import { User, Project, Assignment, CapacityUtilization } from '../../types';
import { calculateCapacityUtilization, formatDate } from '../../utils/helpers';
import CapacityBar from '../../components/common/CapacityBar';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ManagerDashboard: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [engineers, setEngineers] = useState<User[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [capacityUtilization, setCapacityUtilization] = useState<CapacityUtilization[]>([]);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                setLoading(true);
                const [engineersRes, projectsRes, assignmentsRes] = await Promise.all([
                    apiService.getAllEngineers(),
                    apiService.getAllProjects(),
                    apiService.getAllAssignments(),
                ]);

                if (engineersRes.success) setEngineers(engineersRes.data || []);
                if (projectsRes.success) setProjects(projectsRes.data || []);
                if (assignmentsRes.success) setAssignments(assignmentsRes.data || []);

                // Calculate capacity utilization
                const utilization = calculateCapacityUtilization(assignmentsRes.data || []);
                setCapacityUtilization(utilization);
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    const getQuickStats = () => {
        const activeProjects = projects.filter(p => p.status === 'Active').length;
        const planningProjects = projects.filter(p => p.status === 'Planning').length;
        const overallocatedEngineers = capacityUtilization.filter(c => c.utilizationPercentage > 100).length;
        const totalAssignments = assignments.length;

        return {
            totalEngineers: engineers.length,
            activeProjects,
            planningProjects,
            overallocatedEngineers,
            totalAssignments,
        };
    };

    const stats = getQuickStats();

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Manager Dashboard</h1>
                    <p className="text-gray-600">Overview of your team and projects</p>
                </div>
                <div className="flex space-x-3">
                    <Link
                        to="/projects/new"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        New Project
                    </Link>
                    <Link
                        to="/assignments/new"
                        className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                    >
                        <Plus className="h-4 w-4 mr-2" />
                        New Assignment
                    </Link>
                </div>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <Users className="h-6 w-6 text-gray-400" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Total Engineers</dt>
                                    <dd className="text-lg font-medium text-gray-900">{stats.totalEngineers}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <FolderOpen className="h-6 w-6 text-gray-400" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Active Projects</dt>
                                    <dd className="text-lg font-medium text-gray-900">{stats.activeProjects}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <Calendar className="h-6 w-6 text-gray-400" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Total Assignments</dt>
                                    <dd className="text-lg font-medium text-gray-900">{stats.totalAssignments}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <TrendingUp className="h-6 w-6 text-gray-400" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Planning Projects</dt>
                                    <dd className="text-lg font-medium text-gray-900">{stats.planningProjects}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <AlertTriangle className="h-6 w-6 text-red-400" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Overallocated</dt>
                                    <dd className="text-lg font-medium text-red-600">{stats.overallocatedEngineers}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Team Capacity Overview */}
            <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Team Capacity Overview</h3>
                    <p className="text-sm text-gray-600">Current utilization of your engineering team</p>
                </div>
                <div className="p-6">
                    {capacityUtilization.length === 0 ? (
                        <div className="text-center py-8">
                            <Users className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No engineers found</h3>
                            <p className="mt-1 text-sm text-gray-500">Get started by adding engineers to your team.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {capacityUtilization.map((engineer) => (
                                <div key={engineer.engineerId} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                            <span className="text-indigo-600 font-medium text-sm">
                                                {engineer.engineerName.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-900">{engineer.engineerName}</h4>
                                            <p className="text-xs text-gray-500">
                                                {engineer.assignments.length} active assignments
                                            </p>
                                        </div>
                                    </div>
                                    <div className="w-48">
                                        <CapacityBar
                                            current={engineer.currentAllocation}
                                            max={engineer.maxCapacity}
                                            size="sm"
                                        />
                                    </div>
                                    <Link
                                        to={`/engineers/${engineer.engineerId}`}
                                        className="text-indigo-600 hover:text-indigo-900"
                                    >
                                        <Eye className="h-5 w-5" />
                                    </Link>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Recent Projects */}
            <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-medium text-gray-900">Recent Projects</h3>
                            <p className="text-sm text-gray-600">Latest project updates and status</p>
                        </div>
                        <Link
                            to="/projects"
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                        >
                            View all
                        </Link>
                    </div>
                </div>
                <div className="p-6">
                    {projects.length === 0 ? (
                        <div className="text-center py-8">
                            <FolderOpen className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No projects found</h3>
                            <p className="mt-1 text-sm text-gray-500">Get started by creating your first project.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {projects.slice(0, 5).map((project) => (
                                <div key={project._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <FolderOpen className="h-5 w-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-900">{project.name}</h4>
                                            <p className="text-xs text-gray-500">
                                                {formatDate(project.startDate)} - {formatDate(project.endDate)}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <StatusBadge status={project.status} size="sm" />
                                        <Link
                                            to={`/projects/${project._id}`}
                                            className="text-indigo-600 hover:text-indigo-900"
                                        >
                                            <Eye className="h-5 w-5" />
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ManagerDashboard; 