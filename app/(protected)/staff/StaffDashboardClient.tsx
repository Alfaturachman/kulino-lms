"use client";

import { useState } from "react";
import { useAuthStore } from "@/store/auth";
import { mockCourses } from "@/data/courses";
import { mockUsers } from "@/data/users";
import { Course } from "@/types/course";
import { User } from "@/types/auth";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  BookOpen,
  Users,
  UserCheck,
  UserPlus,
  Plus,
  Search,
  CheckCircle,
  FileSpreadsheet,
  ChevronRight,
  RefreshCw,
} from "lucide-react";

interface StaffDashboardClientProps {
  initialTab: string;
}

interface Enrollment {
  courseId: string;
  studentId: string;
  studentName: string;
  nim: string;
}

interface CsvPreviewRow {
  no: number;
  nim: string;
  name: string;
  target: string;
}

interface CsvImportReport {
  total: number;
  success: number;
  failed: number;
  duplicate: number;
}

export default function StaffDashboardClient({
  initialTab,
}: StaffDashboardClientProps) {
  const { user } = useAuthStore();
  const staffName = user?.name || "Siti Rahma";

  // State arrays copied from mocks
  const [courses, setCourses] = useState<Course[]>(mockCourses);
  const [systemUsers, setSystemUsers] = useState<User[]>([
    ...mockUsers,
    { id: "STU-002", name: "Citra Kirana", email: "citra@mhs.dinus.ac.id", role: "mahasiswa", nim_nip: "220102002" },
    { id: "STU-003", name: "Bima Sakti", email: "bima@mhs.dinus.ac.id", role: "mahasiswa", nim_nip: "220102005" },
    { id: "STU-004", name: "Dewi Ayu", email: "dewi@mhs.dinus.ac.id", role: "mahasiswa", nim_nip: "220102078" },
    { id: "STU-005", name: "Galih Prasetya", email: "galih@mhs.dinus.ac.id", role: "mahasiswa", nim_nip: "220102044" },
  ]);

  // Lecturer list
  const lecturers = ["Dr. Budi Santoso", "Dr. Siti Rahmawati", "Dr. Ahmad Hidayat", "Dr. Dewi Lestari", "Dr. Rudi Hartono"];

  // Course Enrollments state (mock data mapping students to classes)
  const [enrollments, setEnrollments] = useState<Enrollment[]>([
    { courseId: "CS-101", studentId: "STU-001", studentName: "Ahmad Fauzi", nim: "220102001" },
    { courseId: "CS-101", studentId: "STU-002", studentName: "Citra Kirana", nim: "220102002" },
    { courseId: "CS-101", studentId: "STU-003", studentName: "Bima Sakti", nim: "220102005" },
    { courseId: "CS-102", studentId: "STU-001", studentName: "Ahmad Fauzi", nim: "220102001" },
    { courseId: "CS-102", studentId: "STU-004", studentName: "Dewi Ayu", nim: "220102078" },
    { courseId: "CS-103", studentId: "STU-001", studentName: "Ahmad Fauzi", nim: "220102001" },
    { courseId: "CS-103", studentId: "STU-005", studentName: "Galih Prasetya", nim: "220102044" },
  ]);

  // Search filter
  const [courseSearch, setCourseSearch] = useState("");

  // Add course form
  const [newCourseName, setNewCourseName] = useState("");
  const [newCourseCode, setNewCourseCode] = useState("");
  const [newCourseClass, setNewCourseClass] = useState("TI-3A");
  const [newCourseSks, setNewCourseSks] = useState("3");
  const [newCourseLecturer, setNewCourseLecturer] = useState(lecturers[0]);
  const [courseSuccessMessage, setCourseSuccessMessage] = useState("");

  // Student Enrollment selection
  const [selectedCourseId, setSelectedCourseId] = useState("CS-101");
  const [selectedStudentId, setSelectedStudentId] = useState("");

  // CSV Import simulation
  const [csvFileSelected, setCsvFileSelected] = useState(false);
  const [csvFileName, setCsvFileName] = useState("");
  const [csvPreviewData, setCsvPreviewData] = useState<CsvPreviewRow[]>([]);
  const [csvImportProgress, setCsvImportProgress] = useState(0);
  const [csvImporting, setCsvImporting] = useState(false);
  const [csvImportReport, setCsvImportReport] = useState<CsvImportReport | null>(null);

  // Individual registration form
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regRole, setRegRole] = useState<"mahasiswa" | "dosen">("mahasiswa");
  const [regNimNip, setRegNimNip] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regSuccessMessage, setRegSuccessMessage] = useState("");

  // Get enrolled students for current selected course
  const currentCourseEnrollments = enrollments.filter((e) => e.courseId === selectedCourseId);

  // Get students NOT enrolled in current selected course
  const availableStudentsForEnroll = systemUsers.filter(
    (u) =>
      u.role === "mahasiswa" &&
      !currentCourseEnrollments.some((e) => e.studentId === u.id)
  );

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseName || !newCourseCode) return;

    // We import Lucide icons dynamically to assign to new courses
    const newCourse: Course = {
      id: `CS-${Date.now()}`,
      name: newCourseName,
      code: newCourseCode,
      class_name: newCourseClass,
      semester: "Ganjil 2025/2026",
      sks: parseInt(newCourseSks),
      lecturer: newCourseLecturer,
      description: `Mata kuliah ${newCourseName} kelas ${newCourseClass} semester Ganjil.`,
      status: "active",
      icon: BookOpen,
    };

    setCourses((prev) => [newCourse, ...prev]);
    setNewCourseName("");
    setNewCourseCode("");
    setCourseSuccessMessage("Mata kuliah baru berhasil didaftarkan ke sistem!");
    setTimeout(() => setCourseSuccessMessage(""), 3000);
  };

  const handleEnrollStudent = () => {
    if (!selectedStudentId || !selectedCourseId) return;

    const studentDetail = systemUsers.find((u) => u.id === selectedStudentId);
    if (!studentDetail) return;

    const newEnroll: Enrollment = {
      courseId: selectedCourseId,
      studentId: selectedStudentId,
      studentName: studentDetail.name,
      nim: studentDetail.nim_nip || "220102xxx",
    };

    setEnrollments((prev) => [...prev, newEnroll]);
    setSelectedStudentId("");
  };

  const handleUnenrollStudent = (studentId: string) => {
    setEnrollments((prev) =>
      prev.filter((e) => !(e.courseId === selectedCourseId && e.studentId === studentId))
    );
  };

  // Move student between classes (TI-3A <-> TI-3B mockup)
  const handleMoveClass = (studentId: string) => {
    const activeEnrollment = enrollments.find(
      (e) => e.courseId === selectedCourseId && e.studentId === studentId
    );
    if (!activeEnrollment) return;

    const currentCourse = courses.find((c) => c.id === selectedCourseId);
    if (!currentCourse) return;

    // Find the equivalent course code in a different class
    const otherClassCourse = courses.find(
      (c) => c.code === currentCourse.code && c.id !== currentCourse.id
    );

    if (otherClassCourse) {
      setEnrollments((prev) =>
        prev.map((e) => {
          if (e.courseId === selectedCourseId && e.studentId === studentId) {
            return {
              ...e,
              courseId: otherClassCourse.id,
            };
          }
          return e;
        })
      );
      alert(`Berhasil memindahkan kelas ${activeEnrollment.studentName} ke ${otherClassCourse.class_name}`);
    } else {
      alert("Tidak ditemukan kelas paralel (paralel class) untuk mata kuliah ini di database.");
    }
  };

  // CSV bulk import simulation
  const handleCsvSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setCsvFileName(file.name);
      setCsvFileSelected(true);
      setCsvImportReport(null);

      // Simulate parsing
      setCsvPreviewData([
        { no: 1, nim: "220102010", name: "Eka Saputra", target: "Pemrograman Web (CS-101)" },
        { no: 2, nim: "220102011", name: "Fajar Bahari", target: "Pemrograman Web (CS-101)" },
        { no: 3, nim: "220102012", name: "Gita Lestari", target: "Pemrograman Web (CS-101)" },
        { no: 4, nim: "220102013", name: "Haris Fadillah", target: "Pemrograman Web (CS-101)" },
      ]);
    }
  };

  const handleProcessCsvImport = async () => {
    setCsvImporting(true);
    setCsvImportProgress(10);

    for (let p = 25; p <= 100; p += 25) {
      await new Promise((r) => setTimeout(r, 250));
      setCsvImportProgress(p);
    }

    // Add these students to system users and enrollments
    const newStudents: User[] = [
      { id: "STU-CSV-1", name: "Eka Saputra", email: "eka@mhs.dinus.ac.id", role: "mahasiswa", nim_nip: "220102010" },
      { id: "STU-CSV-2", name: "Fajar Bahari", email: "fajar@mhs.dinus.ac.id", role: "mahasiswa", nim_nip: "220102011" },
      { id: "STU-CSV-3", name: "Gita Lestari", email: "gita@mhs.dinus.ac.id", role: "mahasiswa", nim_nip: "220102012" },
      { id: "STU-CSV-4", name: "Haris Fadillah", email: "haris@mhs.dinus.ac.id", role: "mahasiswa", nim_nip: "220102013" },
    ];

    setSystemUsers((prev) => [...prev, ...newStudents]);

    const newEnrolls: Enrollment[] = newStudents.map((s) => ({
      courseId: "CS-101",
      studentId: s.id,
      studentName: s.name,
      nim: s.nim_nip || "",
    }));

    setEnrollments((prev) => [...prev, ...newEnrolls]);
    setCsvImporting(false);
    setCsvImportReport({
      total: 4,
      success: 4,
      failed: 0,
      duplicate: 0,
    });
    setCsvFileSelected(false);
    setCsvFileName("");
    setCsvPreviewData([]);
    setCsvImportProgress(0);
  };

  const handleRegisterIndividual = (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName || !regEmail || !regNimNip) return;

    const newUser: User = {
      id: `${regRole.toUpperCase()}-${Date.now()}`,
      name: regName,
      email: regEmail,
      role: regRole,
      nim_nip: regNimNip,
      phone: regPhone,
    };

    setSystemUsers((prev) => [newUser, ...prev]);
    setRegName("");
    setRegEmail("");
    setRegNimNip("");
    setRegPhone("");
    setRegSuccessMessage(`Pengguna dengan nama ${regName} berhasil didaftarkan!`);
    setTimeout(() => setRegSuccessMessage(""), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      {initialTab === "overview" && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-iris-800 to-iris-600 p-6 text-white md:p-8">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="relative z-10 space-y-2">
            <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-[11px] font-semibold tracking-wide uppercase text-white/95">
              Administrasi Tata Usaha (TU)
            </span>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              Selamat datang kembali, {staffName}!
            </h1>
            <p className="text-[13px] text-white/80 md:text-[14px]">
              NIP: 199002012015012002 &bull; Biro Akademik & Kemahasiswaan &bull; Universitas Dian Nuswantoro
            </p>
          </div>
        </div>
      )}

      {/* Stats row */}
      {initialTab === "overview" && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Card className="flex flex-col justify-between p-5">
            <span className="text-[12px] font-medium text-muted">Total Kelas</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-ink">{courses.length}</span>
              <BookOpen size={20} className="text-iris-500" />
            </div>
            <span className="mt-1 text-[10px] text-muted">Aktif semester ini</span>
          </Card>
          <Card className="flex flex-col justify-between p-5">
            <span className="text-[12px] font-medium text-muted">Total Dosen</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-ink">{lecturers.length}</span>
              <UserCheck size={20} className="text-success" />
            </div>
            <span className="mt-1 text-[10px] text-muted">Terdaftar mengajar</span>
          </Card>
          <Card className="flex flex-col justify-between p-5">
            <span className="text-[12px] font-medium text-muted">Total Mahasiswa</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-ink">{systemUsers.filter(u => u.role === "mahasiswa").length}</span>
              <Users size={20} className="text-warning" />
            </div>
            <span className="mt-1 text-[10px] text-muted">Terdaftar di sistem</span>
          </Card>
          <Card className="flex flex-col justify-between p-5">
            <span className="text-[12px] font-medium text-muted">Total Enrollments</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-ink">{enrollments.length}</span>
              <UserPlus size={20} className="text-accent" />
            </div>
            <span className="mt-1 text-[10px] text-muted">Hubungan kelas-mahasiswa</span>
          </Card>
        </div>
      )}

      {/* Tab Content: Overview (Dashboard) */}
      {initialTab === "overview" && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Recent Courses table */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-[15px] font-bold text-ink">Mata Kuliah Semester Ini</h3>
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[12px] border-collapse">
                  <thead>
                    <tr className="border-b border-border text-muted font-bold bg-surface2/60">
                      <th className="p-3">Kode MK</th>
                      <th className="p-3">Nama Mata Kuliah</th>
                      <th className="p-3">Kelas</th>
                      <th className="p-3 text-center">SKS</th>
                      <th className="p-3">Dosen Pengampu</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {courses.slice(0, 5).map((c) => (
                      <tr key={c.id} className="hover:bg-surface2/30">
                        <td className="p-3 font-mono font-semibold text-muted">{c.code}</td>
                        <td className="p-3 font-bold text-ink">{c.name}</td>
                        <td className="p-3 text-ink2">{c.class_name}</td>
                        <td className="p-3 text-center">{c.sks} SKS</td>
                        <td className="p-3 text-ink2">{c.lecturer}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Quick link panel */}
          <Card className="p-5 h-fit space-y-4">
            <h3 className="text-[13px] font-bold text-ink uppercase tracking-wider pb-2 border-b border-border">
              Panduan Akses Cepat
            </h3>
            <div className="space-y-2.5">
              <button
                onClick={() => {
                  const url = new URL(window.location.href);
                  url.searchParams.set("tab", "courses");
                  window.history.pushState({}, "", url.toString());
                  window.dispatchEvent(new PopStateEvent("popstate"));
                }}
                className="w-full text-left flex items-center justify-between p-3 rounded-lg border border-border hover:bg-surface2 transition-colors cursor-pointer font-semibold text-ink text-[12px]"
              >
                <span>Daftarkan Kelas/Course Baru</span>
                <ChevronRight size={15} className="text-muted" />
              </button>
              <button
                onClick={() => {
                  const url = new URL(window.location.href);
                  url.searchParams.set("tab", "users");
                  window.history.pushState({}, "", url.toString());
                  window.dispatchEvent(new PopStateEvent("popstate"));
                }}
                className="w-full text-left flex items-center justify-between p-3 rounded-lg border border-border hover:bg-surface2 transition-colors cursor-pointer font-semibold text-ink text-[12px]"
              >
                <span>Kelola Registrasi Peserta Kelas</span>
                <ChevronRight size={15} className="text-muted" />
              </button>
            </div>
          </Card>
        </div>
      )}

      {/* Tab: Courses (Add Course / CRUD) */}
      {initialTab === "courses" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Courses List */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[15px] font-bold text-ink">Daftar Seluruh Mata Kuliah</h3>
              <div className="flex items-center gap-2 bg-surface border border-border rounded-lg px-3 py-1.5 w-60">
                <Search size={14} className="text-muted shrink-0" />
                <input
                  type="text"
                  placeholder="Cari kelas..."
                  className="bg-transparent border-0 outline-none text-[12px] text-ink placeholder:text-muted w-full"
                  value={courseSearch}
                  onChange={(e) => setCourseSearch(e.target.value)}
                />
              </div>
            </div>

            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[12px] border-collapse">
                  <thead>
                    <tr className="border-b border-border text-muted font-bold bg-surface2/60">
                      <th className="p-3">Kode</th>
                      <th className="p-3">Nama Kelas</th>
                      <th className="p-3">Kelas</th>
                      <th className="p-3 text-center">SKS</th>
                      <th className="p-3">Dosen</th>
                      <th className="p-3 text-right">Tindakan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {courses
                      .filter(
                        (c) =>
                          c.name.toLowerCase().includes(courseSearch.toLowerCase()) ||
                          c.code.toLowerCase().includes(courseSearch.toLowerCase())
                      )
                      .map((c) => (
                        <tr key={c.id} className="hover:bg-surface2/30">
                          <td className="p-3 font-mono font-semibold text-muted">{c.code}</td>
                          <td className="p-3 font-bold text-ink">{c.name}</td>
                          <td className="p-3 text-ink2">{c.class_name}</td>
                          <td className="p-3 text-center">{c.sks} SKS</td>
                          <td className="p-3 text-ink2">{c.lecturer}</td>
                          <td className="p-3 text-right">
                            <button
                              onClick={() => setCourses((prev) => prev.filter((item) => item.id !== c.id))}
                              className="text-danger hover:underline font-bold text-[11px] cursor-pointer"
                            >
                              Hapus
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Add Course Form */}
          <Card className="p-5 h-fit space-y-4">
            <h3 className="text-[13px] font-bold text-ink uppercase tracking-wider pb-2 border-b border-border">
              Tambah Kelas Baru
            </h3>
            
            {courseSuccessMessage && (
              <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-3 rounded-lg text-[12px] flex items-center gap-2">
                <CheckCircle size={16} className="text-success" /> {courseSuccessMessage}
              </div>
            )}

            <form onSubmit={handleAddCourse} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="c-name">Nama Mata Kuliah</Label>
                <Input
                  id="c-name"
                  placeholder="Contoh: Pemrograman Mobile"
                  value={newCourseName}
                  onChange={(e) => setNewCourseName(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="c-code">Kode MK</Label>
                  <Input
                    id="c-code"
                    placeholder="TI402"
                    value={newCourseCode}
                    onChange={(e) => setNewCourseCode(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="c-class">Nama Kelas</Label>
                  <Input
                    id="c-class"
                    placeholder="TI-3A"
                    value={newCourseClass}
                    onChange={(e) => setNewCourseClass(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="c-sks">Jumlah SKS</Label>
                  <Input
                    id="c-sks"
                    type="number"
                    value={newCourseSks}
                    onChange={(e) => setNewCourseSks(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="c-lecturer">Dosen Pengampu</Label>
                  <select
                    id="c-lecturer"
                    value={newCourseLecturer}
                    onChange={(e) => setNewCourseLecturer(e.target.value)}
                    className="w-full h-10 border border-border rounded-lg px-3 py-2 text-[13px] bg-white outline-none focus:border-iris-500 focus:ring-3 focus:ring-iris-500/10"
                  >
                    {lecturers.map((lect, idx) => (
                      <option key={idx} value={lect}>{lect}</option>
                    ))}
                  </select>
                </div>
              </div>

              <Button type="submit" className="w-full gap-2 cursor-pointer">
                <Plus size={15} /> Buat Kelas Baru
              </Button>
            </form>
          </Card>
        </div>
      )}

      {/* Tab: Users (Student Enrollment) */}
      {initialTab === "users" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Enrolled Students list */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-surface p-4 border border-border rounded-xl">
              <div className="space-y-1">
                <Label htmlFor="select-course-enroll">Pilih Kelas</Label>
                <select
                  id="select-course-enroll"
                  value={selectedCourseId}
                  onChange={(e) => setSelectedCourseId(e.target.value)}
                  className="w-64 h-10 border border-border rounded-lg px-3 py-2 text-[13px] bg-white outline-none focus:border-iris-500 focus:ring-3 focus:ring-iris-500/10"
                >
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>{c.name} ({c.class_name})</option>
                  ))}
                </select>
              </div>
              <div className="self-end sm:self-center">
                <Badge variant="blue">{currentCourseEnrollments.length} Peserta Kuliah</Badge>
              </div>
            </div>

            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[12px] border-collapse">
                  <thead>
                    <tr className="border-b border-border text-muted font-bold bg-surface2/60">
                      <th className="p-3">Nama Mahasiswa</th>
                      <th className="p-3">NIM</th>
                      <th className="p-3 text-right">Tindakan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {currentCourseEnrollments.length > 0 ? (
                      currentCourseEnrollments.map((std) => (
                        <tr key={std.studentId} className="hover:bg-surface2/30">
                          <td className="p-3 font-bold text-ink">{std.studentName}</td>
                          <td className="p-3 font-mono text-muted">{std.nim}</td>
                          <td className="p-3 text-right space-x-3">
                            <button
                              onClick={() => handleMoveClass(std.studentId)}
                              className="text-iris-600 hover:underline font-semibold cursor-pointer"
                            >
                              Pindahkan Kelas
                            </button>
                            <button
                              onClick={() => handleUnenrollStudent(std.studentId)}
                              className="text-danger hover:underline font-semibold cursor-pointer"
                            >
                              Keluarkan
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={3} className="text-center py-6 text-muted text-[12px]">
                          Belum ada mahasiswa terdaftar di kelas ini.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Add student to selected course */}
          <Card className="p-5 h-fit space-y-4">
            <h3 className="text-[13px] font-bold text-ink uppercase tracking-wider pb-2 border-b border-border">
              Daftarkan Mahasiswa
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="student-select">Pilih Mahasiswa</Label>
                <select
                  id="student-select"
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full h-10 border border-border rounded-lg px-3 py-2 text-[13px] bg-white outline-none focus:border-iris-500 focus:ring-3 focus:ring-iris-500/10"
                >
                  <option value="">-- Pilih Mahasiswa --</option>
                  {availableStudentsForEnroll.map((std) => (
                    <option key={std.id} value={std.id}>{std.name} ({std.nim_nip})</option>
                  ))}
                </select>
              </div>

              <Button
                onClick={handleEnrollStudent}
                disabled={!selectedStudentId}
                className="w-full gap-2 cursor-pointer"
              >
                <UserPlus size={15} /> Daftarkan Mahasiswa
              </Button>
              
              <div className="border-t border-border/80 pt-3 text-[11px] text-muted leading-relaxed">
                Hanya menampilkan mahasiswa yang belum terdaftar di kelas **{courses.find((c) => c.id === selectedCourseId)?.name}** saat ini.
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Tab: Register (Individual / Bulk Enrollment) */}
      {initialTab === "register" && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Individual Register Form */}
          <Card className="p-6 space-y-4">
            <h3 className="text-[14px] font-bold text-ink uppercase tracking-wider pb-2 border-b border-border flex items-center gap-2">
              <UserPlus size={18} className="text-iris-500" /> Registrasi Akun Baru
            </h3>
            
            {regSuccessMessage && (
              <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-3 rounded-lg text-[12px] flex items-center gap-2">
                <CheckCircle size={16} className="text-success" /> {regSuccessMessage}
              </div>
            )}

            <form onSubmit={handleRegisterIndividual} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="reg-name">Nama Lengkap</Label>
                <Input
                  id="reg-name"
                  placeholder="Contoh: Eka Saputra"
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="reg-email">Email Akademik</Label>
                <Input
                  id="reg-email"
                  type="email"
                  placeholder="eka@mhs.dinus.ac.id"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="reg-role">Peran (Role)</Label>
                  <select
                    id="reg-role"
                    value={regRole}
                    onChange={(e) => setRegRole(e.target.value as "mahasiswa" | "dosen")}
                    className="w-full h-10 border border-border rounded-lg px-3 py-2 text-[13px] bg-white outline-none focus:border-iris-500 focus:ring-3 focus:ring-iris-500/10"
                  >
                    <option value="mahasiswa">Mahasiswa</option>
                    <option value="dosen">Dosen</option>
                  </select>
                </div>
                
                <div className="space-y-1.5">
                  <Label htmlFor="reg-nim">NIM / NIP</Label>
                  <Input
                    id="reg-nim"
                    placeholder="220102010"
                    value={regNimNip}
                    onChange={(e) => setRegNimNip(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="reg-phone">No Telepon / WhatsApp</Label>
                <Input
                  id="reg-phone"
                  placeholder="08123456789"
                  value={regPhone}
                  onChange={(e) => setRegPhone(e.target.value)}
                />
              </div>

              <Button type="submit" className="w-full cursor-pointer">
                Registrasikan Pengguna
              </Button>
            </form>
          </Card>

          {/* Bulk Enrollment via CSV Mock */}
          <Card className="p-6 space-y-4 flex flex-col justify-between">
            <div>
              <h3 className="text-[14px] font-bold text-ink uppercase tracking-wider pb-2 border-b border-border flex items-center gap-2">
                <FileSpreadsheet size={18} className="text-success" /> Bulk Enrollment (Unggah CSV)
              </h3>
              
              <p className="text-[12px] text-muted leading-relaxed mt-3">
                Daftarkan mahasiswa ke kelas secara massal dengan mengunggah file spreadsheet berformat `.csv`. Format kolom: `nim`, `nama_lengkap`, `kelas_id`.
              </p>

              {csvImportReport && (
                <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-4 rounded-xl text-[12px] space-y-2 mt-4">
                  <div className="flex items-center gap-2 font-bold text-[13px]">
                    <CheckCircle size={17} className="text-success" /> Rekapitulasi Bulk Import Sukses!
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-1">
                    <p>Total Baris: <span className="font-semibold text-ink">{csvImportReport.total}</span></p>
                    <p>Sukses Terdaftar: <span className="font-semibold text-success">{csvImportReport.success}</span></p>
                    <p>Duplikat / Gagal: <span className="font-semibold text-danger">{csvImportReport.failed}</span></p>
                  </div>
                </div>
              )}

              <div className="space-y-3 mt-4">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="csv-selector">Pilih Berkas CSV</Label>
                  <Input
                    id="csv-selector"
                    type="file"
                    accept=".csv"
                    onChange={handleCsvSelect}
                    disabled={csvImporting}
                    className="bg-white"
                  />
                  {csvFileSelected && (
                    <p className="text-[11px] text-muted">
                      Berkas terpilih: <span className="font-semibold text-ink">{csvFileName}</span>
                    </p>
                  )}
                </div>

                {csvPreviewData.length > 0 && (
                  <div className="space-y-2 pt-2 border-t border-border/60">
                    <h4 className="text-[11px] font-bold text-ink uppercase tracking-wider">Preview Data (4 Mahasiswa)</h4>
                    <div className="max-h-32 overflow-y-auto border border-border rounded-lg text-[11px]">
                      <table className="w-full text-left">
                        <thead className="bg-surface2 sticky top-0 font-bold border-b border-border">
                          <tr>
                            <th className="p-2">NIM</th>
                            <th className="p-2">Nama</th>
                            <th className="p-2">Tujuan Kelas</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-border/60">
                          {csvPreviewData.map((row, idx) => (
                            <tr key={idx}>
                              <td className="p-2 font-mono">{row.nim}</td>
                              <td className="p-2">{row.name}</td>
                              <td className="p-2 text-muted">{row.target}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {csvImporting && (
                  <div className="space-y-1.5">
                    <div className="h-2 w-full bg-border rounded-full overflow-hidden">
                      <div
                        className="h-full bg-iris-500 rounded-full transition-all duration-300"
                        style={{ width: `${csvImportProgress}%` }}
                      ></div>
                    </div>
                    <p className="text-[10px] text-center text-muted font-semibold">Mengimpor... {csvImportProgress}%</p>
                  </div>
                )}
              </div>
            </div>

            <Button
              onClick={handleProcessCsvImport}
              disabled={csvPreviewData.length === 0 || csvImporting}
              className="mt-6 cursor-pointer"
            >
              {csvImporting ? (
                <>
                  <RefreshCw className="animate-spin size-4 shrink-0 mr-1.5" /> Sedang Memproses...
                </>
              ) : (
                "Proses Bulk Import"
              )}
            </Button>
          </Card>
        </div>
      )}
    </div>
  );
}
