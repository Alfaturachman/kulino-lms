# Dokumen Desain Basis Data (Database Design Specification)

**Sistem:** KULINO — Kuliah Online | Learning Management System  
**Teknologi:** PostgreSQL  
**Versi Dokumen:** 1.1  
**Tanggal:** Juni 2026  
**Status:** Rancangan Final (Siap Produksi)

---

## 1. Arsitektur Data

Sistem KULINO dirancang menggunakan arsitektur basis data relasional. Seluruh integritas data akademik dijaga secara penuh di tingkat basis data menggunakan batasan kunci asing (_Foreign Key Constraints_), batasan nilai unik (_Unique Constraints_), dan indeks untuk mengoptimalkan kueri pencarian.

---

## 2. Kamus Data (Data Dictionary)

Berikut adalah definisi struktur tabel secara rinci beserta tipe data dan batasan yang diterapkan.

### 2.1 Tabel `users`

Menyimpan informasi seluruh akun pengguna (Mahasiswa, Dosen, Staff TU, Admin).

| Nama Kolom   | Tipe Data      | Batasan (Constraints)                      | Keterangan                                               |
| :----------- | :------------- | :----------------------------------------- | :------------------------------------------------------- |
| `id`         | `UUID`         | Primary Key, Default `gen_random_uuid()`   | Pengidentifikasi unik pengguna.                          |
| `name`       | `VARCHAR(100)` | NOT NULL                                   | Nama lengkap pengguna.                                   |
| `email`      | `VARCHAR(100)` | NOT NULL, UNIQUE                           | Alamat email (digunakan untuk login).                    |
| `password`   | `VARCHAR(255)` | NOT NULL                                   | Password terenkripsi (hash bcrypt).                      |
| `nim_nip`    | `VARCHAR(20)`  | NOT NULL, UNIQUE                           | NIM (Mahasiswa) atau NIP (Dosen/Staff).                  |
| `role`       | `VARCHAR(20)`  | NOT NULL, Default 'mahasiswa'              | Hak akses: `guest`, `mahasiswa`, `dosen`, `tu`, `admin`. |
| `prodi_id`   | `UUID`         | FK → `prodi(id)`, ON DELETE SET NULL, NULL | Program studi asal pengguna (NULL untuk admin/guest/TU). |
| `created_at` | `TIMESTAMP`    | Default `CURRENT_TIMESTAMP`                | Waktu pendaftaran akun.                                  |
| `updated_at` | `TIMESTAMP`    | Default `CURRENT_TIMESTAMP`                | Waktu pembaruan akun terakhir.                           |

---

### 2.2 Tabel `courses`

Menyimpan master data mata kuliah dalam kurikulum.

| Nama Kolom     | Tipe Data      | Batasan (Constraints)                     | Keterangan                                                              |
| :------------- | :------------- | :---------------------------------------- | :---------------------------------------------------------------------- |
| `id`           | `UUID`         | Primary Key, Default `gen_random_uuid()`  | Pengidentifikasi unik mata kuliah.                                      |
| `name`         | `VARCHAR(150)` | NOT NULL                                  | Nama mata kuliah.                                                       |
| `code`         | `VARCHAR(20)`  | NOT NULL, UNIQUE                          | Kode unik mata kuliah (misal: `TI301`).                                 |
| `kelompok_mk`  | `VARCHAR(50)`  | NOT NULL, Default 'Wajib Program Studi'   | Kelompok/klasifikasi mata kuliah (misal: 'Wajib Umum', 'Pilihan', dsb). |
| `sks`          | `INTEGER`      | NOT NULL, Check `sks > 0`                 | Bobot Satuan Kredit Semester.                                           |
| `teori`        | `INTEGER`      | NOT NULL, Default 0, Check `teori >= 0`   | Bobot SKS Teori.                                                        |
| `praktek`      | `INTEGER`      | NOT NULL, Default 0, Check `praktek >= 0` | Bobot SKS Praktikum/Praktek.                                            |
| `kurikulum_id` | `UUID`         | FK → `kurikulum(id)`, ON DELETE RESTRICT  | Kurikulum yang menaungi mata kuliah ini.                                |
| `description`  | `TEXT`         | NOT NULL                                  | Deskripsi lengkap mata kuliah.                                          |
| `created_at`   | `TIMESTAMP`    | Default `CURRENT_TIMESTAMP`               | Tanggal pembuatan mata kuliah.                                          |
| `updated_at`   | `TIMESTAMP`    | Default `CURRENT_TIMESTAMP`               | Waktu pembaruan mata kuliah terakhir.                                   |

_Batasan Tambahan:_ Kombinasi `sks` harus merupakan hasil penjumlahan `teori` dan `praktek` (`CHECK (sks = teori + praktek)`).

---

### 2.3 Tabel `classes`

Menyimpan informasi kelas aktif/penawaran mata kuliah per semester.

| Nama Kolom    | Tipe Data     | Batasan (Constraints)                                     | Keterangan                                                                          |
| :------------ | :------------ | :-------------------------------------------------------- | :---------------------------------------------------------------------------------- |
| `id`          | `UUID`        | Primary Key, Default `gen_random_uuid()`                  | Pengidentifikasi unik kelas aktif.                                                  |
| `course_id`   | `UUID`        | FK → `courses(id)`, ON DELETE CASCADE                     | ID mata kuliah master.                                                              |
| `class_name`  | `VARCHAR(20)` | NOT NULL                                                  | Nama kelas akademik (misal: `TI-3A`).                                               |
| `semester`    | `VARCHAR(30)` | NOT NULL                                                  | Semester berjalan (misal: `Ganjil 2025/2026`).                                      |
| `lecturer_id` | `UUID`        | FK → `users(id)`, ON DELETE RESTRICT                      | Dosen pengampu kelas.                                                               |
| `day_of_week` | `VARCHAR(15)` | NULL, Check `day_of_week` in ('Senin', ... 'Minggu')      | Hari pelaksanaan kelas (misal: 'Senin').                                            |
| `start_time`  | `TIME`        | NULL                                                      | Waktu mulai perkuliahan (misal: '08:00:00').                                        |
| `end_time`    | `TIME`        | NULL                                                      | Waktu selesai perkuliahan (misal: '10:30:00').                                      |
| `room`        | `VARCHAR(50)` | NULL                                                      | Ruangan tempat perkuliahan (misal: 'Ruang H.4.1').                                  |
| `status`      | `VARCHAR(15)` | Default 'active'                                          | Status kelas: `active` atau `completed`.                                            |
| `created_at`  | `TIMESTAMP`   | Default `CURRENT_TIMESTAMP`                               | Tanggal pembuatan kelas aktif.                                                      |
| `updated_at`  | `TIMESTAMP`   | Default `CURRENT_TIMESTAMP`                               | Waktu pembaruan kelas aktif terakhir.                                               |

_Batasan Tambahan:_ 
1. Kombinasi `(course_id, class_name, semester)` harus unik (`UNIQUE`) untuk menghindari pembuatan kelas yang sama berulang kali.
2. Batasan isi hari perkuliahan (`CHECK (day_of_week IN ('Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'))`).

---

### 2.4 Tabel `enrollments`

Menghubungkan mahasiswa dengan kelas aktif yang mereka ambil (relasi banyak-ke-banyak).

| Nama Kolom     | Tipe Data     | Batasan (Constraints)                             | Keterangan                                |
| :------------- | :------------ | :------------------------------------------------ | :---------------------------------------- |
| `id`           | `UUID`        | Primary Key, Default `gen_random_uuid()`          | Pengidentifikasi unik pendaftaran.        |
| `student_id`   | `UUID`        | FK → `users(id)`, ON DELETE CASCADE               | ID mahasiswa yang mendaftar.              |
| `class_id`     | `UUID`        | FK → `classes(id)`, ON DELETE CASCADE             | ID kelas yang diikuti.                    |
| `status`       | `VARCHAR(15)` | Default 'active'                                  | Status: `active`, `dropped`, `completed`. |
| `progress_pct` | `INTEGER`     | Default 0, Check `progress_pct BETWEEN 0 AND 100` | Persentase progres belajar (0–100%).      |
| `created_at`   | `TIMESTAMP`   | Default `CURRENT_TIMESTAMP`                       | Tanggal mahasiswa masuk ke kelas.         |

_Batasan Tambahan:_ Kombinasi `(student_id, class_id)` harus unik (`UNIQUE`).

---

### 2.5 Tabel `modules`

Menyimpan materi pembelajaran mingguan per kelas.

