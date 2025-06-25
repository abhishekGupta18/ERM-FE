import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, Edit, Trash2, Plus } from 'lucide-react';
import { apiService } from '../../services/api';
import { Assignment } from '../../types';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const AssignmentsPage: React.FC = () => {
    const [assignments, setAssignments] = useState<Assignment[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const navigate = useNavigate();

    const fetchAssignments = async () => {
        setLoading(true);
        try {
            const res = await apiService.getAllAssignments();
            if (res.success) {
                setAssignments(res.data || []);
            } else {
                alert(res.message || 'Failed to fetch assignments');
            }
        } catch (err: any) {
            alert(err.message || 'Failed to fetch assignments');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAssignments();
    }, []);

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this assignment?')) return;
        setDeletingId(id);
        try {
            const res = await apiService.deleteAssignment(id);
            if (res.success) {
                setAssignments(assignments.filter(a => a._id !== id));
            } else {
                alert(res.message || 'Failed to delete assignment');
            }
        } catch (err: any) {
            alert(err.message || 'Failed to delete assignment');
        } finally {
            setDeletingId(null);
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center h-64"><LoadingSpinner size="lg" /></div>;
    }

    return (
        <div className="max-w-5xl mx-auto p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Assignment Management</h1>
                <button
                    onClick={() => navigate('/assignments/new')}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                    <Plus className="h-4 w-4 mr-2" /> New Assignment
                </button>
            </div>
            {assignments.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-600">No assignments found. Start by creating a new assignment.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border rounded-lg">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 border-b">Engineer</th>
                                <th className="px-4 py-2 border-b">Project</th>
                                <th className="px-4 py-2 border-b">Role</th>
                                <th className="px-4 py-2 border-b">Allocation (%)</th>
                                <th className="px-4 py-2 border-b">Start Date</th>
                                <th className="px-4 py-2 border-b">End Date</th>
                                <th className="px-4 py-2 border-b">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {assignments.map(assignment => (
                                <tr key={assignment._id} className="hover:bg-gray-50">
                                    <td className="px-4 py-2 border-b font-medium">{assignment.engineerId?.name || '-'}</td>
                                    <td className="px-4 py-2 border-b">{assignment.projectId?.name || '-'}</td>
                                    <td className="px-4 py-2 border-b">{assignment.role}</td>
                                    <td className="px-4 py-2 border-b">{assignment.allocationPercentage}</td>
                                    <td className="px-4 py-2 border-b">{assignment.startDate}</td>
                                    <td className="px-4 py-2 border-b">{assignment.endDate}</td>
                                    <td className="px-4 py-2 border-b">
                                        <div className="flex space-x-2">
                                            <button
                                                className="p-2 text-indigo-600 hover:text-indigo-900"
                                                title="View"
                                                onClick={() => navigate(`/assignments/${assignment._id}`)}
                                            >
                                                <Eye className="h-5 w-5" />
                                            </button>
                                            <button
                                                className="p-2 text-yellow-600 hover:text-yellow-900"
                                                title="Edit"
                                                onClick={() => navigate(`/assignments/${assignment._id}/edit`)}
                                            >
                                                <Edit className="h-5 w-5" />
                                            </button>
                                            <button
                                                className="p-2 text-red-600 hover:text-red-900"
                                                title="Delete"
                                                disabled={deletingId === assignment._id}
                                                onClick={() => handleDelete(assignment._id)}
                                            >
                                                <Trash2 className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default AssignmentsPage; 