# Dokumen Desain Basis Data (Database Design Specification)

**Sistem:** KULINO — Kuliah Online | Learning Management System  
**Teknologi:** PostgreSQL  
**Versi Dokumen:** 1.0  
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

| Nama Kolom   | Tipe Data      | Batasan (Constraints)                    | Keterangan                                               |
| :----------- | :------------- | :--------------------------------------- | :------------------------------------------------------- |
| `id`         | `UUID`         | Primary Key, Default `gen_random_uuid()` | Pengidentifikasi unik pengguna.                          |
| `name`       | `VARCHAR(100)` | NOT NULL                                 | Nama lengkap pengguna.                                   |
| `email`      | `VARCHAR(100)` | NOT NULL, UNIQUE                         | Alamat email (digunakan untuk login).                    |
| `password`   | `VARCHAR(255)` | NOT NULL                                 | Password terenkripsi (hash bcrypt).                      |
| `nim_nip`    | `VARCHAR(20)`  | NOT NULL, UNIQUE                         | NIM (Mahasiswa) atau NIP (Dosen/Staff).                  |
| `role`       | `VARCHAR(20)`  | NOT NULL, Default 'mahasiswa'            | Hak akses: `guest`, `mahasiswa`, `dosen`, `tu`, `admin`. |
| `created_at` | `TIMESTAMP`    | Default `CURRENT_TIMESTAMP`              | Waktu pendaftaran akun.                                  |
| `updated_at` | `TIMESTAMP`    | Default `CURRENT_TIMESTAMP`              | Waktu pembaruan akun terakhir.                           |

---

### 2.2 Tabel `courses`

Menyimpan informasi mata kuliah/kelas yang aktif.

| Nama Kolom    | Tipe Data      | Batasan (Constraints)                    | Keterangan                                     |
| :------------ | :------------- | :--------------------------------------- | :--------------------------------------------- |
| `id`          | `UUID`         | Primary Key, Default `gen_random_uuid()` | Pengidentifikasi unik kelas.                   |
| `name`        | `VARCHAR(150)` | NOT NULL                                 | Nama mata kuliah.                              |
| `code`        | `VARCHAR(20)`  | NOT NULL, UNIQUE                         | Kode unik mata kuliah (misal: `CS-101`).       |
| `class_name`  | `VARCHAR(20)`  | NOT NULL                                 | Nama kelas akademik (misal: `TI-3A`).          |
| `semester`    | `VARCHAR(30)`  | NOT NULL                                 | Semester berjalan (misal: `Ganjil 2025/2026`). |
| `sks`         | `INTEGER`      | NOT NULL, Check `sks > 0`                | Bobot Satuan Kredit Semester.                  |
| `lecturer_id` | `UUID`         | FK → `users(id)`, ON DELETE RESTRICT     | Dosen pengampu kelas.                          |
| `description` | `TEXT`         | NOT NULL                                 | Deskripsi singkat kelas & kontrak kuliah.      |
| `status`      | `VARCHAR(15)`  | Default 'active'                         | Status kelas: `active` atau `completed`.       |
| `created_at`  | `TIMESTAMP`    | Default `CURRENT_TIMESTAMP`              | Tanggal pembuatan kelas.                       |

---

### 2.3 Tabel `enrollments`

Menghubungkan mahasiswa dengan kelas yang mereka ambil (relasi banyak-ke-banyak).

| Nama Kolom   | Tipe Data     | Batasan (Constraints)                    | Keterangan                                |
| :----------- | :------------ | :--------------------------------------- | :---------------------------------------- |
| `id`         | `UUID`        | Primary Key, Default `gen_random_uuid()` | Pengidentifikasi unik pendaftaran.        |
| `student_id` | `UUID`        | FK → `users(id)`, ON DELETE CASCADE      | ID mahasiswa yang mendaftar.              |
| `course_id`  | `UUID`        | FK → `courses(id)`, ON DELETE CASCADE    | ID kelas yang diikuti.                    |
| `status`     | `VARCHAR(15)` | Default 'active'                         | Status: `active`, `dropped`, `completed`. |
| `created_at` | `TIMESTAMP`   | Default `CURRENT_TIMESTAMP`              | Tanggal mahasiswa masuk ke kelas.         |

_Batasan Tambahan:_ Kombinasi `(student_id, course_id)` harus unik (`UNIQUE`).

---

### 2.4 Tabel `modules`

Menyimpan materi pembelajaran mingguan per kelas.

