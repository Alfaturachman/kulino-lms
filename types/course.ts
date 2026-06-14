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
    lecturer: string;
    description: string;
    status: 'active' | 'completed';
    icon: LucideIcon;
}
