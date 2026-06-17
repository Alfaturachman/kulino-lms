import type { LucideIcon } from 'lucide-react';

export interface Course {
    id: string;
    name: string;
    code: string;
    class_name: string;
    semester: string;
    sks: number;
    teori?: number;
    praktek?: number;
    kelompok_mk?: string;
    day_of_week?: string;
    start_time?: string;
    end_time?: string;
    room?: string;
    lecturer: string;
    description: string;
    status: 'active' | 'completed';
    icon: LucideIcon;
}

