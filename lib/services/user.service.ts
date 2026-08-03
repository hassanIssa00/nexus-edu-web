const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface User {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    name?: string;
    role: 'STUDENT' | 'TEACHER' | 'PARENT' | 'ADMIN';
    phone?: string;
    isActive?: boolean;
    emailVerified?: boolean;
    createdAt: string;
    updatedAt?: string;
}

export interface CreateUserDto {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
    role: 'STUDENT' | 'TEACHER' | 'PARENT' | 'ADMIN';
    phone?: string;
}

export interface UpdateUserDto {
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    role?: 'STUDENT' | 'TEACHER' | 'PARENT' | 'ADMIN';
    phone?: string;
    isActive?: boolean;
}

export interface UserStats {
    total: number;
    students: number;
    teachers: number;
    parents: number;
    admins: number;
}

class UserService {
    async getAll(filters?: { role?: string; search?: string; page?: number; limit?: number }) {
        const token = localStorage.getItem('token');
        const params = new URLSearchParams();

        if (filters?.role) params.append('role', filters.role);
        if (filters?.search) params.append('search', filters.search);
        if (filters?.page) params.append('page', filters.page.toString());
        if (filters?.limit) params.append('limit', filters.limit.toString());

        const response = await fetch(`${API_BASE_URL}/users?${params.toString()}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) throw new Error('Failed to fetch users');
        return response.json();
    }

    async getById(id: string): Promise<User> {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/users/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) throw new Error('Failed to fetch user');
        return response.json();
    }

    async create(data: CreateUserDto): Promise<User> {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/users`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create user');
        }
        return response.json();
    }

    async update(id: string, data: UpdateUserDto): Promise<User> {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/users/${id}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) throw new Error('Failed to update user');
        return response.json();
    }

    async delete(id: string): Promise<void> {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/users/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) throw new Error('Failed to delete user');
    }

    async getStats(): Promise<UserStats> {
        const token = localStorage.getItem('token');
        const response = await fetch(`${API_BASE_URL}/users/stats`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) throw new Error('Failed to fetch stats');
        return response.json();
    }
}

export const userService = new UserService();
