import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
    Calendar,
    Clock,
    TrendingUp,
    AlertCircle,
    CheckCircle,
    Eye
} from 'lucide-react';
import { apiService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { Assignment, Project } from '../../types';
import { formatDate, formatDateRange } from '../../utils/helpers';
import CapacityBar from '../../components/common/CapacityBar';
import StatusBadge from '../../components/common/StatusBadge';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const EngineerDashboard: React.FC = () => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(true);
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [currentCapacity, setCurrentCapacity] = useState(0);
    const [maxCapacity, setMaxCapacity] = useState(100);

    useEffect(() => {
        const fetchEngineerData = async () => {
            if (!user) return;

            try {
                setLoading(true);
                const [assignmentsRes, capacityRes] = await Promise.all([
                    apiService.getAllAssignments(),
                    apiService.getEngineerCapacity(user._id),
                ]);

                if (assignmentsRes.success) {
                    const myAssignments = assignmentsRes.data?.filter(
                        (assignment: Assignment) => assignment.engineerId._id === user._id
                    ) || [];
                    setAssignments(myAssignments);

                    // Calculate current capacity
                    const totalAllocation = myAssignments.reduce(
                        (sum, assignment) => sum + assignment.allocationPercentage,
                        0
                    );
                    setCurrentCapacity(totalAllocation);
                }

                if (capacityRes.success) {
                    setMaxCapacity(capacityRes.data?.maxCapacity || 100);
                }
            } catch (error) {
                console.error('Error fetching engineer data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEngineerData();
    }, [user]);

    const getUpcomingAssignments = () => {
        const now = new Date();
        return assignments
            .filter(assignment => new Date(assignment.startDate) > now)
            .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())
            .slice(0, 3);
    };

    const getCurrentAssignments = () => {
        const now = new Date();
        return assignments.filter(assignment => {
            const startDate = new Date(assignment.startDate);
            const endDate = new Date(assignment.endDate);
            return startDate <= now && endDate >= now;
        });
    };

    const getQuickStats = () => {
        const currentAssignments = getCurrentAssignments();
        const upcomingAssignments = getUpcomingAssignments();
        const completedAssignments = assignments.filter(
            assignment => new Date(assignment.endDate) < new Date()
        );

        return {
            currentAssignments: currentAssignments.length,
            upcomingAssignments: upcomingAssignments.length,
            completedAssignments: completedAssignments.length,
            utilizationPercentage: maxCapacity > 0 ? (currentCapacity / maxCapacity) * 100 : 0,
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
                    <h1 className="text-2xl font-bold text-gray-900">My Dashboard</h1>
                    <p className="text-gray-600">Welcome back, {user?.name}</p>
                </div>
                <Link
                    to="/profile"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                >
                    <Eye className="h-4 w-4 mr-2" />
                    View Profile
                </Link>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <Calendar className="h-6 w-6 text-blue-400" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Current Assignments</dt>
                                    <dd className="text-lg font-medium text-gray-900">{stats.currentAssignments}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <Clock className="h-6 w-6 text-green-400" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Upcoming</dt>
                                    <dd className="text-lg font-medium text-gray-900">{stats.upcomingAssignments}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <CheckCircle className="h-6 w-6 text-gray-400" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Completed</dt>
                                    <dd className="text-lg font-medium text-gray-900">{stats.completedAssignments}</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <TrendingUp className="h-6 w-6 text-indigo-400" />
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="text-sm font-medium text-gray-500 truncate">Utilization</dt>
                                    <dd className="text-lg font-medium text-gray-900">{stats.utilizationPercentage.toFixed(1)}%</dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Capacity Overview */}
            <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">My Capacity</h3>
                    <p className="text-sm text-gray-600">Current workload and availability</p>
                </div>
                <div className="p-6">
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="text-sm font-medium text-gray-900">Current Allocation</h4>
                                <p className="text-xs text-gray-500">Your current project assignments</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-900">{currentCapacity}%</p>
                                <p className="text-xs text-gray-500">of {maxCapacity}% capacity</p>
                            </div>
                        </div>
                        <CapacityBar
                            current={currentCapacity}
                            max={maxCapacity}
                            size="lg"
                        />
                        {currentCapacity > maxCapacity && (
                            <div className="flex items-center p-3 bg-red-50 border border-red-200 rounded-md">
                                <AlertCircle className="h-5 w-5 text-red-400 mr-2" />
                                <p className="text-sm text-red-800">
                                    You are overallocated by {(currentCapacity - maxCapacity).toFixed(1)}%
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Current Assignments */}
            <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-medium text-gray-900">Current Assignments</h3>
                            <p className="text-sm text-gray-600">Projects you're currently working on</p>
                        </div>
                        <Link
                            to="/assignments"
                            className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                        >
                            View all
                        </Link>
                    </div>
                </div>
                <div className="p-6">
                    {getCurrentAssignments().length === 0 ? (
                        <div className="text-center py-8">
                            <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No current assignments</h3>
                            <p className="mt-1 text-sm text-gray-500">You're not currently assigned to any projects.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {getCurrentAssignments().map((assignment) => (
                                <div key={assignment._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                            <span className="text-blue-600 font-medium text-sm">
                                                {assignment.projectId.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-900">{assignment.projectId.name}</h4>
                                            <p className="text-xs text-gray-500">
                                                {formatDateRange(assignment.startDate, assignment.endDate)} • {assignment.allocationPercentage}% allocation
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <StatusBadge status={assignment.projectId.status} size="sm" />
                                        <Link
                                            to={`/assignments/${assignment._id}`}
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

            {/* Upcoming Assignments */}
            <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-medium text-gray-900">Upcoming Assignments</h3>
                    <p className="text-sm text-gray-600">Future projects and assignments</p>
                </div>
                <div className="p-6">
                    {getUpcomingAssignments().length === 0 ? (
                        <div className="text-center py-8">
                            <Clock className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No upcoming assignments</h3>
                            <p className="mt-1 text-sm text-gray-500">You don't have any future assignments scheduled.</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {getUpcomingAssignments().map((assignment) => (
                                <div key={assignment._id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                            <span className="text-green-600 font-medium text-sm">
                                                {assignment.projectId.name.charAt(0).toUpperCase()}
                                            </span>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-900">{assignment.projectId.name}</h4>
                                            <p className="text-xs text-gray-500">
                                                Starts {formatDate(assignment.startDate)} • {assignment.allocationPercentage}% allocation
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3">
                                        <StatusBadge status={assignment.projectId.status} size="sm" />
                                        <Link
                                            to={`/assignments/${assignment._id}`}
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

export default EngineerDashboard; 