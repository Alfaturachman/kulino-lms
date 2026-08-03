# KULINO — Learning Management System (v1.2.0)

[![Version](https://img.shields.io/badge/version-1.2.0-blue.svg)](file:///d:/projects/learning-management-system/package.json)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](https://github.com/Alfaturachman/kulino-lms/actions)
[![Unit Tests](https://img.shields.io/badge/tests-8%2F8%20passed-brightgreen.svg)](file:///d:/projects/learning-management-system/docs/09_testing.md)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](file:///d:/projects/learning-management-system/LICENSE)

> **KULINO (Kuliah Online)** adalah Learning Management System (LMS) modern berbasis web yang dirancang khusus untuk memenuhi alur kerja akademik kampus (Universitas Dian Nuswantoro / UDINUS). Platform ini mengintegrasikan pengisian KRS, modul materi mingguan 1–16, penugasan & CBT quiz simulator, absensi, grading panel dosen, hingga konsol manajemen super admin.

---

## Fitur Utama & Optimasi Terbaru (v1.2.0)

- **Fast-Path Edge Middleware**: Pemangkasan *blocking network call* Supabase pada rute publik dari 5.7s menjadi **< 1ms**.
- **Turbopack Dev Mode**: Server pengembang berjalan secara instan dengan Next.js Turbopack (`next dev --turbopack`).
- **Pemberantasan Memory Leak**: Resolusi *infinite event loop* pada sinkronisasi sesi Zustand & Supabase (penggunaan RAM browser stabil **< 100 MB**).
- **Akselerasi Grafis (GPU Optimization)**: Eliminasi efek CSS `mask-image` & `blur-3xl` yang membakar CPU peramban.
- **Paginasi Interaktif**: Paginasi 10 data per halaman dengan pencarian & filter pada tabel *Seluruh Pengguna Sistem* (`UsersTab`) dan *Log Aktivitas Sistem* (`OverviewTab`).
- **Ekspor CSV Sungguhan (*Downloadable CSV*)**: Utilitas `exportToCsv` untuk mengunduh log audit dan data pengguna secara langsung ke berkas `.csv`.
- **Kebijakan Pendaftaran Terpusat (*Strict Centralized Provisioning*)**: Seluruh akun (`mahasiswa`, `dosen`, `tu`, `admin`) didaftarkan secara terpusat oleh Admin/TU (tidak ada registrasi mandiri mahasiswa).

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

1. **[00_audit_requirements.md](docs/00_audit_requirements.md)** — Audit Kebutuhan & Analisis Dokumentasi
2. **[01_brd.md](docs/01_brd.md)** — Business Requirements Document
3. **[02_prd.md](docs/02_prd.md)** — Product Requirements Document & Feature Matrix
4. **[03_frd.md](docs/03_frd.md)** — Functional Requirements Document
5. **[04_srs.md](docs/04_srs.md)** — Software Requirements Specification
6. **[05_architecture.md](docs/05_architecture.md)** — System Architecture Document
7. **[06_database.md](docs/06_database.md)** — Database Design Document (PostgreSQL Schema)
8. **[07_desain.md](docs/07_desain.md)** — UI/UX Design System Guide
9. **[08_routing.md](docs/08_routing.md)** — Route Architecture & Next.js App Router Structure
10. **[09_testing.md](docs/09_testing.md)** — Testing Strategy & QA Test Cases
11. **[10_user_manual.md](docs/10_user_manual.md)** — User Manual / Guidebook
12. **[12_security.md](docs/12_security.md)** — Security & Access Control Guide
13. **[14_changelog.md](docs/14_changelog.md)** — Release Notes & Version History

---

## Lisensi

Hak Cipta © 2026 Universitas Dian Nuswantoro (UDINUS) — Dikembangkan untuk Portofolio Sistem Informasi Akademik Digital.