| Nama Kolom     | Tipe Data      | Batasan (Constraints)                      | Keterangan                                        |
| :------------- | :------------- | :----------------------------------------- | :------------------------------------------------ |
| `id`           | `UUID`         | Primary Key, Default `gen_random_uuid()`   | Pengidentifikasi unik materi.                     |
| `class_id`     | `UUID`         | FK → `classes(id)`, ON DELETE CASCADE      | ID kelas tempat materi diunggah.                  |
| `title`        | `VARCHAR(150)` | NOT NULL                                   | Judul materi mingguan.                            |
| `week_no`      | `INTEGER`      | NOT NULL, Check `week_no BETWEEN 1 AND 16` | Pertemuan minggu ke-n.                            |
| `type`         | `VARCHAR(15)`  | NOT NULL                                   | Tipe materi: `video`, `pdf`, `link`, `ppt`.       |
| `content_url`  | `VARCHAR(255)` | NOT NULL                                   | Tautan unduhan file / tautan video.               |
| `description`  | `TEXT`         | NULL                                       | Catatan tambahan tentang materi.                  |
| `is_published` | `BOOLEAN`      | Default TRUE                               | Menentukan apakah materi dapat dilihat mahasiswa. |
| `created_at`   | `TIMESTAMP`    | Default `CURRENT_TIMESTAMP`                | Tanggal publikasi materi.                         |

---

### 2.6 Tabel `assignments`

Menyimpan data instruksi penugasan akademik/ujian dari dosen.

| Nama Kolom        | Tipe Data       | Batasan (Constraints)                          | Keterangan                                          |
| :---------------- | :-------------- | :--------------------------------------------- | :-------------------------------------------------- |
| `id`              | `UUID`          | Primary Key, Default `gen_random_uuid()`       | Pengidentifikasi unik tugas.                        |
| `class_id`        | `UUID`          | FK → `classes(id)`, ON DELETE CASCADE          | ID kelas terkait.                                   |
| `title`           | `VARCHAR(150)`  | NOT NULL                                       | Judul penugasan.                                    |
| `description`     | `TEXT`          | NOT NULL                                       | Petunjuk pengerjaan tugas & rubrik penilaian.       |
| `deadline`        | `TIMESTAMP`     | NOT NULL                                       | Tanggal dan waktu batas pengumpulan.                |
| `weight_pct`      | `INTEGER`       | NOT NULL, Check `weight_pct BETWEEN 1 AND 100` | Bobot nilai tugas terhadap total nilai (%).         |
| `allowed_formats` | `VARCHAR(50)[]` | NOT NULL                                       | Ekstensi file yang diizinkan (misal: `pdf`, `zip`). |
| `max_size_mb`     | `INTEGER`       | Default 10                                     | Batas maksimal ukuran file (MB).                    |
| `created_at`      | `TIMESTAMP`     | Default `CURRENT_TIMESTAMP`                    | Tanggal penugasan diterbitkan.                      |

---

### 2.7 Tabel `submissions`

Menyimpan data pengumpulan tugas oleh mahasiswa.

| Nama Kolom      | Tipe Data      | Batasan (Constraints)                     | Keterangan                                                         |
| :-------------- | :------------- | :---------------------------------------- | :----------------------------------------------------------------- |
| `id`            | `UUID`         | Primary Key, Default `gen_random_uuid()`  | Pengidentifikasi unik pengumpulan.                                 |
| `assignment_id` | `UUID`         | FK → `assignments(id)`, ON DELETE CASCADE | ID penugasan terkait.                                              |
| `student_id`    | `UUID`         | FK → `users(id)`, ON DELETE CASCADE       | ID mahasiswa pengumpul tugas.                                      |
| `file_url`      | `VARCHAR(255)` | NOT NULL                                  | Nama/tautan file yang dikumpulkan.                                 |
| `submitted_at`  | `TIMESTAMP`    | Default `CURRENT_TIMESTAMP`               | Waktu pengumpulan tugas.                                           |
| `is_late`       | `BOOLEAN`      | Default FALSE                             | Status terlambat (terisi otomatis jika `submitted_at > deadline`). |
| `version`       | `INTEGER`      | Default 1                                 | Versi pengumpulan (untuk tracking revisi file).                    |
| `grade`         | `INTEGER`      | NULL, Check `grade BETWEEN 0 AND 100`     | Nilai angka yang diberikan dosen.                                  |
| `feedback`      | `TEXT`         | NULL                                      | Umpan balik/catatan dari dosen.                                    |
| `graded_at`     | `TIMESTAMP`    | NULL                                      | Tanggal pemberian nilai oleh dosen.                                |

---

### 2.8 Tabel `calendar_events`

Menyimpan agenda kalender akademik universitas dan kelas.

| Nama Kolom   | Tipe Data      | Batasan (Constraints)                        | Keterangan                                      |
| :----------- | :------------- | :------------------------------------------- | :---------------------------------------------- |
| `id`         | `UUID`         | Primary Key, Default `gen_random_uuid()`     | Pengidentifikasi unik agenda.                   |
| `title`      | `VARCHAR(150)` | NOT NULL                                     | Nama acara/agenda akademik.                     |
| `date`       | `TIMESTAMP`    | NOT NULL                                     | Tanggal dan waktu pelaksanaan acara.            |
| `type`       | `VARCHAR(15)`  | NOT NULL                                     | Jenis acara: `exam`, `task`, `academic`.        |
| `class_id`   | `UUID`         | FK → `classes(id)`, ON DELETE SET NULL, NULL | Terhubung ke kelas aktif tertentu jika relevan. |
| `created_at` | `TIMESTAMP`    | Default `CURRENT_TIMESTAMP`                  | Tanggal pembuatan acara.                        |

---

### 2.9 Tabel `announcements`

Menyimpan data pengumuman yang disiarkan di kelas.

| Nama Kolom | Tipe Data      | Batasan (Constraints)                    | Keterangan                            |
| :--------- | :------------- | :--------------------------------------- | :------------------------------------ |
| `id`       | `UUID`         | Primary Key, Default `gen_random_uuid()` | Pengidentifikasi unik pengumuman.     |
| `class_id` | `UUID`         | FK → `classes(id)`, ON DELETE CASCADE    | ID kelas tempat pengumuman disiarkan. |
| `title`    | `VARCHAR(150)` | NOT NULL                                 | Judul pengumuman.                     |
| `content`  | `TEXT`         | NOT NULL                                 | Isi teks lengkap pengumuman.          |
| `date`     | `TIMESTAMP`    | Default `CURRENT_TIMESTAMP`              | Waktu siaran pengumuman.              |

---

### 2.10 Tabel `discussions`

Menyimpan topik diskusi dalam forum kelas.

| Nama Kolom  | Tipe Data      | Batasan (Constraints)                    | Keterangan                                         |
| :---------- | :------------- | :--------------------------------------- | :------------------------------------------------- |
| `id`        | `UUID`         | Primary Key, Default `gen_random_uuid()` | Pengidentifikasi unik thread forum.                |
| `class_id`  | `UUID`         | FK → `classes(id)`, ON DELETE CASCADE    | ID kelas terkait.                                  |
| `author_id` | `UUID`         | FK → `users(id)`, ON DELETE CASCADE      | ID pengguna pembuat topik (referential integrity). |
| `title`     | `VARCHAR(200)` | NOT NULL                                 | Judul topik diskusi.                               |
| `content`   | `TEXT`         | NOT NULL                                 | Isi pertanyaan/topik utama.                        |
| `date`      | `TIMESTAMP`    | Default `CURRENT_TIMESTAMP`              | Tanggal pembuatan thread.                          |

---

### 2.11 Tabel `discussion_replies`

Menyimpan tanggapan/jawaban mahasiswa & dosen pada topik diskusi.

| Nama Kolom      | Tipe Data   | Batasan (Constraints)                     | Keterangan                                              |
| :-------------- | :---------- | :---------------------------------------- | :------------------------------------------------------ |
| `id`            | `UUID`      | Primary Key, Default `gen_random_uuid()`  | Pengidentifikasi unik balasan.                          |
| `discussion_id` | `UUID`      | FK → `discussions(id)`, ON DELETE CASCADE | Topik diskusi induk yang dibalas.                       |
| `author_id`     | `UUID`      | FK → `users(id)`, ON DELETE CASCADE       | ID pengguna pengirim tanggapan (referential integrity). |
| `content`       | `TEXT`      | NOT NULL                                  | Isi teks tanggapan.                                     |
| `date`          | `TIMESTAMP` | Default `CURRENT_TIMESTAMP`               | Tanggal tanggapan dikirim.                              |

---

### 2.12 Tabel `attendance`

Menyimpan data kehadiran/absensi mahasiswa per pertemuan mingguan.

