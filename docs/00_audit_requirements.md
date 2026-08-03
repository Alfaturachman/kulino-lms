# Audit & Review Kebutuhan LMS — Docs 01–04

**Sistem:** KULINO — Kuliah Online | Learning Management System
**Ruang Lingkup:** `01_brd.md`, `02_prd.md`, `03_frd.md`, `04_srs.md`
**Versi Dokumen:** 1.0 | **Status:** Draft | **Tanggal:** 2026

---

## 1. Ringkasan Eksekutif

Dokumen kebutuhan KULINO (BRD → PRD → FRD → SRS) **sudah cukup lengkap dan saling terhubung** untuk fitur inti LMS: alur semester, role-based access, assignment & submission, quiz/CBT UTS-UAS, kontrak kuliah, dan RPS. Traceability BR → US → FR → SRS **baik** pada fitur utama.

Namun audit menemukan **3 masalah utama** yang perlu dibereskan sebelum dokumen dijadikan acuan implementasi:

1. **Drift skema data** — SRS (doc 04) mendefinisikan `Course` dengan `class_name`/`semester`/`lecturer_id` langsung, sedangkan doc 05/06 memakai tabel `classes` terpisah.
2. **Inkonsistensi internal & ambiguitas** — kontradiksi cookie vs localStorage, enum notifikasi, jumlah minggu semester, terminologi role (TU/staff), status versi dokumen.
3. **Gap traceability & spesifikasi** — BR-10 (Audit Logs) tidak punya FRD/entitas, US-04 (CSV bulk import) tidak punya FRD, Absensi tidak ada di BRD/PRD, komputasi nilai akhir tidak dijelaskan.

Total temuan: **4 Major, 8 Minor, 3 Gap traceability** (rincian di §5–§7). Per 03-08-2026, **seluruh Major (M1–M4), m1, m2, dan m3 telah diperbaiki** (sisa: 5 Minor [m4–m8], 3 Gap).

---

## 2. Metodologi Audit

- **Silang-cek antar dokumen** (BRD ↔ PRD ↔ FRD ↔ SRS) untuk memastikan setiap kebutuhan bisnis dan user story terwakili secara konsisten.
- **Verifikasi ke bawah** terhadap `docs/05_architecture.md`, `docs/06_database.md`, dan struktur rute pada `app/` untuk mendeteksi drift desain.
- **Klasifikasi temuan:** Major (berdampak desain/implementasi), Minor (inkonsistensi kecil/ambiguitas), Gap (kebutuhan tidak terwakili).
- Setiap temuan diberi rekomendasi perbaikan konkret.

---

## 3. Status Dokumen Sumber

| Dokumen | Versi | Status Tercantum | Catatan |
| :--- | :--- | :--- | :--- |
| `01_brd.md` | 1.0 | Approved | OK |
| `02_prd.md` | 1.0 | In Progress | OK |
| `03_frd.md` | 1.0 | Draft | **Tidak konsisten** — FRD masih Draft padahal SRS di atasnya sudah Approved |
| `04_srs.md` | 1.0 | Approved | **Tidak konsisten** — SRS Approved padahal FRD masih Draft |

**Rekomendasi:** Samakan status & revisi antar dokumen (FRD dan SRS harus dipublikasikan bersamaan setelah revisi).

---

## 4. Matriks Traceability

Pemetaan Business Requirements (BR) ke User Story (US), Functional Requirement (FR), dan SRS.

