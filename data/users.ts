import type { User } from '@/types/auth';

export const mockUsers: User[] = [
    {
        id: 'STU-001',
        name: 'Ahmad Fauzi',
        email: 'mahasiswa@kulino.id',
        role: 'mahasiswa',
        nim_nip: '220102001',
        phone: '08123456789',
    },
    {
        id: 'LEC-001',
        name: 'Dr. Budi Santoso',
        email: 'dosen@kulino.id',
        role: 'dosen',
        nim_nip: '198501012010011001',
        phone: '08123456780',
    },
    {
        id: 'TU-001',
        name: 'Siti Rahma',
        email: 'tu@kulino.id',
        role: 'tu',
        nim_nip: '199002012015012002',
        phone: '08123456781',
    },
    {
        id: 'ADM-001',
        name: 'Prof. Hendra Wijaya',
        email: 'admin@kulino.id',
        role: 'admin',
        nim_nip: '197503121999031003',
        phone: '08123456782',
    },
];