| Nama Kolom     | Tipe Data     | Batasan (Constraints)                      | Keterangan                                         |
| :------------- | :------------ | :----------------------------------------- | :------------------------------------------------- |
| `id`           | `UUID`        | Primary Key, Default `gen_random_uuid()`   | Pengidentifikasi unik absensi.                     |
| `class_id`     | `UUID`        | FK → `classes(id)`, ON DELETE CASCADE      | ID kelas terkait.                                  |
| `student_id`   | `UUID`        | FK → `users(id)`, ON DELETE CASCADE        | ID mahasiswa.                                      |
| `week_no`      | `INTEGER`     | NOT NULL, Check `week_no BETWEEN 1 AND 16` | Pertemuan minggu ke-n.                             |
| `status`       | `VARCHAR(15)` | NOT NULL                                   | Status: `present`, `absent`, `sick`, `permission`. |
| `submitted_at` | `TIMESTAMP`   | Default `CURRENT_TIMESTAMP`                | Waktu pencatatan absensi.                          |

_Batasan Tambahan:_ Kombinasi `(class_id, student_id, week_no)` harus unik (`UNIQUE`).

---

### 2.13 Tabel `grades`

Menyimpan rekap nilai akhir kumulatif mahasiswa per kelas untuk kebutuhan KHS.

| Nama Kolom            | Tipe Data      | Batasan (Constraints)                         | Keterangan                                |
| :-------------------- | :------------- | :-------------------------------------------- | :---------------------------------------- |
| `id`                  | `UUID`         | Primary Key, Default `gen_random_uuid()`      | Pengidentifikasi unik rekap nilai.        |
| `student_id`          | `UUID`         | FK → `users(id)`, ON DELETE CASCADE           | ID mahasiswa.                             |
| `class_id`            | `UUID`         | FK → `classes(id)`, ON DELETE CASCADE         | ID kelas terkait.                         |
| `assignment_score`    | `NUMERIC(5,2)` | CHECK `assignment_score BETWEEN 0 AND 100`    | Nilai rata-rata tugas (bobot 40%).        |
| `midterm_score`       | `NUMERIC(5,2)` | CHECK `midterm_score BETWEEN 0 AND 100`       | Nilai Ujian Tengah Semester (bobot 25%).  |
| `final_score`         | `NUMERIC(5,2)` | CHECK `final_score BETWEEN 0 AND 100`         | Nilai Ujian Akhir Semester (bobot 25%).   |
| `participation_score` | `NUMERIC(5,2)` | CHECK `participation_score BETWEEN 0 AND 100` | Nilai partisipasi/keaktifan (bobot 10%).  |
| `final_grade_letter`  | `VARCHAR(2)`   | NULL                                          | Nilai huruf mutu (A, AB, B, BC, C, D, E). |
| `updated_at`          | `TIMESTAMP`    | Default `CURRENT_TIMESTAMP`                   | Waktu kalkulasi nilai terakhir.           |

_Batasan Tambahan:_ Kombinasi `(student_id, class_id)` harus unik (`UNIQUE`).

---

### 2.14 Tabel `quizzes`

Menyimpan data konfigurasi kuis, UTS, dan UAS per kelas aktif.

| Nama Kolom     | Tipe Data      | Batasan (Constraints)                            | Keterangan                                      |
| :------------- | :------------- | :----------------------------------------------- | :---------------------------------------------- |
| `id`           | `UUID`         | Primary Key, Default `gen_random_uuid()`         | Pengidentifikasi unik kuis.                     |
| `class_id`     | `UUID`         | FK → `classes(id)`, ON DELETE CASCADE            | ID kelas terkait.                               |
| `title`        | `VARCHAR(150)` | NOT NULL                                         | Nama kuis/ujian.                                |
| `type`         | `VARCHAR(10)`  | NOT NULL, Check `type IN ('quiz', 'uts', 'uas')` | Jenis: kuis reguler, UTS, atau UAS.             |
| `duration_min` | `INTEGER`      | NOT NULL, Check `duration_min > 0`               | Durasi pengerjaan dalam menit.                  |
| `open_at`      | `TIMESTAMP`    | NOT NULL                                         | Waktu kuis mulai dapat diakses mahasiswa.       |
| `close_at`     | `TIMESTAMP`    | NOT NULL                                         | Waktu kuis ditutup (auto-submit jika terlewat). |
| `is_published` | `BOOLEAN`      | Default FALSE                                    | Status visibilitas kuis ke mahasiswa.           |
| `created_at`   | `TIMESTAMP`    | Default `CURRENT_TIMESTAMP`                      | Tanggal kuis dibuat.                            |

---

### 2.15 Tabel `questions`

Menyimpan soal-soal yang terdapat dalam sebuah kuis.

| Nama Kolom | Tipe Data     | Batasan (Constraints)                                    | Keterangan                                        |
| :--------- | :------------ | :------------------------------------------------------- | :------------------------------------------------ |
| `id`       | `UUID`        | Primary Key, Default `gen_random_uuid()`                 | Pengidentifikasi unik soal.                       |
| `quiz_id`  | `UUID`        | FK → `quizzes(id)`, ON DELETE CASCADE                    | ID kuis tempat soal berada.                       |
| `content`  | `TEXT`        | NOT NULL                                                 | Isi teks soal.                                    |
| `type`     | `VARCHAR(15)` | NOT NULL, Check `type IN ('mcq', 'essay', 'true_false')` | Tipe soal: pilihan ganda, esai, atau benar/salah. |
| `order_no` | `INTEGER`     | NOT NULL                                                 | Urutan tampil soal dalam kuis.                    |

---

### 2.16 Tabel `question_options`

Menyimpan pilihan jawaban untuk soal bertipe Pilihan Ganda (MCQ).

| Nama Kolom    | Tipe Data   | Batasan (Constraints)                    | Keterangan                                                    |
| :------------ | :---------- | :--------------------------------------- | :------------------------------------------------------------ |
| `id`          | `UUID`      | Primary Key, Default `gen_random_uuid()` | Pengidentifikasi unik pilihan jawaban.                        |
| `question_id` | `UUID`      | FK → `questions(id)`, ON DELETE CASCADE  | ID soal terkait.                                              |
| `option_text` | `TEXT`      | NOT NULL                                 | Isi teks pilihan jawaban.                                     |
| `is_correct`  | `BOOLEAN`   | Default FALSE                            | Status apakah pilihan ini merupakan kunci jawaban yang benar. |
| `created_at`  | `TIMESTAMP` | Default `CURRENT_TIMESTAMP`              | Waktu penambahan pilihan jawaban.                             |
| `updated_at`  | `TIMESTAMP` | Default `CURRENT_TIMESTAMP`              | Waktu pembaruan terakhir.                                     |

---

### 2.17 Tabel `quiz_attempts`

Menyimpan hasil pengerjaan kuis oleh mahasiswa.

| Nama Kolom     | Tipe Data      | Batasan (Constraints)                    | Keterangan                                           |
| :------------- | :------------- | :--------------------------------------- | :--------------------------------------------------- |
| `id`           | `UUID`         | Primary Key, Default `gen_random_uuid()` | Pengidentifikasi unik attempt.                       |
| `quiz_id`      | `UUID`         | FK → `quizzes(id)`, ON DELETE CASCADE    | ID kuis yang dikerjakan.                             |
| `student_id`   | `UUID`         | FK → `users(id)`, ON DELETE CASCADE      | ID mahasiswa yang mengerjakan.                       |
| `started_at`   | `TIMESTAMP`    | Default `CURRENT_TIMESTAMP`              | Waktu mahasiswa mulai mengerjakan.                   |
| `submitted_at` | `TIMESTAMP`    | NULL                                     | Waktu pengumpulan jawaban (NULL jika belum selesai). |
| `score`        | `NUMERIC(5,2)` | NULL, Check `score BETWEEN 0 AND 100`    | Nilai akhir kuis (dihitung otomatis untuk MCQ).      |
| `answers`      | `JSONB`        | NOT NULL                                 | Jawaban mahasiswa per soal dalam format JSON.        |
| `is_late`      | `BOOLEAN`      | Default FALSE                            | Apakah dikumpulkan setelah `close_at` kuis.          |

_Batasan Tambahan:_ Untuk kuis bertipe `uts` dan `uas`, kombinasi `(quiz_id, student_id)` harus unik (one-time attempt).

---

### 2.18 Tabel `notifications`

Menyimpan notifikasi personal yang dikirim ke pengguna.

