import axios, { AxiosError } from 'axios';
import type {
  Member,
  MemberFormData,
  Assessment,
  AssessmentFormData,
  LoginCredentials,
  AuthResponse,
  ViewerAuthResponse,
  PaginatedResponse,
  PaginationParams,
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token');
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authApi = {
  adminLogin: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await api.post<AuthResponse>('/auth/admin/login', credentials);
    return data;
  },

  viewerAuth: async (password: string): Promise<ViewerAuthResponse> => {
    const { data } = await api.post<ViewerAuthResponse>('/auth/viewer/auth', { password });
    return data;
  },

  getMe: async (): Promise<{ user: { id: number; username: string } }> => {
    const { data } = await api.get('/auth/me');
    return data;
  },
};

// Members API
export const membersApi = {
  getAll: async (params?: PaginationParams & { active?: boolean; search?: string }): Promise<PaginatedResponse<Member>> => {
    const { data } = await api.get<PaginatedResponse<Member>>('/members', { params });
    return data;
  },

  getByCode: async (code: string): Promise<Member> => {
    const { data } = await api.get<Member>(`/members/${code}`);
    return data;
  },

  create: async (memberData: MemberFormData): Promise<Member> => {
    const { data } = await api.post<Member>('/members', memberData);
    return data;
  },

  update: async (code: string, memberData: Partial<MemberFormData>): Promise<Member> => {
    const { data } = await api.put<Member>(`/members/${code}`, memberData);
    return data;
  },

  delete: async (code: string): Promise<void> => {
    await api.delete(`/members/${code}`);
  },

  bulkImport: async (members: MemberFormData[]): Promise<{ message: string; data: Member[] }> => {
    const { data } = await api.post('/members/bulk-import', { members });
    return data;
  },
};

// Assessments API
export const assessmentsApi = {
  getAll: async (params?: PaginationParams & { respondentCode?: string }): Promise<PaginatedResponse<Assessment>> => {
    const { data } = await api.get<PaginatedResponse<Assessment>>('/assessments', { params });
    return data;
  },

  getById: async (id: number): Promise<Assessment> => {
    const { data } = await api.get<Assessment>(`/assessments/${id}`);
    return data;
  },

  create: async (assessmentData: AssessmentFormData): Promise<Assessment> => {
    const { data } = await api.post<Assessment>('/assessments', assessmentData);
    return data;
  },

  update: async (id: number, assessmentData: Partial<AssessmentFormData>): Promise<Assessment> => {
    const { data } = await api.put<Assessment>(`/assessments/${id}`, assessmentData);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await api.delete(`/assessments/${id}`);
  },
};

// Metrics API
export const metricsApi = {
  getTeamMetrics: async (): Promise<any> => {
    const { data } = await api.get('/metrics/team');
    return data;
  },

  getMemberMetrics: async (code: string): Promise<any> => {
    const { data } = await api.get(`/metrics/member/${code}`);
    return data;
  },

  calculateAssessmentMetrics: async (id: number): Promise<{ message: string; count: number }> => {
    const { data } = await api.post(`/metrics/assessment/${id}/calculate`);
    return data;
  },
};
