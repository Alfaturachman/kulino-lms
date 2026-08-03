# Riwayat Perubahan & Progress Report (Changelog & Version History)

**Sistem:** KULINO — Kuliah Online | Learning Management System Udinus  
**Versi Dokumen:** 1.1 | **Status:** ✓ Completed (Prototype Production-Ready)

---

## 1. Ringkasan Progress Implementation

| Area                    | Progress | Status    | Keterangan |
| ----------------------- | -------- | --------- | ---------- |
| Auth & Route Protection | 100%     | ✓ Selesai | Middleware JWT + RBAC 5 Roles |
| UI Component Library    | 100%     | ✓ Selesai | Tailwind v4 + Radix Primitives |
| Design System           | 100%     | ✓ Selesai | Soft SaaS Minimalism (Iris Blue) |
| Public Pages            | 100%     | ✓ Selesai | Landing, Login, Register, Catalog |
| Protected Pages         | 100%     | ✓ Selesai | Mahasiswa, Dosen, TU, Admin |
| Domain Data & Types     | 100%     | ✓ Selesai | TypeScript interfaces & Zod Schemas |
| Fitur LMS Inti          | 100%     | ✓ Selesai | Accordion 1-16, CBT, Presensi, CSV |
| Infrastructure & CI/CD  | 100%     | ✓ Selesai | Docker Standalone & GitHub Actions |

**Keseluruhan: 100% (Fase Prototipe & Simulasi Frontend Komplet)**

---

## 2. Detail Halaman & Rute Selesai

| Route                    | Halaman & Deskripsi Fitur                                                                                                                                                                                        | Status    |
| ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------- |
| `/`                      | Landing page — branding + CTA login/register                                                                                                                                                                     | ✓ Selesai |
| `/login`                 | Form login dengan validasi Zod + role-based redirect                                                                                                                                                             | ✓ Selesai |
| `/register`              | Form registrasi 4 field (nama, email, password, confirm)                                                                                                                                                         | ✓ Selesai |
| `/courses`               | Katalog course — grid 3 kolom, filter aktif/selesai                                                                                                                                                              | ✓ Selesai |
| `/demo`                  | Demo preview — fitur showcase + CTA                                                                                                                                                                              | ✓ Selesai |
| `/dashboard`             | Dashboard Mahasiswa — Ringkasan KRS, IPK tracker, tugas tenggat, visual kalender, dan materi                                                                                                                     | ✓ Selesai |
| `/dashboard/course/[id]` | Detail Kelas Mahasiswa — Accordion materi mingguan 1-14, simulator unggah tugas, forum diskusi kelas real-time                                                                                                   | ✓ Selesai |
| `/lecturer`              | Dashboard Dosen — Ringkasan kelas, queue penilaian tugas, form pengumuman kelas, analisis risiko keaktifan mahasiswa                                                                                             | ✓ Selesai |
| `/lecturer/course/[id]`  | Detail Kelas Dosen — Manajemen materi mingguan, buat tugas baru dengan bobot, koreksi & grading submission mahasiswa                                                                                             | ✓ Selesai |
| `/staff`                 | Dashboard Tata Usaha (TU) — CRUD kelas baru, enroll mahasiswa per kelas, simulator bulk CSV import dengan progress bar                                                                                           | ✓ Selesai |
| `/admin`                 | Dashboard Super Admin — Monitoring audit logs sistem, CRUD akun pengguna dengan validasi duplikat (email & NIM), CRUD agenda kalender akademik, ekspor PDF Gradebook, terintegrasi Supabase (fallback mock data) | ✓ Selesai |

---

## 3. Komponen UI & Fitur LMS Inti

- `LoginForm`: Form login dengan react-hook-form + Zod, integrasi Zustand store.
- `AuthGuard`: Route guard — redirect ke `/login` jika belum ter-autentikasi.
- `Sidebar`: Sidebar responsif 260px (desktop) & bottom navigation 5-icon (mobile) dengan routing dinamis berbasis peran.
- `AlertModal` & `ConfirmModal`: Modal dialog reusable untuk error/success/warning & konfirmasi hapus — integrasi Radix Dialog.
- `OverviewTab`, `UsersTab`, `CalendarTab`, `ReportsTab`, `SettingsTab`: Tab-tab modul admin dashboard.

