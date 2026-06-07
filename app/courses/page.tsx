import { mockCourses } from "@/data/courses";
import Link from "next/link";
import { Search, SlidersHorizontal, BookOpen, Clock, Users, ArrowRight, Bell, LayoutDashboard, Calendar } from "lucide-react";

export default function CoursesPage() {
  const activeCourses = mockCourses.filter((c) => c.status === "active");
  const completedCourses = mockCourses.filter((c) => c.status === "completed");

  return (
    <div className="min-h-screen bg-surface2/30 font-sans selection:bg-iris-500/30 selection:text-ink">
      {/* Logged-in Dashboard Navbar */}
      <header className="sticky top-0 z-50 border-b border-border/60 bg-surface/95 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-[1200px] items-center justify-between px-6">
            <div className="flex items-center gap-8">
                <Link href="/" className="flex items-center gap-2.5">
                    <div className="flex size-7 items-center justify-center rounded-md bg-ink text-surface text-[12px] font-bold shadow-sm">
                        K
                    </div>
                    <span className="text-[14px] font-semibold tracking-tight text-ink">
                        KULINO Workspace
                    </span>
                </Link>
                
                {/* Dashboard Navigation */}
                <nav className="hidden md:flex items-center gap-1 text-[13px] font-medium text-muted">
                    <Link href="/courses" className="hover:text-ink transition-colors flex items-center gap-2 px-3 py-1.5 rounded-md">
                        <LayoutDashboard size={14} /> Ringkasan
                    </Link>
                    <Link href="/courses" className="text-ink flex items-center gap-2 bg-surface2 px-3 py-1.5 rounded-md shadow-sm border border-border/50">
                        <BookOpen size={14} /> Mata Kuliah Saya
                    </Link>
                    <Link href="/courses" className="hover:text-ink transition-colors flex items-center gap-2 px-3 py-1.5 rounded-md">
                        <Calendar size={14} /> Jadwal
                    </Link>
                </nav>
            </div>
            
            <div className="flex items-center gap-4">
                <button className="text-muted hover:text-ink transition-colors relative p-1">
                    <Bell size={18} />
                    <span className="absolute top-0.5 right-0.5 size-2.5 rounded-full bg-red-500 border-2 border-surface"></span>
                </button>
                <div className="h-4 w-px bg-border"></div>
                <div className="flex items-center gap-2 cursor-pointer group">
                    <div className="size-8 rounded-full bg-iris-500/10 flex items-center justify-center text-iris-600 font-semibold text-[12px] group-hover:bg-iris-500/20 transition-colors border border-iris-500/20">
                        JD
                    </div>
                </div>
            </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1200px] px-6 py-10">
        {/* Page Header */}
        <div className="mb-10 pb-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div>
                    <h1 className="text-[28px] font-bold text-ink tracking-tight mb-2">Mata Kuliah Saya</h1>
                    <p className="text-[14px] text-muted max-w-xl leading-relaxed">
                        Kelola mata kuliah yang Anda ikuti, pantau kemajuan Anda saat ini, dan akses ruang kerja Anda.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={15} />
                        <input 
                            type="text" 
                            placeholder="Cari mata kuliah..." 
                            className="h-9 w-full sm:w-64 rounded-md border border-border bg-surface px-9 text-[13px] text-ink placeholder:text-muted/70 focus:border-iris-500 focus:outline-none focus:ring-1 focus:ring-iris-500 transition-all shadow-sm"
                        />
                    </div>
                    <button className="flex h-9 items-center justify-center gap-2 rounded-md border border-border bg-surface px-4 text-[13px] font-medium text-ink transition-colors hover:bg-surface2 shadow-sm">
                        <SlidersHorizontal size={14} className="text-muted" />
                        <span className="hidden sm:inline">Filter</span>
                    </button>
                </div>
            </div>
        </div>

        <div className="space-y-12 pb-20">
            <section>
                <div className="mb-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <h2 className="text-[16px] font-semibold text-ink tracking-tight">Semester Aktif</h2>
                        <span className="inline-flex items-center rounded-full bg-iris-500/10 px-2.5 py-0.5 text-[11px] font-semibold text-iris-600 border border-iris-500/20">
                            {activeCourses.length} Terdaftar
                        </span>
                    </div>
                </div>
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {activeCourses.map((course) => (
                        <CourseCard key={course.id} course={course} isActive={true} />
                    ))}
                </div>
            </section>

            {completedCourses.length > 0 && (
                <section>
                    <div className="mb-5 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <h2 className="text-[16px] font-semibold text-ink tracking-tight">Mata Kuliah Sebelumnya</h2>
                            <span className="inline-flex items-center rounded-full bg-surface3 px-2.5 py-0.5 text-[11px] font-semibold text-muted border border-border">
                                {completedCourses.length} Selesai
                            </span>
                        </div>
                    </div>
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        {completedCourses.map((course) => (
                            <CourseCard key={course.id} course={course} isActive={false} />
                        ))}
                    </div>
                </section>
            )}
        </div>
      </main>
    </div>
  );
}

function CourseCard({ course, isActive }: { course: (typeof mockCourses)[number], isActive: boolean }) {
  return (
    <div className={`group relative flex flex-col rounded-xl border ${isActive ? 'border-border/80 hover:border-iris-300' : 'border-border/40 hover:border-border'} bg-surface p-5 shadow-sm hover:shadow-md transition-all duration-300`}>
        {/* Top Accent Line on hover for active courses */}
        {isActive && (
            <div className="absolute -top-[1px] left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-iris-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        )}
        
        <div className="mb-4 flex items-start justify-between">
            <div className={`flex size-10 items-center justify-center rounded-lg ${isActive ? 'bg-iris-500/10 text-iris-600' : 'bg-surface2 text-muted'} border border-border/50`}>
                <course.icon size={18} strokeWidth={isActive ? 2 : 1.5} />
            </div>
            <span className={`inline-flex shrink-0 items-center rounded-md px-2 py-1 text-[10px] font-semibold tracking-wide ${isActive ? 'bg-surface2 text-ink border border-border/50' : 'bg-surface2/50 text-muted border border-border/30'}`}>
                {course.code}
            </span>
        </div>
        
        <div className="mb-4 flex-1">
            <h3 className="text-[15px] font-semibold text-ink leading-tight mb-1.5 group-hover:text-iris-600 transition-colors">
                {course.name}
            </h3>
            <p className="line-clamp-2 text-[13px] text-muted leading-relaxed">
                {course.description}
            </p>
        </div>
        
        <div className="mt-auto space-y-4">
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-[12px] text-muted border-t border-border/50 pt-4">
                <div className="flex items-center gap-1.5">
                    <Users size={14} className="text-muted/70" />
                    <span className="truncate max-w-[120px]">{course.lecturer}</span>
                </div>
                <div className="flex items-center gap-1.5">
                    <Clock size={14} className="text-muted/70" />
                    <span>{course.sks} SKS</span>
                </div>
            </div>
            
            {isActive && (
                <button className="w-full flex items-center justify-center gap-2 rounded-md bg-surface2/50 hover:bg-surface3 py-2 text-[12px] font-semibold text-ink transition-colors border border-border/50">
                    Buka Ruang Kerja <ArrowRight size={14} />
                </button>
            )}
        </div>
    </div>
  );
}
