# Dokumentasi API & Routing (API & Route Specification)

**Sistem:** KULINO — Kuliah Online | Learning Management System  
**Versi Dokumen:** 1.1  
**Status:** Terverifikasi & Siap Produksi

Dokumen ini mendeskripsikan seluruh rute antarmuka (Frontend Routes), Next.js API Route Handlers, serta Server Actions yang tersedia dalam KULINO LMS.

---

## 1. Arsitektur Rute Aplikasi (Route Map)

### 1.1 Rute Publik (Public Routes)
- `/`: Landing Page utama platform (Branding, fitur unggulan, testimoni, CTA login/register).
- `/login`: Form autentikasi pengguna dengan pengalihan peran otomatis berdasarkan metadata JWT.
- `/register`: Form pendaftaran mandiri calon mahasiswa.
- `/courses`: Katalog publik mata kuliah yang ditawarkan (Filter status aktif/selesai).
- `/demo`: Demo interaktif antarmuka platform.

### 1.2 Rute Terproteksi (Protected Routes)

#### Student Routes (`/dashboard/*`)
- `/dashboard`: Halaman utama Mahasiswa (Ringkasan KRS, IPK tracker, tugas tenggat, visual kalender).
- `/dashboard/course/[id]`: Detail kelas Mahasiswa (Accordion minggu 1-14, simulator unggah tugas, forum diskusi).
- `/dashboard/course/[id]/material/[mid]`: Material Viewer (YouTube embed video & PDF document viewer).
- `/dashboard/course/[id]/assignment/[aid]`: Halaman pengumpulan tugas & riwayat revisi file.
- `/dashboard/course/[id]/quiz/[qid]`: CBT Quiz/Exam Module (Countdown timer & autograding).

#### Lecturer Routes (`/lecturer/*`)
- `/lecturer`: Halaman utama Dosen (Daftar kelas diampu, antrean koreksi tugas, pengumuman kelas).
- `/lecturer/course/[id]`: Manajemen kelas Dosen (Tambah materi, buat tugas, manajemen presensi).
- `/lecturer/course/[id]/grade`: Grading Panel (Koreksi nilai tugas & masukan umpan balik).

#### Staff TU Routes (`/staff/*`)
- `/staff`: Halaman utama Staff TU (CRUD Kelas, penawaran mata kuliah).
- `/staff/courses`: Manajemen master mata kuliah dan alokasi dosen pengampu.
- `/staff/users`: Modul registrasi akun massal via Bulk CSV Import dengan visual progress bar.

#### Admin Routes (`/admin/*`)
- `/admin`: Halaman utama Super Admin.
- `/admin/users`: Management pengguna (CRUD User, reset password terenkripsi via Supabase Auth Admin API).
- `/admin/calendar`: Manajemen agenda kalender akademik universitas.
- `/admin/reports`: Generator & ekspor laporan gradebook serta audit logs.

---

## 2. Next.js API Route Handlers

### 2.1 Health Check API (`GET /api/health`)

- **Deskripsi**: Memeriksa status kesehatan server Next.js dan koneksi database Supabase secara real-time.
- **Request Headers**: `Content-Type: application/json`
- **Response `200 OK`**:
```json
{
  "status": "healthy",
  "database": "connected",
  "uptime": 1245.8,
  "timestamp": "2026-08-03T12:00:00.000Z",
  "env": "production"
}
```
- **Response `503 Service Unavailable`**:
```json
{
  "status": "unhealthy",
  "database": "disconnected",
  "error": "Database connection timed out",
  "timestamp": "2026-08-03T12:00:00.000Z"
}
```

---

## 3. Spesifikasi Server Actions (`actions.ts`)

### 3.1 `createUserInAuth(userData)`
- **Akses**: Khusus pengguna terautentikasi dengan peran `admin` atau `tu`.
- **Parameter Input**:
  - `name` (string, mandatory)
  - `email` (string, mandatory, unique)
  - `nim_nip` (string, mandatory, unique)
  - `role` ('mahasiswa' | 'dosen' | 'tu' | 'admin')
  - `password` (string, optional, default: '12345678')
- **Fungsi**: Membuka akun pengguna baru di Supabase Auth Admin API (`supabaseAdmin.auth.admin.createUser`) dan mencatat profil ke `public.users`.
- **Keamanan**: Session verification server-side via `createServerClient()` & `supabase.auth.getUser()`.

### 3.2 `updateUserPasswordInAuth(userId, newPassword)`
- **Akses**: Khusus pengguna terautentikasi dengan peran `admin` atau `tu`.
- **Parameter Input**:
  - `userId` (UUID, mandatory)
  - `newPassword` (string, mandatory, min 8 chars)
- **Fungsi**: Mengubah kata sandi pengguna via Supabase Auth Admin API `updateUserById`.
- **Keamanan**: Terproteksi dari eksposur password di `public.users`.

---

## 4. Kode Status HTTP & Respon Standar Error

| Kode HTTP | Tipe Exception | Deskripsi |
| :--- | :--- | :--- |
| `200 OK` | - | Permintaan berhasil diproses. |
| `400 Bad Request` | `ValidationError` | Format data input tidak sesuai skema Zod. |
| `401 Unauthorized` | `UnauthorizedError` | Token JWT tidak valid atau sesi login telah berakhir. |
| `403 Forbidden` | `ForbiddenError` | Pengguna tidak memiliki peran (*role*) yang diizinkan. |
| `404 Not Found` | `NotFoundError` | Sumber daya / ID data tidak ditemukan di database. |
| `500 Internal Error` | `AppError` | Pengecualian server internal (disamarkan di mode produksi). |

```json
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Password minimal 8 karakter",
    "statusCode": 400
  }
}
```
