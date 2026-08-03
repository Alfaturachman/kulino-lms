# Panduan Penggunaan Aplikasi (User Manual Document)

**Sistem:** KULINO — Kuliah Online | Learning Management System  
**Versi Dokumen:** 1.1  
**Status:** Terverifikasi & Siap Produksi

Dokumen ini berisi panduan teknis penggunaan platform KULINO LMS untuk empat aktor utama: Mahasiswa, Dosen, Staff TU, dan Super Admin.

---

## 1. Panduan Mahasiswa (Student Manual)

### 1.1 Alur Masuk & Dashboard Utama
1. Buka peramban (*browser*) dan akses halaman utama `/login`.
2. Masukkan email mahasiswa (misal: `122202202921@mhs.dinus.ac.id`) dan password akun.
3. Setelah login berhasil, sistem akan mengarahkan secara otomatis ke `/dashboard`.
4. Di dashboard, Mahasiswa dapat melihat:
   - Ringkasan KRS dan total SKS berjalan.
   - Kartu mata kuliah (*Course Cards*) beserta persentase progres belajar.
   - Widget tenggat waktu tugas terdekat (*Upcoming Deadlines*).
   - Visual kalender akademik mingguan.

### 1.2 Mengakses Materi & Mengirim Penilaian (Tugas / UTS / UAS)
1. Klik salah satu kartu mata kuliah untuk masuk ke halaman detail `/dashboard/course/[id]`.
2. Buka tab **Materi** untuk melihat silabus dan materi mingguan (pertemuan 1 s.d. 16).
3. Buka tab **Penilaian** untuk melihat daftar tugas/UTS/UAS dari dosen beserta mode pengerjaannya (unggah file / online quiz / manual).
4. Klik tombol **Submit**, pilih file jawaban (format PDF/ZIP max 10MB), lalu konfirmasi pengiriman.
5. Jika pengumpulan melewati batas tenggat waktu, sistem akan mencatat timestamp pengumpulan dan memberikan badge **Terlambat**.

### 1.3 Mengerjakan Penilaian Online (CBT / Online Quiz)
1. Buka tab **Penilaian** pada detail mata kuliah, lalu pilih penilaian dengan mode **Online Quiz**.
2. Klik **Mulai Kuis** saat window waktu pengerjaan telah dibuka oleh dosen.
3. Kerjakan soal pilihan ganda atau esai. Perhatikan countdown timer di bagian atas layar.
4. Jawaban akan disimpan secara otomatis. Jika waktu habis, sistem akan melakukan *auto-submit* jawaban yang telah terisi.
5. Penilaian UTS/UAS hanya dapat dikerjakan **satu kali**; pastikan koneksi stabil sebelum memulai.

---

## 2. Panduan Dosen (Lecturer Manual)

### 2.1 Mengelola Materi & Pengumuman Kelas
1. Login dengan kredensial dosen dan masuk ke halaman `/lecturer`.
2. Pilih kelas diampu untuk membuka detail kelas `/lecturer/course/[id]`.
3. Klik **Tambah Materi Baru**, isi judul, minggu pertemuan (1 s.d. 16), tipe (PDF/Video YouTube/Link), dan upload file/URL.
4. Gunakan form **Pengumuman Kelas** untuk menyiarkan pesan penting ke seluruh mahasiswa di kelas tersebut.

### 2.2 Penilaian Mahasiswa (*Grading*)
1. Pada halaman detail kelas, buka tab **Penilaian**.
2. Sistem akan menampilkan daftar pengumpulan mahasiswa (mode file_upload) beserta hasil online quiz (mode online_quiz) dan indikator keterlambatan (badge merah jika terlambat).
3. Unduh berkas mahasiswa, masukkan nilai angka (0–100) dan umpan balik (*feedback*) teks.
4. Klik **Simpan Nilai** untuk memperbarui gradebook mahasiswa secara real-time.

### 2.3 Mengelola Presensi Kehadiran Mahasiswa
1. Pada halaman detail kelas dosen, buka tab **Presensi / Absensi**.
2. Pilih pertemuan minggu ke-n (pertemuan 1 s.d. 16).
3. Tandai status setiap mahasiswa (`present`, `absent`, `sick`, `permission`).
4. Klik **Simpan Presensi** untuk mencatat absensi ke dalam database.

---

## 3. Panduan Staff TU (Staff Manual)

### 3.1 Penawaran Kelas & Registrasi Mahasiswa
1. Akses halaman `/staff` setelah login sebagai staff TU.
2. Gunakan form **Tambah Kelas** untuk memetakan mata kuliah master ke kelas semester (misal: Pemrograman Web -> Kelas TI-3A).
3. Gunakan modul **Enrollment** untuk memasukkan mahasiswa ke dalam kelas aktif.

### 3.2 Registrasi Akun Massal (*Bulk CSV Import*)
1. Pilih menu **Import Mahasiswa (CSV)** pada dashboard TU.
2. Upload file `.csv` dengan format kolom: `name,email,nim_nip,role`.
3. Klik **Mulai Import**. Sistem akan menampilkan progress bar pengolahan baris secara real-time dan mendaftarkan akun baru ke Supabase Auth.

---

## 4. Panduan Super Admin (Admin Manual)

### 4.1 Manajemen Akun Pengguna & Reset Password
1. Login sebagai superadmin dan buka rute `/admin`.
2. Buka tab **Users** untuk menambah pengguna baru secara manual atau mengubah data pengguna (nama, email, NIM/NIP, role).
3. Untuk mereset kata sandi pengguna, klik icon pensil di baris pengguna, masukkan kata sandi baru, dan simpan. Kata sandi akan diperbarui secara aman via Supabase Auth Admin API.

### 4.2 Pemantauan Audit Logs & Kalender Akademik
1. Buka tab **Overview** untuk melihat statistik sistem real-time dan log audit aktivitas administratif (`audit_logs`).
2. Buka tab **Kalender Akademik** untuk menambahkan jadwal agenda universitas (UTS, UAS, libur semester).
3. Buka tab **Reports** untuk mengunduh laporan nilai kumulatif (*Gradebook PDF*) dan statistik server.

---

## 5. Bantuan Teknis & Troubleshooting

### 5.1 Pertanyaan Sering Diajukan (FAQ)
- **Gagal Login**: Pastikan email dan kata sandi benar. Jika lupa password, hubungi Admin/TU untuk reset password.
- **File Upload Ditolak**: Pastikan ukuran file di bawah 10MB dan ekstensi file sesuai yang diizinkan (PDF/ZIP/DOCX).
- **Penilaian Online Tidak Dapat Dibuka**: Penilaian mode `online_quiz` hanya dapat diakses dalam rentang waktu `open_at` dan `deadline` yang telah ditentukan dosen.
- **Progress Belajar Tidak Bertambah**: Selesaikan modul dan kumpulkan tugas mingguan agar persentase progres bertambah.

### 5.2 Kontak Layanan Bantuan
- **Email Support**: support@kulino.dinus.ac.id
- **Layanan Helpdesk TU**: Gedung H Lantai 1 Universitas Dian Nuswantoro
- **Jam Layanan**: Senin – Jumat, 08:00 – 16:00 WIB
- **Telepon Helpdesk**: (024) 3517261 ext. 104
