import React, { useEffect, useState } from 'react';
import { apiService } from '../../services/api';
import { User } from '../../types';
import LoadingSpinner from '../../components/common/LoadingSpinner';

const TeamPage: React.FC = () => {
    const [engineers, setEngineers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEngineers = async () => {
            setLoading(true);
            try {
                const res = await apiService.getAllEngineers();
                if (res.success) {
                    setEngineers(res.data || []);
                } else {
                    alert(res.message || 'Failed to fetch engineers');
                }
            } catch (err: any) {
                alert(err.message || 'Failed to fetch engineers');
            } finally {
                setLoading(false);
            }
        };
        fetchEngineers();
    }, []);

    if (loading) {
        return <div className="flex items-center justify-center h-64"><LoadingSpinner size="lg" /></div>;
    }

    return (
        <div className="max-w-5xl mx-auto p-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">Team Overview</h1>
            {engineers.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-gray-600">No engineers found.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border rounded-lg">
                        <thead>
                            <tr>
                                <th className="px-4 py-2 border-b">Name</th>
                                <th className="px-4 py-2 border-b">Email</th>
                                <th className="px-4 py-2 border-b">Role</th>
                                <th className="px-4 py-2 border-b">Seniority</th>
                                <th className="px-4 py-2 border-b">Department</th>
                                <th className="px-4 py-2 border-b">Max Capacity</th>
                                <th className="px-4 py-2 border-b">Skills</th>
                            </tr>
                        </thead>
                        <tbody>
                            {engineers.map(engineer => (
                                <tr key={engineer._id} className="hover:bg-gray-50">
                                    <td className="px-4 py-2 border-b font-medium">{engineer.name}</td>
                                    <td className="px-4 py-2 border-b">{engineer.email}</td>
                                    <td className="px-4 py-2 border-b capitalize">{engineer.role}</td>
                                    <td className="px-4 py-2 border-b capitalize">{engineer.seniority || '-'}</td>
                                    <td className="px-4 py-2 border-b">{engineer.department || '-'}</td>
                                    <td className="px-4 py-2 border-b">{engineer.maxCapacity || '-'}</td>
                                    <td className="px-4 py-2 border-b">
                                        {engineer.skills && engineer.skills.length > 0 ? (
                                            <div className="flex flex-wrap gap-1">
                                                {engineer.skills.map((skill, idx) => (
                                                    <span key={idx} className="inline-block px-2 py-1 bg-indigo-100 text-indigo-800 rounded text-xs">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        ) : '-'}
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

export default TeamPage; 