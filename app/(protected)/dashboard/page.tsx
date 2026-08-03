import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import StudentDashboardClient from "./StudentDashboardClient";

export default async function DashboardPage(props: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const searchParams = await props.searchParams;
  const tab = searchParams.tab || "overview";

  const supabase = await createClient();
  
  // 1. Ambil session user
  const { data: { user: authUser } } = await supabase.auth.getUser();

  let dbUser = undefined;
  let dbCourses = undefined;
  let dbAnnouncements = undefined;
  let dbCalendarEvents = undefined;
  let dbAssignments = undefined;
  let dbSubmissions = undefined;
  let dbGrades = undefined;

  if (authUser) {
    try {
      // Pastikan profil user ada di public.users
      const { data: userProfile } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single();
        
      if (!userProfile) {
        const fallbackName = authUser.user_metadata?.name || authUser.email?.split('@')[0] || 'Mahasiswa';
        const fallbackNim = authUser.user_metadata?.nim_nip || `MHS-${Math.floor(100000 + Math.random() * 900000)}`;
        const { data: newProfile } = await supabase
          .from('users')
          .insert({
            id: authUser.id,
            name: fallbackName,
            email: authUser.email || '',
            password: 'hashed_by_supabase_auth',
            nim_nip: fallbackNim,
            role: 'mahasiswa'
          })
          .select()
          .single();
        dbUser = newProfile;
      } else {
        dbUser = userProfile;
      }

      // Cek keikutsertaan (enrollments)
      const { data: currentEnrollments } = await supabase
        .from('enrollments')
        .select('class_id')
        .eq('student_id', authUser.id);

      // Auto-enroll jika belum memiliki keikutsertaan kelas sama sekali
      if (currentEnrollments && currentEnrollments.length === 0) {
        const seedClassIds = [
          'c101c101-c101-c101-c101-c101c101c101', // Pemrograman Web
          'c102c102-c102-c102-c102-c102c102c102', // Basis Data
          'c103c103-c103-c103-c103-c103c103c103', // Struktur Data
          'c104c104-c104-c104-c104-c104c104c104', // Jaringan Komputer
          'c105c105-c105-c105-c105-c105c105c105', // Sistem Operasi
          'c106c106-c106-c106-c106-c106c106c106', // RPL
          'c108c108-c108-c108-c108-c108c108c108'  // Praktikum Web
        ];
        const enrollList = seedClassIds.map(cid => ({
          student_id: authUser.id,
          class_id: cid,
          status: 'active'
        }));
        await supabase.from('enrollments').insert(enrollList);
      }

      // Ambil daftar kelas terdaftar
      const { data: enrolls } = await supabase
        .from('enrollments')
        .select(`
          class_id,
          classes (
            id,
            class_name,
            semester,
            status,
            day_of_week,
            start_time,
            end_time,
            room,
            courses (
              id,
              name,
              code,
              sks,
              kelompok_mk,
              description
            ),
            users (
              name
            )
          )
        `)
        .eq('student_id', authUser.id);

      if (enrolls && enrolls.length > 0) {
        dbCourses = enrolls
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .filter((e: any) => e.classes !== null)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((e: any) => {
            const cls = e.classes;
            const c = cls.courses;
            return {
              id: cls.id,
              name: c?.name || '',
              code: c?.code || '',
              class_name: cls.class_name,
              semester: cls.semester,
              sks: c?.sks || 0,
              kelompok_mk: c?.kelompok_mk || 'Wajib Program Studi',
              day_of_week: cls.day_of_week,
              start_time: cls.start_time,
              end_time: cls.end_time,
              room: cls.room,
              lecturer: cls.users?.name || 'Dr. Budi Santoso',
              description: c?.description || '',
              status: cls.status
            };
          });
      }

      // Ambil pengumuman
      const { data: announcementsData } = await supabase
        .from('announcements')
        .select('*, classes(courses(name))');
      if (announcementsData) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dbAnnouncements = announcementsData.map((a: any) => ({
          id: a.id,
          courseId: a.class_id,
          title: a.title,
          content: a.content,
          date: a.date,
          lecturerName: 'Dr. Budi Santoso'
        }));
      }

      // Ambil calendar events
      const { data: calendarEventsData } = await supabase
        .from('calendar_events')
        .select('*');
      if (calendarEventsData) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dbCalendarEvents = calendarEventsData.map((e: any) => ({
          id: e.id,
          title: e.title,
          date: e.date,
          type: e.type,
          courseId: e.class_id
        }));
      }

      // Ambil assignments
      const { data: assignmentsData } = await supabase
        .from('assignments')
        .select('*');
      if (assignmentsData) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dbAssignments = assignmentsData.map((a: any) => ({
          id: a.id,
          courseId: a.class_id,
          title: a.title,
          description: a.description,
          deadline: a.deadline,
          weightPct: a.weight_pct,
          allowedFormats: a.allowed_formats,
          maxSizeMb: a.max_size_mb
        }));
      }

      // Ambil submissions
      const { data: submissionsData } = await supabase
        .from('submissions')
        .select('*')
        .eq('student_id', authUser.id);
      if (submissionsData) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dbSubmissions = submissionsData.map((s: any) => ({
          id: s.id,
          assignmentId: s.assignment_id,
          studentId: s.student_id,
          fileUrl: s.file_url,
          submittedAt: s.submitted_at,
          isLate: s.is_late,
          version: s.version,
          grade: s.grade,
          feedback: s.feedback,
          gradedAt: s.graded_at
        }));
      }

      // Ambil grades
      const { data: gradesData } = await supabase
        .from('grades')
        .select(`
          id,
          assignment_score,
          midterm_score,
          final_score,
          participation_score,
          final_grade_letter,
          classes (
            id,
            courses (
              code,
              name,
              sks
            )
          )
        `)
        .eq('student_id', authUser.id);
      
      if (gradesData) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        dbGrades = gradesData.map((g: any) => {
          const cls = g.classes;
          const c = Array.isArray(cls?.courses) ? cls.courses[0] : cls?.courses;
          return {
            id: g.id,
            classId: cls?.id || '',
            code: c?.code || 'TI-MOCK',
            name: c?.name || 'Mata Kuliah',
            sks: c?.sks || 3,
            tugas: g.assignment_score || 0,
            uts: g.midterm_score || 0,
            uas: g.final_score || 0,
            part: g.participation_score || 0,
            final: g.final_grade_letter || 'TBD',
          };
        });
      }
    } catch (err) {
      console.error("Gagal mengambil data dari Supabase, menggunakan data statis local:", err);
    }
  }

  return (
    <Suspense fallback={
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-iris-500 border-t-transparent"></div>
      </div>
    }>
      <StudentDashboardClient 
        initialTab={tab} 
        dbUser={dbUser}
        dbCourses={dbCourses}
        dbAnnouncements={dbAnnouncements}
        dbCalendarEvents={dbCalendarEvents}
        dbAssignments={dbAssignments}
        dbSubmissions={dbSubmissions}
        dbGrades={dbGrades}
      />
    </Suspense>
  );
}