| Nama Kolom   | Tipe Data      | Batasan (Constraints)                                                                  | Keterangan                                           |
| :----------- | :------------- | :------------------------------------------------------------------------------------- | :--------------------------------------------------- |
| `id`         | `UUID`         | Primary Key, Default `gen_random_uuid()`                                               | Pengidentifikasi unik notifikasi.                    |
| `user_id`    | `UUID`         | FK → `users(id)`, ON DELETE CASCADE                                                    | ID pengguna penerima notifikasi.                     |
| `type`       | `VARCHAR(20)`  | NOT NULL, Check `type IN ('deadline', 'grade', 'discussion', 'admin', 'announcement')` | Kategori notifikasi.                                 |
| `message`    | `VARCHAR(255)` | NOT NULL                                                                               | Teks isi notifikasi.                                 |
| `related_id` | `UUID`         | NULL                                                                                   | ID entitas terkait (misal: ID tugas, ID kuis, dsb.). |
| `is_read`    | `BOOLEAN`      | Default FALSE                                                                          | Status baca (FALSE = belum dibaca, TRUE = sudah).    |
| `created_at` | `TIMESTAMP`    | Default `CURRENT_TIMESTAMP`                                                            | Waktu notifikasi dibuat.                             |

---

### 2.19 Tabel `prodi`

Menyimpan data Program Studi (Prodi) di lingkungan universitas.

| Nama Kolom   | Tipe Data      | Batasan (Constraints)                                  | Keterangan                                                |
| :----------- | :------------- | :----------------------------------------------------- | :-------------------------------------------------------- |
| `id`         | `UUID`         | Primary Key, Default `gen_random_uuid()`               | Pengidentifikasi unik program studi.                      |
| `code`       | `VARCHAR(20)`  | NOT NULL, UNIQUE                                       | Kode unik program studi (misal: `A11`).                   |
| `name`       | `VARCHAR(100)` | NOT NULL                                               | Nama lengkap program studi (misal: `Teknik Informatika`). |
| `degree`     | `VARCHAR(10)`  | NOT NULL, Check `degree IN ('D3','D4','S1','S2','S3')` | Jenjang pendidikan.                                       |
| `created_at` | `TIMESTAMP`    | Default `CURRENT_TIMESTAMP`                            | Tanggal penambahan program studi.                         |
| `updated_at` | `TIMESTAMP`    | Default `CURRENT_TIMESTAMP`                            | Waktu pembaruan data terakhir.                            |

---

### 2.20 Tabel `kurikulum`

Menyimpan data kurikulum akademik yang diterapkan pada Program Studi.

| Nama Kolom   | Tipe Data      | Batasan (Constraints)                         | Keterangan                                      |
| :----------- | :------------- | :-------------------------------------------- | :---------------------------------------------- |
| `id`         | `UUID`         | Primary Key, Default `gen_random_uuid()`      | Pengidentifikasi unik kurikulum.                |
| `prodi_id`   | `UUID`         | FK → `prodi(id)`, ON DELETE CASCADE, NOT NULL | Program studi yang memiliki kurikulum ini.      |
| `name`       | `VARCHAR(150)` | NOT NULL                                      | Nama kurikulum (misal: `Kurikulum 2024 (OBE)`). |
| `year`       | `INTEGER`      | NOT NULL, Check `year BETWEEN 1900 AND 2100`  | Tahun peluncuran/berlaku.                       |
| `is_active`  | `BOOLEAN`      | Default TRUE                                  | Menentukan status keaktifan kurikulum.          |
| `created_at` | `TIMESTAMP`    | Default `CURRENT_TIMESTAMP`                   | Tanggal kurikulum dibuat.                       |
| `updated_at` | `TIMESTAMP`    | Default `CURRENT_TIMESTAMP`                   | Waktu pembaruan kurikulum terakhir.             |

### 2.21 Tabel `audit_logs`

Menyimpan log audit aktivitas administratif yang dilakukan oleh admin atau staf TU, termasuk riwayat masuk (login) serta aksi pembuatan, pengubahan, dan penghapusan data pengguna.

| Nama Kolom   | Tipe Data      | Batasan (Constraints)                    | Keterangan                                                 |
| :----------- | :------------- | :--------------------------------------- | :--------------------------------------------------------- |
| `id`         | `UUID`         | Primary Key, Default `gen_random_uuid()` | Pengidentifikasi unik baris log.                           |
| `user_name`  | `VARCHAR(100)` | NOT NULL                                 | Nama pengguna (operator) yang melakukan aksi.              |
| `action`     | `TEXT`         | NOT NULL                                 | Deskripsi aktivitas (misal: "Login", "Membuat user baru"). |
| `ip_address` | `VARCHAR(45)`  | NULL                                     | Alamat IP operator (jika terdeteksi).                      |
| `created_at` | `TIMESTAMP`    | Default `CURRENT_TIMESTAMP`              | Waktu pencatatan log dilakukan.                            |

_Pemicu Otomatis (Database Triggers):_

- **`trg_user_audit`**: Otomatis dipicu setelah aksi `INSERT`, `UPDATE`, atau `DELETE` pada tabel `users` oleh pengguna dengan role `admin` atau `tu`.
- **`trg_user_login`**: Otomatis dipicu setelah kolom `last_sign_in_at` pada tabel internal Supabase `auth.users` diperbarui, merepresentasikan event Login sukses.

---

## 3. Skrip Pembuatan Tabel (SQL DDL Scripts)

Jalankan perintah SQL DDL berikut di DBMS PostgreSQL Anda untuk membuat database lengkap beserta relasinya:

