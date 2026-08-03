# Business Requirements Document (BRD)

## KULINO — Learning Management System

**Versi:** 1.0 | **Tanggal:** Desember 2025 | **Status:** Approved

---

## 1. Latar Belakang & Konteks Bisnis

**Problem Statement:**
Institusi pendidikan tinggi menghadapi keterbatasan infrastruktur pembelajaran digital yang menyebabkan proses belajar mengajar tidak terstruktur, distribusi materi tidak merata, dan pemantauan progress mahasiswa tidak efisien. Sistem konvensional berbasis tatap muka dan WhatsApp Group tidak mampu mengakomodasi skala ratusan mahasiswa secara bersamaan dengan standar akademik yang konsisten.

---

## 2. Business Goals & Objectives

| Metrik                                     | Target    | Keterangan                         |
| ------------------------------------------ | --------- | ---------------------------------- |
| Tingkat partisipasi aktif mahasiswa        | 85%       | Naik dari 60% saat ini             |
| Digitalisasi distribusi materi & penugasan | 100%      | Paperless workflow                 |
| Role-based access control                  | 4 Peran + Visitor | Mahasiswa, Dosen, TU, Admin + pengunjung anonim |
| Waktu loading halaman rata-rata            | < 3 detik | Performance target                 |

---

## 3. Stakeholder Map

### Mahasiswa (Primary User)

- **Peran:** End-user aktif platform
- **Kebutuhan:** Akses mudah ke materi kuliah, tracking progress, submission tugas, dan jadwal akademik yang jelas.
- **Frekuensi Penggunaan:** 3–5 kali per minggu per mata kuliah
- **Prioritas:** High

### Dosen Pengampu

- **Peran:** Content creator & evaluator
- **Kebutuhan:** Tools untuk upload materi, kelola penilaian (tugas/UTS/UAS), grade submission, dan monitor keaktifan mahasiswa secara efisien tanpa pembelajaran teknis yang panjang.
- **Prioritas:** High

### Staff TU & Kepala TU

- **Peran:** Operator & administrator sistem
- **Kebutuhan:** Kemampuan manajemen kelas, distribusi dosen, manajemen user, dan laporan statistik akademik untuk keperluan administratif semester.
- **Prioritas:** Medium

### Super Admin / System Administrator

- **Peran:** Pengelola infrastruktur & keamanan sistem
- **Kebutuhan:** Pengawasan audit trail aktivitas pengguna, pengelolaan kredensial akun, mitigasi insiden keamanan, serta ekspor laporan akademik kumulatif.
- **Prioritas:** High

---

## 4. Business Requirements

| ID    | Kebutuhan Bisnis                                                              | Prioritas   | Kategori       |
| ----- | ----------------------------------------------------------------------------- | ----------- | -------------- |
| BR-01 | Platform harus mendukung alur akademik semester penuh (14 minggu materi + 1 UTS + 1 UAS = 16 slot) | Must Have   | Academic       |
| BR-02 | Sistem role-based access untuk 4 tipe pengguna ber-akun dengan hak yang berbeda; pengunjung anonim tanpa akses rute terproteksi        | Must Have   | Access Control |
| BR-03 | Dukungan asynchronous learning — materi dapat diakses kapan saja              | Must Have   | Learning Model |
| BR-04 | Sistem notifikasi deadline untuk mengurangi keterlambatan pengumpulan tugas   | Should Have | Engagement     |
| BR-05 | Dashboard analytics untuk monitoring performa akademik mahasiswa dan dosen    | Should Have | Reporting      |
| BR-06 | Responsive design untuk akses mobile (smartphone mahasiswa)                   | Must Have   | Accessibility  |
| BR-07 | Kontrak kuliah digital & RPS dapat diakses langsung di halaman mata kuliah    | Should Have | Academic       |
| BR-08 | Forum diskusi per mata kuliah sebagai pengganti sesi tanya jawab tatap muka   | Should Have | Collaboration  |
| BR-09 | Integrasi Computer-Based Testing (CBT) untuk ujian online UTS dan UAS         | Must Have   | Assessment     |
| BR-10 | Sistem Jejak Audit (Audit Logs) untuk mencatat seluruh aksi administratif     | Must Have   | Security       |

---

## 5. Success Metrics & KPI

| KPI               | Target                                       | Cara Pengukuran |
| ----------------- | -------------------------------------------- | --------------- |
| Adoption Rate     | ≥ 90% mahasiswa aktif login per minggu       | Logs Analytics |
| Submission Rate   | ≥ 80% pengumpulan tugas tepat waktu          | Database Report |
| User Satisfaction | ≥ 4.0 / 5.0 rata-rata skor kepuasan pengguna | Survey SUS      |
| System Uptime     | ≥ 99.5% per bulan                            | Health Check    |

---

## 6. Risk Assessment & Mitigation

| Risiko | Tingkat | Dampak | Strategi Mitigasi |
| :--- | :--- | :--- | :--- |
| Kegagalan Server saat Peak Hours | High | Mahasiswa tidak dapat submit tugas | Container scaling & Standalone Next.js build |
| Kebocoran Data Sesi Pengguna | Critical | Akses tidak sah ke akun lain | Cookie HTTP-Only Secure & Middleware JWT Verification |
| Kehilangan File Tugas | High | Jawaban mahasiswa hilang | Supabase Private Storage & Signed URLs |

---

## 7. Constraints & Assumptions

### Constraints

- Prototype frontend-only & hybrid Supabase cloud backend
- Open-source stack: Next.js 16, React 19, Tailwind v4
- Timeline pengembangan dan deployment terstruktur

### Assumptions

- Pengguna memiliki koneksi internet stabil (minimal 3G untuk akses mobile)
- Data akademik tersedia dan digunakan sebagai mock/dummy data saat offline
- Single-tenant deployment untuk institusi universitas di fase awal
