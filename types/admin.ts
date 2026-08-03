export interface AuditLog {
    id: string;
    user_id: string;
    user_name: string;
    action: string;
    ip_address: string | null;
    created_at: string;
}

export interface EnrollmentItem {
    courseId: string;
    studentId: string;
    studentName: string;
    nim: string;
}
