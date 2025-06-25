import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import { Assignment, Project } from '../../types';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useSearch } from '../../context/SearchContext';
import { FolderOpen, TrendingUp } from 'lucide-react';

const EngineerDashboard: React.FC = () => {
    const { user } = useAuth();
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [loading, setLoading] = useState(true);
    const { search } = useSearch();

    useEffect(() => {
        const fetchAssignments = async () => {
            setLoading(true);
            try {
                const res = await apiService.getAllAssignments();
                if (res.success) {
                    setAssignments(res.data || []);
                }
            } catch (err) {
                // handle error
            } finally {
                setLoading(false);
            }
        };
        fetchAssignments();
    }, []);

    // Only assignments for this engineer
    const myAssignments = assignments.filter(a => a.engineerId?._id === user?._id);

    // Unique projects for this engineer
    const myProjects: Project[] = Array.from(
        myAssignments.reduce((map, a) => {
            if (a.projectId && !map.has(a.projectId._id)) {
                map.set(a.projectId._id, a.projectId);
            }
            return map;
        }, new Map<string, Project>()).values()
    );

    // Analytics
    const totalProjects = myProjects.length;
    const totalAssignments = myAssignments.length;
    const totalAllocation = myAssignments.reduce((sum, a) => sum + (a.allocationPercentage || 0), 0);
    const maxCapacity = user?.maxCapacity || 100;
    const utilization = Math.round((totalAllocation / maxCapacity) * 100);

    // Filter assignments by search
    const filteredAssignments = myAssignments.filter(a => {
        const q = search.toLowerCase();
        return (
            (a.projectId?.name?.toLowerCase() || '').includes(q) ||
            (a.role?.toLowerCase() || '').includes(q) ||
            (a.startDate?.slice(0, 10) || '').includes(q) ||
            (a.endDate?.slice(0, 10) || '').includes(q)
        );
    });

    if (loading) return <div className="flex items-center justify-center h-64"><LoadingSpinner size="lg" /></div>;

    return (
        <div className="max-w-4xl mx-auto p-6 space-y-8">
            {/* Analytics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5 flex items-center">
                        <FolderOpen className="h-8 w-8 text-blue-500 mr-4" />
                        <div>
                            <div className="text-sm text-gray-500">Total Projects</div>
                            <div className="text-2xl font-bold text-gray-900">{totalProjects}</div>
                        </div>
                    </div>
                </div>
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5 flex items-center">
                        <TrendingUp className="h-8 w-8 text-green-500 mr-4" />
                        <div>
                            <div className="text-sm text-gray-500">Total Assignments</div>
                            <div className="text-2xl font-bold text-gray-900">{totalAssignments}</div>
                        </div>
                    </div>
                </div>
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5 flex items-center">
                        <TrendingUp className="h-8 w-8 text-indigo-500 mr-4" />
                        <div>
                            <div className="text-sm text-gray-500">Total Allocation</div>
                            <div className="text-2xl font-bold text-gray-900">{totalAllocation}%</div>
                        </div>
                    </div>
                </div>
                <div className="bg-white overflow-hidden shadow rounded-lg">
                    <div className="p-5 flex items-center">
                        <TrendingUp className="h-8 w-8 text-yellow-500 mr-4" />
                        <div>
                            <div className="text-sm text-gray-500">Utilization</div>
                            <div className="text-2xl font-bold text-gray-900">{utilization}%</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Projects List */}
            <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">My Projects</h2>
                {myProjects.length === 0 ? (
                    <div className="text-center py-8 text-gray-600">No projects found.</div>
                ) : (
                    <ul className="space-y-2">
                        {myProjects.map(project => (
                            <li key={project._id} className="border-b last:border-b-0 py-2">
                                <span className="font-medium text-gray-900">{project.name}</span> <span className="text-xs text-gray-500">({project.status})</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Assignments List */}
            <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-semibold mb-4">My Assignments</h2>
                {filteredAssignments.length === 0 ? (
                    <div className="text-center py-8 text-gray-600">No assignments found.</div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border rounded-lg">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2 border-b">Project</th>
                                    <th className="px-4 py-2 border-b">Role</th>
                                    <th className="px-4 py-2 border-b">Allocation (%)</th>
                                    <th className="px-4 py-2 border-b">Start Date</th>
                                    <th className="px-4 py-2 border-b">End Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredAssignments.map(a => (
                                    <tr key={a._id} className="hover:bg-gray-50">
                                        <td className="px-4 py-2 border-b">{a.projectId?.name || '-'}</td>
                                        <td className="px-4 py-2 border-b">{a.role}</td>
                                        <td className="px-4 py-2 border-b">{a.allocationPercentage}</td>
                                        <td className="px-4 py-2 border-b">{a.startDate?.slice(0, 10)}</td>
                                        <td className="px-4 py-2 border-b">{a.endDate?.slice(0, 10)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EngineerDashboard; 