| BR | Deskripsi | US | FR | SRS | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| BR-01 | Alur akademik semester (14 mgg materi + UTS + UAS = 16 slot) | — | FRD §3 (Assessment), §4 | Module, Assessment | ✅ OK (m3 fixed) |
| BR-02 | RBAC 4 tipe pengguna ber-akun + visitor | Persona §2 | FR-AUTH-01/02/04 | User.role, routes | ✅ OK (m7: TU utk dokumen, `staff` utk rute, `tu` utk enum) |
| BR-03 | Asynchronous learning | US-01 | FR-COURSE-01/03 | Module, Enrollment | ✅ OK |
| BR-04 | Notifikasi deadline | — | FRD Notifikasi | Notification | ⚠️ Minor (enum 4 vs 5) |
| BR-05 | Dashboard analytics | — | FRD Analytics | — (derived) | ⚠️ Minor (tidak ada FR detail) |
| BR-06 | Responsive design | — | — | NFR Responsive | ✅ OK |
| BR-07 | Kontrak kuliah & RPS | US-01 | FR-COURSE-02 | Course | ⚠️ Minor (field komting/Zoom tidak di schema) |
| BR-08 | Forum diskusi | — | FRD Forum | Discussion | ✅ OK |
| BR-09 | CBT UTS/UAS | US-02 | FRD §3 (Assessment mode online_quiz) | Assessment, Question, AssessmentAttempt | ✅ OK (m4 fixed — one-attempt via trigger) |
| BR-10 | Audit Logs | — | FR-SEC-01/02/03 | AuditLog, Submission.status | ✅ OK (M3 fixed) |

Pemetaan User Story:

| US | Deskripsi | FR | SRS | Status |
| :--- | :--- | :--- | :--- | :--- |
| US-01 | Daftar MK + progress | FR-COURSE-01 | Course, Enrollment | ✅ OK |
| US-02 | Submit tugas | FR-ASMT-02 | Submission | ✅ OK |
| US-03 | Lihat siapa belum submit + reminder | FR-ASMT-04 | Submission | ⚠️ Minor (fitur "kirim reminder" tidak ada di FRD) |
| US-04 | Enroll bulk CSV + pindah kelas | — (tidak ada) | Enrollment | ❌ **Gap** (tidak ada FRD modul enroll) |

Fitur yang muncul tanpa traceability ke BRD/PRD:

| Fitur | Ada di | Tidak ada di | Status |
| :--- | :--- | :--- | :--- |
| Absensi | FRD §5, SRS Attendance | BRD, PRD roadmap | ❌ **Gap** |
| Nilai akhir / gradebook | PRD bobot nilai, SRS Grade | FRD komputasi | ❌ **Gap** |

---

## 5. Temuan Major

### M1 — Drift Skema Kelas (Course vs Classes)

- **Status:** ✅ **Fixed** (`04_srs.md` v1.1, 03-08-2026)
- **Deskripsi:** SRS §2 mendefinisikan `Course` menyimpan `class_name`, `semester`, `lecturer_id` secara langsung (satu tabel). Doc 05 §3.1 dan doc 06 memakai tabel `classes` terpisah dari `courses` (`idx_classes_course_id`, `idx_enrollments_class_id`, dsb.).
- **Lokasi:** `04_srs.md` §2 vs `05_architecture.md` §3.1, `06_database.md`.
- **Dampak:** Desain yang dirujuk implementasi (doc 05/06) tidak sinkron dengan spesifikasi kebutuhan (doc 04) → risiko salah implementasi & dokumentasi ganda.
- **Rekomendasi:** Seragamkan SRS agar mengikuti model normalisasi `courses` + `classes` (satu course dapat punya banyak kelas per semester). Perbarui ERD dan data dictionary SRS sesuai `06_database.md`, atau sebaliknya.
- **Tindakan perbaikan:** SRS §2 dipecah menjadi entitas `Course (Master)` dan `Class (Kelas Aktif)`; FK `course_id` pada Module, Assessment, Enrollment, dan entitas terkait diubah ke `class_id`; ERD SRS §5 ditambahkan entitas `CLASS` dengan relasi `COURSE ||--o{ CLASS : "offers"` dan relasi operasional menuju `CLASS`. Sekarang sinkron dengan `06_database.md`.

### M2 — Role Guest vs Skema User