| Nama Kolom     | Tipe Data      | Batasan (Constraints)                      | Keterangan                                        |
| :------------- | :------------- | :----------------------------------------- | :------------------------------------------------ |
| `id`           | `UUID`         | Primary Key, Default `gen_random_uuid()`   | Pengidentifikasi unik materi.                     |
| `course_id`    | `UUID`         | FK → `courses(id)`, ON DELETE CASCADE      | ID kelas tempat materi diunggah.                  |
| `title`        | `VARCHAR(150)` | NOT NULL                                   | Judul materi mingguan.                            |
| `week_no`      | `INTEGER`      | NOT NULL, Check `week_no BETWEEN 1 AND 16` | Pertemuan minggu ke-n.                            |
| `type`         | `VARCHAR(15)`  | NOT NULL                                   | Tipe materi: `video`, `pdf`, `link`, `ppt`.       |
| `content_url`  | `VARCHAR(255)` | NOT NULL                                   | Tautan unduhan file / tautan video.               |
| `description`  | `TEXT`         | NULL                                       | Catatan tambahan tentang materi.                  |
| `is_published` | `BOOLEAN`      | Default TRUE                               | Menentukan apakah materi dapat dilihat mahasiswa. |
| `created_at`   | `TIMESTAMP`    | Default `CURRENT_TIMESTAMP`                | Tanggal publikasi materi.                         |

---

### 2.5 Tabel `assignments`

Menyimpan data instruksi penugasan akademik/ujian dari dosen.

| Nama Kolom        | Tipe Data       | Batasan (Constraints)                          | Keterangan                                          |
| :---------------- | :-------------- | :--------------------------------------------- | :-------------------------------------------------- |
| `id`              | `UUID`          | Primary Key, Default `gen_random_uuid()`       | Pengidentifikasi unik tugas.                        |
| `course_id`       | `UUID`          | FK → `courses(id)`, ON DELETE CASCADE          | ID kelas terkait.                                   |
| `title`           | `VARCHAR(150)`  | NOT NULL                                       | Judul penugasan.                                    |
| `description`     | `TEXT`          | NOT NULL                                       | Petunjuk pengerjaan tugas & rubrik penilaian.       |
| `deadline`        | `TIMESTAMP`     | NOT NULL                                       | Tanggal dan waktu batas pengumpulan.                |
| `weight_pct`      | `INTEGER`       | NOT NULL, Check `weight_pct BETWEEN 1 AND 100` | Bobot nilai tugas terhadap total nilai (%).         |
| `allowed_formats` | `VARCHAR(50)[]` | NOT NULL                                       | Ekstensi file yang diizinkan (misal: `pdf`, `zip`). |
| `max_size_mb`     | `INTEGER`       | Default 10                                     | Batas maksimal ukuran file (MB).                    |
| `created_at`      | `TIMESTAMP`     | Default `CURRENT_TIMESTAMP`                    | Tanggal penugasan diterbitkan.                      |

---

### 2.6 Tabel `submissions`

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

### 2.7 Tabel `calendar_events`

Menyimpan agenda kalender akademik universitas dan kelas.

| Nama Kolom   | Tipe Data      | Batasan (Constraints)                        | Keterangan                                      |
| :----------- | :------------- | :------------------------------------------- | :---------------------------------------------- |
| `id`         | `UUID`         | Primary Key, Default `gen_random_uuid()`     | Pengidentifikasi unik agenda.                   |
| `title`      | `VARCHAR(150)` | NOT NULL                                     | Nama acara/agenda akademik.                     |
| `date`       | `TIMESTAMP`    | NOT NULL                                     | Tanggal dan waktu pelaksanaan acara.            |
| `type`       | `VARCHAR(15)`  | NOT NULL                                     | Jenis acara: `exam`, `task`, `academic`.        |
| `course_id`  | `UUID`         | FK → `courses(id)`, ON DELETE SET NULL, NULL | Terhubung ke mata kuliah tertentu jika relevan. |
| `created_at` | `TIMESTAMP`    | Default `CURRENT_TIMESTAMP`                  | Tanggal pembuatan acara.                        |

---

### 2.8 Tabel `announcements`

Menyimpan data pengumuman yang disiarkan di kelas.

