import api from '../api';

export interface SubjectEntity {
    id: string;
    name: string;
    code?: string;
    description?: string;
    classId: string;
    class?: {
        name: string;
    };
    teacher?: {
        id: string;
        name: string;
        email: string;
    };
    _count?: {
        lessons: number;
        assignments: number;
    };
}

export interface CreateSubjectDto {
    name: string;
    code?: string;
    description?: string;
    classId: string;
    teacherId?: string;
}

export const subjectService = {
    getAll: async () => {
        const response = await api.get<any>('/subjects');
        return response.data?.data ?? response.data;
    },

    getOne: async (id: string) => {
        const response = await api.get<any>(`/subjects/${id}`);
        return response.data?.data ?? response.data;
    },

    create: async (data: CreateSubjectDto) => {
        const response = await api.post<any>('/subjects', data);
        return response.data?.data ?? response.data;
    },

    update: async (id: string, data: Partial<CreateSubjectDto>) => {
        const response = await api.patch<any>(`/subjects/${id}`, data);
        return response.data?.data ?? response.data;
    },

    delete: async (id: string) => {
        const response = await api.delete<any>(`/subjects/${id}`);
        return response.data?.data ?? response.data;
    },
};
