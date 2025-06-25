import { User, Project, Assignment } from '../types';

export const demoUsers: User[] = [
    {
        _id: '1',
        email: 'john.doe@company.com',
        name: 'John Doe',
        role: 'manager',
        skills: ['React', 'TypeScript', 'Node.js'],
        seniority: 'senior',
        maxCapacity: 100,
        department: 'Frontend',
    },
    {
        _id: '2',
        email: 'jane.smith@company.com',
        name: 'Jane Smith',
        role: 'engineer',
        skills: ['React', 'JavaScript', 'CSS'],
        seniority: 'mid',
        maxCapacity: 100,
        department: 'Frontend',
    },
    {
        _id: '3',
        email: 'mike.johnson@company.com',
        name: 'Mike Johnson',
        role: 'engineer',
        skills: ['Node.js', 'Express', 'MongoDB'],
        seniority: 'senior',
        maxCapacity: 100,
        department: 'Backend',
    },
    {
        _id: '4',
        email: 'sarah.wilson@company.com',
        name: 'Sarah Wilson',
        role: 'engineer',
        skills: ['Python', 'Django', 'PostgreSQL'],
        seniority: 'junior',
        maxCapacity: 80,
        department: 'Backend',
    },
];

export const demoProjects: Project[] = [
    {
        _id: '1',
        name: 'E-commerce Platform',
        description: 'Building a modern e-commerce platform with React and Node.js',
        startDate: '2024-01-15',
        endDate: '2024-06-30',
        requiredSkills: ['React', 'Node.js', 'MongoDB'],
        teamSize: 5,
        status: 'Active',
        managerId: '1',
    },
    {
        _id: '2',
        name: 'Mobile App Development',
        description: 'React Native mobile application for iOS and Android',
        startDate: '2024-03-01',
        endDate: '2024-08-15',
        requiredSkills: ['React Native', 'JavaScript', 'Firebase'],
        teamSize: 3,
        status: 'Planning',
        managerId: '1',
    },
    {
        _id: '3',
        name: 'API Gateway',
        description: 'Microservices API gateway with authentication and rate limiting',
        startDate: '2024-02-01',
        endDate: '2024-05-30',
        requiredSkills: ['Node.js', 'Express', 'Redis'],
        teamSize: 2,
        status: 'Active',
        managerId: '1',
    },
];

export const demoAssignments: Assignment[] = [
    {
        _id: '1',
        engineerId: demoUsers[1], // Jane Smith
        projectId: demoProjects[0], // E-commerce Platform
        allocationPercentage: 60,
        startDate: '2024-01-15',
        endDate: '2024-06-30',
        role: 'Frontend Developer',
    },
    {
        _id: '2',
        engineerId: demoUsers[2], // Mike Johnson
        projectId: demoProjects[0], // E-commerce Platform
        allocationPercentage: 80,
        startDate: '2024-01-15',
        endDate: '2024-06-30',
        role: 'Backend Developer',
    },
    {
        _id: '3',
        engineerId: demoUsers[3], // Sarah Wilson
        projectId: demoProjects[2], // API Gateway
        allocationPercentage: 100,
        startDate: '2024-02-01',
        endDate: '2024-05-30',
        role: 'Backend Developer',
    },
    {
        _id: '4',
        engineerId: demoUsers[1], // Jane Smith
        projectId: demoProjects[1], // Mobile App Development
        allocationPercentage: 40,
        startDate: '2024-03-01',
        endDate: '2024-08-15',
        role: 'Mobile Developer',
    },
];

// Mock API responses
export const mockApiResponses = {
    login: {
        success: true,
        data: {
            token: 'mock-jwt-token',
            user: demoUsers[0], // Manager
        },
    },
    getAllEngineers: {
        success: true,
        data: demoUsers.filter(user => user.role === 'engineer'),
    },
    getAllProjects: {
        success: true,
        data: demoProjects,
    },
    getAllAssignments: {
        success: true,
        data: demoAssignments,
    },
    getEngineerCapacity: {
        success: true,
        data: {
            maxCapacity: 100,
            currentAllocation: 60,
        },
    },
}; 