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
| Role-based access control                  | 5 Peran   | Guest, Mahasiswa, Dosen, TU, Admin |
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
- **Kebutuhan:** Tools untuk upload materi, kelola assignment, grade submission, dan monitor keaktifan mahasiswa secara efisien tanpa pembelajaran teknis yang panjang.
- **Prioritas:** High

### Staff TU & Kepala TU

- **Peran:** Operator & administrator sistem
- **Kebutuhan:** Kemampuan manajemen kelas, distribusi dosen, manajemen user, dan laporan statistik akademik untuk keperluan administratif semester.
- **Prioritas:** Medium

---

## 4. Business Requirements

| ID    | Kebutuhan Bisnis                                                              | Prioritas   | Kategori       |
| ----- | ----------------------------------------------------------------------------- | ----------- | -------------- |
| BR-01 | Platform harus mendukung alur akademik semester penuh (14 minggu + UTS + UAS) | Must Have   | Academic       |
| BR-02 | Sistem role-based access untuk 5 tipe pengguna dengan hak yang berbeda        | Must Have   | Access Control |
| BR-03 | Dukungan asynchronous learning — materi dapat diakses kapan saja              | Must Have   | Learning Model |
| BR-04 | Sistem notifikasi deadline untuk mengurangi keterlambatan pengumpulan tugas   | Should Have | Engagement     |
| BR-05 | Dashboard analytics untuk monitoring performa akademik mahasiswa dan dosen    | Should Have | Reporting      |
| BR-06 | Responsive design untuk akses mobile (smartphone mahasiswa)                   | Must Have   | Accessibility  |
| BR-07 | Kontrak kuliah digital & RPS dapat diakses langsung di halaman mata kuliah    | Should Have | Academic       |
| BR-08 | Forum diskusi per mata kuliah sebagai pengganti sesi tanya jawab tatap muka   | Should Have | Collaboration  |

---

## 5. Success Metrics & KPI

| KPI               | Target                                       |
| ----------------- | -------------------------------------------- |
| Adoption Rate     | ≥ 90% mahasiswa aktif login per minggu       |
| Submission Rate   | ≥ 80% pengumpulan tugas tepat waktu          |
| User Satisfaction | ≥ 4.0 / 5.0 rata-rata skor kepuasan pengguna |

---

## 6. Constraints & Assumptions

### Constraints

- Prototype frontend-only — tidak ada backend produksi di fase ini
- Budget terbatas — open-source stack: Next.js
- Timeline 3 bulan — prototype siap untuk demo portfolio

### Assumptions

- Pengguna memiliki koneksi internet stabil (minimal 3G untuk akses mobile)
- Data akademik tersedia dan digunakan sebagai mock/dummy data
- Single-tenant deployment untuk satu institusi di fase awal
