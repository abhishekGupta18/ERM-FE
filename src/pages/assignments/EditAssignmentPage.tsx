import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import { apiService } from '../../services/api';
import { Assignment, User, Project } from '../../types';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const EditAssignmentPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState<{ [key: string]: any }>({});
    const [engineers, setEngineers] = useState<User[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [assignmentRes, engineersRes, projectsRes] = await Promise.all([
                    apiService.getAssignment(id!),
                    apiService.getAllEngineers(),
                    apiService.getAllProjects(),
                ]);
                if (assignmentRes.success && assignmentRes.data) {
                    setFormData({
                        ...assignmentRes.data,
                        engineerId: assignmentRes.data.engineerId?._id,
                        projectId: assignmentRes.data.projectId?._id,
                    });
                } else {
                    alert(assignmentRes.message || 'Failed to fetch assignment');
                    navigate('/assignments');
                }
                if (engineersRes.success) setEngineers(engineersRes.data || []);
                if (projectsRes.success) setProjects(projectsRes.data || []);
            } catch (err: any) {
                alert(err.message || 'Failed to fetch assignment data');
                navigate('/assignments');
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id, navigate]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.engineerId || !formData.projectId || !formData.startDate || !formData.endDate || !formData.role) {
            alert('Please fill in all required fields');
            return;
        }
        if (new Date(formData.startDate) >= new Date(formData.endDate)) {
            alert('End date must be after start date');
            return;
        }
        if (formData.allocationPercentage === undefined || formData.allocationPercentage <= 0 || formData.allocationPercentage > 100) {
            alert('Allocation percentage must be between 1 and 100');
            return;
        }
        try {
            setLoading(true);
            const payload = {
                ...formData,
                engineerId: formData.engineerId,
                projectId: formData.projectId,
            };
            const response = await apiService.updateAssignment(id!, payload);
            if (response.success) {
                alert('Assignment updated successfully!');
                navigate('/assignments');
            } else {
                alert(response.message || 'Failed to update assignment');
            }
        } catch (error: any) {
            alert(error.message || 'Failed to update assignment');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div className="flex items-center justify-center h-64"><LoadingSpinner size="lg" /></div>;
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => navigate('/assignments')}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Edit Assignment</h1>
                        <p className="text-gray-600">Update assignment details</p>
                    </div>
                </div>
            </div>
            <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="engineerId" className="block text-sm font-medium text-gray-700 mb-2">Engineer *</label>
                        <select
                            id="engineerId"
                            name="engineerId"
                            value={formData.engineerId || ''}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        >
                            <option value="">Select an engineer</option>
                            {engineers.map((engineer) => (
                                <option key={engineer._id} value={engineer._id}>
                                    {engineer.name} ({engineer.seniority || 'N/A'})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="projectId" className="block text-sm font-medium text-gray-700 mb-2">Project *</label>
                        <select
                            id="projectId"
                            name="projectId"
                            value={formData.projectId || ''}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        >
                            <option value="">Select a project</option>
                            {projects.map((project) => (
                                <option key={project._id} value={project._id}>
                                    {project.name} ({project.status})
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">Role *</label>
                        <input
                            type="text"
                            id="role"
                            name="role"
                            value={formData.role || ''}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="allocationPercentage" className="block text-sm font-medium text-gray-700 mb-2">Allocation Percentage *</label>
                        <div className="relative">
                            <input
                                type="number"
                                id="allocationPercentage"
                                name="allocationPercentage"
                                value={formData.allocationPercentage || ''}
                                onChange={handleInputChange}
                                min="1"
                                max="100"
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                required
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                <span className="text-gray-500 text-sm">%</span>
                            </div>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">Percentage of time allocated to this project</p>
                    </div>
                    <div>
                        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
                        <input
                            type="date"
                            id="startDate"
                            name="startDate"
                            value={formData.startDate || ''}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">End Date *</label>
                        <input
                            type="date"
                            id="endDate"
                            name="endDate"
                            value={formData.endDate || ''}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>
                </div>
                <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={() => navigate('/assignments')}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <Save className="h-4 w-4 mr-2" />
                        Update Assignment
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditAssignmentPage; 