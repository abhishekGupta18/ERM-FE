import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const ProfilePage: React.FC = () => {
    const { user, setUser } = useAuth() as any;
    const [formData, setFormData] = useState<any>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [skillInput, setSkillInput] = useState('');

    useEffect(() => {
        if (user) {
            setFormData({ ...user });
            setLoading(false);
        }
    }, [user]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleAddSkill = () => {
        if (skillInput.trim() && !formData.skills?.includes(skillInput.trim())) {
            setFormData((prev: any) => ({
                ...prev,
                skills: [...(prev.skills || []), skillInput.trim()]
            }));
            setSkillInput('');
        }
    };

    const handleRemoveSkill = (skillToRemove: string) => {
        setFormData((prev: any) => ({
            ...prev,
            skills: (prev.skills || []).filter((skill: string) => skill !== skillToRemove)
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const res = await apiService.updateEngineerProfile(user._id, formData);
            if (res.success && res.data) {
                setUser(res.data);
                alert('Profile updated successfully!');
            } else {
                alert(res.message || 'Failed to update profile');
            }
        } catch (err: any) {
            alert(err.message || 'Failed to update profile');
        } finally {
            setSaving(false);
        }
    };

    if (loading) return <div className="flex items-center justify-center h-64"><LoadingSpinner size="lg" /></div>;

    return (
        <div className="max-w-2xl mx-auto p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>
            <form onSubmit={handleSubmit} className="bg-white shadow rounded-lg p-6">
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                    <input type="text" name="name" value={formData.name || ''} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" required />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                    <input type="email" name="email" value={formData.email || ''} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" required disabled />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Seniority</label>
                    <select name="seniority" value={formData.seniority || ''} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md">
                        <option value="">Select</option>
                        <option value="junior">Junior</option>
                        <option value="mid">Mid</option>
                        <option value="senior">Senior</option>
                    </select>
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Department</label>
                    <input type="text" name="department" value={formData.department || ''} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Max Capacity</label>
                    <input type="number" name="maxCapacity" value={formData.maxCapacity || ''} onChange={handleInputChange} className="w-full px-3 py-2 border border-gray-300 rounded-md" min="1" />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Skills</label>
                    <div className="flex space-x-2 mb-2">
                        <input type="text" value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), handleAddSkill())} className="flex-1 px-3 py-2 border border-gray-300 rounded-md" placeholder="Add a skill" />
                        <button type="button" onClick={handleAddSkill} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Add</button>
                    </div>
                    {formData.skills && formData.skills.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                            {formData.skills.map((skill: string, idx: number) => (
                                <span key={idx} className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-indigo-100 text-indigo-800">
                                    {skill}
                                    <button type="button" onClick={() => handleRemoveSkill(skill)} className="ml-2 text-indigo-600 hover:text-indigo-800">×</button>
                                </span>
                            ))}
                        </div>
                    )}
                </div>
                <div className="flex justify-end">
                    <button type="submit" disabled={saving} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50">
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProfilePage; 