# Product Requirements Document (PRD)

## KULINO — Product Definition

**Versi:** 1.0 | **Tipe:** Frontend Prototype | **Status:** In Progress

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
- Submit tugas & ikuti quiz
- Lihat nilai & progress belajar
- Partisipasi di forum diskusi kelas
- Terima notifikasi deadline

### Dosen Pengampu

- Upload materi per minggu
- Buat tugas & quiz
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

### Guest / Tamu

- Lihat landing page platform
- Jelajahi katalog course (terbatas)
- Preview demo materi
- Registrasi akun baru

---

## 3. Feature Roadmap

| Fitur               | Deskripsi                                | User             | Phase   | Priority |
| ------------------- | ---------------------------------------- | ---------------- | ------- | -------- |
| Auth System         | Login, register, role redirect           | All              | Phase 1 | P0       |
| Course Dashboard    | Daftar mata kuliah + overview            | Mahasiswa        | Phase 1 | P0       |
| Course Detail Page  | Kontrak kuliah, RPS, materi mingguan     | Mahasiswa, Dosen | Phase 1 | P0       |
| Material Viewer     | Embed YouTube, PDF, PPT preview          | Mahasiswa        | Phase 1 | P0       |
| Assignment System   | Buat, submit, grade tugas                | Mahasiswa, Dosen | Phase 2 | P1       |
| Quiz / Ujian        | MCQ, essay, waktu terbatas               | Mahasiswa, Dosen | Phase 2 | P1       |
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

| Periode   | Kegiatan                               |
| --------- | -------------------------------------- |
| Week 1–7  | Materi pembelajaran + Tugas (optional) |
| Week 8    | UTS (Ujian Tengah Semester)            |
| Week 9–14 | Materi pembelajaran + Tugas (optional) |
| Week 15   | UAS (Ujian Akhir Semester)             |
