"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuthStore } from "@/store/auth";
import { mockCourses } from "@/data/courses";
import { mockAnnouncements, mockAssignments, mockSubmissions } from "@/data/mockData";
import type { Submission, Announcement } from "@/types/academic";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  BookOpen,
  Users,
  CheckCircle,
  FileCheck,
  Megaphone,
  BarChart3,
  ArrowRight,
  Plus,
  Clock,
  Check,
  AlertCircle,
  TrendingUp,
} from "lucide-react";

interface LecturerDashboardClientProps {
  initialTab: string;
}

interface UngradedSubmission {
  id: string;
  studentName: string;
  nim: string;
  courseName: string;
  assignmentTitle: string;
  fileName: string;
  submittedAt: string;
  grade?: number;
  feedback?: string;
  status: "pending" | "graded";
}

export default function LecturerDashboardClient({
  initialTab,
}: LecturerDashboardClientProps) {
  const { user } = useAuthStore();
  const lecturerName = user?.name || "Dr. Budi Santoso";

  // Filter courses taught by this lecturer
  const lecturerCourses = mockCourses.filter((c) => c.lecturer === lecturerName);

  // Initial mock list of student submissions for this lecturer's classes
  const [submissions, setSubmissions] = useState<UngradedSubmission[]>([
    {
      id: "SUB-MOCK-002",
      studentName: "Citra Kirana",
      nim: "220102002",
      courseName: "Pemrograman Web",
      assignmentTitle: "Tugas 1: Membuat Halaman Portofolio Pribadi",
      fileName: "portofolio_citra.zip",
      submittedAt: "2026-06-05T16:15:00Z",
      status: "pending",
    },
    {
      id: "SUB-MOCK-003",
      studentName: "Bima Sakti",
      nim: "220102005",
      courseName: "Rekayasa Perangkat Lunak",
      assignmentTitle: "Tugas 1: Dokumen Analisis Kebutuhan",
      fileName: "rpl_analisis_bima.pdf",
      submittedAt: "2026-06-06T09:45:00Z",
      status: "pending",
    },
    {
      id: "SUB-MOCK-001",
      studentName: "Ahmad Fauzi",
      nim: "220102001",
      courseName: "Pemrograman Web",
      assignmentTitle: "Tugas 1: Membuat Halaman Portofolio Pribadi",
      fileName: "portfolio_ahmad_fauzi.zip",
      submittedAt: "2026-06-05T14:30:00Z",
      grade: 92,
      feedback: "Sangat bagus! Struktur HTML rapi, styling modern.",
      status: "graded",
    },
  ]);

  // Announcements state
  const [announcements, setAnnouncements] = useState<Announcement[]>(mockAnnouncements);
  const [targetCourse, setTargetCourse] = useState(lecturerCourses[0]?.id || "");
  const [newAnnTitle, setNewAnnTitle] = useState("");
  const [newAnnContent, setNewAnnContent] = useState("");
  const [annSuccessMessage, setAnnSuccessMessage] = useState("");

  // Grading modal/form state
  const [gradingSubId, setGradingSubId] = useState<string | null>(null);
  const [gradeValue, setGradeValue] = useState("");
  const [feedbackValue, setFeedbackValue] = useState("");

  // Calculate statistics
  const totalClasses = lecturerCourses.length;
  const totalStudents = 125; // Simulated total students across the 3 classes
  const pendingGradingCount = submissions.filter((s) => s.status === "pending").length;

  const handleCreateAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnTitle || !newAnnContent || !targetCourse) return;

    const newAnn: Announcement = {
      id: `ANC-${Date.now()}`,
      courseId: targetCourse,
      title: newAnnTitle,
      content: newAnnContent,
      date: new Date().toISOString(),
      lecturerName: lecturerName,
    };

    setAnnouncements((prev) => [newAnn, ...prev]);
    setNewAnnTitle("");
    setNewAnnContent("");
    setAnnSuccessMessage("Pengumuman berhasil disebarluaskan ke kelas!");
    setTimeout(() => setAnnSuccessMessage(""), 3000);
  };

  const handleOpenGrading = (sub: UngradedSubmission) => {
    setGradingSubId(sub.id);
    setGradeValue(sub.grade ? sub.grade.toString() : "");
    setFeedbackValue(sub.feedback || "");
  };

  const handleSaveGrade = () => {
    const gradeNum = parseInt(gradeValue);
    if (isNaN(gradeNum) || gradeNum < 0 || gradeNum > 100) {
      alert("Masukkan nilai yang valid antara 0 dan 100!");
      return;
    }

    setSubmissions((prev) =>
      prev.map((sub) => {
        if (sub.id === gradingSubId) {
          return {
            ...sub,
            grade: gradeNum,
            feedback: feedbackValue,
            status: "graded" as const,
          };
        }
        return sub;
      })
    );

    setGradingSubId(null);
    setGradeValue("");
    setFeedbackValue("");
  };

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      {initialTab === "overview" && (
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-iris-800 to-iris-600 p-6 text-white md:p-8">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:24px_24px]"></div>
          <div className="relative z-10 space-y-2">
            <span className="inline-block rounded-full bg-white/20 px-3 py-1 text-[11px] font-semibold tracking-wide uppercase text-white/95">
              Portal Dosen Pengampu
            </span>
            <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
              Selamat datang kembali, {lecturerName}!
            </h1>
            <p className="text-[13px] text-white/80 md:text-[14px]">
              NIP: 198501012010011001 &bull; Fakultas Ilmu Komputer &bull; Universitas Dian Nuswantoro
            </p>
          </div>
        </div>
      )}

      {/* Overview Stats Card */}
      {initialTab === "overview" && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Card className="flex flex-col justify-between p-5">
            <span className="text-[12px] font-medium text-muted">Kelas Diampu</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-ink">{totalClasses}</span>
              <BookOpen size={20} className="text-iris-500" />
            </div>
            <span className="mt-1 text-[10px] text-muted">TI-3A, TI-3B, & Kelas Praktikum</span>
          </Card>
          <Card className="flex flex-col justify-between p-5">
            <span className="text-[12px] font-medium text-muted">Total Mahasiswa Binaan</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-ink">{totalStudents}</span>
              <Users size={20} className="text-success" />
            </div>
            <span className="mt-1 text-[10px] text-muted">Aktif semester ini</span>
          </Card>
          <Card className="flex flex-col justify-between p-5">
            <span className="text-[12px] font-medium text-muted">Tugas Menunggu Nilai</span>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl font-bold text-ink">{pendingGradingCount}</span>
              <FileCheck size={20} className="text-warning" />
            </div>
            <span className="mt-1 text-[10px] text-muted">Butuh feedback & penilaian</span>
          </Card>
        </div>
      )}

      {/* Tab: Overview */}
      {initialTab === "overview" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Left: Classes Taught (2 columns) */}
          <div className="space-y-4 lg:col-span-2">
            <div className="flex items-center justify-between">
              <h2 className="text-[15px] font-bold text-ink">Daftar Kelas Semester Ini</h2>
              <Link href="/lecturer?tab=courses">
                <Button variant="ghost" size="sm" className="text-iris-600 gap-1 text-[12px]">
                  Lihat Semua Kelas <ArrowRight size={14} />
                </Button>
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {lecturerCourses.map((course) => {
                const IconComponent = course.icon;
                return (
                  <Link key={course.id} href={`/lecturer/course/${course.id}`}>
                    <Card className="group p-5 hover:border-iris-200 cursor-pointer transition-colors space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-iris-50 text-iris-600">
                          <IconComponent size={20} />
                        </div>
                        <Badge variant="blue">{course.class_name}</Badge>
                      </div>
                      
                      <div>
                        <span className="text-[10px] font-mono text-muted uppercase tracking-wider">{course.code} &bull; {course.sks} SKS</span>
                        <h3 className="text-[14px] font-bold text-ink group-hover:text-iris-600 transition-colors line-clamp-1 mt-0.5">
                          {course.name}
                        </h3>
                        <p className="text-[11px] text-muted mt-1 leading-relaxed line-clamp-2">{course.description}</p>
                      </div>

                      <div className="border-t border-border/60 pt-3 flex items-center justify-between text-[11px] text-muted">
                        <span>4 Tugas Aktif</span>
                        <span>40 Mahasiswa</span>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Right: Submissions Queue (1 column) */}
          <div className="space-y-4">
            <h2 className="text-[15px] font-bold text-ink">Antrean Penilaian</h2>
            
            <Card className="divide-y divide-border/60 overflow-hidden">
              {submissions.map((sub) => (
                <div key={sub.id} className="p-4 space-y-2 hover:bg-surface2/30 transition-colors">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-[12px] font-bold text-ink">{sub.studentName}</h4>
                      <p className="text-[10px] text-muted">NIM: {sub.nim} &bull; {sub.courseName}</p>
                    </div>
                    {sub.status === "graded" ? (
                      <Badge variant="green">Nilai: {sub.grade}</Badge>
                    ) : (
                      <Badge variant="warn">Pending</Badge>
                    )}
                  </div>
                  
                  <p className="text-[11px] font-semibold text-ink2 line-clamp-1 bg-surface2 px-2 py-1 rounded border border-border">
                    {sub.assignmentTitle}
                  </p>

                  <div className="flex items-center justify-between pt-1 text-[10px] text-muted">
                    <span>File: <span className="font-mono underline">{sub.fileName}</span></span>
                    {sub.status === "pending" ? (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleOpenGrading(sub)}
                        className="h-7 text-iris-600 hover:text-iris-800 text-[10px] font-bold p-0 cursor-pointer"
                      >
                        Beri Nilai
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleOpenGrading(sub)}
                        className="h-7 text-muted hover:text-ink text-[10px] p-0 cursor-pointer"
                      >
                        Edit Nilai
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </Card>

            {/* Inline Grading Form (Displays when a submission is selected) */}
            {gradingSubId && (
              <Card className="p-4 bg-iris-50/20 border-iris-100 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-[12px] font-bold text-iris-800 uppercase tracking-wider">
                    Form Penilaian: {submissions.find((s) => s.id === gradingSubId)?.studentName}
                  </h3>
                  <button onClick={() => setGradingSubId(null)} className="text-[11px] text-muted hover:text-ink cursor-pointer">
                    Batal
                  </button>
                </div>
                <div className="space-y-3">
                  <div className="space-y-1">
                    <Label htmlFor="grade-score" className="text-[11px]">Nilai (0-100)</Label>
                    <Input
                      id="grade-score"
                      type="number"
                      placeholder="Masukkan angka 0-100"
                      value={gradeValue}
                      onChange={(e) => setGradeValue(e.target.value)}
                      className="bg-white"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="grade-feedback" className="text-[11px]">Feedback Dosen</Label>
                    <Textarea
                      id="grade-feedback"
                      placeholder="Masukkan masukan/koreksi untuk mahasiswa..."
                      value={feedbackValue}
                      onChange={(e) => setFeedbackValue(e.target.value)}
                      className="bg-white min-h-[70px]"
                    />
                  </div>
                  <Button size="sm" onClick={handleSaveGrade} className="w-full cursor-pointer">
                    Simpan Nilai & Kirim Feedback
                  </Button>
                </div>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Tab: Courses (Classes Management) */}
      {initialTab === "courses" && (
        <div className="space-y-4">
          <h2 className="text-[15px] font-bold text-ink">Manajemen Kelas & Perkuliahan</h2>
          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {lecturerCourses.map((course) => {
              const IconComponent = course.icon;
              return (
                <Link key={course.id} href={`/lecturer/course/${course.id}`}>
                  <Card className="group p-5 hover:border-iris-200 cursor-pointer transition-colors space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex size-10 items-center justify-center rounded-xl bg-iris-50 text-iris-600">
                        <IconComponent size={20} />
                      </div>
                      <Badge variant="blue">{course.class_name}</Badge>
                    </div>

                    <div>
                      <span className="text-[10px] font-mono text-muted uppercase tracking-wider">{course.code} &bull; {course.sks} SKS</span>
                      <h3 className="text-[14px] font-bold text-ink group-hover:text-iris-600 transition-colors line-clamp-1 mt-0.5">
                        {course.name}
                      </h3>
                      <p className="text-[11px] text-muted mt-1 leading-relaxed line-clamp-2">{course.description}</p>
                    </div>

                    <div className="border-t border-border pt-3 flex items-center justify-between text-[11px] text-muted">
                      <span>4 Tugas</span>
                      <span>40 Mahasiswa</span>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab: Announcements */}
      {initialTab === "announcements" && (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {/* Post announcement form */}
          <Card className="p-5 h-fit space-y-4">
            <h3 className="text-[13px] font-bold text-ink uppercase tracking-wider">Kirim Pengumuman</h3>
            
            {annSuccessMessage && (
              <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-3 rounded-lg text-[12px] flex items-center gap-2">
                <Check size={16} /> {annSuccessMessage}
              </div>
            )}

            <form onSubmit={handleCreateAnnouncement} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="target-class">Pilih Kelas</Label>
                <select
                  id="target-class"
                  value={targetCourse}
                  onChange={(e) => setTargetCourse(e.target.value)}
                  className="w-full h-10 border border-border rounded-lg px-3 py-2 text-[13px] bg-white outline-none focus:border-iris-500 focus:ring-3 focus:ring-iris-500/10"
                >
                  {lecturerCourses.map((c) => (
                    <option key={c.id} value={c.id}>{c.name} ({c.class_name})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="ann-title">Judul Pengumuman</Label>
                <Input
                  id="ann-title"
                  placeholder="Masukkan judul..."
                  value={newAnnTitle}
                  onChange={(e) => setNewAnnTitle(e.target.value)}
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="ann-content">Isi Pengumuman</Label>
                <Textarea
                  id="ann-content"
                  placeholder="Masukkan detail pesan pengumuman..."
                  value={newAnnContent}
                  onChange={(e) => setNewAnnContent(e.target.value)}
                  className="min-h-[120px]"
                />
              </div>

              <Button type="submit" className="w-full gap-2 cursor-pointer">
                <Megaphone size={14} /> Kirim Pengumuman
              </Button>
            </form>
          </Card>

          {/* History */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="text-[15px] font-bold text-ink">Riwayat Pengumuman Kelas</h3>
            <div className="space-y-4">
              {announcements
                .filter((ann) => lecturerCourses.some((c) => c.id === ann.courseId))
                .map((ann) => {
                  const courseDetail = lecturerCourses.find((c) => c.id === ann.courseId);
                  return (
                    <Card key={ann.id} className="p-5 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-bold text-iris-600 bg-iris-50 px-2.5 py-0.5 rounded-full">
                          Kelas: {courseDetail ? `${courseDetail.name} (${courseDetail.class_name})` : "General"}
                        </span>
                        <span className="text-[11px] text-muted">
                          {new Date(ann.date).toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                      <h4 className="text-[14px] font-bold text-ink">{ann.title}</h4>
                      <p className="text-[12px] text-ink2 leading-relaxed whitespace-pre-line">{ann.content}</p>
                    </Card>
                  );
                })}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Analytics */}
      {initialTab === "analytics" && (
        <div className="space-y-6">
          <h2 className="text-[15px] font-bold text-ink">Analisis Keaktifan & Penilaian</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="p-5 space-y-3">
              <h3 className="text-[13px] font-bold text-ink uppercase tracking-wider">Rata-rata Pengumpulan Tugas</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-ink">94.5%</span>
                <span className="text-[11px] text-success font-semibold flex items-center gap-0.5">
                  <TrendingUp size={12} /> +1.2% semester lalu
                </span>
              </div>
              <p className="text-[11px] text-muted leading-relaxed">Persentase rata-rata mahasiswa yang mengumpulkan tugas tepat waktu.</p>
            </Card>

            <Card className="p-5 space-y-3">
              <h3 className="text-[13px] font-bold text-ink uppercase tracking-wider">Rata-rata Nilai Kelas</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-success">84.2</span>
                <span className="text-[11px] text-muted">/ 100</span>
              </div>
              <p className="text-[11px] text-muted leading-relaxed">Indeks rata-rata kumulatif nilai tugas mahasiswa di semua kelas.</p>
            </Card>

            <Card className="p-5 space-y-3">
              <h3 className="text-[13px] font-bold text-ink uppercase tracking-wider">Tingkat Kehadiran</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-iris-600">96.8%</span>
                <span className="text-[11px] text-success font-semibold">Sangat Baik</span>
              </div>
              <p className="text-[11px] text-muted leading-relaxed">Rata-rata absensi mingguan mahasiswa baik tatap muka maupun daring.</p>
            </Card>
          </div>

          <Card className="p-5 space-y-4">
            <h3 className="text-[13px] font-bold text-ink uppercase tracking-wider">Deteksi Mahasiswa Bermasalah</h3>
            <p className="text-[12px] text-muted leading-relaxed">Mahasiswa dengan presensi di bawah 75% atau belum mengumpulkan 2+ tugas.</p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[12px] border-collapse">
                <thead>
                  <tr className="border-b border-border text-muted font-bold">
                    <th className="pb-3 pr-4">Nama Mahasiswa</th>
                    <th className="pb-3 pr-4">NIM</th>
                    <th className="pb-3 pr-4">Kelas</th>
                    <th className="pb-3 pr-4 text-center">Tingkat Absensi</th>
                    <th className="pb-3 pr-4 text-center">Tugas Terlewat</th>
                    <th className="pb-3 text-right">Rekomendasi Tindakan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {[
                    { name: "Galih Prasetya", nim: "220102044", class: "Pemrograman Web (TI-3A)", attendance: "68%", missed: 3, action: "Kirim SP-1 / Panggil Konseling" },
                    { name: "Dewi Ayu", nim: "220102078", class: "Rekayasa Perangkat Lunak (TI-3A)", attendance: "71%", missed: 2, action: "Reminder Lewat Email" },
                  ].map((std, idx) => (
                    <tr key={idx} className="hover:bg-surface2/30">
                      <td className="py-3 pr-4 font-bold text-ink">{std.name}</td>
                      <td className="py-3 pr-4 font-mono text-muted">{std.nim}</td>
                      <td className="py-3 pr-4 text-ink2">{std.class}</td>
                      <td className="py-3 pr-4 text-center font-bold text-danger">{std.attendance}</td>
                      <td className="py-3 pr-4 text-center font-bold text-danger">{std.missed}</td>
                      <td className="py-3 text-right text-iris-600 font-bold">
                        <span className="bg-red-50 text-danger px-2 py-0.5 rounded text-[11px]">
                          {std.action}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
