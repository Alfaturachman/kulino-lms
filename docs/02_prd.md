# Product Requirements Document (PRD)

## KULINO — Product Definition

**Versi:** 1.2 | **Tipe:** Engineering Doc | **Status:** Approved (Tersinkronisasi)

---

## 1. Product Vision & Positioning

> _"Untuk mahasiswa dan dosen yang ingin pengalaman belajar online yang terstruktur dan efisien, KULINO adalah platform LMS akademik yang menyediakan seluruh workflow perkuliahan dalam satu ekosistem digital."_

Unlike platform umum seperti Google Classroom yang bersifat generik, KULINO dirancang khusus untuk struktur akademik Indonesia: kontrak kuliah, RPS, UTS/UAS, dan sistem SKS.

---

## 2. User Personas & Use Cases

### Mahasiswa

- Login & akses dashboard
- Lihat daftar mata kuliah aktif
- Buka materi mingguan (video, PDF, link)
- Submit penilaian (tugas/UTS/UAS) & ikuti online quiz
- Lihat nilai & progress belajar
- Partisipasi di forum diskusi kelas
- Terima notifikasi deadline

### Dosen Pengampu

- Upload materi per minggu
- Buat penilaian (tugas/UTS/UAS) dengan mode file_upload / online_quiz / manual
- Atur deadline & bobot penilaian
- Review & grade submission mahasiswa
- Monitor absensi & keaktifan
- Kirim pengumuman kelas

### Staff TU

- Tambah kelas / course baru
- Daftarkan mahasiswa ke kelas
- Assign dosen ke course
- Kelola jadwal semester

### Admin / Kepala TU

- Manajemen semua user (CRUD)
- Atur role & permission
- Lihat statistik sistem
- Kelola kalender akademik
- Generate laporan akademik

### Pengunjung / Tamu (Anonim — tanpa login)

- Lihat landing page platform
- Jelajahi katalog course (terbatas)
- Preview demo materi
- Registrasi akun baru (hasil: role Mahasiswa)

---

## 3. Feature Roadmap

| Fitur               | Deskripsi                                | User             | Phase   | Priority |
| ------------------- | ---------------------------------------- | ---------------- | ------- | -------- |
| Auth System         | Login, register, role redirect           | All              | Phase 1 | P0       |
| Course Dashboard    | Daftar mata kuliah + overview            | Mahasiswa        | Phase 1 | P0       |
| Course Detail Page  | Kontrak kuliah, RPS, materi mingguan     | Mahasiswa, Dosen | Phase 1 | P0       |
| Material Viewer     | Embed YouTube, PDF, PPT preview          | Mahasiswa        | Phase 1 | P0       |
| Assessment System   | Buat (file_upload/online_quiz/manual), submit, grade      | Mahasiswa, Dosen | Phase 2 | P1       |
| Online Quiz / Ujian  | MCQ, essay, waktu terbatas, auto-submit                  | Mahasiswa, Dosen | Phase 2 | P1       |
| Forum Diskusi       | Thread per kelas, reply, upvote          | Mahasiswa, Dosen | Phase 2 | P1       |
| Announcement        | Broadcast ke kelas, pin penting          | Dosen, Admin     | Phase 2 | P1       |
| Notification Center | Bell icon, deadline alerts, unread badge | All              | Phase 3 | P2       |
| Analytics Dashboard | Engagement, nilai rata-rata, absensi     | Dosen, Admin     | Phase 3 | P2       |
| Academic Calendar   | Visualisasi timeline semester            | All              | Phase 3 | P2       |
| User Settings       | Edit profil, foto, password, preferensi  | All              | Phase 3 | P2       |

---

## 4. User Stories (Core Flows)

### US-01 — Mahasiswa melihat daftar mata kuliah aktif

**Sebagai** mahasiswa, **saya ingin** melihat semua mata kuliah yang saya ikuti di semester ini dengan status progress, **sehingga** saya bisa melanjutkan belajar dengan cepat.

**Acceptance Criteria:**

- Menampilkan max 8 course per semester
- Setiap card menampilkan nama MK, kode kelas, nama dosen, progress %, dan status
- Bisa difilter berdasarkan semester dan status (aktif/selesai)

---

### US-02 — Mahasiswa mengumpulkan tugas sebelum deadline

**Sebagai** mahasiswa, **saya ingin** mengunggah file tugas (max 10MB) dan menerima konfirmasi submission, **sehingga** saya yakin tugas saya sudah diterima sistem.

**Acceptance Criteria:**

