# Testing Plan & QA Specification

## KULINO — Rencana & Hasil Pengujian Sistem

**Versi:** 1.2 | **Tipe:** QA Document | **Status:** Active (100% Passed)
**Tanggal:** 3 Agustus 2026

---

## 1. Ruang Lingkup Pengujian

Dokumen ini mencakup rencana dan hasil pengujian untuk **KULINO LMS** — meliputi seluruh alur fungsional utama yang telah diimplementasikan pada fase frontend simulation dan integrasi Supabase. Pengujian dibedakan secara tegas menjadi dua kategori:

1. **Automated Unit Testing (Vitest & RTL)**: Pengujian unit komponen antarmuka otomatis yang dijalankan dalam pipeline CI/CD (`components/admin/__tests__/CoursesTab.test.tsx`).
2. **Manual QA Scenario Testing**: Matriks skenario uji fungsional, otentikasi, perizinan rute (RBAC), dan formulir yang diverifikasi secara eksploratif melalui peramban.

---

## 2. Strategi Pengujian

| Jenis Test        | Metode                    | Tool / Environment           |
| ----------------- | ------------------------- | ---------------------------- |
| Automated Unit    | Vitest & RTL              | Memory Test Runner           |
| CI/CD Automated   | GitHub Actions Pipeline   | Ubuntu Latest (Node 20)      |
| Manual Functional | Exploratory testing       | Browser (Chrome/Firefox)     |
| Role-Based Access | Skenario login tiap role  | Browser DevTools             |
| Responsive        | Resize & device emulation | Chrome DevTools Device Mode  |
| Form Validation   | Input edge cases          | Browser + Zod error messages |
| UI Consistency    | Visual inspection         | Vs. Design System doc        |

---

## 3. Automated Vitest Unit Test Results

Pengujian unit otomatisasi berjalan sukses dengan status **100% Passed (8/8 Tests Passed)**:

```bash
 RUN  v4.1.9 D:/projects/learning-management-system

 ✓ components/admin/__tests__/CoursesTab.test.tsx (8 tests) 720ms

 Test Files  1 passed (1)
      Tests  8 passed (8)
   Start at  12:33:29
   Duration  3.51s
```

---

## 4. Manual QA Test Cases — Modul Autentikasi (Skenario Manual)

### TC-AUTH-01 — Login berhasil sebagai Mahasiswa

| Field            | Detail                                                                             |
| ---------------- | ---------------------------------------------------------------------------------- |
| **Precondition** | Akun mahasiswa tersedia di mock data                                               |
| **Steps**        | 1. Buka `/login` → 2. Input email `mahasiswa@kulino.id` + password → 3. Klik Login |
| **Expected**     | Redirect ke `/dashboard`, sidebar menampilkan menu mahasiswa                       |
| **Status**       | ✅ Pass                                                                            |

### TC-AUTH-02 — Login berhasil sebagai Dosen

| Field        | Detail                                                  |
| ------------ | ------------------------------------------------------- |
| **Steps**    | Input email `dosen@kulino.id` + password → Klik Login   |
| **Expected** | Redirect ke `/lecturer`, sidebar menampilkan menu dosen |
| **Status**   | ✅ Pass                                                 |

### TC-AUTH-03 — Login berhasil sebagai Staff TU

| Field        | Detail                            |
| ------------ | --------------------------------- |
| **Steps**    | Input email staff TU → Klik Login |
| **Expected** | Redirect ke `/staff`              |
| **Status**   | ✅ Pass                           |

### TC-AUTH-04 — Login berhasil sebagai Admin

| Field        | Detail                         |
| ------------ | ------------------------------ |
| **Steps**    | Input email admin → Klik Login |
| **Expected** | Redirect ke `/admin`           |
| **Status**   | ✅ Pass                        |

### TC-AUTH-05 — Login dengan kredensial salah

| Field        | Detail                                          |
| ------------ | ----------------------------------------------- |
| **Steps**    | Input email valid + password salah → Klik Login |
| **Expected** | Tampil pesan error "Email atau password salah"  |
| **Status**   | ✅ Pass                                         |

### TC-AUTH-06 — Akses halaman protected tanpa login

| Field        | Detail                                        |
| ------------ | --------------------------------------------- |
| **Steps**    | Buka `/dashboard` di browser baru tanpa login |
| **Expected** | Redirect otomatis ke `/login`                 |
| **Status**   | ✅ Pass                                       |

### TC-AUTH-07 — Akses cross-role (mahasiswa ke halaman dosen)

| Field        | Detail                                           |
| ------------ | ------------------------------------------------ |
| **Steps**    | Login sebagai mahasiswa → Coba akses `/lecturer` |
| **Expected** | Redirect ke `/dashboard` atau tampil halaman 403 |
| **Status**   | ✅ Pass                                          |

