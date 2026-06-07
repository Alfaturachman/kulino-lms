export interface Module {
    id: string;
    courseId: string;
    title: string;
    weekNo: number;
    type: 'video' | 'pdf' | 'link' | 'ppt';
    contentUrl: string;
    description?: string;
    isPublished: boolean;
}

export interface Assignment {
    id: string;
    courseId: string;
    title: string;
    description: string;
    deadline: string;
    weightPct: number;
    allowedFormats: string[];
    maxSizeMb: number;
}

export interface Submission {
    id: string;
    assignmentId: string;
    studentId: string;
    studentName: string;
    fileUrl: string;
    submittedAt: string;
    isLate: boolean;
    version: number;
    grade?: number;
    feedback?: string;
    gradedAt?: string;
}

export interface CalendarEvent {
    id: string;
    title: string;
    date: string;
    type: 'exam' | 'task' | 'academic';
    courseId?: string;
}

export interface Announcement {
    id: string;
    courseId: string;
    title: string;
    content: string;
    date: string;
    lecturerName: string;
}

export interface Discussion {
    id: string;
    courseId: string;
    title: string;
    content: string;
    authorName: string;
    repliesCount: number;
    date: string;
    replies: DiscussionReply[];
}

export interface DiscussionReply {
    id: string;
    authorName: string;
    content: string;
    date: string;
}