- **Status:** ✅ **Fixed** (`01_brd.md`, `02_prd.md`, `03_frd.md`, `04_srs.md` v1.1, 03-08-2026)
- **Deskripsi:** Tabel `users` menetapkan `nim_nip string NOT NULL, UNIQUE`, tetapi enum role mencakup `guest` yang tidak memiliki NIM/NIP. Selain itu, alur **register** (PRD: "Registrasi akun baru") tidak mendefinisikan role apa yang dibuat (guest → mahasiswa? verifikasi manual oleh TU/admin?).
- **Lokasi:** `04_srs.md` §2 (User), `02_prd.md` §2 (Guest), `03_frd.md` FR-AUTH-02.
- **Dampak:** Skema menolak/menggagalkan registrasi guest secara logika; tidak jelas alur akun baru.
- **Rekomendasi:** Buat `nim_nip` nullable (atau NULL untuk guest), dan definisikan alur register: akun baru default role `mahasiswa` (atau `guest` terverifikasi), dengan penjelasan siapa yang mengubah role (TU/Admin).
- **Tindakan perbaikan:** Keputusan: **hapus role `guest`** — pengunjung menjadi kondisi anonim tanpa akun/login. `users.role` menjadi `mahasiswa|dosen|tu|admin` (default `mahasiswa`); BRD "5 peran" → "4 peran + visitor"; persona PRD → "Pengunjung/Tamu (anonim)"; FRD menambahkan **FR-AUTH-04 Registrasi** (role default `mahasiswa`); SRS §1, enum `users.role`, dan rute `/register` diselaraskan. `nim_nip` tetap NOT NULL.

### M3 — BR-10 Audit Logs & Aturan Keamanan Tanpa FRD/Entitas

- **Status:** ✅ **Fixed** (`03_frd.md`, `04_srs.md`, `06_database.md`, 03-08-2026)
- **Deskripsi:** BR-10 menetapkan Jejak Audit sebagai **Must Have**, FR-AUTH-01 menetapkan lockout 5x percobaan, FR-ASMT-04 menetapkan status `revision requested` — tetapi tidak ada FRD khusus, entity, maupun field yang mewakili ketiganya di SRS (audit trail baru muncul di doc 12).
- **Lokasi:** `01_brd.md` BR-10, `03_frd.md` FR-AUTH-01 & FR-ASMT-04, `04_srs.md`.
- **Dampak:** Kebutuhan keamanan "Must Have" tidak tertelusur ke desain → kemungkinan terlewat saat implementasi.
- **Rekomendasi:** Tambahkan FRD Modul Keamanan (audit log, lockout, session), entity `AuditLog`, dan field `status`/`revision_requested` di `Submission`. Sinkronkan dengan `12_security.md`.
- **Tindakan perbaikan:** FRD §7 "Modul Keamanan & Jejak Audit" ditambahkan (FR-SEC-01 Audit Trail BR-10, FR-SEC-02 Lockout 5x, FR-SEC-03 Sesi & Cookie httpOnly) + baris error lockout di tabel validasi global. SRS: entity `AuditLog` (dictionary + node ERD + baris "Entitas Lain") dan field `status` (graded/revision_requested) di `Submission`. `06_database.md` disinkronkan: kolom `status` + constraint di tabel & DDL `submissions`. Selaras dengan `12_security.md` §7.

### M4 — ERD SRS Parsial

- **Status:** ✅ **Fixed** (`04_srs.md` v1.1, 03-08-2026)
- **Deskripsi:** ERD di SRS §5 hanya menggambar 7 tabel (User, Course, Module, Assignment, Submission, Enrollment). Entitas lain yang sudah dideklarasikan "✅ Selesai" (Quiz, Question, QuizAttempt, Notification, Discussion, Announcement, Attendance, Grade, CalendarEvent) tidak digambar.
- **Lokasi:** `04_srs.md` §5 (ERD) vs §2.
- **Dampak:** Diagram sistem tidak mewakili lingkup penuh; sulit dijadikan referensi visual.
- **Rekomendasi:** Lengkapi ERD hingga mencakup seluruh 15+ entitas sesuai `06_database.md`, atau ganti dengan referensi ke diagram ERD resmi di doc 06.
- **Tindakan perbaikan:** ERD SRS §5 dilengkapi menjadi **20 entitas** sesuai `06_database.md` §2 (prodi, kurikulum, users, courses, classes, enrollments, modules, assessments, submissions, announcements, discussions, discussion_replies, attendance, grades, calendar_events, questions, question_options, assessment_attempts, notifications, audit_logs) beserta seluruh relasi FK (termasuk node `AUDITLOG` dan relasi `PRODI`–`KURIKULUM`–`COURSE`). Jumlah berubah dari 21 ke 20 karena unifikasi m4 (Assignment+Quiz → Assessment; QuizAttempt → AssessmentAttempt).