---

## 4. Release History

### [v1.2.0] - 2026-08-03 (Full Synchronization, Performance Optimization & Feature Audit Release)
- **Penyelarasan Total Kode & Docs**: Package version dinaikkan ke `"1.2.0"` di `package.json`, `types/auth.ts`, dan seluruh `docs/` (00 s.d. 14 & README.md).
- **Optimasi Dev Server (Turbopack)**: Dev script diubah ke `next dev --turbopack` dan Sentry wrapper di-bypass pada mode development (`NODE_ENV !== 'production'`).
- **Eliminasi Memory Leak & Firefox CPU Lag**:
  - *Fast-Path Middleware* di `lib/supabase/middleware.ts` untuk memangkas panggilan jaringan Supabase dari 5.7s ke <1ms pada rute publik.
  - Perbaikan loop rekursi tak terhingga di `store/auth.ts` & `components/auth-sync.tsx` (memangkas RAM Firefox dari 7GB ke <100MB).
  - Pembersihan CSS `mask-image` & `blur-3xl` pada `app/page.tsx` yang memicu software rasterization lag di Firefox.
- **Paginasi Interaktif Admin Dashboard**:
  - Penambahan paginasi interaktif pada tabel Log Aktivitas Sistem (Audit Logs) di `components/admin/OverviewTab.tsx`.
  - Penambahan paginasi interaktif dengan default **10 data per halaman** & auto-reset search/filter pada tabel Seluruh Pengguna Sistem di `components/admin/UsersTab.tsx`.
- **Pembersihan Rute Kosong**: Menghapus folder rute kosong `app/(protected)/staff/courses` dan `app/(protected)/staff/users` untuk menghindari ambiguitas App Router.
- **Standarisasi Role & Tipe User**: Menghapus `guest` dari `types/auth.ts` & `001_schema.sql` (4 role aktif: `mahasiswa`, `dosen`, `tu`, `admin`), menyelaraskan `nim_nip: string` NOT NULL.
- **Update Dokumentasi Rute (`08_routing.md`)**: Menyelaraskan deskripsi rute Next.js App Router (arsitektur Sub-component Tabs & Dialog Modals untuk Admin, Staff, dan Course Detail).
- **Update Dokumen QA Testing (`09_testing.md`)**: Memisahkan pengujian otomatis Vitest (`CoursesTab.test.tsx`) dari matriks skenario uji manual (TC-AUTH-01..06).
- **Inventarisasi Fitur Complete**: Menyusun matriks fitur yang sudah aktif (Live/Mock) vs. fitur roadmap pending (`/register`, `/demo`, Web Push).

### [v1.1.0] - 2026-08-03 (Production Infrastructure & Security Release)
- **Docker Multi-Stage Build**: `Dockerfile` Node 20 Alpine dengan `output: 'standalone'` Next.js.
- **Docker Compose**: `docker-compose.yml` untuk pengelolaan container lokal & server.
- **GitHub Actions CI/CD Pipeline**: `.github/workflows/ci-cd.yml` untuk pengujian otomatis (ESLint, Vitest, Next.js build, Docker build check).
- **Server Action Protection**: Proteksi session & verifikasi role `admin`/`tu` pada Server Actions `createUserInAuth` dan `updateUserPasswordInAuth`.
- **PostgreSQL Anti-Privilege Escalation Trigger**: Migration `006_secure_user_role_update.sql` menolak update kolom `role` oleh non-admin.
- **Restrukturisasi Dokumentasi**: Merapikan seluruh berkas dokumentasi `docs/` menjadi 14 berkas terstruktur 100+ baris (01_brd.md s.d. 14_changelog.md).

