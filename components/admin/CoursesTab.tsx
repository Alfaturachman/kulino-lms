'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import { Course } from '@/types/course';
import { User } from '@/types/auth';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    BookOpen,
    Plus,
    Search,
    UserPlus,
    UserMinus,
    CheckCircle,
    GraduationCap,
} from 'lucide-react';
import { SearchableSelect } from '@/components/ui/searchable-select';

interface Enrollment {
    courseId: string;
    studentId: string;
    studentName: string;
    nim: string;
}

interface CoursesTabProps {
    courses: Course[];
    students: User[];
    enrollments: Enrollment[];
    onAddCourse: (data: {
        name: string;
        code: string;
        class_name: string;
        sks: number;
        lecturer: string;
    }) => void;
    onDeleteCourse: (id: string) => void;
    onEnrollStudent: (courseId: string, studentId: string) => void;
    onUnenrollStudent: (courseId: string, studentId: string) => void;
    showSuccess: (title: string, message: string) => void;
    showConfirm?: (
        message: string,
        onConfirm: () => void,
        title?: string,
        variant?: 'danger' | 'warning',
        confirmLabel?: string,
    ) => void;
    coursesTotalCount?: number;
    coursesCurrentPage?: number;
    coursesPageSize?: number;
    onCoursesPageChange?: (page: number) => void;
    coursesLoading?: boolean;
    initialCourseSearch?: string;
    onCourseSearchChange?: (search: string) => void;
    studentsLoading?: boolean;
    onStudentSearchChange?: (search: string) => void;
}

