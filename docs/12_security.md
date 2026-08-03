# Dokumen Keamanan Perangkat Lunak (Software Security Specification)

**Sistem:** KULINO — Kuliah Online | Learning Management System  
**Versi Dokumen:** 1.1  
**Status:** Terverifikasi & Siap Produksi

Dokumen ini menjelaskan struktur keamanan perangkat lunak yang diterapkan dalam proyek **KULINO LMS**, mencakup standar enkripsi data, otentikasi, otorisasi di tingkat database (RLS), pencegahan kerentanan (SQL Injection, CORS), penanganan variabel lingkungan, rate limiting, dan sistem jejak audit (audit trail).

---

## 1. Enkripsi Data & Hashing (Data Encryption & Hashing)

Sistem memastikan bahwa seluruh data sensitif dilindungi baik saat transit (_data-in-transit_) maupun saat disimpan (_data-at-rest_).

### 1.1 Enkripsi Saat Transit (Data-in-Transit)

- Seluruh komunikasi antara aplikasi Next.js (client) dan endpoint Supabase (database/API) wajib menggunakan enkripsi **SSL/TLS (HTTPS)**.
- Konfigurasi cookie Next.js diatur dengan flag `secure: true` pada environment production untuk mencegah intersepsi token sesi melalui jaringan tidak aman.

### 1.2 Hashing Kata Sandi (Password Hashing)

- Kata sandi pengguna **tidak pernah** disimpan dalam bentuk plain-text.
- Otentikasi dikelola sepenuhnya oleh Supabase Auth (`auth.users`) menggunakan algoritma enkripsi satu arah **Bcrypt**.
- Tabel profil publik (`public.users`) hanya menyimpan string penanda `'hashed_by_supabase_auth'` untuk integritas data, sedangkan verifikasi kredensial dikerjakan di schema terproteksi internal Supabase.

---

## 2. Otentikasi & Otorisasi Aman (Secure Authentication & Authorization)

Sistem menggunakan alur token berbasis JWT (JSON Web Token) dengan otorisasi berbasis peran (Role-Based Access Control / RBAC) yang berlapis.

### 2.1 Next.js Middleware (Application Level)

Middleware Next.js (`middleware.ts` & `lib/supabase/middleware.ts`) bertugas memvalidasi JWT secara real-time pada setiap permintaan rute terproteksi:

- Menggunakan `supabase.auth.getUser()` untuk memvalidasi token sesi secara aman dari sisi server (mencegah manipulasi token JWT lokal di browser).
- Memeriksa klaim peran (`role`) dari metadata JWT terlebih dahulu (optimalisasi performa) sebelum mengizinkan rute:
    - `/admin/*` hanya dapat diakses oleh pengguna dengan role `admin`.
    - `/lecturer/*` hanya dapat diakses oleh pengguna dengan role `dosen`.
    - `/staff/*` hanya dapat diakses oleh pengguna dengan role `tu`.
    - `/dashboard/*` hanya dapat diakses oleh pengguna dengan role `mahasiswa`.

### 2.2 Row Level Security / RLS (Database Level)

Setiap tabel di skema `public` memiliki aturan RLS aktif untuk menghentikan akses data tidak sah langsung dari API client. Kebijakan ini didefinisikan dalam berkas `supabase/migrations/004_rls_policies.sql`.

Contoh kebijakan RLS penting:

- **Tabel `submissions`**: Mahasiswa hanya diizinkan membaca, menambah, dan memperbarui data submission miliknya sendiri (`auth.uid() = student_id`). Dosen dan admin memiliki hak penuh untuk penilaian.
- **Tabel `modules` & `quizzes`**: Mahasiswa hanya dapat melihat materi/kuis kelas jika materi tersebut sudah diterbitkan (`is_published = true`) dan mahasiswa terdaftar aktif dalam kelas tersebut (`class_id` terdaftar di tabel `enrollments` milik mahasiswa yang aktif).
- **Tabel `grades`**: Mahasiswa hanya diizinkan melihat nilainya sendiri (`auth.uid() = student_id`).

### 2.3 Pengamanan Fungsi Database (Secure Database Functions)

