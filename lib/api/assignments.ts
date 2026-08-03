import { apiClient } from './client'

export interface Assignment {
    id: string
    title: string
    description?: string
    dueDate?: string
    maxScore: number
    attachments: string[]
    subjectId: string
    teacherId: string
    createdAt: string
    updatedAt: string
    // Include subject and teacher info if populated
    subject?: {
        id: string
        name: string
    }
    teacher?: {
        id: string
        name: string
    }
}

export interface Submission {
    id: string
    content?: string
    attachments: string[]
    score?: number
    feedback?: string
    assignmentId: string
    studentId: string
    submittedAt: string
    gradedAt?: string
    // Include assignment info if populated
    assignment?: Assignment
}

export interface CreateSubmissionData {
    assignmentId: string
    content?: string
    fileIds: string[] // IDs of uploaded files
}

/**
 * Get all assignments for current user
 */
export async function getAssignments(): Promise<Assignment[]> {
    const response = await apiClient.get<Assignment[]>('/assignments')
    return response.data
}

/**
 * Get a single assignment by ID
 */
export async function getAssignment(id: string): Promise<Assignment> {
    const response = await apiClient.get<Assignment>(`/assignments/${id}`)
    return response.data
}

/**
 * Submit an assignment
 */
export async function submitAssignment(data: CreateSubmissionData): Promise<Submission> {
    const response = await apiClient.post<Submission>(`/assignments/${data.assignmentId}/submit`, {
        content: data.content,
        attachments: data.fileIds,
    })
    return response.data
}

/**
 * Get current user's submissions
 */
export async function getMySubmissions(): Promise<Submission[]> {
    const response = await apiClient.get<Submission[]>('/assignments/student')
    return response.data
}

/**
 * Get submission for a specific assignment
 */
export async function getSubmissionForAssignment(assignmentId: string): Promise<Submission | null> {
    try {
        const response = await apiClient.get<Submission[]>(`/assignments/${assignmentId}/submissions`)
        return response.data[0] ?? null
    } catch (error: any) {
        if (error.response?.status === 404) {
            return null
        }
        throw error
    }
}
