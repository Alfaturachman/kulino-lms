# KULINO — Learning Management System

> **Frontend prototype** of a web-based Learning Management System (LMS) designed for academic use at Universitas Dian Nuswantoro (Udinus). Built as a **portfolio showcase** focusing on UI design, realistic academic workflow simulation, and role-based user experience.

---

## Tech Stack

| Layer      | Technology                     | Versi       |
| ---------- | ------------------------------ | ----------- |
| Framework  | Next.js (App Router)           | `16.2.6`    |
| UI Library | React                          | `19.2.4`    |
| Language   | TypeScript                     | `5.x`       |
| Styling    | Tailwind CSS (CSS-first, v4)   | `^4`        |
| Animations | Framer Motion                  | `^12`       |
| Icons      | Lucide React                   | `^1.17`     |
| Components | Radix UI Primitives + CVA      | latest      |
| Forms      | React Hook Form + Zod          | `v7` / `v4` |
| State      | Zustand                        | `v5`        |
| Backend    | Supabase (Auth + DB + Storage) | `^2.107`    |

---

## Getting Started

### Prerequisites

Make sure you have **Node.js** installed, then install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

### Run Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Scope & Objectives](#2-scope--objectives)
3. [User Roles](#3-user-roles)
4. [Learning Model](#4-learning-model)
5. [Course Structure](#5-course-structure)
6. [Weekly Learning Flow](#6-weekly-learning-flow)
7. [Core Functional Features](#7-core-functional-features)
8. [Additional Features](#8-additional-features)
9. [Non-Functional Requirements](#9-non-functional-requirements)
10. [System Design Deliverables](#10-system-design-deliverables)
11. [Database Planning](#11-database-planning)
12. [Portfolio Positioning](#12-portfolio-positioning)
13. [Final Deliverables](#13-final-deliverables)
14. [Success Criteria](#14-success-criteria)

---

## 1. Project Overview

Proyek ini adalah **Learning Management System (LMS)** berbasis web untuk kebutuhan perkuliahan online.

Sistem ini dirancang sebagai **prototype frontend untuk portofolio**, sehingga implementasi lebih menitikberatkan pada:

- Desain antarmuka yang modern dan profesional
- Alur pengguna yang realistis
- Simulasi pengalaman penggunaan akademik

Tujuan utama adalah menampilkan kemampuan perancangan sistem pendidikan digital dengan struktur akademik yang realistis.

---

## 2. Scope & Objectives

### Objectives

Membangun prototype LMS yang:

- ✓ Menampilkan pengalaman belajar online yang terstruktur
- ✓ Mendukung alur akademik kampus / perkuliahan
- ✓ Menyediakan dashboard berbeda sesuai peran pengguna
- ✓ Menjadi showcase portfolio profesional

### Scope

- **Frontend simulation** — fitur LMS diimplementasikan dengan mock data (Zustand + JSON)
- **Supabase integration** — Auth, Database PostgreSQL, dan Storage telah dikonfigurasi untuk fase berikutnya
- Fokus pada **UI/UX, information architecture, dan interaksi pengguna**

---

## 3. User Roles

### 3.1 Guest / Tamu

Pengguna tanpa login.

| Kemampuan                           |
| ----------------------------------- |
| Melihat landing page                |
| Menjelajahi informasi umum platform |
| Melihat daftar course terbatas      |
| Akses demo / preview course         |

---

### 3.2 Mahasiswa

| Kemampuan                       |
| ------------------------------- |
| Login ke dashboard              |
| Melihat daftar mata kuliah      |
| Mengakses materi pembelajaran   |
| Mengumpulkan tugas              |
| Mengikuti quiz / ujian          |
| Berpartisipasi di forum diskusi |
| Melihat progress belajar        |
| Mendapat notifikasi deadline    |

---

### 3.3 Dosen

| Kemampuan                        |
| -------------------------------- |
| Upload materi pembelajaran       |
| Menambahkan penugasan / quiz     |
| Menentukan waktu mulai & tenggat |
| Menilai submission mahasiswa     |
| Monitoring absensi               |
| Memberikan feedback              |

---

### 3.4 Staff TU

| Kemampuan                           |
| ----------------------------------- |
| Menambahkan kelas / course          |
| Menentukan mahasiswa peserta kelas  |
| Mengelola distribusi kelas ke dosen |

---

### 3.5 Kepala TU / Administrator

| Kemampuan                    |
| ---------------------------- |
| Manajemen seluruh user       |
| Pengaturan role & permission |
| Monitoring statistik sistem  |
| Pengelolaan jadwal akademik  |

---

## 4. Learning Model

### Primary Model: Asynchronous Learning

Platform mengutamakan pembelajaran mandiri dengan resource eksternal agar efisien.

**Content Delivery:**

- Link video YouTube / Google Drive
- PDF / PPT download
- Modul mingguan
- Forum diskusi

---

## 5. Course Structure

Setiap mata kuliah memiliki halaman detail dengan struktur berikut:

### Header Information

- Nama Mata Kuliah
- Kelas
- Semester

### Komting (Ketua Kelas)

| Field  | Keterangan            |
| ------ | --------------------- |
| Nama   | Nama Mahasiswa        |
| NIM    | Nomor Induk Mahasiswa |
| Kontak | Nomor Telepon         |

### Kontrak Kuliah

| Komponen    | Bobot |
| ----------- | ----- |
| Tugas       | 40%   |
| UTS         | 25%   |
| UAS         | 25%   |
| Partisipasi | 10%   |

### Peraturan

- Kehadiran
- Keaktifan
- Ketepatan waktu submission

### Referensi

- Buku / jurnal / modul yang digunakan

### Kontak Dosen

| Field   | Keterangan     |
| ------- | -------------- |
| Nama    | Dosen Pengampu |
| HP      | Nomor aktif    |
| Email   | Email dosen    |
| Ruangan | Ruang Dosen    |

### Media Komunikasi

- Link Zoom / platform meeting

### Dokumen

- File RPS (PDF)

### Forum Diskusi

---

## 6. Weekly Learning Flow

```
Week 1–7         →  Materi + Penugasan (optional)
      ↓
  Midterm (UTS) — Week 8
      ↓
Week 9–15        →  Materi + Penugasan (optional)
      ↓
  Final Exam (UAS) — Week 16
```

| Fase       | Minggu    | Aktivitas                                  |
| ---------- | --------- | ------------------------------------------ |
| Pra-UTS    | Week 1–7  | Materi pembelajaran + penugasan (optional) |
| Midterm    | Week 8    | UTS (Ujian Tengah Semester)                |
| Pra-UAS    | Week 9–15 | Materi pembelajaran + penugasan (optional) |
| Final Exam | Week 16   | UAS (Ujian Akhir Semester)                 |

---

## 7. Core Functional Features

### Student Features

- Login & autentikasi
- Dashboard mata kuliah
- Course overview & announcements terbaru
- Assignment tracking
- Material access (PDF, video, modul)
- Submission upload _(max 10 MB)_
- Forum participation
- Quiz / exam participation
- Learning progress tracking
- Deadline notifications

### Lecturer Features

- Upload materials
- Create assignments / quizzes
- Manage deadlines
- Review & grade submissions
- Monitor attendance
- Give feedback

### Admin / TU Features

- User management
- Course management
- Academic scheduling
- Statistical reporting
- Role & permission management

---

## 8. Additional Features

### 8.1 Announcement / Broadcast System

Fitur pengumuman terpusat untuk menyampaikan informasi penting.

- Pengumuman kelas & perubahan jadwal
- Reminder deadline & informasi ujian
- Read / unread status
- Priority pinning

### 8.2 Academic Calendar / Timeline

Visualisasi jadwal akademik agar pengguna dapat melihat agenda penting.

- Deadline tugas & jadwal quiz
- Tanggal UTS / UAS
- Event akademik

### 8.3 Search & Filtering

Mempermudah navigasi ketika jumlah course, materi, atau diskusi semakin banyak.

- Cari materi tertentu
- Filter tugas aktif / selesai
- Cari diskusi lama
- Sorting berdasarkan deadline

### 8.4 Submission History / File Versioning

Riwayat pengumpulan tugas agar perubahan dapat dilacak.

- Menyimpan versi upload sebelumnya
- Menampilkan timestamp submission
- Tracking revisi tugas

### 8.5 Notification Center

Pusat notifikasi untuk meningkatkan awareness pengguna.

- Bell icon indicator & unread badge
- Categorized notifications
- Deadline alerts

### 8.6 Analytics Dashboard

Memberikan insight bagi dosen dan admin terkait performa akademik.

- List mahasiswa belum submit
- Engagement rate
- Nilai rata-rata kelas
- Attendance trends

### 8.7 User Settings & Personalization

- Edit profile & upload photo
- Change password
- Notification preferences

---

## 9. Non-Functional Requirements

| Aspek               | Deskripsi                       |
| ------------------- | ------------------------------- |
| **Scalability**     | Siap untuk ribuan pengguna      |
| **Security**        | Perlindungan data akademik      |
| **Availability**    | Stabilitas akses tinggi         |
| **Usability**       | Sederhana & intuitif            |
| **Performance**     | Cepat & ringan                  |
| **Accessibility**   | Ramah semua pengguna            |
| **Mobile-friendly** | Responsif di berbagai perangkat |

---

## 10. System Design Deliverables

### Architecture

| Layer    | Komponen                               |
| -------- | -------------------------------------- |
| Frontend | Next.js 16 Web App (App Router)        |
| Data     | Mock / Static data simulation (Fase 1) |
| Backend  | Supabase (Auth + PostgreSQL + Storage) |
| Storage  | Supabase Storage (file upload)         |
| Auth     | Supabase Auth + Zustand session store  |

### Documentation (Product Development Life Cycle)

| Dokumen                                     | File                                                      | Status |
| ------------------------------------------- | --------------------------------------------------------- | ------ |
| Business Requirements Document (BRD)        | `Product Development Life Cycle/01_BRD.md`                | ✅     |
| Product Requirements Document (PRD)         | `Product Development Life Cycle/02_PRD.md`                | ✅     |
| Functional Requirements Document (FRD)      | `Product Development Life Cycle/03_FRD.md`                | ✅     |
| Software Requirements Spec (SRS) + Diagrams | `Product Development Life Cycle/04_SRS.md`                | ✅     |
| UI/UX Design System                         | `Product Development Life Cycle/05_UIUX_Design_System.md` | ✅     |
| Progress Report                             | `Product Development Life Cycle/06_Progress.md`           | ✅     |
| Database Design + DDL SQL                   | `Product Development Life Cycle/07_Database_Design.md`    | ✅     |
| Testing Plan                                | `Product Development Life Cycle/08_Testing_Plan.md`       | ✅     |

> Use Case Diagram, Activity Diagram, Sequence Diagram, dan ERD tersedia sebagai Mermaid diagrams di dalam `04_SRS.md`.

---

## 11. Database Planning

### Core Entities

| Entitas           | Keterangan                         |
| ----------------- | ---------------------------------- |
| `User`            | Semua pengguna sistem + role field |
| `Course`          | Mata kuliah                        |
| `Enrollment`      | Pendaftaran mahasiswa ke course    |
| `Module`          | Modul / materi per pertemuan       |
| `Assignment`      | Penugasan                          |
| `Submission`      | Hasil pengumpulan tugas            |
| `Quiz`            | Kuis / UTS / UAS                   |
| `Question`        | Soal kuis                          |
| `QuizAttempt`     | Hasil pengerjaan kuis mahasiswa    |
| `Attendance`      | Absensi per minggu                 |
| `Grade`           | Rekap nilai akhir per mata kuliah  |
| `Discussion`      | Thread forum diskusi               |
| `DiscussionReply` | Balasan thread forum               |
| `Announcement`    | Pengumuman kelas                   |
| `Notification`    | Notifikasi personal pengguna       |
| `CalendarEvent`   | Agenda akademik                    |

> Detail struktur tabel, DDL SQL script, constraints, dan seed data tersedia di `Product Development Life Cycle/07_Database_Design.md`.

---

## 12. Portfolio Positioning

Karena proyek ini bersifat **frontend showcase**, fokus utama meliputi:

- **Professional UI Design** — tampilan modern & premium
- **Realistic Academic Workflow** — alur yang mencerminkan sistem akademik nyata
- **Information Architecture** — struktur informasi yang jelas
- **Role-based User Experience** — dashboard berbeda tiap peran
- **Clean & modern interaction design** — animasi dan interaksi yang halus

---

## 13. Final Deliverables

- [x] Interactive LMS Prototype
- [x] Responsive Web Interface
- [x] High-fidelity mock dashboard
- [x] Structured course pages
- [x] User role simulation
- [x] Documentation & design artifacts

---

## 14. Success Criteria

Prototype dianggap **berhasil** jika mampu:

- ✓ Merepresentasikan alur LMS kampus secara realistis
- ✓ Menampilkan desain modern & profesional
- ✓ Menjadi showcase portfolio yang kuat
- ✓ Memberikan pengalaman pengguna yang intuitif