| Nama Kolom  | Tipe Data      | Batasan (Constraints)                    | Keterangan                            |
| :---------- | :------------- | :--------------------------------------- | :------------------------------------ |
| `id`        | `UUID`         | Primary Key, Default `gen_random_uuid()` | Pengidentifikasi unik pengumuman.     |
| `course_id` | `UUID`         | FK → `courses(id)`, ON DELETE CASCADE    | ID kelas tempat pengumuman disiarkan. |
| `title`     | `VARCHAR(150)` | NOT NULL                                 | Judul pengumuman.                     |
| `content`   | `TEXT`         | NOT NULL                                 | Isi teks lengkap pengumuman.          |
| `date`      | `TIMESTAMP`    | Default `CURRENT_TIMESTAMP`              | Waktu siaran pengumuman.              |

---

### 2.9 Tabel `discussions`

Menyimpan topik diskusi dalam forum kelas.

| Nama Kolom    | Tipe Data      | Batasan (Constraints)                    | Keterangan                          |
| :------------ | :------------- | :--------------------------------------- | :---------------------------------- |
| `id`          | `UUID`         | Primary Key, Default `gen_random_uuid()` | Pengidentifikasi unik thread forum. |
| `course_id`   | `UUID`         | FK → `courses(id)`, ON DELETE CASCADE    | ID kelas terkait.                   |
| `title`       | `VARCHAR(200)` | NOT NULL                                 | Judul topik diskusi.                |
| `content`     | `TEXT`         | NOT NULL                                 | Isi pertanyaan/topik utama.         |
| `author_name` | `VARCHAR(100)` | NOT NULL                                 | Nama pembuat topik.                 |
| `date`        | `TIMESTAMP`    | Default `CURRENT_TIMESTAMP`              | Tanggal pembuatan thread.           |

---

### 2.10 Tabel `discussion_replies`

Menyimpan tanggapan/jawaban mahasiswa & dosen pada topik diskusi.

| Nama Kolom      | Tipe Data      | Batasan (Constraints)                     | Keterangan                        |
| :-------------- | :------------- | :---------------------------------------- | :-------------------------------- |
| `id`            | `UUID`         | Primary Key, Default `gen_random_uuid()`  | Pengidentifikasi unik balasan.    |
| `discussion_id` | `UUID`         | FK → `discussions(id)`, ON DELETE CASCADE | Topik diskusi induk yang dibalas. |
| `author_name`   | `VARCHAR(100)` | NOT NULL                                  | Nama pengirim tanggapan.          |
| `content`       | `TEXT`         | NOT NULL                                  | Isi teks tanggapan.               |
| `date`          | `TIMESTAMP`    | Default `CURRENT_TIMESTAMP`               | Tanggal tanggapan dikirim.        |

---

### 2.11 Tabel `attendance`

Menyimpan data kehadiran/absensi mahasiswa per pertemuan mingguan.

| Nama Kolom     | Tipe Data     | Batasan (Constraints)                      | Keterangan                                         |
| :------------- | :------------ | :----------------------------------------- | :------------------------------------------------- |
| `id`           | `UUID`        | Primary Key, Default `gen_random_uuid()`   | Pengidentifikasi unik absensi.                     |
| `course_id`    | `UUID`        | FK → `courses(id)`, ON DELETE CASCADE      | ID kelas terkait.                                  |
| `student_id`   | `UUID`        | FK → `users(id)`, ON DELETE CASCADE        | ID mahasiswa.                                      |
| `week_no`      | `INTEGER`     | NOT NULL, Check `week_no BETWEEN 1 AND 16` | Pertemuan minggu ke-n.                             |
| `status`       | `VARCHAR(15)` | NOT NULL                                   | Status: `present`, `absent`, `sick`, `permission`. |
| `submitted_at` | `TIMESTAMP`   | Default `CURRENT_TIMESTAMP`                | Waktu pencatatan absensi.                          |

---

### 2.12 Tabel `grades`

Menyimpan rekap nilai akhir kumulatif mahasiswa per mata kuliah untuk kebutuhan KHS.