Guna meminimalkan risiko eksploitasi eskalasi hak akses (*privilege escalation*), fungsi pembantu keamanan database dikonfigurasi sebagai berikut:
- **Pengekangan Search Path**: Fungsi-fungsi kritis seperti `handle_new_user()`, `is_admin()`, `is_dosen()`, `log_user_audit_action()`, dan `log_user_login()` dikunci menggunakan parameter `SET search_path = public` untuk mencegah pembajakan skema pencarian relasi (*search_path mutable vulnerability*).
- **Pencabutan Hak Eksekusi Publik**: Hak eksekusi (`EXECUTE`) fungsi pemicu pendaftaran otomatis (`handle_new_user()`) dan pencatatan audit log (`log_user_audit_action()`, `log_user_login()`) dicabut dari publik/anon/authenticated role untuk mencegah pemanggilan langsung secara manual lewat REST API.

### 2.4 Otorisasi Server Actions & Pencegahan Privilege Escalation

- **Proteksi Server Actions (`actions.ts`)**: Server Action `createUserInAuth` dan `updateUserPasswordInAuth` mengecek session pemanggil via `createServerClient()` dan memverifikasi role pemanggil (`admin`/`tu`) sebelum mengeksekusi `SUPABASE_SERVICE_ROLE_KEY` Admin API.
- **Trigger Restriksi Kolom Role (`006_secure_user_role_update.sql`)**: PostgreSQL Trigger `prevent_user_role_escalation` pada tabel `public.users` mencegah perubahan kolom `role` jika dilakukan oleh pengguna non-admin/non-service_role via API Supabase Browser Client.

---

## 3. Perlindungan CORS (CORS Protection)

- **Next.js API Routes**: Endpoint Next.js tidak membuka akses publik (`Access-Control-Allow-Origin: *`). Semua API internal diamankan untuk penggunaan lokal satu domain saja.
- **Supabase API Gateway**: Konfigurasi CORS pada Supabase diatur melalui konsol manajemen untuk hanya membolehkan origin HTTP tertentu yang sah (misal: localhost untuk development dan domain resmi kampus untuk production). Kunci API anonim (`anon_key`) ditolak bila dipanggil dari asal origin yang tidak dikenali.

---

## 4. Pencegahan SQL Injection (SQL Injection Prevention)

SQL Injection dicegah 100% menggunakan pendekatan akses data terstruktur:

- **Supabase PostgREST Client**: Aplikasi tidak menulis atau mengeksekusi kueri SQL dalam bentuk string mentah yang digabung (concatenated strings). Interaksi database menggunakan SDK Supabase (`supabase.from().select()`) yang secara otomatis menggunakan kueri terparameterisasi (_parameterized queries_) di sisi server.
- **Stored Procedures & Triggers**: Logika database di sisi server (fungsi trigger PL/pgSQL) didefinisikan menggunakan parameter terikat yang aman dari manipulasi string masukan.

---

## 5. Keamanan Variabel Lingkungan (Secure Environment Variables)

Sistem memisahkan variabel lingkungan berdasarkan cakupan akses keamanan:

- **Kunci Publik (`NEXT_PUBLIC_`)**: Variabel seperti `NEXT_PUBLIC_SUPABASE_URL` dan `NEXT_PUBLIC_SUPABASE_ANON_KEY` aman dipublikasikan ke frontend karena dilindungi oleh aturan RLS database.
- **Kunci Rahasia (Server-Only)**: Kredensial sensitif seperti token API server-to-server atau `SUPABASE_SERVICE_ROLE_KEY` disimpan tanpa awalan `NEXT_PUBLIC_` agar tidak pernah terikut ke dalam bundel kode Javascript client-side.
- Berkas template konfigurasi disediakan secara aman di `.env.local.example` tanpa nilai asli.

---

## 6. Pembatasan Laju Permintaan (Rate Limiting)

Untuk menghindari serangan DDoS (Distributed Denial of Service) dan brute force pada form masuk akun:

