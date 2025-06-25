import React, { useEffect, useState } from 'react';
import { apiService } from '../../services/api';
import { Project, Assignment, User } from '../../types';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { Users, FolderOpen, AlertTriangle, TrendingUp } from 'lucide-react';

const AnalyticsPage: React.FC = () => {
    const [loading, setLoading] = useState(true);
    const [projects, setProjects] = useState<Project[]>([]);
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [engineers, setEngineers] = useState<User[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [projectsRes, assignmentsRes, engineersRes] = await Promise.all([
                    apiService.getAllProjects(),
                    apiService.getAllAssignments(),
                    apiService.getAllEngineers(),
                ]);
                if (projectsRes.success) setProjects(projectsRes.data || []);
                if (assignmentsRes.success) setAssignments(assignmentsRes.data || []);
                if (engineersRes.success) setEngineers(engineersRes.data || []);
            } catch (err: any) {
                alert(err.message || 'Failed to fetch analytics data');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    // Calculate team utilization and overallocated engineers
    const engineerUtilization = engineers.map(engineer => {
        const engineerAssignments = assignments.filter(a => a.engineerId?._id === engineer._id);
        const totalAllocation = engineerAssignments.reduce((sum, a) => sum + (a.allocationPercentage || 0), 0);
        return {
            ...engineer,
            totalAllocation,
            overallocated: engineer.maxCapacity ? totalAllocation > engineer.maxCapacity : totalAllocation > 100,
        };
    });
    const overallocatedCount = engineerUtilization.filter(e => e.overallocated).length;
    const avgUtilization =
        engineerUtilization.length > 0
            ? Math.round(
                engineerUtilization.reduce((sum, e) => sum + (e.totalAllocation / (e.maxCapacity || 100)), 0) /
                engineerUtilization.length * 100
            )
            : 0;

    return loading ? (
        <div className="flex items-center justify-center h-64"><LoadingSpinner size="lg" /></div>
    ) : (
        <div className="max-w-5xl mx-auto p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Analytics Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5 flex items-center">
                        <FolderOpen className="h-8 w-8 text-blue-500 mr-4" />
                        <div>
                            <div className="text-sm text-gray-500">Total Projects</div>
                            <div className="text-2xl font-bold text-gray-900">{projects.length}</div>
                        </div>
                    </div>
                </div>
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5 flex items-center">
                        <Users className="h-8 w-8 text-indigo-500 mr-4" />
                        <div>
                            <div className="text-sm text-gray-500">Total Engineers</div>
                            <div className="text-2xl font-bold text-gray-900">{engineers.length}</div>
                        </div>
                    </div>
                </div>
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5 flex items-center">
                        <TrendingUp className="h-8 w-8 text-green-500 mr-4" />
                        <div>
                            <div className="text-sm text-gray-500">Avg. Team Utilization</div>
                            <div className="text-2xl font-bold text-gray-900">{avgUtilization}%</div>
                        </div>
                    </div>
                </div>
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5 flex items-center">
                        <AlertTriangle className="h-8 w-8 text-red-500 mr-4" />
                        <div>
                            <div className="text-sm text-gray-500">Overallocated Engineers</div>
                            <div className="text-2xl font-bold text-red-600">{overallocatedCount}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">Engineer Utilization</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border rounded-lg">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 border-b">Engineer</th>
                                <th className="px-4 py-2 border-b">Max Capacity</th>
                                <th className="px-4 py-2 border-b">Current Allocation</th>
                                <th className="px-4 py-2 border-b">Utilization (%)</th>
                                <th className="px-4 py-2 border-b">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {engineerUtilization.map(e => (
                                <tr key={e._id} className="hover:bg-gray-50">
                                    <td className="px-4 py-2 border-b font-medium">{e.name}</td>
                                    <td className="px-4 py-2 border-b">{e.maxCapacity || 100}</td>
                                    <td className="px-4 py-2 border-b">{e.totalAllocation}</td>
                                    <td className="px-4 py-2 border-b">{Math.round((e.totalAllocation / (e.maxCapacity || 100)) * 100)}%</td>
                                    <td className="px-4 py-2 border-b">
                                        {e.overallocated ? (
                                            <span className="px-2 py-1 bg-red-100 text-red-700 rounded text-xs">Overallocated</span>
                                        ) : (
                                            <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs">OK</span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsPage; 