| Nama Kolom            | Tipe Data      | Batasan (Constraints)                         | Keterangan                                |
| :-------------------- | :------------- | :-------------------------------------------- | :---------------------------------------- |
| `id`                  | `UUID`         | Primary Key, Default `gen_random_uuid()`      | Pengidentifikasi unik rekap nilai.        |
| `student_id`          | `UUID`         | FK → `users(id)`, ON DELETE CASCADE           | ID mahasiswa.                             |
| `course_id`           | `UUID`         | FK → `courses(id)`, ON DELETE CASCADE         | ID kelas terkait.                         |
| `assignment_score`    | `NUMERIC(5,2)` | CHECK `assignment_score BETWEEN 0 AND 100`    | Nilai rata-rata tugas (bobot 40%).        |
| `midterm_score`       | `NUMERIC(5,2)` | CHECK `midterm_score BETWEEN 0 AND 100`       | Nilai Ujian Tengah Semester (bobot 25%).  |
| `final_score`         | `NUMERIC(5,2)` | CHECK `final_score BETWEEN 0 AND 100`         | Nilai Ujian Akhir Semester (bobot 25%).   |
| `participation_score` | `NUMERIC(5,2)` | CHECK `participation_score BETWEEN 0 AND 100` | Nilai partisipasi/keaktifan (bobot 10%).  |
| `final_grade_letter`  | `VARCHAR(2)`   | NULL                                          | Nilai huruf mutu (A, AB, B, BC, C, D, E). |
| `updated_at`          | `TIMESTAMP`    | Default `CURRENT_TIMESTAMP`                   | Waktu kalkulasi nilai terakhir.           |

---

## 3. Skrip Pembuatan Tabel (SQL DDL Scripts)

Jalankan perintah SQL DDL berikut di DBMS PostgreSQL Anda untuk membuat database lengkap beserta relasinya:

```sql
-- Mengaktifkan modul UUID generator jika belum aktif
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Pembuatan Tabel users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    nim_nip VARCHAR(20) NOT NULL UNIQUE,
    role VARCHAR(20) NOT NULL DEFAULT 'mahasiswa' CHECK (role IN ('guest', 'mahasiswa', 'dosen', 'tu', 'admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Pembuatan Tabel courses
CREATE TABLE courses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(150) NOT NULL,
    code VARCHAR(20) NOT NULL UNIQUE,
    class_name VARCHAR(20) NOT NULL,
    semester VARCHAR(30) NOT NULL,
    sks INTEGER NOT NULL CHECK (sks > 0),
    lecturer_id UUID NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(15) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (lecturer_id) REFERENCES users(id) ON DELETE RESTRICT
);

-- 3. Pembuatan Tabel enrollments
CREATE TABLE enrollments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL,
    course_id UUID NOT NULL,
    status VARCHAR(15) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'dropped', 'completed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE(student_id, course_id)
);

-- 4. Pembuatan Tabel modules
CREATE TABLE modules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL,
    title VARCHAR(150) NOT NULL,
    week_no INTEGER NOT NULL CHECK (week_no BETWEEN 1 AND 16),
    type VARCHAR(15) NOT NULL CHECK (type IN ('video', 'pdf', 'link', 'ppt')),
    content_url VARCHAR(255) NOT NULL,
    description TEXT,
    is_published BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- 5. Pembuatan Tabel assignments
CREATE TABLE assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL,
    title VARCHAR(150) NOT NULL,
    description TEXT NOT NULL,
    deadline TIMESTAMP NOT NULL,
    weight_pct INTEGER NOT NULL CHECK (weight_pct BETWEEN 1 AND 100),
    allowed_formats VARCHAR(50)[] NOT NULL,
    max_size_mb INTEGER NOT NULL DEFAULT 10,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- 6. Pembuatan Tabel submissions
CREATE TABLE submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assignment_id UUID NOT NULL,
    student_id UUID NOT NULL,
    file_url VARCHAR(255) NOT NULL,
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_late BOOLEAN NOT NULL DEFAULT FALSE,
    version INTEGER NOT NULL DEFAULT 1,
    grade INTEGER CHECK (grade BETWEEN 0 AND 100),
    feedback TEXT,
    graded_at TIMESTAMP,
    FOREIGN KEY (assignment_id) REFERENCES assignments(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 7. Pembuatan Tabel calendar_events
CREATE TABLE calendar_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(150) NOT NULL,
    date TIMESTAMP NOT NULL,
    type VARCHAR(15) NOT NULL CHECK (type IN ('exam', 'task', 'academic')),
    course_id UUID,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE SET NULL
);

-- 8. Pembuatan Tabel announcements
CREATE TABLE announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL,
    title VARCHAR(150) NOT NULL,
    content TEXT NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- 9. Pembuatan Tabel discussions
CREATE TABLE discussions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    author_name VARCHAR(100) NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE
);

-- 10. Pembuatan Tabel discussion_replies
CREATE TABLE discussion_replies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    discussion_id UUID NOT NULL,
    author_name VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (discussion_id) REFERENCES discussions(id) ON DELETE CASCADE
);

-- 11. Pembuatan Tabel attendance
CREATE TABLE attendance (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    course_id UUID NOT NULL,
    student_id UUID NOT NULL,
    week_no INTEGER NOT NULL CHECK (week_no BETWEEN 1 AND 16),
    status VARCHAR(15) NOT NULL CHECK (status IN ('present', 'absent', 'sick', 'permission')),
    submitted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    UNIQUE(course_id, student_id, week_no)
);

-- 12. Pembuatan Tabel grades
CREATE TABLE grades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL,
    course_id UUID NOT NULL,
    assignment_score NUMERIC(5,2) CHECK (assignment_score BETWEEN 0 AND 100),
    midterm_score NUMERIC(5,2) CHECK (midterm_score BETWEEN 0 AND 100),
    final_score NUMERIC(5,2) CHECK (final_score BETWEEN 0 AND 100),
    participation_score NUMERIC(5,2) CHECK (participation_score BETWEEN 0 AND 100),
    final_grade_letter VARCHAR(2),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
    UNIQUE(student_id, course_id)
);

-- Indeks untuk Mengoptimalkan Query Pencarian
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_courses_lecturer ON courses(lecturer_id);
CREATE INDEX idx_modules_course ON modules(course_id);
CREATE INDEX idx_assignments_course ON assignments(course_id);
CREATE INDEX idx_submissions_assignment ON submissions(assignment_id);
CREATE INDEX idx_submissions_student ON submissions(student_id);
CREATE INDEX idx_enrollments_student ON enrollments(student_id);
CREATE INDEX idx_enrollments_course ON enrollments(course_id);
CREATE INDEX idx_attendance_course_student ON attendance(course_id, student_id);
CREATE INDEX idx_grades_student_course ON grades(student_id, course_id);
```