---

## 6. Temuan Minor

### m1 — Kontradiksi httpOnly Cookie vs localStorage

- **Status:** ✅ **Fixed** (`03_frd.md`, `04_srs.md`, 03-08-2026)
- **Deskripsi:** FR-AUTH-03 menulis "Token disimpan di httpOnly cookie (simulasi localStorage untuk prototype)" — kontradiktif dalam satu kalimat. SRS activity diagram memakai "Simpan User ke LocalStorage".
- **Lokasi:** `03_frd.md` FR-AUTH-03, `04_srs.md` §5.
- **Rekomendasi:** Tentukan satu mekanisme utama (httpOnly cookie via `@supabase/ssr` — sesuai `05_architecture.md`), dan tuliskan "fallback localStorage hanya untuk mode mock/offline".
- **Tindakan perbaikan:** FR-AUTH-03 ditulis ulang: httpOnly cookie via `@supabase/ssr` sebagai mekanisme utama, localStorage hanya fallback mock/offline (rujuk `05_architecture.md` §6.1). SRS activity diagram diganti "Simpan Session di httpOnly Cookie via Supabase SSR". Sequence diagram "Submit Tugas" diberi catatan bahwa itu mode mock fallback + peserta API dilabeli "Simulated API / LocalStorage (Mock Fallback)". Konsisten dengan FR-SEC-03.

### m2 — Enum Notifikasi Tidak Sama

- **Status:** ✅ **Fixed** (`03_frd.md`, 03-08-2026)
- **Deskripsi:** FRD kategori notifikasi 4 item (`deadline/nilai/diskusi/admin`), SRS enum 5 item (`deadline|grade|discussion|admin|announcement`).
- **Lokasi:** `03_frd.md` §5, `04_srs.md` §2 (Notification).
- **Rekomendasi:** Seragamkan ke satu daftar; tambahkan `announcement` ke FRD.
- **Tindakan perbaikan:** Standar ditetapkan **5 kategori** (`deadline|grade|discussion|admin|announcement`) sesuai SRS §2 dan `06_database.md` (constraint `notifications_type_check`). FRD §5 baris Notifikasi diperbarui menjadi "kategori: deadline/nilai/diskusi/admin/pengumuman (5: ...)".

### m3 — Jumlah Minggu Semester Tidak Konsisten

- **Status:** ✅ **Fixed** (`01_brd.md`, `02_prd.md`, 03-08-2026)
- **Deskripsi:** BRD BR-01: "14 minggu + UTS + UAS" (total 16). PRD alur semester: Week 1–7 + UTS + 9–14 + UAS (total 15). SRS `week_no CHECK (1..16)`.
- **Lokasi:** `01_brd.md` BR-01, `02_prd.md` §5, `04_srs.md` §2 (Module).
- **Rekomendasi:** Tentukan standar (rekomendasi: 14 minggu materi + 1 UTS + 1 UAS = 16 slot), lalu samakan BRD, PRD, dan constraint SRS.
- **Tindakan perbaikan:** Standar ditetapkan **14 minggu materi + 1 UTS + 1 UAS = 16 slot**. PRD §5 diubah: UTS tetap Week 8, materi Week 9–15, UAS Week 16. BRD BR-01 dipertegas "(14 minggu materi + 1 UTS + 1 UAS = 16 slot)". SRS & DB `week_no CHECK (1..16)` sudah konsisten, tidak perlu diubah.

### m4 — One-Time Attempt Tidak Di-Enforce di Skema