export function CoursesTab({
    courses,
    students,
    enrollments,
    onAddCourse,
    onDeleteCourse,
    onEnrollStudent,
    onUnenrollStudent,
    showSuccess,
    showConfirm,
    coursesTotalCount,
    coursesCurrentPage = 1,
    coursesPageSize = 10,
    onCoursesPageChange,
    coursesLoading = false,
    initialCourseSearch = '',
    onCourseSearchChange,
    studentsLoading = false,
    onStudentSearchChange,
}: CoursesTabProps) {
    const [courseSearch, setCourseSearch] = useState(initialCourseSearch);
    const [newCourseName, setNewCourseName] = useState('');
    const [newCourseCode, setNewCourseCode] = useState('');
    const [newCourseClass, setNewCourseClass] = useState('TI-3A');
    const [newCourseSks, setNewCourseSks] = useState('3');
    const [newCourseLecturer, setNewCourseLecturer] = useState('');
    const [selectedCourseId, setSelectedCourseId] = useState(
        courses[0]?.id || '',
    );
    const [selectedStudentId, setSelectedStudentId] = useState('');
    const [activeSideTab, setActiveSideTab] = useState<'add-course' | 'enroll'>(
        'add-course',
    );

    // Keep selectedCourseId in sync if courses prop changes and current selection is not in list
    useEffect(() => {
        if (courses.length > 0 && !courses.some((c) => c.id === selectedCourseId)) {
            setSelectedCourseId(courses[0].id);
        }
    }, [courses, selectedCourseId]);

    // Debounce course search input
    useEffect(() => {
        if (!onCourseSearchChange) return;
        const handler = setTimeout(() => {
            onCourseSearchChange(courseSearch);
        }, 300);
        return () => clearTimeout(handler);
    }, [courseSearch, onCourseSearchChange]);

    const lecturers = [...new Set(courses.map((c) => c.lecturer))];

    const currentEnrollments = enrollments.filter(
        (e) => e.courseId === selectedCourseId,
    );

    const availableStudents = students.filter(
        (s) =>
            s.role === 'mahasiswa' &&
            !currentEnrollments.some((e) => e.studentId === s.id),
    );

    const courseOptions = courses.map((c) => ({
        value: c.id,
        label: `[${c.code}] ${c.name} - Kelas ${c.class_name} (${c.sks} SKS) - Dosen: ${c.lecturer}`,
    }));

    const studentOptions = availableStudents.map((s) => ({
        value: s.id,
        label: `${s.name} (${s.nim_nip || '-'})`,
    }));

    const confirmDelete = (id: string) => {
        if (showConfirm) {
            showConfirm(
                'Apakah Anda yakin ingin menghapus kelas ini? Semua enrollment terkait juga akan dihapus.',
                () => onDeleteCourse(id),
            );
        } else {
            onDeleteCourse(id);
        }
    };

    const confirmUnenroll = (studentId: string, studentName: string) => {
        if (showConfirm) {
            showConfirm(
                `Apakah Anda yakin ingin mengeluarkan mahasiswa ${studentName} dari kelas ini?`,
                () => onUnenrollStudent(selectedCourseId, studentId),
                'Konfirmasi Keluarkan',
                'danger',
                'Ya, Keluarkan',
            );
        } else {
            onUnenrollStudent(selectedCourseId, studentId);
        }
    };

    const handleAddCourse = (e: React.FormEvent) => {
        e.preventDefault();
        if (!newCourseName || !newCourseCode) return;

        onAddCourse({
            name: newCourseName,
            code: newCourseCode.toUpperCase(),
            class_name: newCourseClass,
            sks: parseInt(newCourseSks),
            lecturer: newCourseLecturer || lecturers[0] || 'Dr. Budi Santoso',
        });

        setNewCourseName('');
        setNewCourseCode('');
        setNewCourseSks('3');
        setNewCourseLecturer('');
        showSuccess(
            'Kelas berhasil ditambahkan!',
            `Mata kuliah ${newCourseName} telah didaftarkan ke sistem.`,
        );
    };

    const handleEnroll = () => {
        if (!selectedStudentId || !selectedCourseId) return;
        onEnrollStudent(selectedCourseId, selectedStudentId);
        setSelectedStudentId('');
    };

    const selectedCourse = courses.find((c) => c.id === selectedCourseId);

    const filteredCourses = onCourseSearchChange
        ? courses
        : courses.filter(
              (c) =>
                  c.name.toLowerCase().includes(courseSearch.toLowerCase()) ||
                  c.code.toLowerCase().includes(courseSearch.toLowerCase()),
          );

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Course List */}
            <div className="lg:col-span-2 space-y-4">
                {activeSideTab === 'add-course' ? (
                    <>
                        <div className="flex items-center justify-between">
                            <h3 className="text-[15px] font-bold text-ink">
                                Daftar Mata Kuliah
                            </h3>
                            <div className="flex items-center gap-2 bg-surface border border-border rounded-lg px-3 py-1.5 w-60">
                                <Search
                                    size={14}
                                    className="text-muted shrink-0"
                                />
                                <input
                                    type="text"
                                    placeholder="Cari kelas..."
                                    className="bg-transparent border-0 outline-none text-[12px] text-ink placeholder:text-muted w-full"
                                    value={courseSearch}
                                    onChange={(e) =>
                                        setCourseSearch(e.target.value)
                                    }
                                />
                            </div>
                        </div>

                        <Card className="overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left text-[12px] border-collapse">
                                    <thead>
                                        <tr className="border-b border-border text-muted font-bold bg-surface2/60">
                                            <th className="p-3">Kode</th>
                                            <th className="p-3">
                                                Nama Mata Kuliah
                                            </th>
                                            <th className="p-3">Kelas</th>
                                            <th className="p-3 text-center">
                                                SKS
                                            </th>
                                            <th className="p-3">Dosen</th>
                                            <th className="p-3 text-right">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-border/60">
                                        {coursesLoading ? (
                                            <tr>
                                                <td
                                                    colSpan={6}
                                                    className="text-center py-12 text-muted text-[13px]"
                                                >
                                                    <div className="flex items-center justify-center gap-2">
                                                        <span className="animate-spin rounded-full h-4 w-4 border-2 border-iris-500 border-t-transparent"></span>
                                                        Memuat data kelas...
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : filteredCourses.length > 0 ? (
                                            filteredCourses.map((c) => (
                                                <tr
                                                    key={c.id}
                                                    className={`hover:bg-surface2/30 cursor-pointer ${
                                                        selectedCourseId ===
                                                        c.id
                                                            ? 'bg-iris-50/40'
                                                            : ''
                                                    }`}
                                                    onClick={() =>
                                                        setSelectedCourseId(
                                                            c.id,
                                                        )
                                                    }
                                                >
                                                    <td className="p-3 font-mono font-semibold text-muted">
                                                        {c.code}
                                                    </td>
                                                    <td className="p-3 font-bold text-ink">
                                                        {c.name}
                                                    </td>
                                                    <td className="p-3 text-ink2">
                                                        {c.class_name}
                                                    </td>
                                                    <td className="p-3 text-center">
                                                        {c.sks} SKS
                                                    </td>
                                                    <td className="p-3 text-ink2">
                                                        {c.lecturer}
                                                    </td>
                                                    <td className="p-3 text-right">
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                confirmDelete(
                                                                    c.id,
                                                                );
                                                            }}
                                                            className="text-danger hover:underline font-bold text-[11px] cursor-pointer"
                                                        >
                                                            Hapus
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td
                                                    colSpan={6}
                                                    className="text-center py-8 text-muted text-[12px]"
                                                >
                                                    {courseSearch
                                                        ? 'Tidak ada kelas yang sesuai dengan pencarian.'
                                                        : 'Belum ada kelas. Buat kelas baru melalui form di samping.'}
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </Card>

                        {/* Pagination Controls */}
                        {coursesTotalCount !== undefined && coursesTotalCount > 0 && (
                            <div className="flex items-center justify-between border-t border-border bg-white px-4 py-3 sm:px-6 mt-3 rounded-lg shadow-sm">
                                <div className="flex flex-1 justify-between sm:hidden">
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => onCoursesPageChange?.(Math.max(1, coursesCurrentPage - 1))}
                                        disabled={coursesCurrentPage <= 1 || coursesLoading}
                                        className="h-8 text-[11px] cursor-pointer"
                                    >
                                        Sebelumnya
                                    </Button>
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={() => onCoursesPageChange?.(Math.min(Math.ceil(coursesTotalCount / coursesPageSize), coursesCurrentPage + 1))}
                                        disabled={coursesCurrentPage >= Math.ceil(coursesTotalCount / coursesPageSize) || coursesLoading}
                                        className="h-8 text-[11px] cursor-pointer"
                                    >
                                        Selanjutnya
                                    </Button>
                                </div>
                                <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                                    <div>
                                        <p className="text-[12px] text-muted">
                                            Menampilkan <span className="font-semibold">{Math.min(coursesTotalCount, (coursesCurrentPage - 1) * coursesPageSize + 1)}</span> sampai{' '}
                                            <span className="font-semibold">{Math.min(coursesTotalCount, coursesCurrentPage * coursesPageSize)}</span> dari{' '}
                                            <span className="font-semibold">{coursesTotalCount}</span> kelas
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-1.5">
                                        <Button
                                            variant="secondary"
                                            className="h-8 px-2 cursor-pointer"
                                            onClick={() => onCoursesPageChange?.(1)}
                                            disabled={coursesCurrentPage <= 1 || coursesLoading}
                                        >
                                            &laquo;
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            className="h-8 px-3 cursor-pointer text-[12px]"
                                            onClick={() => onCoursesPageChange?.(Math.max(1, coursesCurrentPage - 1))}
                                            disabled={coursesCurrentPage <= 1 || coursesLoading}
                                        >
                                            Sebelumnya
                                        </Button>
                                        <span className="text-[12px] font-semibold text-ink px-2">
                                            Hal {coursesCurrentPage} dari {Math.ceil(coursesTotalCount / coursesPageSize)}
                                        </span>
                                        <Button
                                            variant="secondary"
                                            className="h-8 px-3 cursor-pointer text-[12px]"
                                            onClick={() => onCoursesPageChange?.(Math.min(Math.ceil(coursesTotalCount / coursesPageSize), coursesCurrentPage + 1))}
                                            disabled={coursesCurrentPage >= Math.ceil(coursesTotalCount / coursesPageSize) || coursesLoading}
                                        >
                                            Selanjutnya
                                        </Button>
                                        <Button
                                            variant="secondary"
                                            className="h-8 px-2 cursor-pointer"
                                            onClick={() => onCoursesPageChange?.(Math.ceil(coursesTotalCount / coursesPageSize))}
                                            disabled={coursesCurrentPage >= Math.ceil(coursesTotalCount / coursesPageSize) || coursesLoading}
                                        >
                                            &raquo;
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </>
                ) : (
                    <>
                        {/* Enrolled Students */}
                        {selectedCourseId ? (
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-[15px] font-bold text-ink">
                                        Peserta Kelas:{' '}
                                        <span className="text-muted font-normal">
                                            {selectedCourse?.name} (
                                            {selectedCourse?.class_name})
                                        </span>
                                    </h3>
                                    <Badge variant="blue">
                                        {currentEnrollments.length} Mahasiswa
                                    </Badge>
                                </div>

                                <Card className="overflow-hidden">
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-left text-[12px] border-collapse">
                                            <thead>
                                                <tr className="border-b border-border text-muted font-bold bg-surface2/60">
                                                    <th className="p-3">
                                                        Nama Mahasiswa
                                                    </th>
                                                    <th className="p-3">NIM</th>
                                                    <th className="p-3 text-right">
                                                        Aksi
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody className="divide-y divide-border/60">
                                                {currentEnrollments.length >
                                                0 ? (
                                                    currentEnrollments.map(
                                                        (enr) => (
                                                            <tr
                                                                key={
                                                                    enr.studentId
                                                                }
                                                                className="hover:bg-surface2/30"
                                                            >
                                                                <td className="p-3 font-bold text-ink">
                                                                    {
                                                                        enr.studentName
                                                                    }
                                                                </td>
                                                                <td className="p-3 font-mono text-muted">
                                                                    {enr.nim}
                                                                </td>
                                                                <td className="p-3 text-right">
                                                                    <button
                                                                        onClick={() =>
                                                                            confirmUnenroll(
                                                                                enr.studentId,
                                                                                enr.studentName,
                                                                            )
                                                                        }
                                                                        className="text-danger hover:underline font-semibold text-[11px] cursor-pointer inline-flex items-center gap-1"
                                                                    >
                                                                        <UserMinus
                                                                            size={
                                                                                13
                                                                            }
                                                                        />
                                                                        Keluarkan
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        ),
                                                    )
                                                ) : (
                                                    <tr>
                                                        <td
                                                            colSpan={3}
                                                            className="text-center py-8 text-muted text-[12px]"
                                                        >
                                                            Belum ada mahasiswa
                                                            terdaftar di kelas
                                                            ini.
                                                        </td>
                                                    </tr>
                                                )}
                                            </tbody>
                                        </table>
                                    </div>
                                </Card>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center p-12 text-center border border-dashed border-border rounded-lg bg-surface2/30 h-64">
                                <GraduationCap
                                    size={40}
                                    className="text-muted mb-3"
                                />
                                <h4 className="text-[14px] font-bold text-ink">
                                    Belum Ada Kelas Terpilih
                                </h4>
                                <p className="text-[12px] text-muted max-w-sm mt-1">
                                    Silakan pilih salah satu kelas di panel
                                    sebelah kanan untuk melihat dan mengelola
                                    daftar mahasiswa yang terdaftar.
                                </p>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Side Panel */}
            <div className="space-y-4">
                {/* Tab Switcher */}
                <div className="bg-surface2/60 border border-border p-1 rounded-lg flex items-center gap-1 shrink-0">
                    <button
                        type="button"
                        onClick={() => setActiveSideTab('add-course')}
                        className={cn(
                            'flex-1 text-center py-2 rounded-md text-[12px] font-bold transition-all cursor-pointer outline-none',
                            activeSideTab === 'add-course'
                                ? 'bg-white text-iris-500 shadow-sm border border-border/40'
                                : 'text-muted hover:text-ink hover:bg-surface2/40',
                        )}
                    >
                        Tambah Kelas
                    </button>
                    <button
                        type="button"
                        onClick={() => setActiveSideTab('enroll')}
                        className={cn(
                            'flex-1 text-center py-2 rounded-md text-[12px] font-bold transition-all cursor-pointer outline-none',
                            activeSideTab === 'enroll'
                                ? 'bg-white text-iris-500 shadow-sm border border-border/40'
                                : 'text-muted hover:text-ink hover:bg-surface2/40',
                        )}
                    >
                        Daftarkan Mahasiswa
                    </button>
                </div>

                {activeSideTab === 'add-course' ? (
                    /* Add Course Form */
                    <Card className="p-5 space-y-4">
                        <h3 className="text-[13px] font-bold text-ink uppercase tracking-wider pb-2 border-b border-border flex items-center gap-2">
                            <Plus size={16} className="text-iris-500" />
                            Tambah Kelas Baru
                        </h3>

                        <form onSubmit={handleAddCourse} className="space-y-4">
                            <div className="space-y-1.5">
                                <Label htmlFor="ac-name">
                                    Nama Mata Kuliah
                                </Label>
                                <Input
                                    id="ac-name"
                                    placeholder="Contoh: Kecerdasan Buatan"
                                    value={newCourseName}
                                    onChange={(e) =>
                                        setNewCourseName(e.target.value)
                                    }
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <Label htmlFor="ac-code">Kode MK</Label>
                                    <Input
                                        id="ac-code"
                                        placeholder="Contoh: TIF301"
                                        value={newCourseCode}
                                        onChange={(e) =>
                                            setNewCourseCode(e.target.value)
                                        }
                                        required
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="ac-class">Nama Kelas</Label>
                                    <Input
                                        id="ac-class"
                                        placeholder="TI-3A"
                                        value={newCourseClass}
                                        onChange={(e) =>
                                            setNewCourseClass(e.target.value)
                                        }
                                        required
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1.5">
                                    <Label htmlFor="ac-sks">SKS</Label>
                                    <Input
                                        id="ac-sks"
                                        type="number"
                                        min={1}
                                        max={6}
                                        value={newCourseSks}
                                        onChange={(e) =>
                                            setNewCourseSks(e.target.value)
                                        }
                                        required
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <Label htmlFor="ac-lecturer">Dosen</Label>
                                    <select
                                        id="ac-lecturer"
                                        value={newCourseLecturer}
                                        onChange={(e) =>
                                            setNewCourseLecturer(e.target.value)
                                        }
                                        className="w-full h-10 border border-border rounded-lg px-3 py-2 text-[13px] bg-white outline-none focus:border-iris-500 focus:ring-3 focus:ring-iris-500/10"
                                    >
                                        <option value="">
                                            -- Pilih Dosen --
                                        </option>
                                        {lecturers.map((name, idx) => (
                                            <option key={idx} value={name}>
                                                {name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full gap-2 cursor-pointer"
                            >
                                <Plus size={15} /> Buat Kelas Baru
                            </Button>
                        </form>
                    </Card>
                ) : (
                    /* Enroll Student */
                    <Card className="p-5 space-y-4">
                        <h3 className="text-[13px] font-bold text-ink uppercase tracking-wider pb-2 border-b border-border flex items-center gap-2">
                            <GraduationCap
                                size={16}
                                className="text-iris-500"
                            />
                            Daftarkan Mahasiswa
                        </h3>

                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <Label>Pilih Kelas</Label>
                                <SearchableSelect
                                    options={courseOptions}
                                    value={selectedCourseId}
                                    onChange={setSelectedCourseId}
                                    placeholder="-- Pilih Kelas --"
                                    searchPlaceholder="Cari kelas..."
                                    emptyMessage="Tidak ada kelas yang cocok."
                                />
                            </div>

                            {selectedCourseId && (
                                <>
                                    <div className="space-y-1.5">
                                        <Label>Pilih Mahasiswa</Label>
                                        <SearchableSelect
                                            options={studentOptions}
                                            value={selectedStudentId}
                                            onChange={setSelectedStudentId}
                                            placeholder="-- Pilih Mahasiswa --"
                                            searchPlaceholder="Cari nama atau NIM..."
                                            emptyMessage="Tidak ada mahasiswa yang cocok."
                                            onSearchChange={onStudentSearchChange}
                                            loading={studentsLoading}
                                        />
                                    </div>

                                    {availableStudents.length === 0 && (
                                        <p className="text-[11px] text-muted">
                                            Semua mahasiswa sudah terdaftar di
                                            kelas ini.
                                        </p>
                                    )}

                                    <Button
                                        onClick={handleEnroll}
                                        disabled={!selectedStudentId}
                                        className="w-full gap-2 cursor-pointer"
                                    >
                                        <UserPlus size={15} /> Daftarkan
                                        Mahasiswa
                                    </Button>
                                </>
                            )}

                            {!selectedCourseId && (
                                <p className="text-[11px] text-muted">
                                    Pilih kelas terlebih dahulu untuk
                                    mendaftarkan mahasiswa.
                                </p>
                            )}
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
}