- **API Gateway Rate Limiting**: Supabase API Gateway (Kong) secara default membatasi jumlah permintaan per IP untuk rute otentikasi (`/auth/v1/token`) guna menghindari serangan brute-force password.
- **Next.js Rate Limiting (Production Recommendation)**: Disarankan mengimplementasikan pembatasan laju kueri di level edge middleware Next.js menggunakan solusi seperti Redis (Upstash) untuk API Routes yang menerima data sensitif atau proses berat.

---

## 7. Sistem Jejak Audit Otomatis (Audit Logs Trail)

Untuk kepatuhan dan pelacakan aktivitas administrator, database dilengkapi pemicu audit otomatis yang berjalan di server (`supabase/migrations/003_admin_audit_triggers.sql`):

- **Audit Pengguna (User Audit)**: Setiap kali ada operasi `INSERT`, `UPDATE`, atau `DELETE` pada tabel `public.users` oleh admin atau staf TU, trigger `trg_user_audit` akan secara otomatis mencatat detail tindakan tersebut ke tabel `public.audit_logs`.
- **Audit Login (Sign-In Audit)**: Trigger `trg_user_login` mendeteksi pembaruan timestamp login (`last_sign_in_at`) pada auth schema dan otomatis merekam aktivitas masuk sesi administrator atau TU untuk kebutuhan forensik keamanan.

---

## 8. Keamanan Penyimpanan Berkas (Supabase Storage Security)

Untuk mendukung unggah file tugas mahasiswa dan bahan ajar dosen secara aman, sistem menerapkan integrasi objek penyimpanan (*Object Storage*) Supabase dengan spesifikasi keamanan berikut:

### 8.1 Manajemen Bucket Khusus
Sistem memisahkan ruang penyimpanan menjadi dua bucket terisolasi:
1. **`materials`**: Digunakan untuk menyimpan materi kuliah, slide presentasi, dan silabus yang diunggah oleh dosen.
2. **`submissions`**: Digunakan untuk menampung berkas jawaban tugas yang dikirim oleh mahasiswa.

### 8.2 Kebijakan RLS Penyimpanan (Storage RLS Policies)
Supabase Storage mengamankan bucket menggunakan aturan Row Level Security di tabel `storage.objects`:
- **Aturan Bucket `materials`**:
  - **Dosen & Admin (`INSERT`/`UPDATE`/`DELETE`)**: Diizinkan jika peran user dalam `public.users` adalah `dosen` atau `admin`.
  - **Mahasiswa (`SELECT`)**: Diizinkan membaca berkas materi jika telah terdaftar aktif di kelas terkait (`class_id` terdaftar di tabel `enrollments` milik mahasiswa).
- **Aturan Bucket `submissions`**:
  - **Mahasiswa (`INSERT`)**: Mahasiswa diizinkan mengunggah file jika status enrollment aktif di kelas penugasan tersebut, dan kolom nama file diawali dengan ID/NIM miliknya (`auth.uid() = owner_id`).
  - **Mahasiswa (`SELECT`/`UPDATE`/`DELETE` dilarang untuk file mahasiswa lain)**: Mahasiswa hanya diperbolehkan mengunduh atau mengubah berkas penugasannya sendiri (`auth.uid() = owner_id`). Mahasiswa dilarang keras mengakses berkas milik mahasiswa lain.
  - **Dosen & Admin (`SELECT`/`UPDATE`)**: Dosen pengampu kelas memiliki izin penuh untuk membaca seluruh berkas tugas yang dikirim oleh mahasiswa di kelasnya guna kebutuhan penilaian.

### 8.3 Signed URLs untuk Distribusi Berkas Aman
Guna mencegah akses langsung menggunakan alamat URL publik statis yang dapat ditebak (*insecure direct object reference / IDOR*):
- Seluruh file di dalam bucket `submissions` diatur bersifat **Private**.
- Aplikasi menggunakan API server-side Next.js untuk membuat **Signed URL** (URL bertanda tangan digital) dengan masa kedaluwarsa pendek (misal: 15 menit) hanya setelah memvalidasi kredensial session user yang sedang aktif. URL ini tidak dapat diakses lagi setelah waktu kadaluwarsa berlalu.
