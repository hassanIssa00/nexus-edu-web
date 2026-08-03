export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string
                    email: string
                    full_name: string
                    role: 'student' | 'teacher' | 'parent' | 'admin'
                    phone: string | null
                    avatar_url: string | null
                    bio: string | null
                    is_active: boolean
                    metadata: Json
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    email: string
                    full_name: string
                    role?: 'student' | 'teacher' | 'parent' | 'admin'
                    phone?: string | null
                    avatar_url?: string | null
                    bio?: string | null
                    is_active?: boolean
                    metadata?: Json
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    email?: string
                    full_name?: string
                    role?: 'student' | 'teacher' | 'parent' | 'admin'
                    phone?: string | null
                    avatar_url?: string | null
                    bio?: string | null
                    is_active?: boolean
                    metadata?: Json
                    created_at?: string
                    updated_at?: string
                }
            }
            classes: {
                Row: {
                    id: string
                    school_id: string | null
                    name: string
                    name_ar: string | null
                    description: string | null
                    academic_year: string
                    grade_level: number | null
                    teacher_id: string | null
                    room_number: string | null
                    schedule: Json | null
                    capacity: number
                    is_active: boolean
                    created_at: string
                    updated_at: string
                }
            }
            assignments: {
                Row: {
                    id: string
                    class_id: string
                    subject_id: string | null
                    teacher_id: string
                    title: string
                    description: string | null
                    instructions: string | null
                    due_date: string
                    total_points: number
                    status: 'draft' | 'published' | 'closed'
                    attachment_urls: string[] | null
                    metadata: Json
                    created_at: string
                    updated_at: string
                }
            }
            submissions: {
                Row: {
                    id: string
                    assignment_id: string
                    student_id: string
                    content: string | null
                    attachment_urls: string[] | null
                    submitted_at: string
                    status: 'pending' | 'submitted' | 'graded' | 'late'
                    grade: number | null
                    feedback: string | null
                    graded_at: string | null
                    graded_by: string | null
                    metadata: Json
                    created_at: string
                    updated_at: string
                }
            }
        }
    }
}