### [v1.1.2] - 2026-08-03 (Terminologi Role — m7)
- **Standar terminologi role ditetapkan**: **TU** / **Staff TU** (Tata Usaha) untuk display role di seluruh dokumen, **`staff`** hanya untuk route/URL (`/staff`, `/staff/courses`, `/staff/users`), dan **`tu`** hanya untuk enum `users.role`; mapping dicatat di `00_audit_requirements.md` m7.
- **Label campuran dibersihkan**: SRS §1 diagram "Staff / TU Panel" → "Staff TU Panel"; doc 06 `users.nim_nip` "(Dosen/Staff)" → "(Dosen/TU)"; user manual "dashboard staff" → "dashboard TU".

### [v1.1.1] - 2026-08-03 (Unifikasi Model Penilaian — m4)
- **FRD §3 Modul Penilaian (FR-ASMT-01 s.d. 04)**: Entitas `assignments` + `quizzes` digabung menjadi `assessments` dengan `type` (`task`/`uts`/`uas`) × `mode` (`file_upload`/`online_quiz`/`manual`); section §4–§6 direnumber.
- **SRS**: data dictionary `Assessment`, `Question` (FK `assessment_id`), `AssessmentAttempt`, rute `/assessment/[aid]` + `/assessment/[aid]/attempt`, ERD diperbarui ke 20 entitas.
- **doc 06 (Database)**: DDL `assessments`, `assessment_attempts`, `submissions` (FK `assessment_id`), `questions`; matriks mode penilaian §2.14; trigger `enforce_one_time_uts_uas`; indeks, RLS, dan seed disinkronkan.
- **docs 02/05/08/09/10/12**: terminologi & rute diperbarui ke model penilaian; audit doc `00_audit_requirements.md` menandai **m4 Fixed**.

### [v1.0.0] - 2026-06-15 (Initial Full Prototype Release)
- Implementasi Next.js 16 App Router dengan Tailwind CSS v4.
- Modul Otentikasi, Catalog Courses, Dashboard Mahasiswa, Dosen, Staff TU, dan Admin.
- Skema PostgreSQL Supabase dengan 15+ tabel relasional dan RLS Policies.
- Unit testing Vitest untuk komponen admin.

---

## 5. Risk Log & Mitigasi Rilis

| Isu / Risiko | Dampak | Penanganan | Status |
| :--- | :--- | :--- | :--- |
| Standalone Build Root Path Warning | Warning log pada Docker build | Menambahkan `outputFileTracingRoot` di `next.config.ts` | ✓ Solved |
| State Cascade Render pada Effect | UI Lagging / Console Warning | Refactor derived state tanpa `setState` di `useEffect` | ✓ Solved |
| Plaintext Password di DB Public | Kebocoran keamanan password | Menggunakan Supabase Auth Admin API `updateUserById` | ✓ Solved |
| Privilege Escalation Role User | Pengubahan role unauthorized | Menambahkan PostgreSQL Trigger `prevent_user_role_escalation` | ✓ Solved |
| Missing Docker Environment Vars | Container crash pada startup | Menambahkan file template `.env.local.example` dan healthcheck | ✓ Solved |

---

## 6. Rencana Rilis Mendatang (Roadmap v1.2.0)

- **AI Tutor Assistant Integration**: Asisten AI untuk menjawab pertanyaan seputar materi perkuliahan secara otomatis.
- **Push Notification Service**: Notifikasi real-time via Web Push untuk pengingat tugas & pengumuman dosen.
- **Multi-Tenant University Support**: Pengelompokan data antar fakultas/universitas dalam satu sistem.
- **Mobile Native App (React Native)**: Aplikasi mobile iOS & Android terintegrasi.
- **Analytics & BI Dashboard**: Visualisasi analitik tingkat tinggi untuk rektorat dan dekanat.
- **Integration with Learning Analytics API**: Ekspor data pembelajaran ke standar LTI (Learning Tools Interoperability).

---

## 7. Kesimpulan & Penutup

Setiap perubahan versi pada repositori ini dicatat secara konsisten untuk menjaga akuntabilitas pengembangan perangkat lunak dan keandalan sistem KULINO LMS.

---
*Dokumen ini merupakan catatan riwayat rilis resmi proyek KULINO LMS Udinus.*  
*Hak cipta dilindungi oleh tim pengembang KULINO LMS.*
