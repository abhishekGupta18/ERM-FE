import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Save, Users, Calendar } from 'lucide-react';
import { apiService } from '../../services/api';
import { Assignment, User, Project } from '../../types';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const CreateAssignmentPage: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [engineers, setEngineers] = useState<User[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [formData, setFormData] = useState({
        engineerId: '',
        projectId: '',
        allocationPercentage: 50,
        startDate: '',
        endDate: '',
        role: ''
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [engineersRes, projectsRes] = await Promise.all([
                    apiService.getAllEngineers(),
                    apiService.getAllProjects()
                ]);

                if (engineersRes.success) {
                    setEngineers(engineersRes.data || []);
                }
                if (projectsRes.success) {
                    setProjects(projectsRes.data || []);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
                alert('Failed to load engineers and projects');
            }
        };

        fetchData();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
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

        if (formData.allocationPercentage <= 0 || formData.allocationPercentage > 100) {
            alert('Allocation percentage must be between 1 and 100');
            return;
        }

        try {
            setLoading(true);
            const response = await apiService.createAssignment(formData);

            if (response.success) {
                alert('Assignment created successfully!');
                navigate('/dashboard');
            } else {
                alert(response.message || 'Failed to create assignment');
            }
        } catch (error: any) {
            alert(error.message || 'Failed to create assignment');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => navigate('/dashboard')}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Create New Assignment</h1>
                        <p className="text-gray-600">Assign an engineer to a project</p>
                    </div>
                </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Engineer Selection */}
                    <div>
                        <label htmlFor="engineerId" className="block text-sm font-medium text-gray-700 mb-2">
                            Engineer *
                        </label>
                        <select
                            id="engineerId"
                            name="engineerId"
                            value={formData.engineerId}
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

                    {/* Project Selection */}
                    <div>
                        <label htmlFor="projectId" className="block text-sm font-medium text-gray-700 mb-2">
                            Project *
                        </label>
                        <select
                            id="projectId"
                            name="projectId"
                            value={formData.projectId}
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

                    {/* Role */}
                    <div>
                        <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-2">
                            Role *
                        </label>
                        <input
                            type="text"
                            id="role"
                            name="role"
                            value={formData.role}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="e.g., Frontend Developer, Backend Developer"
                            required
                        />
                    </div>

                    {/* Allocation Percentage */}
                    <div>
                        <label htmlFor="allocationPercentage" className="block text-sm font-medium text-gray-700 mb-2">
                            Allocation Percentage *
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                id="allocationPercentage"
                                name="allocationPercentage"
                                value={formData.allocationPercentage}
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

                    {/* Start Date */}
                    <div>
                        <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-2">
                            Start Date *
                        </label>
                        <input
                            type="date"
                            id="startDate"
                            name="startDate"
                            value={formData.startDate}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>

                    {/* End Date */}
                    <div>
                        <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-2">
                            End Date *
                        </label>
                        <input
                            type="date"
                            id="endDate"
                            name="endDate"
                            value={formData.endDate}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>
                </div>

                {/* Selected Engineer Info */}
                {formData.engineerId && (
                    <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-900 mb-2">Selected Engineer Details</h3>
                        {(() => {
                            const engineer = engineers.find(e => e._id === formData.engineerId);
                            return engineer ? (
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                                        <Users className="h-5 w-5 text-indigo-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{engineer.name}</p>
                                        <p className="text-xs text-gray-500">
                                            {engineer.seniority || 'N/A'} • {engineer.skills?.join(', ') || 'No skills listed'}
                                        </p>
                                    </div>
                                </div>
                            ) : null;
                        })()}
                    </div>
                )}

                {/* Selected Project Info */}
                {formData.projectId && (
                    <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                        <h3 className="text-sm font-medium text-gray-900 mb-2">Selected Project Details</h3>
                        {(() => {
                            const project = projects.find(p => p._id === formData.projectId);
                            return project ? (
                                <div className="flex items-center space-x-4">
                                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                                        <Calendar className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">{project.name}</p>
                                        <p className="text-xs text-gray-500">
                                            {project.status} • Team Size: {project.teamSize}
                                        </p>
                                    </div>
                                </div>
                            ) : null;
                        })()}
                    </div>
                )}

                {/* Form Actions */}
                <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={() => navigate('/dashboard')}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <Save className="h-4 w-4 mr-2" />
                        Create Assignment
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CreateAssignmentPage; 