- Upload file dengan validasi format dan ukuran
- Tampilkan konfirmasi dengan timestamp setelah submit
- Jika melewati deadline, submission masih bisa tapi ditandai "Late"

---

### US-03 — Dosen melihat siapa saja yang belum submit tugas

**Sebagai** dosen, **saya ingin** melihat daftar mahasiswa yang belum mengumpulkan tugas beserta persentase submission, **sehingga** saya dapat mengirim reminder tepat waktu.

**Acceptance Criteria:**

- Tabel daftar mahasiswa dengan status submitted / not submitted
- Persentase submission real-time
- Tombol kirim reminder ke mahasiswa yang belum submit

---

### US-04 — Admin menambahkan mahasiswa ke kelas

**Sebagai** admin, **saya ingin** mendaftarkan mahasiswa ke kelas tertentu secara bulk (CSV import), **sehingga** proses pendaftaran semester baru tidak memakan waktu lama. Dan juga bisa menampilkan data mahasiswa yang sudah terdaftar di kelas tersebut. Dan menambahkan mahasiswa ke kelas tertentu secara manual. Dan juga bisa menghapus mahasiswa dari kelas tertentu. Dan juga bisa memindahkan mahasiswa dari kelas tertentu ke kelas lain.

**Acceptance Criteria:**

- Upload CSV dengan format yang ditentukan
- Preview data sebelum konfirmasi import
- Laporan hasil import (berhasil / gagal / duplikat)
- Menampilkan data mahasiswa yang sudah terdaftar di kelas
- Bisa menambahkan mahasiswa ke kelas tertentu secara manual
- Bisa menghapus mahasiswa dari kelas tertentu
- Bisa memindahkan mahasiswa dari kelas tertentu ke kelas lain

---

## 5. Course Structure — Data Model

### Metadata Kelas

| Field       | Contoh Value     |
| ----------- | ---------------- |
| Mata Kuliah | Pemrograman Web  |
| Kelas       | TI-3A            |
| Semester    | Ganjil 2025/2026 |
| SKS         | 3 SKS            |
| Dosen       | Dr. Budi Santoso |

### Kontrak Kuliah (Bobot Penilaian)

| Komponen    | Bobot |
| ----------- | ----- |
| Tugas       | 40%   |
| UTS         | 25%   |
| UAS         | 25%   |
| Partisipasi | 10%   |

### Alur Semester

Standar: **14 minggu materi + 1 UTS + 1 UAS = 16 slot** (selaras dengan `week_no` 1–16 pada SRS/DB).

| Periode   | Kegiatan                               |
| --------- | -------------------------------------- |
| Week 1–7  | Materi pembelajaran + Tugas (optional) |
| Week 8    | UTS (Ujian Tengah Semester)            |
| Week 9–15 | Materi pembelajaran + Tugas (optional) |
| Week 16   | UAS (Ujian Akhir Semester)             |

---

## 6. Inventarisasi Fitur KULINO LMS (Status Implementsi)

### 6.1 Matriks Fitur Aktif (Existing & Live/Mock Active)

