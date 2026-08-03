# Functional Requirements Document (FRD)

## KULINO — Spesifikasi Fungsional Sistem

**Versi:** 1.2 | **Tipe:** Engineering Doc | **Status:** Approved (Tersinkronisasi)

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
    - Pengunjung (tanpa login) tidak memiliki akses ke rute protected
- **Priority:** Must Have

### FR-AUTH-04 — Registrasi Akun Baru

- **Input:** nama lengkap, email (valid), password (min 8 karakter)
- **Proses:** Validasi format & duplikasi email, lalu buat akun dengan role default `mahasiswa`
- **Output:** Akun baru tersimpan + redirect ke `/login` untuk masuk
- **Catatan:** Verifikasi/aktivasi oleh TU/Admin opsional (di luar proses registrasi self-service)
- **Error Handling:** "Email sudah terdaftar" jika email duplikat
- **Priority:** Must Have

### FR-AUTH-03 — Logout & Session Expiry

- User dapat logout manual kapan saja
- Session expired otomatis setelah 8 jam inaktif
- Token sesi disimpan di **httpOnly cookie** via `@supabase/ssr` (mekanisme utama); mode mock/offline fallback menyimulasikan sesi via localStorage — lihat `05_architecture.md` §6.1
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
- Tab navigation: **Materi | Penilaian | Diskusi | Nilai**
- **Priority:** Must Have | **Actor:** Mahasiswa, Dosen

### FR-COURSE-03 — Upload Materi oleh Dosen

- **Input:** judul materi, deskripsi, type (YouTube URL / Google Drive URL / PDF upload), week number, visibility (published/draft)
- **Validasi:** URL harus valid; PDF max 50MB
- **Output:** Materi muncul di timeline minggu yang ditentukan
- **Priority:** Must Have | **Actor:** Dosen

### FR-COURSE-04 — Progress Tracking Mahasiswa

- Sistem melacak: modul yang sudah dibuka (viewed), penilaian yang sudah disubmit/dikerjakan
- Progress % = (items completed / total items) × 100
- Ditampilkan di course card dan halaman detail
- **Priority:** Should Have | **Actor:** Mahasiswa

---

## 3. Modul Penilaian (Assessment) & Submission

Model penilaian KULINO bersifat **fleksibel**: dosen membuat penilaian bertipe `task` (tugas), `uts`, atau `uas` dengan **mode** `file_upload`, `online_quiz`, atau `manual` — kombinasi bebas sesuai kebutuhan dosen. UTS/UAS **tidak wajib** berupa quiz, dan tugas juga bisa berbentuk quiz online.

### FR-ASMT-01 — Buat Penilaian (Dosen)

- **Input:** judul, instruksi (rich text), type (`task`/`uts`/`uas`), mode (`file_upload`/`online_quiz`/`manual`), bobot nilai (%), deadline (datetime), `open_at` (window mulai, opsional), `is_published`
- **Atribut sesuai mode:**
    - `file_upload`: format file yang diterima (PDF/DOCX/ZIP), max file size (default 10MB)
    - `online_quiz`: durasi menit (countdown timer) + daftar soal (MCQ/true-false/essay)
    - `manual`: tanpa upload/pengerjaan online (nilai diinput langsung oleh dosen)
- **Output:** Penilaian muncul di tab "Penilaian" mahasiswa dengan countdown timer (mode online) / instruksi unggah (mode file)
- **Priority:** Must Have | **Actor:** Dosen

### FR-ASMT-02 — Submit & Pengerjaan (Mahasiswa)

- **Mode `file_upload`:** upload file max 10MB; **validasi** format, ukuran, deadline; setelah submit tampilkan konfirmasi dengan timestamp; jika melewati deadline → submission tetap bisa tetapi ditandai "Late"; riwayat submission disimpan (max 3 versi)
- **Mode `online_quiz`:** kerjakan soal MCQ/true-false (dinilai otomatis) dan essay (dinilai manual dosen); waktu terbatas dengan countdown; **auto-submit** saat waktu habis; urutan soal random (opsional)
- **Mode `manual`:** tidak ada aksi submit dari mahasiswa (nilai diinput dosen)
- **Priority:** Must Have | **Actor:** Mahasiswa

### FR-ASMT-03 — UTS/UAS & Kebijakan Ujian (CBT)

- Akses hanya dalam **window waktu tertentu** (`open_at` – `deadline`)
- **One-time attempt** per mahasiswa untuk type `uts`/`uas`
- Anti back-navigation (simulasi)
- Hasil dapat **diekspor ke Excel** (Admin); nilai otomatis masuk ke **gradebook**
- **Priority:** Must Have | **Actor:** Mahasiswa, Dosen, Admin

### FR-ASMT-04 — Grading & Feedback (Dosen)