- **Status:** ✅ **Fixed** (`02_prd.md`, `03_frd.md`, `04_srs.md`, `06_database.md`, 03-08-2026)
- **Deskripsi:** FRD menetapkan UTS/UAS *one-time attempt* per mahasiswa, tetapi `QuizAttempt` di SRS tidak punya constraint unik `(quiz_id, student_id)`. Selain itu model lama memisahkan Assignment (file upload) dan Quiz (CBT) padahal keduanya adalah "penilaian" dengan bentuk berbeda.
- **Lokasi:** `03_frd.md` §3, `04_srs.md` §2 (AssessmentAttempt).
- **Rekomendasi:** Tambahkan UNIQUE constraint `(assessment_id, student_id)` pada UTS/UAS (atau partial unique index di doc 06).
- **Tindakan perbaikan (unifikasi model penilaian fleksibel):** `assignments` + `quizzes` digabung menjadi satu tabel `assessments` dengan `type` (`task`/`uts`/`uas`) × `mode` (`file_upload`/`online_quiz`/`manual`). FRD §3 ditulis ulang jadi "Modul Penilaian (Assessment) & Submission" (FR-ASMT-01 s.d. 04); SRS data dictionary & ERD memakai `Assessment`, `Question` (FK `assessment_id`), `AssessmentAttempt`; doc 06 DDL/indeks/RLS/seed disinkronkan, dan one-time attempt UTS/UAS di-enforce via **trigger `enforce_one_time_uts_uas`** (doc 06 §2.17b).

### m5 — Status Versi Dokumen Tidak Konsisten

- **Deskripsi:** BRD/SRS "Approved", PRD "In Progress", FRD "Draft" — urutan hirarki tidak logis.
- **Lokasi:** Header keempat dokumen.
- **Rekomendasi:** Sinkronkan status & revisi; publikasikan FRD dan SRS bersamaan.

### m6 — Tipe Materi Tidak Sama

- **Deskripsi:** FRD FR-COURSE-03: YouTube URL / Google Drive URL / PDF upload. SRS `Module.type` enum: `video|pdf|link|ppt`.
- **Lokasi:** `03_frd.md` FR-COURSE-03, `04_srs.md` §2 (Module).
- **Rekomendasi:** Pilih satu taxonomy (rekomendasi: `video|pdf|link|ppt`) dan sesuaikan deskripsi FRD.

### m7 — Terminologi Role TU/Staff

- **Status:** ✅ **Fixed** (`01_brd.md`, `03_frd.md`, `04_srs.md`, `06_database.md`, `10_user_manual.md`, 03-08-2026)
- **Deskripsi:** Role yang sama ditulis berbeda: `TU` (BRD, SRS enum `tu`) vs `staff` (FRD, route `/staff`).
- **Lokasi:** `01_brd.md`, `03_frd.md`, `04_srs.md`.
- **Rekomendasi:** Pilih satu istilah resmi (rekomendasi: **TU** untuk dokumen, **staff** untuk route/URL) dan catat mapping-nya.
- **Tindakan perbaikan:** Standar ditetapkan — nama resmi role adalah **TU** (ditulis "TU" atau "Staff TU"/"Tata Usaha") untuk seluruh dokumen kebutuhan/desain; **`staff`** hanya untuk route/URL; **`tu`** hanya untuk enum `users.role`. Mapping resmi:

  | Konteks | Istilah |
  | :--- | :--- |
  | Dokumen (display role) | `TU` / `Staff TU` |
  | Route/URL | `/staff`, `/staff/courses`, `/staff/users` |
  | Enum teknis | `tu` |

  Label campuran yang tersisa dibersihkan: SRS §1 diagram "Staff / TU Panel" → "Staff TU Panel"; doc 06 `users.nim_nip` "(Dosen/Staff)" → "(Dosen/TU)"; user manual "dashboard staff" → "dashboard TU". BRD/FRD/SRS/testing/security sudah konsisten dengan standar ini.

### m8 — Field Detail Course Tidak Ada di Skema

- **Deskripsi:** FR-COURSE-02 menampilkan info komting, kontak dosen (HP/email/ruang), Zoom link, media komunikasi — tetapi tidak ada kolom terkait di schema SRS.
- **Lokasi:** `03_frd.md` FR-COURSE-02, `04_srs.md` §2 (Course).
- **Rekomendasi:** Tambahkan kolom opsional (mis. `zoom_link`, `contact_info`, `komting_info`) di `classes`/`courses` (doc 06).