### TC-AUTH-08 — Form validation: password kurang dari 8 karakter

| Field        | Detail                                          |
| ------------ | ----------------------------------------------- |
| **Steps**    | Input password 5 karakter → Klik Login          |
| **Expected** | Tampil error Zod: "Password minimal 8 karakter" |
| **Status**   | ✅ Pass                                         |

---

## 5. Test Cases — Modul Course & Materi

### TC-COURSE-01 — Mahasiswa melihat daftar mata kuliah

| Field        | Detail                                                         |
| ------------ | -------------------------------------------------------------- |
| **Steps**    | Login mahasiswa → Buka `/dashboard`                            |
| **Expected** | Menampilkan course cards dengan nama MK, dosen, dan progress % |
| **Status**   | ✅ Pass                                                        |

### TC-COURSE-02 — Mahasiswa membuka detail mata kuliah

| Field        | Detail                                                                                      |
| ------------ | ------------------------------------------------------------------------------------------- |
| **Steps**    | Klik card course → Buka `/dashboard/course/[id]`                                            |
| **Expected** | Halaman detail menampilkan header kelas, tab Materi/Tugas/Diskusi/Nilai, accordion mingguan |
| **Status**   | ✅ Pass                                                                                     |

### TC-COURSE-03 — Dosen upload materi baru

| Field        | Detail                                                               |
| ------------ | -------------------------------------------------------------------- |
| **Steps**    | Login dosen → Buka course → Klik "Tambah Materi" → Isi form → Submit |
| **Expected** | Materi baru muncul di timeline minggu yang dipilih                   |
| **Status**   | ✅ Pass                                                              |

### TC-COURSE-04 — Filter course berdasarkan status

| Field        | Detail                                             |
| ------------ | -------------------------------------------------- |
| **Steps**    | Di halaman `/courses`, pilih filter "Selesai"      |
| **Expected** | Hanya menampilkan course dengan status `completed` |
| **Status**   | ✅ Pass                                            |

---

## 6. Test Cases — Modul Penilaian (Assessment)

Penilaian (tugas/UTS/UAS) mendukung mode `file_upload`, `online_quiz`, dan `manual`. Test case di bawah mencakup mode `file_upload` (pengumpulan) dan `online_quiz` (CBT).

### TC-ASSIGN-01 — Mahasiswa submit tugas sebelum deadline

| Field        | Detail                                                          |
| ------------ | --------------------------------------------------------------- |
| **Steps**    | Buka detail tugas → Upload file (PDF < 10MB) → Klik Submit      |
| **Expected** | Tampil konfirmasi dengan timestamp, status berubah "Diserahkan" |
| **Status**   | ✅ Pass                                                         |

### TC-ASSIGN-02 — Mahasiswa submit tugas setelah deadline

| Field        | Detail                                                              |
| ------------ | ------------------------------------------------------------------- |
| **Steps**    | Submit tugas dengan timestamp melebihi deadline                     |
| **Expected** | Submission diterima, status ditandai "Terlambat" dengan badge merah |
| **Status**   | ✅ Pass                                                             |

### TC-ASSIGN-03 — Upload file melebihi batas ukuran

| Field        | Detail                                                          |
| ------------ | --------------------------------------------------------------- |
| **Steps**    | Coba upload file > 10MB                                         |
| **Expected** | Tampil error "Ukuran file melebihi batas 10 MB", upload ditolak |
| **Status**   | ✅ Pass                                                         |

### TC-ASSIGN-04 — Upload file format tidak diizinkan

| Field        | Detail                                                     |
| ------------ | ---------------------------------------------------------- |
| **Steps**    | Upload file `.exe` pada tugas yang hanya menerima PDF/DOCX |
| **Expected** | Tampil error validasi format file                          |
| **Status**   | ✅ Pass                                                    |

### TC-ASSIGN-05 — Dosen memberikan nilai dan feedback

| Field        | Detail                                                                          |
| ------------ | ------------------------------------------------------------------------------- |
| **Steps**    | Login dosen → Buka submission mahasiswa → Input nilai (0–100) + feedback → Save |
| **Expected** | Nilai tersimpan dan muncul di halaman nilai mahasiswa                           |
| **Status**   | ✅ Pass                                                                         |

### TC-QUIZ-01 — Mahasiswa mengerjakan penilaian online (mode online_quiz)

| Field        | Detail                                                                        |
| ------------ | ----------------------------------------------------------------------------- |
| **Steps**    | Buka `/assessment/[aid]/attempt` saat `open_at` → kerjakan MCQ/esai → submit  |
| **Expected** | Nilai MCQ/true-false dihitung otomatis, esai masuk antrean koreksi dosen      |
| **Status**   | ✅ Pass                                                                       |

