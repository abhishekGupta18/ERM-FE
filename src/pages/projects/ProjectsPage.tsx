import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, Edit, Trash2, Plus } from 'lucide-react';
import { apiService } from '../../services/api';
import { Project } from '../../types';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useSearch } from '../../context/SearchContext';

const ProjectsPage: React.FC = () => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const navigate = useNavigate();
    const { search } = useSearch();

    const fetchProjects = async () => {
        setLoading(true);
        try {
            const res = await apiService.getAllProjects();
            if (res.success) {
                setProjects(res.data || []);
            } else {
                alert(res.message || 'Failed to fetch projects');
            }
        } catch (err: any) {
            alert(err.message || 'Failed to fetch projects');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleDelete = async (id: string) => {
        if (!window.confirm('Are you sure you want to delete this project?')) return;
        setDeletingId(id);
        try {
            const res = await apiService.deleteProject(id);
            if (res.success) {
                setProjects(projects.filter(p => p._id !== id));
            } else {
                alert(res.message || 'Failed to delete project');
            }
        } catch (err: any) {
            alert(err.message || 'Failed to delete project');
        } finally {
            setDeletingId(null);
        }
    };

    // Filter projects by search
    const filteredProjects = projects.filter(p => {
        const q = search.toLowerCase();
        return (
            p.name.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.status.toLowerCase().includes(q)
        );
    });

    if (loading) {
        return <div className="flex items-center justify-center h-64"><LoadingSpinner size="lg" /></div>;
    }

    return (
        <div className="max-w-5xl mx-auto p-6">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-2xl font-bold text-gray-900">Project Management</h1>
                <Link
                    to="/projects/new"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                >
                    <Plus className="h-4 w-4 mr-2" /> New Project
                </Link>
            </div>
            {filteredProjects.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-600">No projects found. Start by creating a new project.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border rounded-lg">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 border-b">Name</th>
                                <th className="px-4 py-2 border-b">Status</th>
                                <th className="px-4 py-2 border-b">Start Date</th>
                                <th className="px-4 py-2 border-b">End Date</th>
                                <th className="px-4 py-2 border-b">Team Size</th>
                                <th className="px-4 py-2 border-b">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredProjects.map(project => (
                                <tr key={project._id} className="hover:bg-gray-50">
                                    <td className="px-4 py-2 border-b font-medium">{project.name}</td>
                                    <td className="px-4 py-2 border-b">{project.status}</td>
                                    <td className="px-4 py-2 border-b">{project.startDate}</td>
                                    <td className="px-4 py-2 border-b">{project.endDate}</td>
                                    <td className="px-4 py-2 border-b">{project.teamSize}</td>
                                    <td className="px-4 py-2 border-b">
                                        <div className="flex space-x-2">
                                            <button
                                                className="p-2 text-indigo-600 hover:text-indigo-900"
                                                title="View"
                                                onClick={() => navigate(`/projects/${project._id}`)}
                                            >
                                                <Eye className="h-5 w-5" />
                                            </button>
                                            <button
                                                className="p-2 text-yellow-600 hover:text-yellow-900"
                                                title="Edit"
                                                onClick={() => navigate(`/projects/${project._id}/edit`)}
                                            >
                                                <Edit className="h-5 w-5" />
                                            </button>
                                            <button
                                                className="p-2 text-red-600 hover:text-red-900"
                                                title="Delete"
                                                disabled={deletingId === project._id}
                                                onClick={() => handleDelete(project._id)}
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

export default ProjectsPage; 