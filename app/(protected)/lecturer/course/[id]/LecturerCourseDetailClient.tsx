"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { mockCourses } from "@/data/courses";
import {
  mockModules,
  mockAssignments,
  mockSubmissions,
} from "@/data/mockData";
import type { Module, Assignment, Submission } from "@/types/academic";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Video,
  FileText,
  Link2,
  Plus,
  Trash,
  Clock,
  CheckCircle2,
  UserCheck,
  AlertCircle,
  Users,
  Check,
  Edit,
} from "lucide-react";

interface LecturerCourseDetailClientProps {
  courseId: string;
}

export default function LecturerCourseDetailClient({
  courseId,
}: LecturerCourseDetailClientProps) {
  const course = mockCourses.find((c) => c.id === courseId);

  // States
  const [activeTab, setActiveTab] = useState<"materi" | "tugas" | "penilaian" | "mahasiswa">("materi");
  const [expandedWeeks, setExpandedWeeks] = useState<Record<number, boolean>>({
    1: true,
    2: true,
  });

  // Dynamic lists states
  const [modules, setModules] = useState<Module[]>(
    mockModules.filter((m) => m.courseId === courseId)
  );
  const [assignments, setAssignments] = useState<Assignment[]>(
    mockAssignments.filter((a) => a.courseId === courseId)
  );
  const [submissions, setSubmissions] = useState<Submission[]>([
    {
      id: "SUB-001",
      assignmentId: "ASM-101-01",
      studentId: "STU-001",
      studentName: "Ahmad Fauzi",
      fileUrl: "portfolio_ahmad_fauzi.zip",
      submittedAt: "2026-06-05T14:30:00",
      version: 1,
      grade: 92,
      feedback: "Sangat bagus! Struktur HTML rapi, styling modern.",
      isLate: false,
    },
    {
      id: "SUB-002",
      assignmentId: "ASM-101-01",
      studentId: "STU-002",
      studentName: "Citra Kirana",
      fileUrl: "portofolio_citra.zip",
      submittedAt: "2026-06-05T16:15:00",
      version: 1,
      isLate: false,
    },
    {
      id: "SUB-003",
      assignmentId: "ASM-101-02",
      studentId: "STU-001",
      studentName: "Ahmad Fauzi",
      fileUrl: "kalkulator_ahmad.zip",
      submittedAt: "2026-06-06T11:00:00",
      version: 1,
      isLate: false,
    },
  ]);

  // Form states: Material upload
  const [showAddMaterial, setShowAddMaterial] = useState(false);
  const [matTitle, setMatTitle] = useState("");
  const [matWeek, setMatWeek] = useState("1");
  const [matType, setMatType] = useState<"video" | "pdf" | "link" | "ppt">("pdf");
  const [matUrl, setMatUrl] = useState("");
  const [matDesc, setMatDesc] = useState("");

  // Form states: Assignment creation
  const [asmTitle, setAsmTitle] = useState("");
  const [asmDesc, setAsmDesc] = useState("");
  const [asmDeadline, setAsmDeadline] = useState("2026-06-20T23:59");
  const [asmWeight, setAsmWeight] = useState("15");
  const [asmFormats, setAsmFormats] = useState("zip, pdf");

  // Grading states
  const [gradingSubId, setGradingSubId] = useState<string | null>(null);
  const [gradeScore, setGradeScore] = useState("");
  const [gradeFeedback, setGradeFeedback] = useState("");

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle size={48} className="text-danger mb-4" />
        <h2 className="text-xl font-bold text-ink">Mata Kuliah Tidak Ditemukan</h2>
        <Link href="/lecturer" className="mt-6">
          <Button>Kembali ke Dashboard</Button>
        </Link>
      </div>
    );
  }

  const toggleWeek = (weekNo: number) => {
    setExpandedWeeks((prev) => ({ ...prev, [weekNo]: !prev[weekNo] }));
  };

  // Add material submit
  const handleAddMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!matTitle || !matUrl) return;

    const newModule: Module = {
      id: `MOD-${Date.now()}`,
      courseId,
      title: matTitle,
      weekNo: parseInt(matWeek),
      type: matType,
      contentUrl: matUrl,
      description: matDesc,
      isPublished: true,
    };

    setModules((prev) => [...prev, newModule]);
    
    // Auto expand the week where the material was added
    setExpandedWeeks((prev) => ({ ...prev, [parseInt(matWeek)]: true }));

    // Reset Form
    setMatTitle("");
    setMatUrl("");
    setMatDesc("");
    setShowAddMaterial(false);
  };

  // Add assignment submit
  const handleAddAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!asmTitle || !asmDesc) return;

    const newAsm: Assignment = {
      id: `ASM-${Date.now()}`,
      courseId,
      title: asmTitle,
      description: asmDesc,
      deadline: new Date(asmDeadline).toISOString(),
      weightPct: parseInt(asmWeight),
      allowedFormats: asmFormats.split(",").map((f) => f.trim().toLowerCase()),
      maxSizeMb: 10,
    };

    setAssignments((prev) => [...prev, newAsm]);
    
    // Reset Form
    setAsmTitle("");
    setAsmDesc("");
  };

  // Submit Grade
  const handleSaveGrade = () => {
    const score = parseInt(gradeScore);
    if (isNaN(score) || score < 0 || score > 100) {
      alert("Masukkan nilai antara 0-100");
      return;
    }

    setSubmissions((prev) =>
      prev.map((sub) => {
        if (sub.id === gradingSubId) {
          return {
            ...sub,
            grade: score,
            feedback: gradeFeedback,
            gradedAt: new Date().toISOString(),
          };
        }
        return sub;
      })
    );

    setGradingSubId(null);
    setGradeScore("");
    setGradeFeedback("");
  };

  return (
    <div className="space-y-6">
      {/* Back Header */}
      <div className="flex items-center justify-between">
        <Link href="/lecturer" className="inline-flex items-center gap-2 text-[13px] font-semibold text-muted hover:text-ink transition-colors cursor-pointer">
          <ArrowLeft size={16} /> Kembali ke Dashboard Dosen
        </Link>
        <span className="text-[11px] font-mono text-muted uppercase tracking-wider">
          Pengelolaan Kelas &bull; {course.code}
        </span>
      </div>

      {/* Course Banner */}
      <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2">
            <span className="inline-block rounded-full bg-iris-50 px-2.5 py-0.5 text-[11px] font-semibold text-iris-800">
              {course.semester}
            </span>
            <h1 className="text-xl font-bold tracking-tight text-ink md:text-2xl">
              {course.name}
            </h1>
            <p className="text-[13px] text-muted max-w-2xl leading-relaxed">
              Manajemen bahan ajar, penugasan, absensi dan penilaian mahasiswa kelas {course.class_name}.
            </p>
          </div>
          
          <div className="shrink-0 flex items-center gap-3">
            <div className="text-center bg-surface2 border border-border px-4 py-2 rounded-xl">
              <span className="block text-2xl font-bold text-iris-600">{course.sks}</span>
              <span className="text-[10px] uppercase font-bold text-muted tracking-wider">SKS</span>
            </div>
            <div className="text-center bg-surface2 border border-border px-4 py-2 rounded-xl">
              <span className="block text-2xl font-bold text-ink">{course.class_name}</span>
              <span className="text-[10px] uppercase font-bold text-muted tracking-wider">Kelas</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-border gap-1 overflow-x-auto pb-px">
        {([
          { id: "materi", label: "Materi & Silabus" },
          { id: "tugas", label: "Penugasan (Tugas)" },
          { id: "penilaian", label: "Beri Nilai Tugas" },
          { id: "mahasiswa", label: "Peserta Kuliah" },
        ] as const).map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`text-[13px] font-semibold px-4 py-2.5 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                isActive
                  ? "border-iris-500 text-iris-800"
                  : "border-transparent text-muted hover:text-ink hover:border-border"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* -------------------- TAB: MATERI & SILABUS -------------------- */}
      {activeTab === "materi" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Timeline (Left 2 columns) */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-[15px] font-bold text-ink">Bahan Ajar Mingguan</h2>
            
            <div className="space-y-3">
              {Array.from({ length: 14 }).map((_, idx) => {
                const weekNo = idx + 1;
                const isExpanded = expandedWeeks[weekNo];
                const weekModules = modules.filter((m) => m.weekNo === weekNo);
                
                return (
                  <Card key={weekNo} className="overflow-hidden">
                    <button
                      onClick={() => toggleWeek(weekNo)}
                      className="flex w-full items-center justify-between p-4 bg-surface2/30 hover:bg-surface2/60 transition-colors cursor-pointer text-left"
                    >
                      <div>
                        <span className="text-[13px] font-bold text-ink">Minggu ke-{weekNo}</span>
                        <span className="text-[11px] text-muted block mt-0.5">
                          {weekModules.length} materi diunggah
                        </span>
                      </div>
                      {isExpanded ? <ChevronUp size={16} className="text-muted" /> : <ChevronDown size={16} className="text-muted" />}
                    </button>

                    {isExpanded && (
                      <div className="p-4 border-t border-border/50 divide-y divide-border/40 bg-white">
                        {weekModules.length > 0 ? (
                          weekModules.map((mod) => (
                            <div key={mod.id} className="py-3.5 first:pt-0 last:pb-0 flex items-start justify-between gap-3">
                              <div className="flex items-start gap-3">
                                <div className={`mt-0.5 p-1.5 rounded-lg shrink-0 ${
                                  mod.type === "video" ? "bg-red-50 text-red-600" :
                                  mod.type === "pdf" ? "bg-amber-50 text-amber-600" :
                                  mod.type === "ppt" ? "bg-orange-50 text-orange-600" : "bg-iris-50 text-iris-600"
                                }`}>
                                  {mod.type === "video" ? <Video size={16} /> :
                                   mod.type === "pdf" ? <FileText size={16} /> :
                                   mod.type === "ppt" ? <FileText size={16} /> : <Link2 size={16} />}
                                </div>
                                <div>
                                  <h4 className="text-[13px] font-bold text-ink leading-snug">{mod.title}</h4>
                                  <p className="text-[11px] text-muted mt-0.5">{mod.description}</p>
                                  <span className="text-[9px] font-mono text-muted bg-surface2 px-1.5 py-0.5 rounded border border-border/60 mt-1.5 inline-block">
                                    {mod.contentUrl}
                                  </span>
                                </div>
                              </div>
                              
                              <button
                                onClick={() => setModules((prev) => prev.filter((m) => m.id !== mod.id))}
                                className="text-muted hover:text-danger p-1 rounded transition-colors cursor-pointer"
                              >
                                <Trash size={14} />
                              </button>
                            </div>
                          ))
                        ) : (
                          <p className="text-center py-4 text-[12px] text-muted">Belum ada materi pembelajaran diunggah.</p>
                        )}
                      </div>
                    )}
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Upload panel (Right 1 column) */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-[15px] font-bold text-ink">Tindakan</h3>
            </div>
            
            <Card className="p-5 space-y-4">
              <h4 className="text-[13px] font-bold text-ink uppercase tracking-wider pb-2 border-b border-border/80">
                Unggah Materi Baru
              </h4>
              
              <form onSubmit={handleAddMaterial} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="title-mat">Judul Materi</Label>
                  <Input
                    id="title-mat"
                    placeholder="Contoh: CSS Flexbox Lanjutan"
                    value={matTitle}
                    onChange={(e) => setMatTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="week-mat">Minggu Ke</Label>
                    <select
                      id="week-mat"
                      value={matWeek}
                      onChange={(e) => setMatWeek(e.target.value)}
                      className="w-full h-10 border border-border rounded-lg px-3 py-2 text-[13px] bg-white outline-none focus:border-iris-500 focus:ring-3 focus:ring-iris-500/10"
                    >
                      {Array.from({ length: 14 }).map((_, i) => (
                        <option key={i} value={i + 1}>Minggu {i + 1}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-1.5">
                    <Label htmlFor="type-mat">Tipe Format</Label>
                    <select
                      id="type-mat"
                      value={matType}
                      onChange={(e) => setMatType(e.target.value as "video" | "pdf" | "link" | "ppt")}
                      className="w-full h-10 border border-border rounded-lg px-3 py-2 text-[13px] bg-white outline-none focus:border-iris-500 focus:ring-3 focus:ring-iris-500/10"
                    >
                      <option value="pdf">PDF Dokumen</option>
                      <option value="video">Video YouTube</option>
                      <option value="ppt">PowerPoint Slide</option>
                      <option value="link">Web Link</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="url-mat">Link / URL Materi</Label>
                  <Input
                    id="url-mat"
                    placeholder="https://youtube.com/embed/..."
                    value={matUrl}
                    onChange={(e) => setMatUrl(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="desc-mat">Deskripsi Pendek</Label>
                  <Textarea
                    id="desc-mat"
                    placeholder="Tulis ringkasan singkat materi ini..."
                    value={matDesc}
                    onChange={(e) => setMatDesc(e.target.value)}
                    className="min-h-[70px]"
                  />
                </div>

                <Button type="submit" className="w-full gap-2 cursor-pointer">
                  <Plus size={15} /> Publikasikan Materi
                </Button>
              </form>
            </Card>
          </div>
        </div>
      )}

      {/* -------------------- TAB: PENUGASAN -------------------- */}
      {activeTab === "tugas" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Assignments list (Left 2 columns) */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-[15px] font-bold text-ink">Penugasan & Ujian Aktif</h2>
            
            <div className="space-y-3">
              {assignments.map((asm) => {
                const dl = new Date(asm.deadline);
                const subCount = submissions.filter((s) => s.assignmentId === asm.id).length;
                return (
                  <Card key={asm.id} className="p-5 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <h3 className="text-[14px] font-bold text-ink leading-snug">{asm.title}</h3>
                        <span className="text-[11px] text-muted flex items-center gap-1.5 mt-1.5">
                          <Clock size={12} />
                          Tenggat: {dl.toLocaleDateString("id-ID", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })} WIB
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2 self-start sm:self-center">
                        <span className="text-[10px] text-muted font-bold bg-surface2 border border-border px-2 py-0.5 rounded-full">
                          Bobot {asm.weightPct}%
                        </span>
                        <Badge variant="blue">{subCount} Pengumpulan</Badge>
                      </div>
                    </div>

                    <p className="text-[12px] text-ink2 leading-relaxed bg-surface2 p-3 rounded-lg border border-border/80 whitespace-pre-line">
                      {asm.description}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-muted border-t border-border/50 pt-3">
                      <span>Format: <span className="uppercase text-ink font-semibold">{asm.allowedFormats.join(", ")}</span></span>
                      <button
                        onClick={() => setAssignments((prev) => prev.filter((a) => a.id !== asm.id))}
                        className="text-danger hover:underline font-semibold cursor-pointer"
                      >
                        Hapus Tugas
                      </button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Create assignment (Right 1 column) */}
          <Card className="p-5 h-fit space-y-4">
            <h3 className="text-[13px] font-bold text-ink uppercase tracking-wider pb-2 border-b border-border/80">
              Buat Tugas Baru
            </h3>
            
            <form onSubmit={handleAddAssignment} className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="title-asm">Judul Tugas</Label>
                <Input
                  id="title-asm"
                  placeholder="Contoh: Tugas 3: Integrasi API"
                  value={asmTitle}
                  onChange={(e) => setAsmTitle(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="desc-asm">Deskripsi & Instruksi</Label>
                <Textarea
                  id="desc-asm"
                  placeholder="Tulis petunjuk pengerjaan tugas secara lengkap di sini..."
                  value={asmDesc}
                  onChange={(e) => setAsmDesc(e.target.value)}
                  required
                  className="min-h-[120px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="weight-asm">Bobot (%)</Label>
                  <Input
                    id="weight-asm"
                    type="number"
                    value={asmWeight}
                    onChange={(e) => setAsmWeight(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="formats-asm">Format File</Label>
                  <Input
                    id="formats-asm"
                    placeholder="zip, pdf, html"
                    value={asmFormats}
                    onChange={(e) => setAsmFormats(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="deadline-asm">Batas Waktu (Deadline)</Label>
                <Input
                  id="deadline-asm"
                  type="datetime-local"
                  value={asmDeadline}
                  onChange={(e) => setAsmDeadline(e.target.value)}
                  required
                />
              </div>

              <Button type="submit" className="w-full gap-2 cursor-pointer">
                <Plus size={15} /> Publikasikan Tugas
              </Button>
            </form>
          </Card>
        </div>
      )}

      {/* -------------------- TAB: PENILAIAN TUGAS -------------------- */}
      {activeTab === "penilaian" && (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Submissions list (Left 2 columns) */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-[15px] font-bold text-ink">Daftar Pengumpulan Mahasiswa</h2>
            
            <Card className="overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[12px] border-collapse">
                  <thead>
                    <tr className="border-b border-border text-muted font-bold bg-surface2/60">
                      <th className="p-3">Mahasiswa</th>
                      <th className="p-3">Tugas</th>
                      <th className="p-3">Berkas</th>
                      <th className="p-3 text-center">Tanggal Kirim</th>
                      <th className="p-3 text-right">Nilai / Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {submissions.map((sub) => {
                      const asmDetail = assignments.find((a) => a.id === sub.assignmentId);
                      const isGraded = sub.grade !== undefined;
                      const date = new Date(sub.submittedAt);
                      
                      return (
                        <tr key={sub.id} className="hover:bg-surface2/30 transition-colors">
                          <td className="p-3">
                            <span className="font-bold text-ink block">{sub.studentName}</span>
                            <span className="text-[10px] text-muted">NIM: {sub.studentId === "STU-001" ? "220102001" : "220102002"}</span>
                          </td>
                          <td className="p-3">
                            <span className="text-ink2 line-clamp-1 max-w-[150px] font-medium">
                              {asmDetail ? asmDetail.title : "Tugas Uji"}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className="font-mono text-iris-600 underline cursor-pointer">{sub.fileUrl}</span>
                          </td>
                          <td className="p-3 text-center text-muted">
                            {date.toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                            })}
                          </td>
                          <td className="p-3 text-right">
                            {isGraded ? (
                              <div className="flex items-center justify-end gap-2">
                                <span className="font-bold text-success text-[13px]">{sub.grade}/100</span>
                                <button
                                  onClick={() => {
                                    setGradingSubId(sub.id);
                                    setGradeScore(sub.grade!.toString());
                                    setGradeFeedback(sub.feedback || "");
                                  }}
                                  className="text-muted hover:text-ink cursor-pointer"
                                >
                                  <Edit size={13} />
                                </button>
                              </div>
                            ) : (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => {
                                  setGradingSubId(sub.id);
                                  setGradeScore("");
                                  setGradeFeedback("");
                                }}
                                className="h-7 text-iris-600 hover:text-iris-800 text-[11px] font-bold p-0 px-2.5 rounded bg-iris-50 cursor-pointer"
                              >
                                Nilai
                              </Button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* Grading Box (Right 1 column) */}
          <div className="space-y-4">
            <h3 className="text-[15px] font-bold text-ink">Beri Nilai</h3>
            
            {gradingSubId ? (
              <Card className="p-5 space-y-4 bg-iris-50/20 border-iris-100">
                <div className="flex items-center justify-between border-b border-border/80 pb-2">
                  <h4 className="text-[12px] font-bold text-iris-800 uppercase tracking-wider">
                    Koreksi Penyerahan
                  </h4>
                  <button onClick={() => setGradingSubId(null)} className="text-[11px] text-muted hover:text-ink cursor-pointer">
                    Batal
                  </button>
                </div>

                <div className="text-[12px] space-y-1.5 text-muted bg-white p-3 rounded-lg border border-border/80">
                  <p>Mahasiswa: <span className="font-bold text-ink">{submissions.find((s) => s.id === gradingSubId)?.studentName}</span></p>
                  <p>Tugas: <span className="font-semibold text-ink line-clamp-1">{assignments.find((a) => a.id === submissions.find((s) => s.id === gradingSubId)?.assignmentId)?.title}</span></p>
                  <p>Berkas: <span className="font-mono underline text-iris-600 cursor-pointer">{submissions.find((s) => s.id === gradingSubId)?.fileUrl}</span></p>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="grade-score-val">Nilai Uji (0-100)</Label>
                    <Input
                      id="grade-score-val"
                      type="number"
                      placeholder="Masukkan angka..."
                      value={gradeScore}
                      onChange={(e) => setGradeScore(e.target.value)}
                      className="bg-white"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="grade-feedback-val">Feedback / Catatan Perbaikan</Label>
                    <Textarea
                      id="grade-feedback-val"
                      placeholder="Tulis komentar koreksi di sini..."
                      value={gradeFeedback}
                      onChange={(e) => setGradeFeedback(e.target.value)}
                      className="bg-white min-h-[90px]"
                    />
                  </div>

                  <Button onClick={handleSaveGrade} className="w-full cursor-pointer">
                    Kirim & Simpan Nilai
                  </Button>
                </div>
              </Card>
            ) : (
              <Card className="p-6 text-center text-muted text-[12px] flex flex-col items-center justify-center py-12">
                <AlertCircle size={28} className="text-muted/60 mb-2" />
                <span>Pilih salah satu baris tugas mahasiswa di tabel untuk mulai menilai dan memberi umpan balik koreksi.</span>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* -------------------- TAB: PESERTA KULIAH -------------------- */}
      {activeTab === "mahasiswa" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-[15px] font-bold text-ink">Daftar Mahasiswa Terdaftar</h2>
            <Badge variant="blue">40 Peserta Aktif</Badge>
          </div>

          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-[12px] border-collapse">
                <thead>
                  <tr className="border-b border-border text-muted font-bold bg-surface2/60">
                    <th className="p-3">No</th>
                    <th className="p-3">Nama Lengkap</th>
                    <th className="p-3">NIM</th>
                    <th className="p-3">Email Akademik</th>
                    <th className="p-3 text-center">Persentase Kehadiran</th>
                    <th className="p-3 text-right">Status Kelas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {[
                    { no: 1, name: "Ahmad Fauzi", nim: "220102001", email: "mahasiswa@kulino.id", attendance: "96.5%", status: "Aktif" },
                    { no: 2, name: "Citra Kirana", nim: "220102002", email: "citra.kirana@mhs.dinus.ac.id", attendance: "92.0%", status: "Aktif" },
                    { no: 3, name: "Bima Sakti", nim: "220102005", email: "bima.sakti@mhs.dinus.ac.id", attendance: "90.2%", status: "Aktif" },
                    { no: 4, name: "Dewi Ayu", nim: "220102078", email: "dewi.ayu@mhs.dinus.ac.id", attendance: "71.0%", status: "Perlu Perhatian" },
                    { no: 5, name: "Galih Prasetya", nim: "220102044", email: "galih.prasa@mhs.dinus.ac.id", attendance: "68.0%", status: "Perlu Perhatian" },
                  ].map((std) => (
                    <tr key={std.no} className="hover:bg-surface2/30 transition-colors">
                      <td className="p-3 text-muted">{std.no}</td>
                      <td className="p-3 font-bold text-ink">{std.name}</td>
                      <td className="p-3 font-mono text-muted">{std.nim}</td>
                      <td className="p-3 text-ink2">{std.email}</td>
                      <td className={`p-3 text-center font-bold ${parseFloat(std.attendance) < 75 ? "text-danger" : "text-ink"}`}>
                        {std.attendance}
                      </td>
                      <td className="p-3 text-right">
                        <Badge variant={std.status === "Aktif" ? "green" : "red"}>
                          {std.status}
                        </Badge>
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