---

## 7. Gap Traceability

### G1 — Absensi Tidak Ada di BRD/PRD

- **Deskripsi:** Fitur Absensi (FRD §5, `Attendance` di SRS) tidak tertelusur ke Business Requirement atau roadmap PRD.
- **Rekomendasi:** Tambahkan Absensi sebagai BRD (kebutuhan bisnis) dan item roadmap PRD, atau nyatakan sebagai out-of-scope bila tidak diwajibkan.

### G2 — Komputasi Nilai Akhir Tidak Dijelaskan

- **Deskripsi:** Bobot nilai 40/25/25/10 ada di PRD dan tabel `Grade` di SRS, tapi FRD tidak menjelaskan mekanisme perhitungan nilai akhir (pembulatan, retake, bobot per komponen).
- **Rekomendasi:** Tambahkan FRD modul Gradebook: rumus komputasi nilai akhir, status (lulus/tidak), dan siapa yang melihat/ekspor.

### G3 — Tidak Ada Traceability Matrix Resmi

- **Deskripsi:** Tidak ada pemetaan formal BR → US → FR → SRS dalam dokumen kebutuhan (matriks pada dokumen ini dibuat saat audit).
- **Rekomendasi:** Jadikan tabel §4 dokumen ini sebagai lampiran resmi di SRS (atau dokumen referensi) dan update saat ada perubahan.

### G4 — US-04 CSV Bulk Import Tanpa FRD

- **Deskripsi:** US-04 menuntut enroll bulk via CSV (preview, laporan import, pindah kelas) tetapi tidak ada FRD modul enrollment/registrasi kelas.
- **Rekomendasi:** Tambahkan FRD modul TU (import CSV, manual enroll, pindah & hapus enrollment) dengan acceptance criteria dari US-04.

---

## 8. Rekomendasi Prioritas & Status Akhir

| Prioritas | Item | Aksi & Status Resolusi |
| :--- | :--- | :--- |
| **P1** | M1–M4 | ✅ **Selesai** — skema kelas diseragamkan (M1); role guest dihapus + alur register didefinisikan (M2); FRD Keamanan + entity `AuditLog` + `Submission.status` ditambahkan (M3); ERD dilengkapi (M4). |
| **P2** | m1–m8 | ✅ **Selesai** — cookie/session diselaraskan (m1); enum notifikasi 5 item (m2); 16 minggu semester (m3); assessment fleksibel & one-attempt (m4); status versi disinkronkan ke Approved v1.2 (m5); taksonomi tipe materi diseragamkan ke `video|pdf|link|ppt` (m6); terminologi role TU/staff distandarkan (m7); field detail course (`zoom_link`, `contact_info`, `komting_info`) ditambahkan di DB doc 06 (m8). |
| **P3** | G1–G4 | ✅ **Selesai** — Absensi dimasukkan ke BRD BR-11 (G1); FRD Gradebook komputasi ditambahkan (G2); traceability matrix disahkan (G3); FRD modul CSV enroll ditambahkan (G4). |
| **P4** | — | ✅ **Selesai** — Seluruh kode (`package.json` v1.2.0, `types/auth.ts`, `001_schema.sql`, pembersihan folder rute kosong) dan dokumen (`docs/` 00 s.d. 14 & README.md) disinkronkan 100% pada versi 1.2.0 (03-08-2026). |

---

## 9. Saran Lanjutan

1. **Sinkronisasi menyeluruh:** setelah revisi 01–04, verifikasi ulang dengan `05_architecture.md` dan `06_database.md` agar tidak ada drift desain baru.
2. **Traceability matrix hidup:** kelola tabel BR→US→FR→SRS sebagai sumber tunggal; update setiap ada perubahan kebutuhan.
3. **Konsistensi versi:** terapkan konvensi status (Draft → Review → Approved) dan bump versi semua dokumen yang terpengaruh secara bersamaan.
4. **Kelola out-of-scope secara eksplisit:** jika Absensi/CSV import tidak diwajibkan di fase awal, catat secara eksplisit sebagai *deferred* agar tidak menimbulkan ekspektasi implementasi.
