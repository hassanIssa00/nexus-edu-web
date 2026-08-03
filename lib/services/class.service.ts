import api from '../api';

export interface ClassEntity {
    id: string;
    name: string;
    description?: string;
    academicYear?: string;
    teacher?: {
        id: string;
        name: string;
        email: string;
    };
    _count?: {
        students: number;
        subjects: number;
    };
}

export interface CreateClassDto {
    name: string;
    description?: string;
    academicYear?: string;
    teacherId?: string;
}

export const classService = {
    getAll: async () => {
        const response = await api.get<ClassEntity[]>('/classes');
        return response.data;
    },

    getOne: async (id: string) => {
        const response = await api.get<ClassEntity>(`/classes/${id}`);
        return response.data;
    },

    create: async (data: CreateClassDto) => {
        const response = await api.post<ClassEntity>('/classes', data);
        return response.data;
    },

    update: async (id: string, data: Partial<CreateClassDto>) => {
        const response = await api.patch<ClassEntity>(`/classes/${id}`, data);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await api.delete(`/classes/${id}`);
        return response.data;
    },
};
