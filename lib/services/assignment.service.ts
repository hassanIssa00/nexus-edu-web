const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
const getAccessToken = () =>
    localStorage.getItem('access_token') || localStorage.getItem('token');

export interface Assignment {
    id: string;
    title: string;
    description?: string;
    dueDate?: string;
    maxScore: number;
    attachments?: string[];
    subjectId: string;
    subject?: {
        id: string;
        name: string;
        code?: string;
    };
    teacher?: {
        id: string;
        name?: string;
        email: string;
    };
    _count?: {
        submissions: number;
    };
    submission?: Submission | null;
    createdAt: string;
    updatedAt: string;
}

export interface Submission {
    id: string;
    content?: string;
    attachments?: string[];
    score?: number;
    feedback?: string;
    assignmentId: string;
    studentId: string;
    student?: {
        id: string;
        name?: string;
        email: string;
    };
    submittedAt: string;
    gradedAt?: string;
}

export interface CreateAssignmentDto {
    title: string;
    description?: string;
    subjectId: string;
    dueDate?: string;
    maxScore?: number;
    attachments?: string[];
}

export interface SubmitAssignmentDto {
    content?: string;
    attachments?: string[];
}

export interface GradeSubmissionDto {
    score: number;
    feedback?: string;
}

class AssignmentServiceClass {
    async getAll(filters?: { subjectId?: string }): Promise<Assignment[]> {
        const token = getAccessToken();
        const params = new URLSearchParams();

        if (filters?.subjectId) {
            params.append('subjectId', filters.subjectId);
        }

        const response = await fetch(`${API_BASE_URL}/assignments?${params.toString()}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch assignments');
        }

        const json = await response.json();
        return json.data ?? json;
    }

    async getMyAssignments(): Promise<Assignment[]> {
        const token = getAccessToken();

        const response = await fetch(`${API_BASE_URL}/assignments/my`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch my assignments');
        }

        const json = await response.json();
        return json.data ?? json;
    }

    async getStudentAssignments(): Promise<Assignment[]> {
        const token = getAccessToken();

        const response = await fetch(`${API_BASE_URL}/assignments/student`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch student assignments');
        }

        const json = await response.json();
        return json.data ?? json;
    }

    async getById(id: string): Promise<Assignment> {
        const token = getAccessToken();

        const response = await fetch(`${API_BASE_URL}/assignments/${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch assignment');
        }

        const json = await response.json();
        return json.data ?? json;
    }

    async create(data: CreateAssignmentDto): Promise<Assignment> {
        const token = getAccessToken();

        const response = await fetch(`${API_BASE_URL}/assignments`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to create assignment');
        }

        const json = await response.json();
        return json.data ?? json;
    }

    async update(id: string, data: Partial<CreateAssignmentDto>): Promise<Assignment> {
        const token = getAccessToken();

        const response = await fetch(`${API_BASE_URL}/assignments/${id}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to update assignment');
        }

        const json = await response.json();
        return json.data ?? json;
    }

    async delete(id: string): Promise<void> {
        const token = getAccessToken();

        const response = await fetch(`${API_BASE_URL}/assignments/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error('Failed to delete assignment');
        }
    }

    async submit(id: string, data: SubmitAssignmentDto): Promise<Submission> {
        const token = getAccessToken();

        const response = await fetch(`${API_BASE_URL}/assignments/${id}/submit`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to submit assignment');
        }

        const json = await response.json();
        return json.data ?? json;
    }

    async getSubmissions(assignmentId: string): Promise<Submission[]> {
        const token = getAccessToken();

        const response = await fetch(`${API_BASE_URL}/assignments/${assignmentId}/submissions`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        });

        if (!response.ok) {
            throw new Error('Failed to fetch submissions');
        }

        const json = await response.json();
        return json.data ?? json;
    }

    async gradeSubmission(submissionId: string, data: GradeSubmissionDto): Promise<Submission> {
        const token = getAccessToken();

        const response = await fetch(`${API_BASE_URL}/assignments/submissions/${submissionId}/grade`, {
            method: 'PATCH',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Failed to grade submission');
        }

        const json = await response.json();
        return json.data ?? json;
    }
}

export const assignmentService = new AssignmentServiceClass();