| Modul | Fitur | Status Implementasi | Lokasi Kode Utama |
| :--- | :--- | :--- | :--- |
| **Auth & Security** | Form Login dengan Zod & RBAC Redirect | ✅ Aktif (Live Supabase + Mock) | [login-form.tsx](file:///d:/projects/learning-management-system/components/login-form.tsx), [store/auth.ts](file:///d:/projects/learning-management-system/store/auth.ts) |
| **Auth & Security** | Middleware Proteksi Rute JWT & Role Check | ✅ Aktif | [proxy.ts](file:///d:/projects/learning-management-system/proxy.ts), [middleware.ts](file:///d:/projects/learning-management-system/lib/supabase/middleware.ts) |
| **Auth & Security** | Server Actions `createUserInAuth` & `updateUserPassword` | ✅ Aktif | [actions.ts](file:///d:/projects/learning-management-system/app/%28protected%29/admin/actions.ts) |
| **Publik** | Landing Page responsif (Hero, Testimonials, FAQ) | ✅ Aktif | [app/page.tsx](file:///d:/projects/learning-management-system/app/page.tsx) |
| **Publik** | Katalog Publik Mata Kuliah + Filter Search | ✅ Aktif | [app/courses/page.tsx](file:///d:/projects/learning-management-system/app/courses/page.tsx) |
| **Mahasiswa** | Student Dashboard (KRS, IPK, Kalender, Tugas) | ✅ Aktif | [StudentDashboardClient.tsx](file:///d:/projects/learning-management-system/app/%28protected%29/dashboard/StudentDashboardClient.tsx) |
| **Mahasiswa** | Class Detail (Accordion Minggu 1-16, Video/PDF Viewer) | ✅ Aktif | [CourseDetailClient.tsx](file:///d:/projects/learning-management-system/app/%28protected%29/dashboard/course/%5Bid%5D/CourseDetailClient.tsx) |
| **Mahasiswa** | Task Submission & CBT Quiz Simulator | ✅ Aktif | [CourseDetailClient.tsx](file:///d:/projects/learning-management-system/app/%28protected%29/dashboard/course/%5Bid%5D/CourseDetailClient.tsx) |
| **Mahasiswa** | Forum Diskusi Kelas Real-time | ✅ Aktif | [CourseDetailClient.tsx](file:///d:/projects/learning-management-system/app/%28protected%29/dashboard/course/%5Bid%5D/CourseDetailClient.tsx) |
| **Dosen** | Lecturer Dashboard (Queue Koreksi & Pengumuman) | ✅ Aktif | [LecturerDashboardClient.tsx](file:///d:/projects/learning-management-system/app/%28protected%29/lecturer/LecturerDashboardClient.tsx) |
| **Dosen** | Lecturer Class Detail (Materi & Assessment Creator) | ✅ Aktif | [LecturerCourseDetailClient.tsx](file:///d:/projects/learning-management-system/app/%28protected%29/lecturer/course/%5Bid%5D/LecturerCourseDetailClient.tsx) |
| **Dosen** | Grading Panel & Umpan Balik Submission | ✅ Aktif | [LecturerCourseDetailClient.tsx](file:///d:/projects/learning-management-system/app/%28protected%29/lecturer/course/%5Bid%5D/LecturerCourseDetailClient.tsx) |
| **Staff TU** | Staff Dashboard (CRUD Kelas & Enroll Mahasiswa) | ✅ Aktif | [StaffDashboardClient.tsx](file:///d:/projects/learning-management-system/app/%28protected%29/staff/StaffDashboardClient.tsx) |
| **Staff TU** | Simulator Bulk CSV Import Registrasi Massal | ✅ Aktif | [StaffDashboardClient.tsx](file:///d:/projects/learning-management-system/app/%28protected%29/staff/StaffDashboardClient.tsx) |
| **Admin** | Admin Dashboard (Overview, Users, Courses, Calendar, Reports) | ✅ Aktif | [AdminDashboardClient.tsx](file:///d:/projects/learning-management-system/app/%28protected%29/admin/AdminDashboardClient.tsx), [components/admin](file:///d:/projects/learning-management-system/components/admin) |
| **Admin** | User Management (CRUD & Reset Password) | ✅ Aktif | [UsersTab.tsx](file:///d:/projects/learning-management-system/components/admin/UsersTab.tsx) |
| **Admin** | Monitoring Jejak Audit (Audit Logs) | ✅ Aktif | [OverviewTab.tsx](file:///d:/projects/learning-management-system/components/admin/OverviewTab.tsx) |
| **QA & Infra** | Unit Testing Vitest Komponen UI Admin | ✅ Aktif | [CoursesTab.test.tsx](file:///d:/projects/learning-management-system/components/admin/__tests__/CoursesTab.test.tsx) |
| **QA & Infra** | Multi-stage Dockerfile & GitHub Actions CI/CD | ✅ Aktif | [Dockerfile](file:///d:/projects/learning-management-system/Dockerfile), [.github/workflows/ci-cd.yml](file:///d:/projects/learning-management-system/.github/workflows/ci-cd.yml) |

### 6.2 Matriks Kebijakan Registrasi Akun (Strict Provisioning Policy)

> [!IMPORTANT]
> **Kebijakan Pendaftaran Terpusat (Centralized Account Provisioning):**
> Tidak ada fitur pendaftaran mandiri (self-registration) untuk Mahasiswa atau Dosen. Seluruh akun pengguna dibuat dan diotorisasi secara terpusat melalui **Super Admin** (Single Account Registration / User Management) atau **Staff TU** (Simulator Bulk CSV Import).

| Fitur | Deskripsi | Target Rilis | Status Saat Ini |
| :--- | :--- | :--- | :--- |
| **Interactive Demo Page (`/demo`)** | Showcase demo interaktif antarmuka publik | Roadmap v1.3 | Belum diimplementasikan |
| **Web Push Notifications** | Push notification browser untuk pengingat tugas & pengumuman | Roadmap v1.3 | Mock notification state |
| **Multi-Tenant University Support** | Pengelompokan data multi-fakultas/universitas | Roadmap v1.4 | Single institution |

