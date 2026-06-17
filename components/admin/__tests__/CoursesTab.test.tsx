import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CoursesTab } from '../CoursesTab';
import { Course } from '@/types/course';
import { User } from '@/types/auth';
import { BookOpen } from 'lucide-react';

// Mock data
const mockCourses: Course[] = [
    {
        id: 'course-1',
        name: 'Pemrograman Web',
        code: 'TI301',
        sks: 3,
        lecturer: 'Dr. Budi Santoso',
        class_name: 'TI-3A',
        semester: 'Ganjil 2025/2026',
        description: 'Mata kuliah Pemrograman Web',
        status: 'active',
        icon: BookOpen,
    },
    {
        id: 'course-2',
        name: 'Basis Data',
        code: 'TI202',
        sks: 3,
        lecturer: 'Dr. Siti Rahmawati',
        class_name: 'TI-3B',
        semester: 'Ganjil 2025/2026',
        description: 'Mata kuliah Basis Data',
        status: 'active',
        icon: BookOpen,
    },
];

const mockStudents: User[] = [
    {
        id: 'student-1',
        name: 'Ahmad Hidayat',
        email: 'ahmad@mhs.dinus.ac.id',
        nim_nip: 'A11.2022.14000',
        role: 'mahasiswa',
    },
    {
        id: 'student-2',
        name: 'Siti Aminah',
        email: 'siti@mhs.dinus.ac.id',
        nim_nip: 'A11.2022.14001',
        role: 'mahasiswa',
    },
];

const mockEnrollments = [
    {
        courseId: 'course-1',
        studentId: 'student-1',
        studentName: 'Ahmad Hidayat',
        nim: 'A11.2022.14000',
    },
];

describe('CoursesTab Component', () => {
    const defaultProps = {
        courses: mockCourses,
        students: mockStudents,
        enrollments: mockEnrollments,
        onAddCourse: vi.fn(),
        onDeleteCourse: vi.fn(),
        onEnrollStudent: vi.fn(),
        onUnenrollStudent: vi.fn(),
        showSuccess: vi.fn(),
        showConfirm: vi.fn((msg, callback) => callback()),
    };

    it('renders the course list correctly when activeSideTab is add-course', () => {
        render(<CoursesTab {...defaultProps} />);

        // Primary header should be visible
        expect(screen.getByText('Daftar Mata Kuliah')).toBeInTheDocument();

        // Course data row entries
        expect(screen.getByText('Pemrograman Web')).toBeInTheDocument();
        expect(screen.getByText('TI301')).toBeInTheDocument();
        expect(screen.getAllByText('Dr. Budi Santoso')[0]).toBeInTheDocument();
        expect(screen.getByText('Basis Data')).toBeInTheDocument();
    });

    it('filters courses when search input is typed', () => {
        render(<CoursesTab {...defaultProps} />);

        const searchInput = screen.getByPlaceholderText('Cari kelas...');
        fireEvent.change(searchInput, { target: { value: 'Web' } });

        // Pemrograman Web should be visible
        expect(screen.getByText('Pemrograman Web')).toBeInTheDocument();

        // Basis Data should be hidden due to filter
        expect(screen.queryByText('Basis Data')).not.toBeInTheDocument();
    });

    it('switches to Daftarkan Mahasiswa tab and displays class members', () => {
        render(<CoursesTab {...defaultProps} />);

        const enrollTabButton = screen.getByRole('button', {
            name: 'Daftarkan Mahasiswa',
        });
        fireEvent.click(enrollTabButton);

        // Sidebar state switches, left-hand panel should now show enrolled students
        expect(screen.getByText('Peserta Kelas:')).toBeInTheDocument();
        expect(screen.getByText('Ahmad Hidayat')).toBeInTheDocument();
        expect(screen.getByText('A11.2022.14000')).toBeInTheDocument();

        // The master course list should now be hidden
        expect(
            screen.queryByText('Daftar Mata Kuliah'),
        ).not.toBeInTheDocument();
    });

    it('calls onDeleteCourse when Hapus button is clicked and confirmed', () => {
        render(<CoursesTab {...defaultProps} />);

        const deleteButtons = screen.getAllByRole('button', { name: 'Hapus' });
        fireEvent.click(deleteButtons[0]);

        expect(defaultProps.showConfirm).toHaveBeenCalled();
        expect(defaultProps.onDeleteCourse).toHaveBeenCalledWith('course-1');
    });

    it('calls onUnenrollStudent when Keluarkan button is clicked', () => {
        render(<CoursesTab {...defaultProps} />);

        // Switch to enroll tab first
        fireEvent.click(
            screen.getByRole('button', { name: 'Daftarkan Mahasiswa' }),
        );

        const removeButton = screen.getByRole('button', { name: 'Keluarkan' });
        fireEvent.click(removeButton);

        expect(defaultProps.showConfirm).toHaveBeenCalled();
        expect(defaultProps.onUnenrollStudent).toHaveBeenCalledWith(
            'course-1',
            'student-1',
        );
    });

    it('shows loading indicator when coursesLoading is true', () => {
        render(<CoursesTab {...defaultProps} coursesLoading={true} />);
        expect(screen.getByText('Memuat data kelas...')).toBeInTheDocument();
    });

    it('displays pagination controls and triggers page change callback', () => {
        const onCoursesPageChange = vi.fn();
        render(
            <CoursesTab
                {...defaultProps}
                coursesTotalCount={25}
                coursesCurrentPage={2}
                coursesPageSize={10}
                onCoursesPageChange={onCoursesPageChange}
            />,
        );

        expect(
            screen.getByText((content, element) => {
                const hasText = (node: Element | null) =>
                    node !== null &&
                    node.textContent !== null &&
                    /Menampilkan.*11.*sampai.*20.*dari.*25/.test(node.textContent);
                const elementHasText = hasText(element);
                const childrenWithoutText = Array.from(element?.children || []).every(
                    (child) => !hasText(child)
                );
                return elementHasText && childrenWithoutText;
            })
        ).toBeInTheDocument();

        // Trigger page change to next page (Selanjutnya button)
        const nextButtons = screen.getAllByRole('button', {
            name: 'Selanjutnya',
        });
        // The first is mobile, the second is desktop. Let's click desktop.
        fireEvent.click(nextButtons[1]);

        expect(onCoursesPageChange).toHaveBeenCalledWith(3);
    });

    it('calls onCourseSearchChange when search query is typed and debounced', () => {
        vi.useFakeTimers();
        const onCourseSearchChange = vi.fn();
        render(
            <CoursesTab
                {...defaultProps}
                onCourseSearchChange={onCourseSearchChange}
            />,
        );

        const searchInput = screen.getByPlaceholderText('Cari kelas...');
        fireEvent.change(searchInput, { target: { value: 'Basis Data' } });

        // Shouldn't be called immediately due to debounce
        expect(onCourseSearchChange).not.toHaveBeenCalled();

        // Advance timers by 300ms
        vi.advanceTimersByTime(300);

        expect(onCourseSearchChange).toHaveBeenCalledWith('Basis Data');
        vi.useRealTimers();
    });
});
