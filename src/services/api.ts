import axios, { type AxiosResponse } from 'axios';
import { useAuthStore } from '../stores/authStore';
import type { 
  ApiResponse, 
  PaginatedResponse, 
  Ticket, 
  User, 
  DashboardStats,
  Merchant,
  TicketFilters,
  CategoryConfig,
  SLAConfig
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (username: string, password: string): Promise<{ user: User; token: string }> => {
    const response: AxiosResponse<ApiResponse<{ user: User; token: string }>> = 
      await api.post('/auth/login', { username, password });
    return response.data.data;
  },
  
  refreshToken: async (): Promise<{ token: string }> => {
    const response: AxiosResponse<ApiResponse<{ token: string }>> = 
      await api.post('/auth/refresh');
    return response.data.data;
  },
  
  getCurrentUser: async (): Promise<User> => {
    const response: AxiosResponse<ApiResponse<User>> = 
      await api.get('/auth/me');
    return response.data.data;
  },
};

// Dashboard API
export const dashboardAPI = {
  getStats: async (): Promise<DashboardStats> => {
    const response: AxiosResponse<ApiResponse<DashboardStats>> = 
      await api.get('/dashboard/stats');
    return response.data.data;
  },
};

// Tickets API
export const ticketsAPI = {
  getTickets: async (
    page: number = 0, 
    size: number = 10, 
    filters?: TicketFilters
  ): Promise<PaginatedResponse<Ticket>> => {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      ...filters,
    });
    
    const response: AxiosResponse<ApiResponse<PaginatedResponse<Ticket>>> = 
      await api.get(`/tickets?${params}`);
    return response.data.data;
  },
  
  getTicketById: async (id: string): Promise<Ticket> => {
    const response: AxiosResponse<ApiResponse<Ticket>> = 
      await api.get(`/tickets/${id}`);
    return response.data.data;
  },
  
  updateTicketStatus: async (id: string, status: string): Promise<Ticket> => {
    const response: AxiosResponse<ApiResponse<Ticket>> = 
      await api.patch(`/tickets/${id}/status`, { status });
    return response.data.data;
  },
  
  assignTicket: async (id: string, agentId: string): Promise<Ticket> => {
    const response: AxiosResponse<ApiResponse<Ticket>> = 
      await api.patch(`/tickets/${id}/assign`, { agentId });
    return response.data.data;
  },
  
  addNote: async (ticketId: string, content: string, isInternal: boolean): Promise<void> => {
    await api.post(`/tickets/${ticketId}/notes`, { content, isInternal });
  },
  
  bulkUpdateStatus: async (ticketIds: string[], status: string): Promise<void> => {
    await api.patch('/tickets/bulk-status', { ticketIds, status });
  },
};

// Merchants API
export const merchantsAPI = {
  getMerchants: async (page: number = 0, size: number = 10): Promise<PaginatedResponse<Merchant>> => {
    const response: AxiosResponse<ApiResponse<PaginatedResponse<Merchant>>> = 
      await api.get(`/merchants?page=${page}&size=${size}`);
    return response.data.data;
  },
  
  getMerchantById: async (id: string): Promise<Merchant> => {
    const response: AxiosResponse<ApiResponse<Merchant>> = 
      await api.get(`/merchants/${id}`);
    return response.data.data;
  },
  
  updateMerchant: async (id: string, data: Partial<Merchant>): Promise<Merchant> => {
    const response: AxiosResponse<ApiResponse<Merchant>> = 
      await api.put(`/merchants/${id}`, data);
    return response.data.data;
  },
};

// Configuration API
export const configAPI = {
  getCategories: async (): Promise<CategoryConfig[]> => {
    const response: AxiosResponse<ApiResponse<CategoryConfig[]>> = 
      await api.get('/config/categories');
    return response.data.data;
  },
  
  createCategory: async (data: Omit<CategoryConfig, 'id'>): Promise<CategoryConfig> => {
    const response: AxiosResponse<ApiResponse<CategoryConfig>> = 
      await api.post('/config/categories', data);
    return response.data.data;
  },
  
  updateCategory: async (id: string, data: Partial<CategoryConfig>): Promise<CategoryConfig> => {
    const response: AxiosResponse<ApiResponse<CategoryConfig>> = 
      await api.put(`/config/categories/${id}`, data);
    return response.data.data;
  },
  
  deleteCategory: async (id: string): Promise<void> => {
    await api.delete(`/config/categories/${id}`);
  },
  
  getSLAConfigs: async (): Promise<SLAConfig[]> => {
    const response: AxiosResponse<ApiResponse<SLAConfig[]>> = 
      await api.get('/config/sla');
    return response.data.data;
  },
  
  updateSLAConfig: async (id: string, data: Partial<SLAConfig>): Promise<SLAConfig> => {
    const response: AxiosResponse<ApiResponse<SLAConfig>> = 
      await api.put(`/config/sla/${id}`, data);
    return response.data.data;
  },
};

// Reports API
export const reportsAPI = {
  getTicketVolumeByCategory: async (dateFrom: string, dateTo: string) => {
    const response = await api.get(`/reports/ticket-volume?from=${dateFrom}&to=${dateTo}`);
    return response.data.data;
  },
  
  getSLACompliance: async (dateFrom: string, dateTo: string) => {
    const response = await api.get(`/reports/sla-compliance?from=${dateFrom}&to=${dateTo}`);
    return response.data.data;
  },
  
  getAgentPerformance: async (dateFrom: string, dateTo: string) => {
    const response = await api.get(`/reports/agent-performance?from=${dateFrom}&to=${dateTo}`);
    return response.data.data;
  },
  
  exportTickets: async (filters?: TicketFilters): Promise<Blob> => {
    const params = new URLSearchParams(filters as any);
    const response = await api.get(`/reports/export/tickets?${params}`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

export default api;