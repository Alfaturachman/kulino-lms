# KULINO — Learning Management System (v1.2.0)

[![Version](https://img.shields.io/badge/version-1.2.0-blue.svg)](file:///d:/projects/learning-management-system/package.json)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/Alfaturachman/kulino-lms/actions)
[![Unit Tests](https://img.shields.io/badge/tests-8%2F8%20passed-brightgreen.svg)](file:///d:/projects/learning-management-system/docs/09_testing.md)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](file:///d:/projects/learning-management-system/LICENSE)

> **KULINO (Kuliah Online)** adalah Learning Management System (LMS) modern berbasis web yang dirancang khusus untuk memenuhi alur kerja akademik kampus (Universitas Dian Nuswantoro / UDINUS). Platform ini mengintegrasikan pengisian KRS, modul materi mingguan 1–16, penugasan & CBT quiz simulator, absensi, grading panel dosen, hingga konsol manajemen super admin.

---

## Peran Pengguna (User Roles)

1. **Mahasiswa**: Mengakses modul perkuliahan mingguan 1–16, mengunduh materi (PDF/Video), mengumpulkan tugas, mengikuti CBT Quiz Simulator, berpartisipasi di forum diskusi kelas, serta memantau IPK & KRS.
2. **Dosen**: Mengunggah materi perkuliahan, membuat penugasan & kuis, menilai submission mahasiswa (*Grading Panel*), memberikan umpan balik, serta mengelola presensi absensi mingguan.
3. **Staff TU (Tata Usaha)**: Mengelola master kelas, penawaran mata kuliah per semester, mendaftarkan mahasiswa ke kelas, serta mendaftarkan akun massal via *Simulator Bulk CSV Import*.
4. **Super Admin**: Mengelola seluruh akun pengguna (CRUD & Reset Password), memantau Jejak Audit (*Audit Logs*), mengelola master mata kuliah, kalender akademik universitas, dan melakukan ekspor data CSV.

> **Catatan Pendaftaran Akun:** Seluruh akun pengguna terdaftar secara terpusat oleh Admin atau Staff TU. Tidak ada fitur pendaftaran mandiri (self-registration) bagi mahasiswa.

---

## Fitur Utama Platform

- **Autentikasi & Otorisasi Berbasis Peran**: Akses dasbor yang disesuaikan secara khusus untuk Mahasiswa, Dosen, Staff TU, dan Admin.
- **Modul Pembelajaran Mingguan (Week 1–16)**: Pengorganisasian materi perkuliahan (PDF, Video, PPT) terstruktur berbasis minggu.
- **CBT Quiz Simulator & Penugasan**: Simulator ujian online interaktif dengan timer dan pelacakan status pengumpulan tugas.
- **Grading Panel & Umpan Balik Dosen**: Modul penilaian tugas mahasiswa oleh dosen dengan rekapitulasi nilai yang transparan.
- **Manajemen Kelas & Registrasi Peserta**: Pengalokasian dosen pengampu dan pendaftaran mahasiswa ke dalam kelas perkuliahan.
- **Simulator Bulk CSV Import**: Fitur pendaftaran akun massal dan alokasi kelas secara efisien berbasis berkas CSV.
- **Konsol Super Admin & Audit Trail**: Monitoring statistik sistem, pencatatan log aktivitas (*Audit Logs*), dan ekspor data CSV.
- **Paginasi & Filter Pencarian**: Navigasi tabel 10 data per halaman dengan pencarian dan filter peran instan.

---

## Tech Stack

| Layer      | Teknologi                      | Versi       |
| ---------- | ------------------------------ | ----------- |
| Framework  | Next.js (App Router + Turbo)   | `16.2.6`    |
| UI Library | React                          | `19.2.4`    |
| Bahasa     | TypeScript                     | `5.x`       |
| Styling    | Tailwind CSS (v4)              | `^4`        |
| Animasi    | Framer Motion                  | `^12`       |
| Ikon       | Lucide React                   | `^1.17`     |
| Komponen   | Radix UI Primitives + CVA      | latest      |
| Form       | React Hook Form + Zod          | `v7` / `v4` |
| State      | Zustand (Persist)              | `v5`        |
| Backend    | Supabase (Auth + DB + Storage) | `^2.107`    |
| Testing    | Vitest + Testing Library       | `^4.1`      |

---

## Petunjuk Penggunaan (Getting Started)

### 1. Instalasi Dependensi
```bash
npm install
```

### 2. Jalankan Dev Server (Turbopack)
```bash
npm run dev
```
Buka **`http://localhost:3000`** pada peramban Anda.

### 3. Pengujian Otomatis (Unit Testing)
```bash
npm run test
```

### 4. Pemeriksaan Linting & Type Checking
```bash
npm run lint
```

### 5. Kompilasi Produksi (Production Build)
```bash
npm run build
```

---

## Akun Simulasi Login (Test Credentials)

| Role | Email Login | Password | Keterangan |
| :--- | :--- | :--- | :--- |
| **Mahasiswa** | `mahasiswa@dsn.dinus.ac.id` | `password` | Dashboard Mahasiswa (KRS, Tugas, Quiz) |
| **Dosen** | `dosen@dsn.dinus.ac.id` | `password` | Dashboard Dosen (Materi & Grading Panel) |
| **Staff TU** | `tu@dsn.dinus.ac.id` | `password` | Dashboard Staff (CRUD Kelas & Import CSV) |
| **Admin** | `admin@dsn.dinus.ac.id` | `password` | Super Admin Console (User & Audit Logs) |

---

## Berkas Dokumentasi Resmi (`docs/`)

Untuk informasi teknis mendalam mengenai arsitektur, basis data, dan panduan pengembang, silakan merujuk ke **[Developer Handbook (docs/README.md)](docs/README.md)**:

1. **[01_brd.md](docs/01_brd.md)** — Business Requirements Document
2. **[02_prd.md](docs/02_prd.md)** — Product Requirements Document & Feature Matrix
3. **[03_frd.md](docs/03_frd.md)** — Functional Requirements Document
4. **[04_srs.md](docs/04_srs.md)** — Software Requirements Specification
5. **[05_architecture.md](docs/05_architecture.md)** — System Architecture Document
6. **[06_database.md](docs/06_database.md)** — Database Design Document (PostgreSQL Schema)
7. **[07_desain.md](docs/07_desain.md)** — UI/UX Design System Guide
8. **[08_routing.md](docs/08_routing.md)** — Route Architecture & Next.js App Router Structure
9. **[09_testing.md](docs/09_testing.md)** — Testing Strategy & QA Test Cases
10. **[10_user_manual.md](docs/10_user_manual.md)** — User Manual / Guidebook
11. **[12_security.md](docs/12_security.md)** — Security & Access Control Guide
12. **[14_changelog.md](docs/14_changelog.md)** — Release Notes & Version History

---

## Lisensi

Proyek ini dikembangkan sebagai **Proyek Portofolio Pribadi** (Simulasi Frontend & UI Showcase LMS Akademik).
