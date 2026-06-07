"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { mockCourses } from "@/data/courses";
import {
  mockModules,
  mockAssignments,
  mockSubmissions,
  mockDiscussions,
} from "@/data/mockData";
import type { Module, Assignment, Submission, Discussion } from "@/types/academic";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  ArrowLeft,
  Video,
  FileText,
  Link2,
  ExternalLink,
  Download,
  Calendar,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Send,
  PlusCircle,
  User,
  GraduationCap,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

interface CourseDetailClientProps {
  courseId: string;
  dbCourse?: any;
  dbModules?: any[];
  dbAssignments?: any[];
  dbSubmissions?: any[];
}

const getNextSubId = () => `SUB-${Date.now()}`;
const getNextDiscussionId = () => `DIS-${Date.now()}`;
const getNextReplyId = () => `RPY-${Date.now()}`;

export default function CourseDetailClient({
  courseId,
  dbCourse,
  dbModules,
  dbAssignments,
  dbSubmissions
}: CourseDetailClientProps) {
  const router = useRouter();
  const course = dbCourse || mockCourses.find((c) => c.id === courseId);

  // States
  const [activeSubTab, setActiveSubTab] = useState<"materi" | "tugas" | "diskusi" | "nilai">("materi");
  const [expandedWeeks, setExpandedWeeks] = useState<Record<number, boolean>>({
    1: true,
    2: true,
    3: false,
    4: false,
  });
  
  // Selected assignment for view / upload
  const [selectedAsmId, setSelectedAsmId] = useState<string | null>(null);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [submissionsList, setSubmissionsList] = useState<Submission[]>(
    dbSubmissions && dbSubmissions.length > 0 ? dbSubmissions : mockSubmissions
  );
  
  // Discussions
  const [discussions, setDiscussions] = useState<Discussion[]>(
    mockDiscussions.filter((d) => d.courseId === courseId)
  );
  const [newDiscussionTitle, setNewDiscussionTitle] = useState("");
  const [newDiscussionContent, setNewDiscussionContent] = useState("");
  const [showAddDiscussion, setShowAddDiscussion] = useState(false);
  const [replyInputs, setReplyInputs] = useState<Record<string, string>>({});

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <AlertCircle size={48} className="text-danger mb-4" />
        <h2 className="text-xl font-bold text-ink">Mata Kuliah Tidak Ditemukan</h2>
        <p className="text-muted mt-2">ID mata kuliah &apos;{courseId}&apos; tidak terdaftar dalam sistem KULINO.</p>
        <Link href="/dashboard" className="mt-6">
          <Button>Kembali ke Dashboard</Button>
        </Link>
      </div>
    );
  }

  const courseAssignments = dbAssignments && dbAssignments.length > 0
    ? dbAssignments
    : mockAssignments.filter((asm) => asm.courseId === courseId);
    
  const courseModules = dbModules && dbModules.length > 0
    ? dbModules
    : mockModules.filter((mod) => mod.courseId === courseId);

  const toggleWeek = (weekNo: number) => {
    setExpandedWeeks((prev) => ({ ...prev, [weekNo]: !prev[weekNo] }));
  };

  // Handle mock submission file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadFile(e.target.files[0]);
    }
  };

  // Simulate file upload progress
  const handleSubmitAssignment = async (assignmentId: string) => {
    if (!uploadFile) return;
    setUploading(true);
    setUploadProgress(10);

    for (let p = 20; p <= 100; p += 20) {
      await new Promise((r) => setTimeout(r, 200));
      setUploadProgress(p);
    }

    const newSub: Submission = {
      id: getNextSubId(),
      assignmentId,
      studentId: "STU-001",
      studentName: "Ahmad Fauzi",
      fileUrl: uploadFile.name,
      submittedAt: new Date().toISOString(),
      isLate: false,
      version: 1,
    };

    setSubmissionsList((prev) => [newSub, ...prev]);
    setUploading(false);
    setUploadFile(null);
    setUploadProgress(0);
  };

  // Add Discussion Thread
  const handleCreateDiscussion = () => {
    if (!newDiscussionTitle || !newDiscussionContent) return;

    const newThread: Discussion = {
      id: getNextDiscussionId(),
      courseId,
      title: newDiscussionTitle,
      content: newDiscussionContent,
      authorName: "Ahmad Fauzi",
      repliesCount: 0,
      date: new Date().toISOString(),
      replies: [],
    };

    setDiscussions((prev) => [newThread, ...prev]);
    setNewDiscussionTitle("");
    setNewDiscussionContent("");
    setShowAddDiscussion(false);
  };

  // Add Discussion Reply
  const handleAddReply = (discussionId: string) => {
    const replyText = replyInputs[discussionId];
    if (!replyText) return;

    setDiscussions((prev) =>
      prev.map((disc) => {
        if (disc.id === discussionId) {
          return {
            ...disc,
            repliesCount: disc.repliesCount + 1,
            replies: [
              ...disc.replies,
              {
                id: getNextReplyId(),
                authorName: "Ahmad Fauzi",
                content: replyText,
                date: new Date().toISOString(),
              },
            ],
          };
        }
        return disc;
      })
    );

    setReplyInputs((prev) => ({ ...prev, [discussionId]: "" }));
  };

  return (
    <div className="space-y-6">
      {/* Back button and path */}
      <div className="flex items-center justify-between">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-[13px] font-semibold text-muted hover:text-ink transition-colors cursor-pointer">
          <ArrowLeft size={16} /> Kembali ke Dashboard
        </Link>
        <span className="text-[11px] font-mono text-muted uppercase tracking-wider">
          Kode MK: {course.code}
        </span>
      </div>

      {/* Course Header Banner */}
      <div className="rounded-2xl border border-border bg-surface p-6 sm:p-8 hover:shadow-xs transition-shadow">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2">
            <span className="inline-block rounded-full bg-iris-50 px-2.5 py-0.5 text-[11px] font-semibold text-iris-800">
              {course.semester}
            </span>
            <h1 className="text-xl font-bold tracking-tight text-ink md:text-2xl">
              {course.name}
            </h1>
            <p className="text-[13px] text-muted max-w-2xl leading-relaxed">
              {course.description}
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

      {/* Main Grid: Left Tabs Content (70%) & Right Course Info (30%) */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column (Main Tabs & Content) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Sub Navigation Tabs */}
          <div className="flex border-b border-border gap-1 overflow-x-auto pb-px">
            {([
              { id: "materi", label: "Materi Kuliah" },
              { id: "tugas", label: "Tugas & Ujian" },
              { id: "diskusi", label: "Forum Diskusi" },
              { id: "nilai", label: "Penilaian" },
            ] as const).map((tab) => {
              const isActive = activeSubTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveSubTab(tab.id)}
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

          {/* -------------------- TAB CONTENT: MATERI -------------------- */}
          {activeSubTab === "materi" && (
            <div className="space-y-4">
              <h2 className="text-[15px] font-bold text-ink">Timeline Pembelajaran Mingguan</h2>
              
              <div className="space-y-3">
                {Array.from({ length: 14 }).map((_, idx) => {
                  const weekNo = idx + 1;
                  const isExpanded = expandedWeeks[weekNo];
                  const weekModules = courseModules.filter((m) => m.weekNo === weekNo);
                  
                  return (
                    <Card key={weekNo} className="overflow-hidden">
                      {/* Week Accordion Header */}
                      <button
                        onClick={() => toggleWeek(weekNo)}
                        className="flex w-full items-center justify-between p-4 bg-surface2/30 hover:bg-surface2/60 transition-colors cursor-pointer text-left"
                      >
                        <div>
                          <span className="text-[13px] font-bold text-ink">Minggu ke-{weekNo}</span>
                          <span className="text-[11px] text-muted block mt-0.5">
                            {weekNo === 8 ? "Evaluasi Tengah Semester (UTS)" : weekNo === 15 ? "Evaluasi Akhir Semester (UAS)" : `${weekModules.length} materi pembelajaran`}
                          </span>
                        </div>
                        {isExpanded ? <ChevronUp size={16} className="text-muted" /> : <ChevronDown size={16} className="text-muted" />}
                      </button>

                      {/* Week Accordion Content */}
                      {isExpanded && (
                        <div className="p-4 border-t border-border/50 divide-y divide-border/40">
                          {weekModules.length > 0 ? (
                            weekModules.map((mod) => (
                              <div key={mod.id} className="py-3.5 first:pt-0 last:pb-0 space-y-2">
                                <div className="flex items-start justify-between gap-3">
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
                                      <p className="text-[11px] text-muted leading-relaxed mt-0.5">{mod.description}</p>
                                    </div>
                                  </div>
                                  
                                  <a href={mod.contentUrl} target="_blank" rel="noopener noreferrer">
                                    <Button variant="ghost" size="sm" className="h-8 text-muted gap-1 text-[11px] hover:text-ink">
                                      Buka <ExternalLink size={12} />
                                    </Button>
                                  </a>
                                </div>

                                {/* Video Player Embed Preview for YouTube videos */}
                                {mod.type === "video" && mod.contentUrl.includes("youtube") && (
                                  <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-border mt-2 shadow-xs">
                                    <iframe
                                      src={mod.contentUrl}
                                      title={mod.title}
                                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                      allowFullScreen
                                      className="absolute inset-0 size-full border-0"
                                    ></iframe>
                                  </div>
                                )}
                              </div>
                            ))
                          ) : (
                            <p className="text-center py-4 text-muted text-[12px]">Belum ada materi untuk minggu ini.</p>
                          )}
                        </div>
                      )}
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* -------------------- TAB CONTENT: TUGAS -------------------- */}
          {activeSubTab === "tugas" && (
            <div className="space-y-4">
              <h2 className="text-[15px] font-bold text-ink">Daftar Tugas Perkuliahan</h2>
              
              <div className="space-y-3">
                {courseAssignments.length > 0 ? (
                  courseAssignments.map((asm) => {
                    const isSelected = selectedAsmId === asm.id;
                    const submission = submissionsList.find(
                      (sub) => sub.assignmentId === asm.id && sub.studentId === "STU-001"
                    );
                    const hasSubmitted = !!submission;
                    const dl = new Date(asm.deadline);

                    return (
                      <Card key={asm.id} className="overflow-hidden">
                        <div
                          onClick={() => setSelectedAsmId(isSelected ? null : asm.id)}
                          className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 cursor-pointer hover:bg-surface2/30 transition-colors"
                        >
                          <div>
                            <h3 className="text-[13px] font-bold text-ink leading-snug">{asm.title}</h3>
                            <span className="text-[11px] text-muted flex items-center gap-1.5 mt-1">
                              <Calendar size={12} />
                              Deadline: {dl.toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              })} WIB
                            </span>
                          </div>
                          
                          <div className="flex items-center gap-2 self-start sm:self-center">
                            <span className="text-[10px] text-muted font-semibold bg-surface2 border border-border px-2 py-0.5 rounded-full">
                              Bobot {asm.weightPct}%
                            </span>
                            {hasSubmitted ? (
                              <Badge variant="green">Diserahkan</Badge>
                            ) : (
                              <Badge variant="red">Belum Dikumpul</Badge>
                            )}
                          </div>
                        </div>

                        {isSelected && (
                          <div className="p-5 border-t border-border bg-surface2/20 space-y-4">
                            <div className="text-[13px] text-ink2 leading-relaxed whitespace-pre-line bg-white border border-border/80 p-4 rounded-xl">
                              {asm.description}
                            </div>

                            {/* Details Table */}
                            <div className="grid grid-cols-2 gap-4 text-[12px] bg-surface2 p-3 rounded-lg border border-border">
                              <div>
                                <span className="text-muted block">Format File</span>
                                <span className="font-semibold text-ink uppercase">{asm.allowedFormats.join(", ")}</span>
                              </div>
                              <div>
                                <span className="text-muted block">Ukuran Maksimal</span>
                                <span className="font-semibold text-ink">{asm.maxSizeMb} MB</span>
                              </div>
                            </div>

                            {/* Submit Form Area */}
                            <div className="border-t border-border/80 pt-4 space-y-3">
                              <h4 className="text-[12px] font-bold text-ink uppercase tracking-wider">Status Pengumpulan</h4>
                              
                              {hasSubmitted ? (
                                <div className="space-y-3">
                                  <div className="flex items-start gap-3 bg-emerald-50 border border-emerald-100 p-4 rounded-xl text-emerald-800">
                                    <CheckCircle2 size={18} className="text-success mt-0.5 shrink-0" />
                                    <div className="text-[13px]">
                                      <p className="font-bold">Tugas berhasil diserahkan</p>
                                      <p className="text-[11px] opacity-90 mt-0.5">
                                        File: <span className="underline font-mono">{submission.fileUrl}</span>
                                      </p>
                                      <p className="text-[11px] opacity-90 mt-0.5">
                                        Tanggal: {new Date(submission.submittedAt).toLocaleDateString("id-ID", {
                                          day: "numeric",
                                          month: "long",
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        })} WIB
                                      </p>
                                    </div>
                                  </div>

                                  {submission.grade !== undefined && (
                                    <div className="bg-iris-50/50 border border-iris-100 p-4 rounded-xl space-y-2">
                                      <div className="flex items-center justify-between">
                                        <span className="text-[12px] font-bold text-iris-800 flex items-center gap-1.5">
                                          <GraduationCap size={16} /> Penilaian Dosen
                                        </span>
                                        <span className="text-lg font-black text-iris-600">{submission.grade}/100</span>
                                      </div>
                                      {submission.feedback && (
                                        <p className="text-[12px] text-ink2 bg-white/60 p-2.5 rounded-lg border border-border">
                                          &ldquo;{submission.feedback}&rdquo;
                                        </p>
                                      )}
                                    </div>
                                  )}
                                </div>
                              ) : (
                                <div className="space-y-3">
                                  <div className="flex flex-col gap-1.5">
                                    <Label htmlFor={`file-${asm.id}`} className="text-[12px]">Pilih File Tugas</Label>
                                    <Input
                                      id={`file-${asm.id}`}
                                      type="file"
                                      onChange={handleFileChange}
                                      disabled={uploading}
                                      className="bg-white"
                                    />
                                    {uploadFile && (
                                      <p className="text-[11px] text-muted">
                                        File terpilih: <span className="font-mono text-ink font-semibold">{uploadFile.name}</span> ({(uploadFile.size / (1024 * 1024)).toFixed(2)} MB)
                                      </p>
                                    )}
                                  </div>

                                  {uploading && (
                                    <div className="space-y-1.5">
                                      <div className="h-2 w-full bg-border rounded-full overflow-hidden">
                                        <div
                                          className="h-full bg-iris-500 rounded-full transition-all duration-300"
                                          style={{ width: `${uploadProgress}%` }}
                                        ></div>
                                      </div>
                                      <p className="text-[10px] text-center text-muted font-bold">Mengunggah... {uploadProgress}%</p>
                                    </div>
                                  )}

                                  <Button
                                    onClick={() => handleSubmitAssignment(asm.id)}
                                    disabled={!uploadFile || uploading}
                                    className="w-full sm:w-auto cursor-pointer"
                                  >
                                    Unggah & Serahkan Tugas
                                  </Button>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </Card>
                    );
                  })
                ) : (
                  <div className="py-8 text-center text-muted text-[13px]">Tidak ada tugas terdaftar.</div>
                )}
              </div>
            </div>
          )}

          {/* -------------------- TAB CONTENT: DISKUSI -------------------- */}
          {activeSubTab === "diskusi" && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-[15px] font-bold text-ink">Forum Diskusi Kelas</h2>
                <Button
                  onClick={() => setShowAddDiscussion(!showAddDiscussion)}
                  variant="ghost"
                  className="text-iris-600 gap-1 text-[12px] h-9 cursor-pointer"
                >
                  <PlusCircle size={16} /> Buat Diskusi Baru
                </Button>
              </div>

              {/* Add Discussion Form */}
              {showAddDiscussion && (
                <Card className="p-5 space-y-3 bg-iris-50/20 border-iris-100">
                  <h3 className="text-[13px] font-bold text-ink">Mulai Diskusi Baru</h3>
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <Label htmlFor="disc-title">Judul Diskusi</Label>
                      <Input
                        id="disc-title"
                        placeholder="Contoh: Pertanyaan tentang Tugas 1"
                        value={newDiscussionTitle}
                        onChange={(e) => setNewDiscussionTitle(e.target.value)}
                        className="bg-white"
                      />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="disc-content">Isi Pertanyaan / Topik</Label>
                      <Textarea
                        id="disc-content"
                        placeholder="Tulis detail topik diskusi Anda di sini..."
                        value={newDiscussionContent}
                        onChange={(e) => setNewDiscussionContent(e.target.value)}
                        className="bg-white min-h-[100px]"
                      />
                    </div>
                    <div className="flex items-center gap-2 pt-2 justify-end">
                      <Button variant="ghost" size="sm" onClick={() => setShowAddDiscussion(false)}>
                        Batal
                      </Button>
                      <Button size="sm" onClick={handleCreateDiscussion}>
                        Kirim Thread
                      </Button>
                    </div>
                  </div>
                </Card>
              )}

              {/* Discussions List */}
              <div className="space-y-4">
                {discussions.length > 0 ? (
                  discussions.map((disc) => (
                    <Card key={disc.id} className="p-5 space-y-4">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-semibold text-iris-600 bg-iris-50 px-2.5 py-0.5 rounded-full">
                            {disc.authorName}
                          </span>
                          <span className="text-[10px] text-muted">
                            {new Date(disc.date).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })} WIB
                          </span>
                        </div>
                        <h3 className="text-[14px] font-bold text-ink leading-snug">{disc.title}</h3>
                        <p className="text-[12px] text-ink2 leading-relaxed">{disc.content}</p>
                      </div>

                      {/* Replies Section */}
                      <div className="border-t border-border/60 pt-4 space-y-3">
                        <h4 className="text-[11px] font-bold text-ink uppercase tracking-wider flex items-center gap-1.5">
                          <MessageSquare size={13} className="text-muted" /> Tanggapan ({disc.replies.length})
                        </h4>

                        {disc.replies.length > 0 && (
                          <div className="space-y-3 bg-surface2/30 p-3 rounded-xl border border-border/50">
                            {disc.replies.map((reply) => (
                              <div key={reply.id} className="text-[12px] space-y-1 pb-3 last:pb-0 border-b last:border-0 border-border/40">
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-ink">{reply.authorName}</span>
                                  <span className="text-[10px] text-muted">
                                    {new Date(reply.date).toLocaleDateString("id-ID", {
                                      day: "numeric",
                                      month: "short",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    })}
                                  </span>
                                </div>
                                <p className="text-ink2 leading-relaxed">{reply.content}</p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Reply Form */}
                        <div className="flex gap-2">
                          <Input
                            placeholder="Tulis tanggapan Anda..."
                            value={replyInputs[disc.id] || ""}
                            onChange={(e) =>
                              setReplyInputs((prev) => ({ ...prev, [disc.id]: e.target.value }))
                            }
                            className="bg-white text-[12px] h-9"
                          />
                          <Button
                            size="sm"
                            onClick={() => handleAddReply(disc.id)}
                            className="h-9 w-9 p-0 flex items-center justify-center shrink-0"
                          >
                            <Send size={14} />
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))
                ) : (
                  <div className="py-8 text-center text-muted text-[13px]">Belum ada topik diskusi. Jadilah yang pertama bertanya!</div>
                )}
              </div>
            </div>
          )}

          {/* -------------------- TAB CONTENT: NILAI -------------------- */}
          {activeSubTab === "nilai" && (
            <Card className="p-5 space-y-5">
              <h2 className="text-[14px] font-bold text-ink uppercase tracking-wider">Rincian Penilaian</h2>
              
              <div className="overflow-x-auto">
                <table className="w-full text-left text-[13px] border-collapse">
                  <thead>
                    <tr className="border-b border-border text-muted font-semibold">
                      <th className="pb-3 pr-4">Komponen Penilaian</th>
                      <th className="pb-3 pr-4 text-center">Bobot</th>
                      <th className="pb-3 pr-4 text-center">Nilai Uji</th>
                      <th className="pb-3 text-right">Nilai Kontribusi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/60">
                    {[
                      { name: "Rata-rata Tugas", weight: "40%", score: 90, contribution: 36.0 },
                      { name: "Ujian Tengah Semester (UTS)", weight: "25%", score: 80, contribution: 20.0 },
                      { name: "Ujian Akhir Semester (UAS)", weight: "25%", score: 85, contribution: 21.25 },
                      { name: "Partisipasi & Kehadiran", weight: "10%", score: 95, contribution: 9.5 },
                    ].map((item, idx) => (
                      <tr key={idx}>
                        <td className="py-3.5 pr-4 font-semibold text-ink">{item.name}</td>
                        <td className="py-3.5 pr-4 text-center text-muted">{item.weight}</td>
                        <td className="py-3.5 pr-4 text-center font-bold text-ink">{item.score}</td>
                        <td className="py-3.5 text-right font-mono font-semibold text-muted">+{item.contribution.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="border-t border-border pt-4 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold text-muted tracking-wider">Akumulasi Nilai</span>
                  <p className="text-xl font-bold text-ink">86.75 / 100</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-muted tracking-wider block text-right">Predikat Huruf</span>
                  <span className="inline-block rounded-full bg-success/15 px-3.5 py-1 text-[13px] font-black text-success mt-0.5">
                    A (Lulus Sangat Memuaskan)
                  </span>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Right Column (Course Info Sidebar) */}
        <div className="space-y-6">
          {/* Lecturer Contact Info */}
          <Card className="p-5 space-y-4">
            <h3 className="text-[13px] font-bold text-ink uppercase tracking-wider pb-2 border-b border-border/80">
              Dosen Pengampu
            </h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-iris-50 text-iris-600 font-bold shrink-0">
                  {course.lecturer.charAt(0)}
                </div>
                <div>
                  <h4 className="text-[13px] font-bold text-ink leading-tight">{course.lecturer}</h4>
                  <span className="text-[10px] text-muted">NIP. 198501012010011001</span>
                </div>
              </div>
              <div className="text-[12px] space-y-1.5 text-muted pt-2 border-t border-border/60">
                <p>Email: <span className="text-ink">budi.santoso@dsn.dinus.ac.id</span></p>
                <p>Telepon: <span className="text-ink">08123456780</span></p>
                <p>Ruang: <span className="text-ink">Gedung H Lantai 2 (H.2.3)</span></p>
              </div>
            </div>
          </Card>

          {/* Academic Communication Links */}
          <Card className="p-5 space-y-4">
            <h3 className="text-[13px] font-bold text-ink uppercase tracking-wider pb-2 border-b border-border/80">
              Media & Pembelajaran
            </h3>
            <div className="space-y-2.5">
              <a href="https://zoom.us/j/123456789" target="_blank" rel="noopener noreferrer" className="block">
                <Button className="w-full gap-2 justify-center bg-iris-600 hover:bg-iris-700 cursor-pointer" size="md">
                  <Video size={16} /> Masuk Meeting Zoom
                </Button>
              </a>
              <button className="w-full flex items-center justify-between rounded-lg border border-border px-3 py-2 text-[12px] font-semibold text-ink hover:bg-surface2 transition-colors cursor-pointer text-left">
                <span className="flex items-center gap-2">
                  <FileText size={15} className="text-muted" /> Rencana Pembelajaran (RPS)
                </span>
                <Download size={14} className="text-muted" />
              </button>
            </div>
          </Card>

          {/* Class Representative Info */}
          <Card className="p-5 space-y-4">
            <h3 className="text-[13px] font-bold text-ink uppercase tracking-wider pb-2 border-b border-border/80">
              Komisaris Tingkat (Komting)
            </h3>
            <div className="flex items-center gap-3">
              <div className="flex size-8 items-center justify-center rounded-full bg-surface2 border border-border text-muted shrink-0">
                <User size={15} />
              </div>
              <div>
                <h4 className="text-[12px] font-bold text-ink leading-tight">Reza Ramadhan</h4>
                <p className="text-[10px] text-muted mt-0.5">HP: 0896-1234-5678</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