### TC-QUIZ-02 — Auto-submit saat waktu habis

| Field        | Detail                                                                 |
| ------------ | ---------------------------------------------------------------------- |
| **Steps**    | Biarkan countdown timer habis saat mengerjakan online quiz              |
| **Expected** | Sistem auto-submit jawaban yang sudah terisi, attempt dikunci           |
| **Status**   | ✅ Pass                                                                |

### TC-QUIZ-03 — UTS/UAS one-time attempt

| Field        | Detail                                                                             |
| ------------ | ---------------------------------------------------------------------------------- |
| **Steps**    | Mahasiswa yang sudah submit UTS/UAS mencoba masuk attempt lagi                      |
| **Expected** | Ditolak (trigger `enforce_one_time_uts_uas`), muncul pesan "hanya dapat dikerjakan satu kali" |
| **Status**   | ✅ Pass                                                                            |

---

## 7. Test Cases — Role-Based Access Control

| Test Case  | User Role | URL Diakses  | Expected Result             | Status  |
| ---------- | --------- | ------------ | --------------------------- | ------- |
| TC-RBAC-01 | Mahasiswa | `/dashboard` | ✅ Akses diberikan          | ✅ Pass |
| TC-RBAC-02 | Mahasiswa | `/lecturer`  | ❌ Redirect ke `/dashboard` | ✅ Pass |
| TC-RBAC-03 | Mahasiswa | `/admin`     | ❌ Redirect ke `/dashboard` | ✅ Pass |
| TC-RBAC-04 | Dosen     | `/lecturer`  | ✅ Akses diberikan          | ✅ Pass |
| TC-RBAC-05 | Dosen     | `/admin`     | ❌ Redirect ke `/lecturer`  | ✅ Pass |
| TC-RBAC-06 | Staff TU  | `/staff`     | ✅ Akses diberikan          | ✅ Pass |
| TC-RBAC-07 | Admin     | `/admin`     | ✅ Akses diberikan          | ✅ Pass |
| TC-RBAC-08 | Guest     | `/dashboard` | ❌ Redirect ke `/login`     | ✅ Pass |

---

## 8. Test Cases — Responsive Design

| Breakpoint | Lebar Layar    | Yang Diuji             | Expected                                     | Status  |
| ---------- | -------------- | ---------------------- | -------------------------------------------- | ------- |
| Mobile     | 375px (iPhone) | Sidebar → Bottom Nav   | ✅ Nav berubah ke 5-icon bottom bar          | ✅ Pass |
| Mobile     | 375px          | Course Cards           | ✅ 1-2 kolom                                 | ✅ Pass |
| Tablet     | 768px          | Sidebar collapsed      | ✅ Sidebar tersembunyi, toggle icon tersedia | ✅ Pass |
| Desktop    | 1024px         | Full sidebar + content | ✅ 260px sidebar visible                     | ✅ Pass |
| Wide       | 1440px         | Max content width      | ✅ Content max-width 1200px, centered        | ✅ Pass |

---

## 9. Test Cases — Form Validation Global

| Test Case  | Input Kondisi                | Expected Error                                          | Status  |
| ---------- | ---------------------------- | ------------------------------------------------------- | ------- |
| TC-FORM-01 | Field wajib dikosongkan      | "Field ini wajib diisi" + border merah                  | ✅ Pass |
| TC-FORM-02 | Email format salah (tanpa @) | "Format email tidak valid"                              | ✅ Pass |
| TC-FORM-03 | Submit saat session expired  | Redirect ke `/login` + pesan "Sesi Anda telah berakhir" | ✅ Pass |
| TC-FORM-04 | Koneksi mock gagal           | Tampilkan tombol "Coba Lagi"                            | ✅ Pass |

---

## 10. Bugs & Known Issues

| ID  | Halaman | Deskripsi                                                   | Severity | Status |
| --- | ------- | ----------------------------------------------------------- | -------- | ------ |
| —   | —       | Tidak ada bug kritis yang teridentifikasi di fase prototype | —        | —      |

---

## 11. Rencana Pengujian Fase Berikutnya (Backend Integration)

Ketika integrasi Supabase aktif, pengujian berikut perlu ditambahkan:

- **API Integration Testing** — Validasi response dari Supabase REST API
- **Authentication Testing** — JWT token expiry, refresh token behavior
- **Database Constraint Testing** — Uji FK constraints, UNIQUE constraints, CHECK constraints
- **File Upload Testing** — Supabase Storage upload dengan file nyata
- **Real-time Testing** — Supabase Realtime untuk notifikasi & forum diskusi
- **Performance Testing** — Lighthouse audit untuk FCP ≤ 1.5s dan LCP ≤ 2.5s
- **Security Testing** — XSS prevention, input sanitization, route protection
