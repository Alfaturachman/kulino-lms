# Functional Requirements Document (FRD)

## KULINO — Spesifikasi Fungsional Sistem

**Versi:** 1.0 | **Tipe:** Engineering Doc | **Status:** Draft

---

## 1. Modul Autentikasi

### FR-AUTH-01 — Login dengan Email & Password

- **Input:** email (string, valid format), password (min 8 karakter)
- **Proses:** Validasi credentials terhadap data user
- **Output:** JWT token + redirect ke dashboard sesuai role
- **Error Handling:** "Email atau password salah" jika gagal; lockout setelah 5x percobaan gagal
- **Priority:** Must Have

### FR-AUTH-02 — Role-Based Redirect Post-Login

- **Proses:** Setelah login berhasil, sistem membaca role user dan melakukan redirect:
    - Mahasiswa → `/dashboard`
    - Dosen → `/lecturer`
    - Staff TU → `/staff`
    - Admin → `/admin`
    - Guest tidak memiliki akses ke rute protected
- **Priority:** Must Have

### FR-AUTH-03 — Logout & Session Expiry

- User dapat logout manual kapan saja
- Session expired otomatis setelah 8 jam inaktif
- Token disimpan di httpOnly cookie (simulasi localStorage untuk prototype)
- Redirect ke `/login` setelah logout
- **Priority:** Must Have

---

## 2. Modul Course & Materi

### FR-COURSE-01 — Daftar Mata Kuliah Mahasiswa

- Menampilkan semua course yang di-enroll user (max 8/semester)
- Setiap card menampilkan: nama MK, kode kelas, nama dosen, progress %, status (aktif/selesai)
- Filter tersedia: semester, status
- **Priority:** Must Have | **Actor:** Mahasiswa

### FR-COURSE-02 — Halaman Detail Mata Kuliah

- Menampilkan: header info kelas, kontrak kuliah (bobot nilai), info komting, kontak dosen (HP, email, ruang), media komunikasi (Zoom link), dokumen RPS (PDF), dan daftar modul mingguan
- Tab navigation: **Materi | Tugas | Diskusi | Nilai**
- **Priority:** Must Have | **Actor:** Mahasiswa, Dosen

### FR-COURSE-03 — Upload Materi oleh Dosen

- **Input:** judul materi, deskripsi, type (YouTube URL / Google Drive URL / PDF upload), week number, visibility (published/draft)
- **Validasi:** URL harus valid; PDF max 50MB
- **Output:** Materi muncul di timeline minggu yang ditentukan
- **Priority:** Must Have | **Actor:** Dosen

### FR-COURSE-04 — Progress Tracking Mahasiswa

- Sistem melacak: modul yang sudah dibuka (viewed), tugas yang sudah submitted, quiz yang sudah dikerjakan
- Progress % = (items completed / total items) × 100
- Ditampilkan di course card dan halaman detail
- **Priority:** Should Have | **Actor:** Mahasiswa

---

## 3. Modul Assignment & Submission

### FR-ASSIGN-01 — Buat Assignment (Dosen)

- **Input:** judul, instruksi (rich text), deadline (datetime), bobot nilai (%), format file yang diterima (PDF/DOCX/ZIP), max file size
- **Output:** Assignment muncul di halaman tugas mahasiswa dengan countdown timer
- **Priority:** Must Have | **Actor:** Dosen

### FR-ASSIGN-02 — Submit Tugas (Mahasiswa)

- Upload file max 10MB
- **Validasi:** cek format, ukuran, deadline
- Setelah submit: tampilkan konfirmasi dengan timestamp
- Jika melewati deadline: submission masih bisa dilakukan tetapi ditandai status "Late"
- Riwayat submission disimpan (max 3 versi per tugas)
- **Priority:** Must Have | **Actor:** Mahasiswa

### FR-ASSIGN-03 — Grading & Feedback (Dosen)

- Dosen dapat download submission mahasiswa
- Beri nilai (0–100), tulis feedback teks, pilih status (graded / revision requested)
- Nilai tersimpan dan muncul di halaman nilai mahasiswa
- Support bulk grading untuk efisiensi
- **Priority:** Should Have | **Actor:** Dosen

---

## 4. Modul Quiz & Ujian

### Quiz Reguler

| Fitur       | Spesifikasi                              |
| ----------- | ---------------------------------------- |
| Tipe soal   | MCQ, true/false, essay singkat           |
| Durasi      | Waktu terbatas dengan countdown timer    |
| Auto-submit | Aktif saat waktu habis                   |
| Urutan soal | Random question order (opsional)         |
| Penilaian   | MCQ otomatis, essay dinilai manual dosen |

### UTS / UAS

| Fitur    | Spesifikasi                                    |
| -------- | ---------------------------------------------- |
| Akses    | Hanya bisa diakses dalam window waktu tertentu |
| Attempt  | One-time attempt per mahasiswa                 |
| Navigasi | Anti back-navigation (simulasi)                |
| Export   | Hasil dapat diekspor ke Excel (Admin)          |
| Rekap    | Nilai otomatis masuk ke gradebook              |

---

## 5. Modul Lanjutan

| Modul             | Fungsi Utama                                                               | Actor            | Phase   |
| ----------------- | -------------------------------------------------------------------------- | ---------------- | ------- |
| Forum Diskusi     | Thread per course, reply bersarang, pin thread, search diskusi             | Semua            | Phase 2 |
| Announcement      | Broadcast pesan ke kelas, read/unread, priority pin, schedule publish      | Dosen, Admin     | Phase 2 |
| Notifikasi        | Bell icon, badge unread, kategori: deadline/nilai/diskusi/admin            | Semua            | Phase 3 |
| Absensi           | Dosen buka sesi absen, mahasiswa submit kehadiran, rekap per minggu        | Mahasiswa, Dosen | Phase 2 |
| Kalender Akademik | Visualisasi semester, event penting, filter per course                     | Semua            | Phase 3 |
| Analytics         | Engagement rate, nilai rata-rata, mahasiswa belum submit, attendance trend | Dosen, Admin     | Phase 3 |

---

## 6. Validasi & Error Handling Global

| Kondisi                    | Pesan Error                                | Aksi                   |
| -------------------------- | ------------------------------------------ | ---------------------- |
| Field wajib kosong         | "Field ini wajib diisi"                    | Highlight border merah |
| Format email salah         | "Format email tidak valid"                 | Inline validation      |
| File melebihi batas ukuran | "Ukuran file melebihi batas X MB"          | Tolak upload           |
| Session expired            | "Sesi Anda telah berakhir"                 | Redirect ke login      |
| Akses tidak diizinkan      | "Anda tidak memiliki akses ke halaman ini" | Redirect ke dashboard  |
| Koneksi gagal              | "Gagal memuat data. Coba lagi."            | Tampilkan tombol retry |