- Dosen dapat download submission mahasiswa (mode file) / melihat jawaban (mode online)
- Beri nilai (0–100), tulis feedback teks, pilih status (graded / revision requested)
- Nilai tersimpan dan muncul di halaman nilai mahasiswa
- Support bulk grading untuk efisiensi
- **Priority:** Should Have | **Actor:** Dosen

---

## 4. Modul Lanjutan

| Modul             | Fungsi Utama                                                               | Actor            | Phase   |
| ----------------- | -------------------------------------------------------------------------- | ---------------- | ------- |
| Forum Diskusi     | Thread per course, reply bersarang, pin thread, search diskusi             | Semua            | Phase 2 |
| Announcement      | Broadcast pesan ke kelas, read/unread, priority pin, schedule publish      | Dosen, Admin     | Phase 2 |
| Notifikasi        | Bell icon, badge unread, kategori: deadline/nilai/diskusi/admin/pengumuman (5: deadline, grade, discussion, admin, announcement) | Semua            | Phase 3 |
| Absensi           | Dosen buka sesi absen, mahasiswa submit kehadiran, rekap per minggu        | Mahasiswa, Dosen | Phase 2 |
| Kalender Akademik | Visualisasi semester, event penting, filter per course                     | Semua            | Phase 3 |
| Analytics         | Engagement rate, nilai rata-rata, mahasiswa belum submit, attendance trend | Dosen, Admin     | Phase 3 |

---

## 5. Validasi & Error Handling Global

| Kondisi                    | Pesan Error                                | Aksi                   |
| -------------------------- | ------------------------------------------ | ---------------------- |
| Field wajib kosong         | "Field ini wajib diisi"                    | Highlight border merah |
| Format email salah         | "Format email tidak valid"                 | Inline validation      |
| File melebihi batas ukuran | "Ukuran file melebihi batas X MB"          | Tolak upload           |
| Session expired            | "Sesi Anda telah berakhir"                 | Redirect ke login      |
| Akses tidak diizinkan      | "Anda tidak memiliki akses ke halaman ini" | Redirect ke dashboard  |
| Koneksi gagal              | "Gagal memuat data. Coba lagi."            | Tampilkan tombol retry |
| Percobaan login gagal 5x   | "Akun terkunci sementara. Coba lagi nanti" | Lockout sementara      |

---

## 6. Modul Keamanan & Jejak Audit

### FR-SEC-01 — Audit Trail Administratif (BR-10)

- **Deskripsi:** Merekam seluruh aksi administratif secara otomatis: login sukses serta operasi `INSERT`/`UPDATE`/`DELETE` pada data user oleh role `admin` atau `tu`.
- **Proses:** Trigger database `trg_user_audit` dan `trg_user_login` menulis ke tabel `audit_logs` (user_name, action, ip_address, created_at).
- **Output:** Log tersimpan otomatis tanpa intervensi user; dapat dilihat/diekspor oleh Super Admin untuk audit.
- **Priority:** Must Have | **Actor:** System (otomatis), Admin

### FR-SEC-02 — Lockout Akun (Brute-Force Protection)

- **Proses:** Setelah **5x** percobaan login gagal dalam jendela waktu tertentu, akun dikunci sementara (misal 15 menit).
- **Output:** Pesan "Akun terkunci sementara. Coba lagi nanti" + tidak menerima kredensial selama masa lockout.
- **Priority:** Must Have | **Actor:** System

### FR-SEC-03 — Sesi & Kebijakan Cookie

- Token sesi disimpan di **httpOnly, Secure, SameSite** cookie (mode mock menggunakan localStorage hanya untuk fallback offline — lihat `05_architecture.md` §6.1).
- Session expired otomatis setelah **8 jam** inaktif (fallback ke FR-AUTH-03).
- Logout manual tersedia kapan saja dan menghapus seluruh cookie sesi.
- **Priority:** Must Have | **Actor:** System, Semua user

---

## 7. Modul Administrasi & Paginasi Data

### FR-ADM-01 — Paginasi Interaktif Tabel Admin

- **Deskripsi:** Tabel "Log Aktivitas Sistem (Audit Logs)" dan "Seluruh Pengguna Sistem" dilengkapi kontrol paginasi interaktif.
- **Spesifikasi:**
  - Default tampilan tabel pengguna: **10 data per halaman**.
  - Dropdown opsi pilihan ukuran baris: 5, 10, 20, atau 50 data.
  - Kontrol navigasi Halaman Sebelumnya (`<`) & Halaman Selanjutnya (`>`) dengan indikator teks `Menampilkan X–Y dari Z data`.
  - Otomatis meriset halaman ke Halaman 1 saat kata kunci pencarian atau filter peran diubah.
- **Priority:** Must Have | **Actor:** Admin
