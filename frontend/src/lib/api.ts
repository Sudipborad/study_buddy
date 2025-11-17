const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api';

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface Material {
  id: string;
  title: string;
  summary: string;
  flashcards: Array<{
    front: string;
    back: string;
  }>;
  sourceDocument?: string;
  createdAt: string;
}

export interface AuthResponse {
  success: boolean;
  data?: {
    user: User;
    token: string;
  };
  message?: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: any[];
}

class ApiClient {
  private baseURL: string;
  private token: string | null = null;

  constructor() {
    this.baseURL = API_BASE_URL;
    // Load token from localStorage if available
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }
  }

  setToken(token: string | null) {
    this.token = token;
    if (typeof window !== 'undefined') {
      if (token) {
        localStorage.setItem('auth_token', token);
      } else {
        localStorage.removeItem('auth_token');
      }
    }
  }

  private async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'API request failed');
      }

      return data;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  // Auth methods
  async register(email: string, password: string, name: string): Promise<AuthResponse> {
    const response = await this.request<{ user: User; token: string }>('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email, password, name }),
    });

    if (response.success && response.data) {
      this.setToken(response.data.token);
    }

    return response;
  }

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await this.request<{ user: User; token: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });

    if (response.success && response.data) {
      this.setToken(response.data.token);
    }

    return response;
  }

  async getCurrentUser(): Promise<ApiResponse<{ user: User }>> {
    return this.request('/auth/me');
  }

  logout() {
    this.setToken(null);
  }

  // Materials methods
  async getMaterials(): Promise<ApiResponse<{ materials: Material[] }>> {
    return this.request('/materials');
  }

  async createMaterial(materialData: {
    title: string;
    summary: string;
    flashcards: Array<{ front: string; back: string }>;
    sourceDocument?: string;
  }): Promise<ApiResponse<{ materialId: string; material: Material }>> {
    return this.request('/materials', {
      method: 'POST',
      body: JSON.stringify(materialData),
    });
  }

  async getMaterial(id: string): Promise<ApiResponse<{ material: Material }>> {
    return this.request(`/materials/${id}`);
  }

  async updateMaterial(
    id: string,
    updates: Partial<{
      title: string;
      summary: string;
      flashcards: Array<{ front: string; back: string }>;
      sourceDocument: string;
    }>
  ): Promise<ApiResponse<{ material: Material }>> {
    return this.request(`/materials/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteMaterial(id: string): Promise<ApiResponse> {
    return this.request(`/materials/${id}`, {
      method: 'DELETE',
    });
  }

  // User methods
  async updateProfile(updates: {
    name?: string;
    avatar?: string;
  }): Promise<ApiResponse<{ user: User }>> {
    return this.request('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  }

  async deleteAccount(): Promise<ApiResponse> {
    return this.request('/users/account', {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient();
export default apiClient;