```sql
-- Mengaktifkan modul UUID generator jika belum aktif
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Pembuatan Tabel prodi
CREATE TABLE public.prodi (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    code character varying(20) NOT NULL,
    name character varying(100) NOT NULL,
    degree character varying(10) NOT NULL,
    created_at timestamp without time zone NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone NULL DEFAULT CURRENT_TIMESTAMP,
    constraint prodi_pkey primary key (id),
    constraint prodi_code_key unique (code),
    constraint prodi_degree_check check (degree::text = any (array['D3'::character varying, 'D4'::character varying, 'S1'::character varying, 'S2'::character varying, 'S3'::character varying]::text[]))
) TABLESPACE pg_default;

-- 2. Pembuatan Tabel kurikulum
CREATE TABLE public.kurikulum (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    prodi_id uuid NOT NULL,
    name character varying(150) NOT NULL,
    year integer NOT NULL,
    is_active boolean NOT NULL DEFAULT true,
    created_at timestamp without time zone NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone NULL DEFAULT CURRENT_TIMESTAMP,
    constraint kurikulum_pkey primary key (id),
    constraint kurikulum_prodi_id_fkey foreign key (prodi_id) references public.prodi (id) on delete cascade,
    constraint kurikulum_year_check check (year >= 1900 and year <= 2100)
) TABLESPACE pg_default;

-- 3. Pembuatan Tabel users
create table public.users (
  id uuid not null,
  name character varying(100) not null,
  email character varying(100) not null,
  password character varying(255) not null,
  nim_nip character varying(20) not null,
  role character varying(20) not null default 'mahasiswa'::character varying,
  prodi_id uuid null,
  created_at timestamp without time zone null default CURRENT_TIMESTAMP,
  updated_at timestamp without time zone null default CURRENT_TIMESTAMP,
  constraint users_pkey primary key (id),
  constraint users_email_key unique (email),
  constraint users_nim_nip_key unique (nim_nip),
  constraint users_prodi_id_fkey foreign key (prodi_id) references public.prodi (id) on delete set null,
  constraint users_role_check check (
    (
      (role)::text = any (
        (
          array[
            'guest'::character varying,
            'mahasiswa'::character varying,
            'dosen'::character varying,
            'tu'::character varying,
            'admin'::character varying
          ]
        )::text[]
      )
    )
  )
) TABLESPACE pg_default;

-- 4. Pembuatan Tabel courses (Master)
CREATE TABLE public.courses (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    name character varying(150) NOT NULL,
    code character varying(20) NOT NULL,
    kelompok_mk character varying(50) NOT NULL DEFAULT 'Wajib Program Studi'::character varying,
    sks integer NOT NULL,
    teori integer NOT NULL DEFAULT 0,
    praktek integer NOT NULL DEFAULT 0,
    kurikulum_id uuid NULL,
    description text NOT NULL,
    created_at timestamp without time zone NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone NULL DEFAULT CURRENT_TIMESTAMP,
    constraint courses_pkey primary key (id),
    constraint courses_code_key unique (code),
    constraint courses_kurikulum_id_fkey foreign key (kurikulum_id) references public.kurikulum (id) on delete restrict,
    constraint courses_sks_check check (sks > 0),
    constraint courses_teori_check check (teori >= 0),
    constraint courses_praktek_check check (praktek >= 0),
    constraint chk_sks_sum check (sks = (teori + praktek))
) TABLESPACE pg_default;

-- 4b. Pembuatan Tabel classes (Kelas Aktif / Penawaran Matakuliah)
CREATE TABLE public.classes (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    course_id uuid NOT NULL,
    class_name character varying(20) NOT NULL,
    semester character varying(30) NOT NULL,
    lecturer_id uuid NOT NULL,
    day_of_week character varying(15) NULL,
    start_time time without time zone NULL,
    end_time time without time zone NULL,
    room character varying(50) NULL,
    status character varying(15) NOT NULL DEFAULT 'active'::character varying,
    created_at timestamp without time zone NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone NULL DEFAULT CURRENT_TIMESTAMP,
    constraint classes_pkey primary key (id),
    constraint classes_course_id_fkey foreign key (course_id) references public.courses (id) on delete cascade,
    constraint classes_lecturer_id_fkey foreign key (lecturer_id) references public.users (id) on delete restrict,
    constraint classes_status_check check (status::text = any (array['active'::character varying, 'completed'::character varying]::text[])),
    constraint classes_course_class_semester_key unique (course_id, class_name, semester),
    constraint chk_classes_day_of_week check (day_of_week::text = any (array['Senin'::text, 'Selasa'::text, 'Rabu'::text, 'Kamis'::text, 'Jumat'::text, 'Sabtu'::text, 'Minggu'::text]))
) TABLESPACE pg_default;

-- 5. Pembuatan Tabel enrollments
CREATE TABLE public.enrollments (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    student_id uuid NOT NULL,
    class_id uuid NOT NULL,
    status character varying(15) NOT NULL DEFAULT 'active'::character varying,
    progress_pct integer NOT NULL DEFAULT 0,
    created_at timestamp without time zone NULL DEFAULT CURRENT_TIMESTAMP,
    constraint enrollments_pkey primary key (id),
    constraint enrollments_student_id_fkey foreign key (student_id) references public.users (id) on delete cascade,
    constraint enrollments_class_id_fkey foreign key (class_id) references public.classes (id) on delete cascade,
    constraint enrollments_student_class_key unique (student_id, class_id),
    constraint enrollments_status_check check (status::text = any (array['active'::character varying, 'dropped'::character varying, 'completed'::character varying]::text[])),
    constraint enrollments_progress_pct_check check (progress_pct >= 0 and progress_pct <= 100)
) TABLESPACE pg_default;

-- 6. Pembuatan Tabel modules
CREATE TABLE public.modules (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    class_id uuid NOT NULL,
    title character varying(150) NOT NULL,
    week_no integer NOT NULL,
    type character varying(15) NOT NULL,
    content_url character varying(255) NOT NULL,
    description text NULL,
    is_published boolean NOT NULL DEFAULT true,
    created_at timestamp without time zone NULL DEFAULT CURRENT_TIMESTAMP,
    constraint modules_pkey primary key (id),
    constraint modules_class_id_fkey foreign key (class_id) references public.classes (id) on delete cascade,
    constraint modules_week_no_check check (week_no >= 1 and week_no <= 16),
    constraint modules_type_check check (type::text = any (array['video'::character varying, 'pdf'::character varying, 'link'::character varying, 'ppt'::character varying]::text[]))
) TABLESPACE pg_default;

-- 7. Pembuatan Tabel assignments
CREATE TABLE public.assignments (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    class_id uuid NOT NULL,
    title character varying(150) NOT NULL,
    description text NOT NULL,
    deadline timestamp without time zone NOT NULL,
    weight_pct integer NOT NULL,
    allowed_formats character varying(50)[] NOT NULL,
    max_size_mb integer NOT NULL DEFAULT 10,
    created_at timestamp without time zone NULL DEFAULT CURRENT_TIMESTAMP,
    constraint assignments_pkey primary key (id),
    constraint assignments_class_id_fkey foreign key (class_id) references public.classes (id) on delete cascade,
    constraint assignments_weight_pct_check check (weight_pct >= 1 and weight_pct <= 100)
) TABLESPACE pg_default;

-- 8. Pembuatan Tabel submissions
CREATE TABLE public.submissions (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    assignment_id uuid NOT NULL,
    student_id uuid NOT NULL,
    file_url character varying(255) NOT NULL,
    submitted_at timestamp without time zone NULL DEFAULT CURRENT_TIMESTAMP,
    is_late boolean NOT NULL DEFAULT false,
    version integer NOT NULL DEFAULT 1,
    grade integer NULL,
    feedback text NULL,
    graded_at timestamp without time zone NULL,
    constraint submissions_pkey primary key (id),
    constraint submissions_assignment_id_fkey foreign key (assignment_id) references public.assignments (id) on delete cascade,
    constraint submissions_student_id_fkey foreign key (student_id) references public.users (id) on delete cascade,
    constraint submissions_grade_check check (grade >= 0 and grade <= 100)
) TABLESPACE pg_default;

-- 9. Pembuatan Tabel calendar_events
CREATE TABLE public.calendar_events (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    title character varying(150) NOT NULL,
    date timestamp without time zone NOT NULL,
    type character varying(15) NOT NULL,
    class_id uuid NULL,
    created_at timestamp without time zone NULL DEFAULT CURRENT_TIMESTAMP,
    constraint calendar_events_pkey primary key (id),
    constraint calendar_events_class_id_fkey foreign key (class_id) references public.classes (id) on delete set null,
    constraint calendar_events_type_check check (type::text = any (array['exam'::character varying, 'task'::character varying, 'academic'::character varying]::text[]))
) TABLESPACE pg_default;

-- 10. Pembuatan Tabel announcements
CREATE TABLE public.announcements (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    class_id uuid NOT NULL,
    title character varying(150) NOT NULL,
    content text NOT NULL,
    date timestamp without time zone NULL DEFAULT CURRENT_TIMESTAMP,
    constraint announcements_pkey primary key (id),
    constraint announcements_class_id_fkey foreign key (class_id) references public.classes (id) on delete cascade
) TABLESPACE pg_default;

-- 11. Pembuatan Tabel discussions
CREATE TABLE public.discussions (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    class_id uuid NOT NULL,
    author_id uuid NOT NULL,
    title character varying(200) NOT NULL,
    content text NOT NULL,
    date timestamp without time zone NULL DEFAULT CURRENT_TIMESTAMP,
    constraint discussions_pkey primary key (id),
    constraint discussions_class_id_fkey foreign key (class_id) references public.classes (id) on delete cascade,
    constraint discussions_author_id_fkey foreign key (author_id) references public.users (id) on delete cascade
) TABLESPACE pg_default;

-- 12. Pembuatan Tabel discussion_replies
CREATE TABLE public.discussion_replies (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    discussion_id uuid NOT NULL,
    author_id uuid NOT NULL,
    content text NOT NULL,
    date timestamp without time zone NULL DEFAULT CURRENT_TIMESTAMP,
    constraint discussion_replies_pkey primary key (id),
    constraint discussion_replies_discussion_id_fkey foreign key (discussion_id) references public.discussions (id) on delete cascade,
    constraint discussion_replies_author_id_fkey foreign key (author_id) references public.users (id) on delete cascade
) TABLESPACE pg_default;

-- 13. Pembuatan Tabel attendance
CREATE TABLE public.attendance (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    class_id uuid NOT NULL,
    student_id uuid NOT NULL,
    week_no integer NOT NULL,
    status character varying(15) NOT NULL,
    submitted_at timestamp without time zone NULL DEFAULT CURRENT_TIMESTAMP,
    constraint attendance_pkey primary key (id),
    constraint attendance_class_id_fkey foreign key (class_id) references public.classes (id) on delete cascade,
    constraint attendance_student_id_fkey foreign key (student_id) references public.users (id) on delete cascade,
    constraint attendance_class_student_week_key unique (class_id, student_id, week_no),
    constraint attendance_week_no_check check (week_no >= 1 and week_no <= 16),
    constraint attendance_status_check check (status::text = any (array['present'::character varying, 'absent'::character varying, 'sick'::character varying, 'permission'::character varying]::text[]))
) TABLESPACE pg_default;

-- 14. Pembuatan Tabel grades
CREATE TABLE public.grades (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    student_id uuid NOT NULL,
    class_id uuid NOT NULL,
    assignment_score numeric(5,2) NULL,
    midterm_score numeric(5,2) NULL,
    final_score numeric(5,2) NULL,
    participation_score numeric(5,2) NULL,
    final_grade_letter character varying(2) NULL,
    updated_at timestamp without time zone NULL DEFAULT CURRENT_TIMESTAMP,
    constraint grades_pkey primary key (id),
    constraint grades_student_id_fkey foreign key (student_id) references public.users (id) on delete cascade,
    constraint grades_class_id_fkey foreign key (class_id) references public.classes (id) on delete cascade,
    constraint grades_student_class_key unique (student_id, class_id),
    constraint grades_assignment_score_check check (assignment_score >= 0.0 and assignment_score <= 100.0),
    constraint grades_midterm_score_check check (midterm_score >= 0.0 and midterm_score <= 100.0),
    constraint grades_final_score_check check (final_score >= 0.0 and final_score <= 100.0),
    constraint grades_participation_score_check check (participation_score >= 0.0 and participation_score <= 100.0)
) TABLESPACE pg_default;

-- 15. Pembuatan Tabel quizzes
CREATE TABLE public.quizzes (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    class_id uuid NOT NULL,
    title character varying(150) NOT NULL,
    type character varying(10) NOT NULL,
    duration_min integer NOT NULL,
    open_at timestamp without time zone NOT NULL,
    close_at timestamp without time zone NOT NULL,
    is_published boolean NOT NULL DEFAULT false,
    created_at timestamp without time zone NULL DEFAULT CURRENT_TIMESTAMP,
    constraint quizzes_pkey primary key (id),
    constraint quizzes_class_id_fkey foreign key (class_id) references public.classes (id) on delete cascade,
    constraint quizzes_type_check check (type::text = any (array['quiz'::character varying, 'uts'::character varying, 'uas'::character varying]::text[])),
    constraint quizzes_duration_min_check check (duration_min > 0)
) TABLESPACE pg_default;

-- 16. Pembuatan Tabel questions
CREATE TABLE public.questions (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    quiz_id uuid NOT NULL,
    content text NOT NULL,
    type character varying(15) NOT NULL,
    order_no integer NOT NULL,
    constraint questions_pkey primary key (id),
    constraint questions_quiz_id_fkey foreign key (quiz_id) references public.quizzes (id) on delete cascade,
    constraint questions_type_check check (type::text = any (array['mcq'::character varying, 'essay'::character varying, 'true_false'::character varying]::text[]))
) TABLESPACE pg_default;

-- 16b. Pembuatan Tabel question_options (Relational MCQ)
CREATE TABLE public.question_options (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    question_id uuid NOT NULL,
    option_text text NOT NULL,
    is_correct boolean NOT NULL DEFAULT false,
    created_at timestamp without time zone NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone NULL DEFAULT CURRENT_TIMESTAMP,
    constraint question_options_pkey primary key (id),
    constraint question_options_question_id_fkey foreign key (question_id) references public.questions (id) on delete cascade
) TABLESPACE pg_default;

-- 17. Pembuatan Tabel quiz_attempts
CREATE TABLE public.quiz_attempts (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    quiz_id uuid NOT NULL,
    student_id uuid NOT NULL,
    started_at timestamp without time zone NULL DEFAULT CURRENT_TIMESTAMP,
    submitted_at timestamp without time zone NULL,
    score numeric(5,2) NULL,
    answers jsonb NOT NULL DEFAULT '{}'::jsonb,
    is_late boolean NOT NULL DEFAULT false,
    constraint quiz_attempts_pkey primary key (id),
    constraint quiz_attempts_quiz_id_fkey foreign key (quiz_id) references public.quizzes (id) on delete cascade,
    constraint quiz_attempts_student_id_fkey foreign key (student_id) references public.users (id) on delete cascade,
    constraint quiz_attempts_score_check check (score >= 0.0 and score <= 100.0)
) TABLESPACE pg_default;

-- 18. Pembuatan Tabel notifications
CREATE TABLE public.notifications (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    type character varying(20) NOT NULL,
    message character varying(255) NOT NULL,
    related_id uuid NULL,
    is_read boolean NOT NULL DEFAULT false,
    created_at timestamp without time zone NULL DEFAULT CURRENT_TIMESTAMP,
    constraint notifications_pkey primary key (id),
    constraint notifications_user_id_fkey foreign key (user_id) references public.users (id) on delete cascade,
    constraint notifications_type_check check (type::text = any (array['deadline'::character varying, 'grade'::character varying, 'discussion'::character varying, 'admin'::character varying, 'announcement'::character varying]::text[]))
) TABLESPACE pg_default;

-- 19. Pembuatan Tabel audit_logs
create table public.audit_logs (
  id uuid not null default gen_random_uuid (),
  user_name character varying(100) not null,
  action text not null,
  ip_address character varying(45) null,
  created_at timestamp without time zone null default CURRENT_TIMESTAMP,
  constraint audit_logs_pkey primary key (id)
) TABLESPACE pg_default;

-- Indeks untuk Mengoptimalkan Query Pencarian
create index IF not exists idx_users_role on public.users using btree (role) TABLESPACE pg_default;
create index IF not exists idx_users_prodi_id on public.users using btree (prodi_id) TABLESPACE pg_default;
create index IF not exists idx_kurikulum_prodi_id on public.kurikulum using btree (prodi_id) TABLESPACE pg_default;
create index IF not exists idx_courses_kurikulum_id on public.courses using btree (kurikulum_id) TABLESPACE pg_default;
create index IF not exists idx_classes_course_id on public.classes using btree (course_id) TABLESPACE pg_default;
create index IF not exists idx_classes_lecturer_id on public.classes using btree (lecturer_id) TABLESPACE pg_default;
create index IF not exists idx_modules_class_id on public.modules using btree (class_id) TABLESPACE pg_default;
create index IF not exists idx_assignments_class_id on public.assignments using btree (class_id) TABLESPACE pg_default;
create index IF not exists idx_submissions_assignment_id on public.submissions using btree (assignment_id) TABLESPACE pg_default;
create index IF not exists idx_submissions_student_id on public.submissions using btree (student_id) TABLESPACE pg_default;
create index IF not exists idx_enrollments_student_id on public.enrollments using btree (student_id) TABLESPACE pg_default;
create index IF not exists idx_enrollments_class_id on public.enrollments using btree (class_id) TABLESPACE pg_default;
create index IF not exists idx_attendance_class_student on public.attendance using btree (class_id, student_id) TABLESPACE pg_default;
create index IF not exists idx_grades_student_class on public.grades using btree (student_id, class_id) TABLESPACE pg_default;
create index IF not exists idx_quizzes_class_id on public.quizzes using btree (class_id) TABLESPACE pg_default;
create index IF not exists idx_questions_quiz_id on public.questions using btree (quiz_id) TABLESPACE pg_default;
create index IF not exists idx_question_options_question_id on public.question_options using btree (question_id) TABLESPACE pg_default;
create index IF not exists idx_quiz_attempts_quiz_id on public.quiz_attempts using btree (quiz_id) TABLESPACE pg_default;
create index IF not exists idx_quiz_attempts_student_id on public.quiz_attempts using btree (student_id) TABLESPACE pg_default;
create index IF not exists idx_notifications_user_id on public.notifications using btree (user_id) TABLESPACE pg_default;
create index IF not exists idx_notifications_unread on public.notifications using btree (user_id, is_read) TABLESPACE pg_default where is_read = false;
create index IF not exists idx_discussions_class_id on public.discussions using btree (class_id) TABLESPACE pg_default;
create index IF not exists idx_discussion_replies_discussion_id on public.discussion_replies using btree (discussion_id) TABLESPACE pg_default;
```

