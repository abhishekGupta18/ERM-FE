import React, { useEffect, useState } from 'react';
import { Menu, Bell, Search, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useSearch } from '../../context/SearchContext';
import { useLocation, Link } from 'react-router-dom';
import { apiService } from '../../services/api';

interface HeaderProps {
    onMenuToggle: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuToggle }) => {
    const { user, logout } = useAuth();
    const { search, setSearch } = useSearch();
    const location = useLocation();
    const [projectResults, setProjectResults] = useState<any[]>([]);
    const [assignmentResults, setAssignmentResults] = useState<any[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        if (user?.role === 'manager' && search.trim().length > 0) {
            const fetchResults = async () => {
                const [projectsRes, assignmentsRes] = await Promise.all([
                    apiService.getAllProjects(),
                    apiService.getAllAssignments(),
                ]);
                const q = search.toLowerCase();
                setProjectResults(
                    (projectsRes.data || []).filter((p: any) =>
                        p.name.toLowerCase().includes(q) ||
                        p.description.toLowerCase().includes(q) ||
                        p.status.toLowerCase().includes(q)
                    )
                );
                setAssignmentResults(
                    (assignmentsRes.data || []).filter((a: any) =>
                        (a.projectId?.name?.toLowerCase() || '').includes(q) ||
                        (a.role?.toLowerCase() || '').includes(q) ||
                        (a.engineerId?.name?.toLowerCase() || '').includes(q)
                    )
                );
                setShowDropdown(true);
            };
            fetchResults();
        } else {
            setProjectResults([]);
            setAssignmentResults([]);
            setShowDropdown(false);
        }
    }, [search, user]);

    const handleLogout = () => {
        logout();
        // You might want to redirect to login page here
        window.location.href = '/login';
    };

    return (
        <header className="bg-white shadow-sm border-b border-gray-200">
            <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
                {/* Left section */}
                <div className="flex items-center">
                    <button
                        onClick={onMenuToggle}
                        className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                    >
                        <Menu className="h-6 w-6" />
                    </button>

                    <div className="hidden lg:block ml-4">
                        <h1 className="text-xl font-semibold text-gray-900">
                            Engineering Resource Management
                        </h1>
                    </div>
                </div>

                {/* Center section - Search */}
                {((user?.role === 'manager') || location.pathname.startsWith('/projects') || location.pathname.startsWith('/assignments') || (user?.role === 'engineer' && location.pathname === '/dashboard')) && (
                    <div className="flex-1 max-w-lg mx-4 hidden md:block relative">
                        <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400" />
                            </div>
                            <input
                                type="text"
                                placeholder="Search..."
                                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                value={search}
                                onChange={e => setSearch(e.target.value)}
                                onFocus={() => user?.role === 'manager' && setShowDropdown(true)}
                                onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                            />
                        </div>
                        {/* Dropdown for global search results (manager only) */}
                        {user?.role === 'manager' && showDropdown && (search.trim().length > 0) && (
                            <div className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded shadow-lg max-h-80 overflow-y-auto">
                                {projectResults.length === 0 && assignmentResults.length === 0 && (
                                    <div className="p-4 text-gray-500 text-sm">No results found.</div>
                                )}
                                {projectResults.length > 0 && (
                                    <div>
                                        <div className="px-4 py-2 text-xs text-gray-400 uppercase">Projects</div>
                                        {projectResults.map((p) => (
                                            <Link
                                                key={p._id}
                                                to={`/projects/${p._id}`}
                                                className="block px-4 py-2 hover:bg-indigo-50 text-gray-900"
                                                onClick={() => setShowDropdown(false)}
                                            >
                                                <span className="font-medium">{p.name}</span> <span className="text-xs text-gray-500">({p.status})</span>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                                {assignmentResults.length > 0 && (
                                    <div>
                                        <div className="px-4 py-2 text-xs text-gray-400 uppercase">Assignments</div>
                                        {assignmentResults.map((a) => (
                                            <Link
                                                key={a._id}
                                                to={`/assignments/${a._id}/edit`}
                                                className="block px-4 py-2 hover:bg-indigo-50 text-gray-900"
                                                onClick={() => setShowDropdown(false)}
                                            >
                                                <span className="font-medium">{a.projectId?.name || 'No Project'}</span> <span className="text-xs text-gray-500">({a.role})</span> - <span className="text-xs text-gray-400">{a.engineerId?.name}</span>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Right section */}
                <div className="flex items-center space-x-4">
                    {/* Notifications */}
                    <button className="p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100 rounded-md relative">
                        <Bell className="h-6 w-6" />
                        <span className="absolute top-1 right-1 block h-2 w-2 rounded-full bg-red-400"></span>
                    </button>

                    {/* User menu */}
                    <div className="flex items-center space-x-3">
                        <div className="hidden sm:block text-right">
                            <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                            <p className="text-xs text-gray-500 capitalize">{user?.role}</p>
                        </div>
                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                            <span className="text-indigo-600 font-medium text-sm">
                                {user?.name?.charAt(0).toUpperCase()}
                            </span>
                        </div>

                        {/* Logout button */}
                        <button
                            onClick={handleLogout}
                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors duration-200"
                            title="Logout"
                        >
                            <LogOut className="h-5 w-5" />
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header; 