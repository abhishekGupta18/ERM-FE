import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { ApiResponse, LoginCredentials, SignupData, User, Project, Assignment } from '../types';
import { config } from '../config/environment';

class ApiService {
    private api: AxiosInstance;

    constructor() {
        this.api = axios.create({
            baseURL: config.apiBaseUrl,
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Add request interceptor to include auth token
        this.api.interceptors.request.use(
            (config) => {
                const token = localStorage.getItem('token');
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
                return config;
            },
            (error) => {
                return Promise.reject(error);
            }
        );

        // Add response interceptor for error handling
        this.api.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    window.location.href = '/login';
                }
                return Promise.reject(error);
            }
        );
    }

    // Authentication
    async login(credentials: LoginCredentials): Promise<ApiResponse<{ token: string; user: User }>> {
        try {
            const response: AxiosResponse<ApiResponse<{ token: string; user: User }>> = await this.api.post('/login', credentials);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Login failed');
        }
    }

    async signup(userData: SignupData): Promise<ApiResponse<{ token: string; user: User }>> {
        try {
            const response: AxiosResponse<ApiResponse<{ token: string; user: User }>> = await this.api.post('/signup', userData);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Signup failed');
        }
    }

    async getProfile(): Promise<ApiResponse<User>> {
        try {
            const response: AxiosResponse<ApiResponse<User>> = await this.api.get('/profile');
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to fetch profile');
        }
    }

    // Engineers
    async getAllEngineers(): Promise<ApiResponse<User[]>> {
        try {
            const response: AxiosResponse<ApiResponse<User[]>> = await this.api.get('/getAllEngineers');
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to fetch engineers');
        }
    }

    async getEngineerCapacity(engineerId: string): Promise<ApiResponse<any>> {
        try {
            const response: AxiosResponse<ApiResponse<any>> = await this.api.get(`/engineer/${engineerId}/capacity`);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to fetch engineer capacity');
        }
    }

    async updateEngineerProfile(engineerId: string, data: Partial<User>): Promise<ApiResponse<User>> {
        try {
            const response: AxiosResponse<ApiResponse<User>> = await this.api.put(`/engineerProfile/${engineerId}`, data);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to update engineer profile');
        }
    }

    async getSuitableEngineers(criteria: any): Promise<ApiResponse<User[]>> {
        try {
            const response: AxiosResponse<ApiResponse<User[]>> = await this.api.post('/getSuitableEngineer', criteria);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to find suitable engineers');
        }
    }

    // Projects
    async getAllProjects(): Promise<ApiResponse<Project[]>> {
        try {
            const response: AxiosResponse<ApiResponse<Project[]>> = await this.api.get('/getAllproject');
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to fetch projects');
        }
    }

    async getProject(projectId: string): Promise<ApiResponse<Project>> {
        try {
            const response: AxiosResponse<ApiResponse<Project>> = await this.api.get(`/getProject/${projectId}`);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to fetch project');
        }
    }

    async createProject(projectData: Omit<Project, '_id' | 'managerId'>): Promise<ApiResponse<Project>> {
        try {
            const response: AxiosResponse<ApiResponse<Project>> = await this.api.post('/createProject', projectData);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to create project');
        }
    }

    async updateProject(projectId: string, projectData: Partial<Project>): Promise<ApiResponse<Project>> {
        try {
            const response: AxiosResponse<ApiResponse<Project>> = await this.api.put(`/updateProject/${projectId}`, projectData);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to update project');
        }
    }

    async deleteProject(projectId: string): Promise<ApiResponse<void>> {
        try {
            const response: AxiosResponse<ApiResponse<void>> = await this.api.delete(`/delete/${projectId}`);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to delete project');
        }
    }

    // Assignments
    async getAllAssignments(): Promise<ApiResponse<Assignment[]>> {
        try {
            const response: AxiosResponse<ApiResponse<Assignment[]>> = await this.api.get('/getAllAssignment');
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to fetch assignments');
        }
    }

    async createAssignment(assignmentData: Omit<Assignment, '_id'>): Promise<ApiResponse<Assignment>> {
        try {
            const response: AxiosResponse<ApiResponse<Assignment>> = await this.api.post('/createAssignment', assignmentData);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to create assignment');
        }
    }

    async updateAssignment(assignmentId: string, assignmentData: Partial<Assignment>): Promise<ApiResponse<Assignment>> {
        try {
            const response: AxiosResponse<ApiResponse<Assignment>> = await this.api.put(`/updateAssignment/${assignmentId}`, assignmentData);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to update assignment');
        }
    }

    async deleteAssignment(assignmentId: string): Promise<ApiResponse<void>> {
        try {
            const response: AxiosResponse<ApiResponse<void>> = await this.api.delete(`/deleteAssignment/${assignmentId}`);
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to delete assignment');
        }
    }

    // Analytics
    async getUtilizationAnalytics(): Promise<ApiResponse<any>> {
        try {
            const response: AxiosResponse<ApiResponse<any>> = await this.api.get('/analytics/utilization');
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to fetch utilization analytics');
        }
    }

    async getTimeline(): Promise<ApiResponse<any>> {
        try {
            const response: AxiosResponse<ApiResponse<any>> = await this.api.get('/analytics/timeline');
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to fetch timeline');
        }
    }

    async getProjectAnalytics(): Promise<ApiResponse<any>> {
        try {
            const response: AxiosResponse<ApiResponse<any>> = await this.api.get('/analytics/projects');
            return response.data;
        } catch (error: any) {
            throw new Error(error.response?.data?.message || 'Failed to fetch project analytics');
        }
    }
}

export const apiService = new ApiService(); 