### 3.1 Kebijakan Keamanan Tingkat Baris (Row Level Security / RLS)

Untuk mengamankan data KULINO LMS di Supabase, Row Level Security (RLS) diaktifkan untuk setiap tabel. Berikut adalah perintah SQL untuk mengaktifkan RLS dan menetapkan aturan akses (Policy) untuk masing-masing tabel:

```sql
-- Helper Function untuk memeriksa apakah pengguna adalah admin/staf TU
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean SECURITY DEFINER AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role IN ('admin', 'tu')
  );
END;
$$ LANGUAGE plpgsql;

-- Helper Function untuk memeriksa apakah pengguna adalah dosen
CREATE OR REPLACE FUNCTION public.is_dosen()
RETURNS boolean SECURITY DEFINER AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid() AND role = 'dosen'
  );
END;
$$ LANGUAGE plpgsql;

-- 1. RLS untuk Tabel prodi
ALTER TABLE public.prodi ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read prodi" ON public.prodi
    FOR SELECT TO public USING (true);

CREATE POLICY "Admin can manage prodi" ON public.prodi
    FOR ALL TO public USING (public.is_admin());

-- 2. RLS untuk Tabel kurikulum
ALTER TABLE public.kurikulum ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated read kurikulum" ON public.kurikulum
    FOR SELECT TO public USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can manage kurikulum" ON public.kurikulum
    FOR ALL TO public USING (public.is_admin());

-- 3. RLS untuk Tabel users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data" ON public.users
    FOR SELECT TO public USING (auth.uid() = id);

CREATE POLICY "Users can update own profile data" ON public.users
    FOR UPDATE TO public USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

CREATE POLICY "Admin can insert users" ON public.users
    FOR INSERT TO public WITH CHECK (public.is_admin());

CREATE POLICY "Admin can update/delete users" ON public.users
    FOR ALL TO public USING (public.is_admin());

-- 4. RLS untuk Tabel courses
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated read courses" ON public.courses
    FOR SELECT TO public USING (auth.role() = 'authenticated');

CREATE POLICY "Admin can manage courses" ON public.courses
    FOR ALL TO public USING (public.is_admin());

-- 5. RLS untuk Tabel classes
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated read classes" ON public.classes
    FOR SELECT TO public USING (auth.role() = 'authenticated');

CREATE POLICY "Admin/Dosen can manage classes" ON public.classes
    FOR ALL TO public USING (public.is_admin() OR public.is_dosen());

-- 6. RLS untuk Tabel enrollments
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own enrollments" ON public.enrollments
    FOR SELECT TO public USING (auth.uid() = student_id OR public.is_admin() OR public.is_dosen());

CREATE POLICY "Admin/TU can manage enrollments" ON public.enrollments
    FOR ALL TO public USING (public.is_admin());

-- 7. RLS untuk Tabel modules
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can read published modules of enrolled classes" ON public.modules
    FOR SELECT TO public USING (
        (is_published = true AND EXISTS (
            SELECT 1 FROM public.enrollments 
            WHERE enrollments.class_id = modules.class_id 
            AND enrollments.student_id = auth.uid()
        )) OR public.is_dosen() OR public.is_admin()
    );

CREATE POLICY "Lecturer and Admin can manage modules" ON public.modules
    FOR ALL TO public USING (public.is_dosen() OR public.is_admin());

-- 8. RLS untuk Tabel assignments
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can read assignments of enrolled classes" ON public.assignments
    FOR SELECT TO public USING (
        EXISTS (
            SELECT 1 FROM public.enrollments 
            WHERE enrollments.class_id = assignments.class_id 
            AND enrollments.student_id = auth.uid()
        ) OR public.is_dosen() OR public.is_admin()
    );

CREATE POLICY "Lecturer and Admin can manage assignments" ON public.assignments
    FOR ALL TO public USING (public.is_dosen() OR public.is_admin());

-- 9. RLS untuk Tabel submissions
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own submissions" ON public.submissions
    FOR SELECT TO public USING (auth.uid() = student_id OR public.is_dosen() OR public.is_admin());

CREATE POLICY "Students can insert own submissions" ON public.submissions
    FOR INSERT TO public WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can update own submissions" ON public.submissions
    FOR UPDATE TO public USING (auth.uid() = student_id) WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Lecturer and Admin can grade submissions" ON public.submissions
    FOR ALL TO public USING (public.is_dosen() OR public.is_admin());

-- 10. RLS untuk Tabel calendar_events
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated read calendar_events" ON public.calendar_events
    FOR SELECT TO public USING (auth.role() = 'authenticated');

CREATE POLICY "Admin and Dosen can manage calendar_events" ON public.calendar_events
    FOR ALL TO public USING (public.is_admin() OR public.is_dosen());

-- 11. RLS untuk Tabel announcements
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated read announcements" ON public.announcements
    FOR SELECT TO public USING (auth.role() = 'authenticated');

CREATE POLICY "Admin and Dosen can manage announcements" ON public.announcements
    FOR ALL TO public USING (public.is_admin() OR public.is_dosen());

-- 12. RLS untuk Tabel discussions
ALTER TABLE public.discussions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated read discussions" ON public.discussions
    FOR SELECT TO public USING (auth.role() = 'authenticated');

CREATE POLICY "Author can manage own discussions" ON public.discussions
    FOR ALL TO public USING (auth.uid() = author_id OR public.is_admin());

CREATE POLICY "Allow authenticated insert discussions" ON public.discussions
    FOR INSERT TO public WITH CHECK (auth.uid() = author_id);

-- 13. RLS untuk Tabel discussion_replies
ALTER TABLE public.discussion_replies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated read discussion_replies" ON public.discussion_replies
    FOR SELECT TO public USING (auth.role() = 'authenticated');

CREATE POLICY "Author can manage own replies" ON public.discussion_replies
    FOR ALL TO public USING (auth.uid() = author_id OR public.is_admin());

CREATE POLICY "Allow authenticated insert replies" ON public.discussion_replies
    FOR INSERT TO public WITH CHECK (auth.uid() = author_id);

-- 14. RLS untuk Tabel attendance
ALTER TABLE public.attendance ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can read own attendance" ON public.attendance
    FOR SELECT TO public USING (auth.uid() = student_id OR public.is_dosen() OR public.is_admin());

CREATE POLICY "Lecturer and Admin can manage attendance" ON public.attendance
    FOR ALL TO public USING (public.is_dosen() OR public.is_admin());

-- 15. RLS untuk Tabel grades
ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can read own grades" ON public.grades
    FOR SELECT TO public USING (auth.uid() = student_id OR public.is_dosen() OR public.is_admin());

CREATE POLICY "Lecturer and Admin can manage grades" ON public.grades
    FOR ALL TO public USING (public.is_dosen() OR public.is_admin());

-- 16. RLS untuk Tabel quizzes
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can read published quizzes of enrolled classes" ON public.quizzes
    FOR SELECT TO public USING (
        (is_published = true AND EXISTS (
            SELECT 1 FROM public.enrollments 
            WHERE enrollments.class_id = quizzes.class_id 
            AND enrollments.student_id = auth.uid()
        )) OR public.is_dosen() OR public.is_admin());

CREATE POLICY "Lecturer and Admin can manage quizzes" ON public.quizzes
    FOR ALL TO public USING (public.is_dosen() OR public.is_admin());

-- 17. RLS untuk Tabel questions
ALTER TABLE public.questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can read questions of open quizzes" ON public.questions
    FOR SELECT TO public USING (
        EXISTS (
            SELECT 1 FROM public.quizzes
            JOIN public.enrollments ON enrollments.class_id = quizzes.class_id
            WHERE quizzes.id = questions.quiz_id
            AND quizzes.is_published = true
            AND enrollments.student_id = auth.uid()
        ) OR public.is_dosen() OR public.is_admin()
    );

CREATE POLICY "Lecturer and Admin can manage questions" ON public.questions
    FOR ALL TO public USING (public.is_dosen() OR public.is_admin());

-- 18. RLS untuk Tabel question_options
ALTER TABLE public.question_options ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can read options of open quizzes" ON public.question_options
    FOR SELECT TO public USING (
        EXISTS (
            SELECT 1 FROM public.questions
            JOIN public.quizzes ON quizzes.id = questions.quiz_id
            JOIN public.enrollments ON enrollments.class_id = quizzes.class_id
            WHERE questions.id = question_options.question_id
            AND quizzes.is_published = true
            AND enrollments.student_id = auth.uid()
        ) OR public.is_dosen() OR public.is_admin()
    );

CREATE POLICY "Lecturer and Admin can manage question_options" ON public.question_options
    FOR ALL TO public USING (public.is_dosen() OR public.is_admin());

-- 19. RLS untuk Tabel quiz_attempts
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Students can view own attempts" ON public.quiz_attempts
    FOR SELECT TO public USING (auth.uid() = student_id OR public.is_dosen() OR public.is_admin());

CREATE POLICY "Students can insert own attempts" ON public.quiz_attempts
    FOR INSERT TO public WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Students can update own attempts" ON public.quiz_attempts
    FOR UPDATE TO public USING (auth.uid() = student_id) WITH CHECK (auth.uid() = student_id);

CREATE POLICY "Lecturer and Admin can grade attempts" ON public.quiz_attempts
    FOR ALL TO public USING (public.is_dosen() OR public.is_admin());

-- 20. RLS untuk Tabel notifications
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own notifications" ON public.notifications
    FOR SELECT TO public USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON public.notifications
    FOR UPDATE TO public USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

-- 21. RLS untuk Tabel audit_logs
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can view audit_logs" ON public.audit_logs
    FOR SELECT TO public USING (public.is_admin());

CREATE POLICY "Authenticated users can insert audit_logs" ON public.audit_logs
    FOR INSERT TO public WITH CHECK (auth.role() = 'authenticated');
```

