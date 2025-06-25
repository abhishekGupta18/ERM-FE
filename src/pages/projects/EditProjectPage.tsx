import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Save, X } from 'lucide-react';
import { apiService } from '../../services/api';
import { Project } from '../../types';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const EditProjectPage: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState<Partial<Project>>({});
    const [skillInput, setSkillInput] = useState('');

    useEffect(() => {
        const fetchProject = async () => {
            setLoading(true);
            try {
                const res = await apiService.getProject(id!);
                if (res.success && res.data) {
                    setFormData(res.data);
                } else {
                    alert(res.message || 'Failed to fetch project');
                    navigate('/projects');
                }
            } catch (err: any) {
                alert(err.message || 'Failed to fetch project');
                navigate('/projects');
            } finally {
                setLoading(false);
            }
        };
        fetchProject();
    }, [id, navigate]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleAddSkill = () => {
        if (skillInput.trim() && !formData.requiredSkills?.includes(skillInput.trim())) {
            setFormData(prev => ({
                ...prev,
                requiredSkills: [...(prev.requiredSkills || []), skillInput.trim()]
            }));
            setSkillInput('');
        }
    };

    const handleRemoveSkill = (skillToRemove: string) => {
        setFormData(prev => ({
            ...prev,
            requiredSkills: (prev.requiredSkills || []).filter(skill => skill !== skillToRemove)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.description || !formData.startDate || !formData.endDate) {
            alert('Please fill in all required fields');
            return;
        }
        if (new Date(formData.startDate) >= new Date(formData.endDate)) {
            alert('End date must be after start date');
            return;
        }
        try {
            setLoading(true);
            const response = await apiService.updateProject(id!, formData);
            if (response.success) {
                alert('Project updated successfully!');
                navigate('/projects');
            } else {
                alert(response.message || 'Failed to update project');
            }
        } catch (error: any) {
            alert(error.message || 'Failed to update project');
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
                        onClick={() => navigate('/projects')}
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md"
                    >
                        <ArrowLeft className="h-5 w-5" />
                    </button>
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Edit Project</h1>
                        <p className="text-gray-600">Update project details</p>
                    </div>
                </div>
            </div>
            <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">Project Name *</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            value={formData.name || ''}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description || ''}
                            onChange={handleInputChange}
                            rows={4}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            required
                        />
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
                    <div>
                        <label htmlFor="teamSize" className="block text-sm font-medium text-gray-700 mb-2">Team Size</label>
                        <input
                            type="number"
                            id="teamSize"
                            name="teamSize"
                            value={formData.teamSize || 1}
                            onChange={handleInputChange}
                            min="1"
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        />
                    </div>
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                        <select
                            id="status"
                            name="status"
                            value={formData.status || 'Planning'}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="Planning">Planning</option>
                            <option value="Active">Active</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">Required Skills</label>
                        <div className="flex space-x-2 mb-3">
                            <input
                                type="text"
                                value={skillInput}
                                onChange={(e) => setSkillInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())}
                                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                                placeholder="Add a skill (e.g., React, Node.js)"
                            />
                            <button
                                type="button"
                                onClick={handleAddSkill}
                                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            >
                                Add
                            </button>
                        </div>
                        {formData.requiredSkills && formData.requiredSkills.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                                {formData.requiredSkills.map((skill, index) => (
                                    <span
                                        key={index}
                                        className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800"
                                    >
                                        {skill}
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveSkill(skill)}
                                            className="ml-2 text-indigo-600 hover:text-indigo-800"
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
                    <button
                        type="button"
                        onClick={() => navigate('/projects')}
                        className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <Save className="h-4 w-4 mr-2" />
                        Update Project
                    </button>
                </div>
            </form>
        </div>
    );
};

export default EditProjectPage; 