---

## 4. Contoh Query Pengisian Data Awal (Seed Data SQL)

Gunakan skrip kueri berikut untuk mengisi data awal (_dummy data_) yang sesuai dengan kondisi LMS KULINO:

```sql
-- Input Akun Dosen
INSERT INTO users (id, name, email, password, nim_nip, role) VALUES
('c3f0a1b2-1111-2222-3333-444455556666', 'Dr. Budi Santoso', 'dosen@kulino.id', '$2b$10$xyz', '198706152010121002', 'dosen');

-- Input Akun Mahasiswa
INSERT INTO users (id, name, email, password, nim_nip, role) VALUES
('a1b2c3d4-4444-5555-6666-777788889999', 'Ahmad Fauzi', 'mahasiswa@kulino.id', '$2b$10$abc', 'A11.2022.14321', 'mahasiswa');

-- Input Mata Kuliah Pemrograman Web
INSERT INTO courses (id, name, code, class_name, semester, sks, lecturer_id, description, status) VALUES
('f4e3d2c1-8888-9999-0000-111122223333', 'Pemrograman Web', 'CS-101', 'TI-3A', 'Ganjil 2025/2026', 3, 'c3f0a1b2-1111-2222-3333-444455556666', 'Mata kuliah dasar pengembangan aplikasi web responsif menggunakan HTML, CSS, JavaScript, dan framework modern.', 'active');

-- Registrasi Mahasiswa ke Kelas Pemrograman Web
INSERT INTO enrollments (student_id, course_id, status) VALUES
('a1b2c3d4-4444-5555-6666-777788889999', 'f4e3d2c1-8888-9999-0000-111122223333', 'active');

-- Input Modul / Materi Awal
INSERT INTO modules (course_id, title, week_no, type, content_url, description) VALUES
('f4e3d2c1-8888-9999-0000-111122223333', 'Pengenalan Web Modern & HTML5', 1, 'pdf', 'https://example.com/pdf/html5-intro.pdf', 'Dasar arsitektur web dan penggunaan elemen semantik baru pada spesifikasi HTML5.');

-- Input Presensi Awal Mahasiswa
INSERT INTO attendance (course_id, student_id, week_no, status) VALUES
('f4e3d2c1-8888-9999-0000-111122223333', 'a1b2c3d4-4444-5555-6666-777788889999', 1, 'present');

-- Input Rekap Nilai Awal Mahasiswa
INSERT INTO grades (student_id, course_id, assignment_score, midterm_score, final_score, participation_score, final_grade_letter) VALUES
('a1b2c3d4-4444-5555-6666-777788889999', 'f4e3d2c1-8888-9999-0000-111122223333', 92.00, 85.00, 88.00, 90.00, 'A');
```