### 3.2 Pemicu Otomatis (Database Triggers)

Berikut adalah perintah SQL DDL untuk membuat fungsi trigger dan trigger pengawasan login, aktivitas administratif (CRUD) pada user, serta pembuatan profil otomatis:

```sql
-- 1. Trigger Function untuk Log CRUD Admin pada tabel users
CREATE OR REPLACE FUNCTION public.log_user_audit_action()
RETURNS trigger AS $$
DECLARE
    operator_role character varying(20);
    operator_name character varying(100);
BEGIN
    SELECT role, name INTO operator_role, operator_name
    FROM public.users
    WHERE id = auth.uid();

    IF operator_role IN ('admin', 'tu') THEN
        IF (TG_OP = 'INSERT') THEN
            INSERT INTO public.audit_logs (user_name, action)
            VALUES (COALESCE(operator_name, 'System/Admin'), 'Membuat pengguna baru: ' || NEW.name || ' (' || NEW.nim_nip || ') dengan role ' || NEW.role);
        ELSIF (TG_OP = 'UPDATE') THEN
            INSERT INTO public.audit_logs (user_name, action)
            VALUES (COALESCE(operator_name, 'System/Admin'), 'Mengubah pengguna: ' || OLD.name || ' (' || OLD.nim_nip || ') -> ' || NEW.name || ' (' || NEW.nim_nip || ')');
        ELSIF (TG_OP = 'DELETE') THEN
            INSERT INTO public.audit_logs (user_name, action)
            VALUES (COALESCE(operator_name, 'System/Admin'), 'Menghapus pengguna: ' || OLD.name || ' (' || OLD.nim_nip || ')');
        END IF;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Membuat trigger untuk public.users
CREATE OR REPLACE TRIGGER trg_user_audit
AFTER INSERT OR UPDATE OR DELETE ON public.users
FOR EACH ROW EXECUTE FUNCTION public.log_user_audit_action();


-- 2. Trigger Function untuk Log Login Admin dan Staf TU
CREATE OR REPLACE FUNCTION public.log_user_login()
RETURNS trigger AS $$
DECLARE
    user_record record;
BEGIN
    IF (OLD.last_sign_in_at IS DISTINCT FROM NEW.last_sign_in_at) THEN
        SELECT name, role INTO user_record
        FROM public.users
        WHERE id = NEW.id;

        IF user_record.role IN ('admin', 'tu') THEN
            INSERT INTO public.audit_logs (user_name, action)
            VALUES (COALESCE(user_record.name, NEW.email), 'Masuk sesi admin (Login / Sign In)');
        END IF;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Membuat trigger untuk tabel auth.users
CREATE OR REPLACE TRIGGER trg_user_login
AFTER UPDATE OF last_sign_in_at ON auth.users
FOR EACH ROW EXECUTE FUNCTION public.log_user_login();


-- 3. Trigger Function untuk Membuat Profile Otomatis di public.users saat User baru terdaftar
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, name, email, password, nim_nip, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.email,
    'hashed_by_supabase_auth',
    COALESCE(NEW.raw_user_meta_data->>'nim_nip', 'MHS-' || floor(random() * 900000 + 100000)::text),
    COALESCE(NEW.raw_user_meta_data->>'role', 'mahasiswa')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Membuat trigger pada auth.users saat pendaftaran sukses
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

---

## 4. Contoh Query Pengisian Data Awal (Seed Data SQL)

Gunakan skrip kueri berikut untuk mengisi data awal (_dummy data_) yang sesuai dengan kondisi LMS KULINO:

```sql
-- Input Program Studi
INSERT INTO public.prodi (id, code, name, degree) VALUES
('p1111111-1111-1111-1111-111111111111', 'A11', 'Teknik Informatika', 'S1'),
('p2222222-2222-2222-2222-222222222222', 'A12', 'Sistem Informasi', 'S1')
ON CONFLICT (id) DO NOTHING;

