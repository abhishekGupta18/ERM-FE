export interface User {
    _id: string;
    email: string;
    name: string;
    role: 'engineer' | 'manager';
    skills?: string[];
    seniority?: 'junior' | 'mid' | 'senior';
    maxCapacity?: number;
    department?: string;
}

export interface Project {
    _id: string;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    requiredSkills: string[];
    teamSize: number;
    status: 'Planning' | 'Active' | 'Completed';
    managerId: string;
}

export interface Assignment {
    _id: string;
    engineerId: User;
    projectId: Project;
    allocationPercentage: number;
    startDate: string;
    endDate: string;
    role: string;
}

export interface LoginCredentials {
    email: string;
    password: string;
}

export interface SignupData {
    email: string;
    password: string;
    name: string;
    role: 'engineer' | 'manager';
    skills?: string[];
    seniority?: 'junior' | 'mid' | 'senior';
    maxCapacity?: number;
    department?: string;
}

export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    message?: string;
    error?: string;
}

export interface CapacityUtilization {
    engineerId: string;
    engineerName: string;
    currentAllocation: number;
    maxCapacity: number;
    utilizationPercentage: number;
    assignments: Assignment[];
}

export interface ProjectAnalytics {
    projectId: string;
    projectName: string;
    teamSize: number;
    assignedEngineers: number;
    skillCoverage: number;
    timelineProgress: number;
}

export interface TimelineEvent {
    id: string;
    title: string;
    start: Date;
    end: Date;
    engineerName: string;
    projectName: string;
    allocationPercentage: number;
    color: string;
}

export interface FilterOptions {
    skills?: string[];
    status?: string[];
    dateRange?: {
        start: Date;
        end: Date;
    };
    seniority?: string[];
    department?: string[];
} 