-- Input Kurikulum
INSERT INTO public.kurikulum (id, prodi_id, name, year, is_active) VALUES
('k1111111-1111-1111-1111-111111111111', 'p1111111-1111-1111-1111-111111111111', 'Kurikulum 2024 (OBE)', 2024, TRUE)
ON CONFLICT (id) DO NOTHING;

-- Input Akun Pengguna (Dosen, Mahasiswa, Admin)
INSERT INTO public.users (id, name, email, password, nim_nip, role, prodi_id, created_at, updated_at) VALUES
('212dc83a-5159-430d-8f82-a2599db61181', 'Alfaturachman Maulana', '122202202921@mhs.dinus.ac.id', '12345678', '122202202921', 'mahasiswa', 'p1111111-1111-1111-1111-111111111111', '2026-06-13 19:51:57.196904', '2026-06-13 19:51:57.196904'),
('559b800c-eaa8-41d7-bd8f-3d658dd6f76a', 'Alfaturachman Maulana Pahlevi', '122202202929@mhs.dinus.ac.id', 'hashed_by_supabase_auth', '122202202929', 'mahasiswa', 'p1111111-1111-1111-1111-111111111111', '2026-06-13 18:38:06.028316', '2026-06-13 18:38:06.028316'),
('a8813852-bdd5-44f7-8e58-bb1014bd46c0', 'Elfiantara Kurniawan Amd.Kom', '0252.11.2025.001@mhs.dinus.ac.id', 'hashed_by_supabase_auth', '0252.11.2025.001', 'dosen', 'p1111111-1111-1111-1111-111111111111', '2026-06-13 18:45:16.691554', '2026-06-13 18:45:16.691554'),
('b9eb7582-f1dc-4e3b-a021-646854f5b71a', 'Alfaturachman Maulana', 'alemaulana09@gmail.com', 'hashed_by_supabase_auth', 'MHS-693080', 'mahasiswa', 'p1111111-1111-1111-1111-111111111111', '2026-06-06 18:55:49.447417', '2026-06-06 18:55:49.447417'),
('fdf44078-e4b1-45e1-b612-09b6c6d547df', 'Budi Siregar', 'superadmin@mhs.dinus.ac.id', 'hashed_by_supabase_auth', '0001.01.2025.001', 'admin', NULL, '2026-06-13 18:43:15.483033', '2026-06-13 18:43:15.483033')
ON CONFLICT (id) DO NOTHING;

-- Input Mata Kuliah Pemrograman Web (Master)
INSERT INTO public.courses (id, name, code, kelompok_mk, sks, teori, praktek, kurikulum_id, description) VALUES
('c101c101-c101-c101-c101-c101c101c101', 'Pemrograman Web', 'CS-101', 'Wajib Program Studi', 3, 2, 1, 'k1111111-1111-1111-1111-111111111111', 'Mata kuliah dasar pengembangan aplikasi web responsif menggunakan HTML, CSS, JavaScript, dan framework modern.')
ON CONFLICT (id) DO NOTHING;

-- Input Kelas Pemrograman Web (Kelas Aktif)
INSERT INTO public.classes (id, course_id, class_name, semester, lecturer_id, day_of_week, start_time, end_time, room, status) VALUES
('f4e3d2c1-8888-9999-0000-111122223333', 'c101c101-c101-c101-c101-c101c101c101', 'TI-3A', 'Ganjil 2025/2026', 'a8813852-bdd5-44f7-8e58-bb1014bd46c0', 'Senin', '08:00:00', '10:30:00', 'Ruang H.4.1', 'active')
ON CONFLICT (id) DO NOTHING;

-- Registrasi Mahasiswa ke Kelas Pemrograman Web
INSERT INTO public.enrollments (student_id, class_id, status) VALUES
('212dc83a-5159-430d-8f82-a2599db61181', 'f4e3d2c1-8888-9999-0000-111122223333', 'active')
ON CONFLICT (id) DO NOTHING;

-- Input Modul / Materi Awal
INSERT INTO public.modules (class_id, title, week_no, type, content_url, description) VALUES
('f4e3d2c1-8888-9999-0000-111122223333', 'Pengenalan Web Modern & HTML5', 1, 'pdf', 'https://example.com/pdf/html5-intro.pdf', 'Dasar arsitektur web dan penggunaan elemen semantik baru pada spesifikasi HTML5.')
ON CONFLICT (id) DO NOTHING;

-- Input Presensi Awal Mahasiswa
INSERT INTO public.attendance (class_id, student_id, week_no, status) VALUES
('f4e3d2c1-8888-9999-0000-111122223333', '212dc83a-5159-430d-8f82-a2599db61181', 1, 'present')
ON CONFLICT (id) DO NOTHING;

-- Input Rekap Nilai Awal Mahasiswa
INSERT INTO public.grades (student_id, class_id, assignment_score, midterm_score, final_score, participation_score, final_grade_letter) VALUES
('212dc83a-5159-430d-8f82-a2599db61181', 'f4e3d2c1-8888-9999-0000-111122223333', 92.00, 85.00, 88.00, 90.00, 'A')
ON CONFLICT (id) DO NOTHING;
```

---
