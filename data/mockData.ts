import type {
  Module,
  Assignment,
  Submission,
  CalendarEvent,
  Announcement,
  Discussion,
  DiscussionReply,
} from "@/types/academic";

// Initial mock data
export const mockModules: Module[] = [
  // Pemrograman Web (CS-101)
  {
    id: "MOD-101-01",
    courseId: "CS-101",
    title: "Pengenalan Web Modern & HTML5",
    weekNo: 1,
    type: "pdf",
    contentUrl: "https://example.com/pdf/html5-intro.pdf",
    description: "Materi dasar arsitektur web dan elemen semantik HTML5.",
    isPublished: true,
  },
  {
    id: "MOD-101-02",
    courseId: "CS-101",
    title: "Dasar CSS3 & Layout Flexbox",
    weekNo: 2,
    type: "video",
    contentUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    description: "Video tutorial styling halaman web menggunakan CSS Flexbox.",
    isPublished: true,
  },
  {
    id: "MOD-101-03",
    courseId: "CS-101",
    title: "Responsive Web Design & Grid System",
    weekNo: 3,
    type: "ppt",
    contentUrl: "https://example.com/ppt/responsive-design.pptx",
    description: "Slide presentasi tentang media queries dan CSS Grid.",
    isPublished: true,
  },
  {
    id: "MOD-101-04",
    courseId: "CS-101",
    title: "Dasar JavaScript & DOM Manipulation",
    weekNo: 4,
    type: "video",
    contentUrl: "https://www.youtube.com/embed/y17RuWkW6M",
    description: "Belajar membuat halaman web interaktif dengan JavaScript.",
    isPublished: true,
  },
  // Basis Data (CS-102)
  {
    id: "MOD-102-01",
    courseId: "CS-102",
    title: "Konsep Dasar Basis Data & ERD",
    weekNo: 1,
    type: "pdf",
    contentUrl: "https://example.com/pdf/erd-concepts.pdf",
    description: "Dasar-dasar sistem basis data dan diagram hubungan entitas.",
    isPublished: true,
  },
  {
    id: "MOD-102-02",
    courseId: "CS-102",
    title: "Normalisasi Basis Data (1NF, 2NF, 3NF)",
    weekNo: 2,
    type: "ppt",
    contentUrl: "https://example.com/ppt/normalization.pptx",
    description: "Langkah-langkah menormalisasi database untuk mengurangi redundansi.",
    isPublished: true,
  },
];

export const mockAssignments: Assignment[] = [
  {
    id: "ASM-101-01",
    courseId: "CS-101",
    title: "Tugas 1: Membuat Halaman Portofolio Pribadi",
    description: `Buatlah sebuah website portofolio pribadi menggunakan HTML5 semantik dan CSS3 murni (tanpa framework). Website harus memiliki struktur yang baik, navigasi, bagian profil, portofolio karya, dan formulir kontak yang responsif.
    
    Kriteria Penilaian:
    1. Penggunaan elemen semantik HTML5 (header, nav, main, section, footer) - 30%
    2. Responsivitas layout (bisa dibuka dengan baik di mobile & desktop) - 30%
    3. Kreativitas & estetika styling CSS - 30%
    4. Kerapihan kode - 10%`,
    deadline: "2026-06-15T23:59:00",
    weightPct: 15,
    allowedFormats: ["zip", "html", "css"],
    maxSizeMb: 10,
  },
  {
    id: "ASM-101-02",
    courseId: "CS-101",
    title: "Tugas 2: Kalkulator Interaktif JavaScript",
    description: "Buat aplikasi kalkulator berbasis web menggunakan HTML, CSS, dan JavaScript DOM manipulation. Kalkulator harus mendukung operasi dasar matematika (+, -, *, /) serta fungsi clear.",
    deadline: "2026-06-25T23:59:00",
    weightPct: 20,
    allowedFormats: ["zip", "pdf"],
    maxSizeMb: 5,
  },
  {
    id: "ASM-102-01",
    courseId: "CS-102",
    title: "Tugas 1: Desain ERD Sistem E-Commerce",
    description: "Rancang ERD untuk sistem penjualan online (e-commerce). Tentukan entitas, atribut, primary key, foreign key, serta kardinalitas relasi antar entitas. Kumpulkan dalam format PDF.",
    deadline: "2026-06-18T23:59:00",
    weightPct: 15,
    allowedFormats: ["pdf"],
    maxSizeMb: 10,
  },
];

export const mockSubmissions: Submission[] = [
  {
    id: "SUB-001",
    assignmentId: "ASM-101-01",
    studentId: "STU-001",
    studentName: "Ahmad Fauzi",
    fileUrl: "portfolio_ahmad_fauzi.zip",
    submittedAt: "2026-06-05T14:30:00",
    isLate: false,
    version: 1,
    grade: 92,
    feedback: "Sangat bagus! Struktur HTML rapi, styling modern dan layout responsif di mobile. Tingkatkan lagi di bagian contrast rasio warnanya.",
    gradedAt: "2026-06-06T10:00:00",
  },
];

export const mockCalendarEvents: CalendarEvent[] = [
  {
    id: "EVT-001",
    title: "Deadline Tugas 1 Pemrograman Web",
    date: "2026-06-15T23:59:00",
    type: "task",
    courseId: "CS-101",
  },
  {
    id: "EVT-002",
    title: "Deadline Tugas 1 Basis Data",
    date: "2026-06-18T23:59:00",
    type: "task",
    courseId: "CS-102",
  },
  {
    id: "EVT-003",
    title: "Ujian Tengah Semester (UTS) Ganjil",
    date: "2026-07-06T08:00:00",
    type: "exam",
  },
  {
    id: "EVT-004",
    title: "Batas Akhir Pengisian KRS Susulan",
    date: "2026-06-12T16:00:00",
    type: "academic",
  },
];

export const mockAnnouncements: Announcement[] = [
  {
    id: "ANC-001",
    courseId: "CS-101",
    title: "Perkuliahan Minggu Ke-5 Daring Via Zoom",
    content: "Diberitahukan kepada seluruh mahasiswa TI-3A bahwa untuk pertemuan minggu ke-5 (JavaScript Lanjutan) akan dilaksanakan secara daring penuh menggunakan Zoom. Link meeting dapat dilihat di halaman detail course.",
    date: "2026-06-05T09:00:00",
    lecturerName: "Dr. Budi Santoso",
  },
  {
    id: "ANC-002",
    courseId: "CS-102",
    title: "Pengumuman Asistensi Praktikum Basis Data",
    content: "Bagi mahasiswa yang nilai tugas 1 di bawah 70 wajib mengikuti sesi asistensi tambahan bersama asisten laboratorium pada hari Jum'at pukul 13.00 di Lab RPL.",
    date: "2026-06-04T11:30:00",
    lecturerName: "Dr. Siti Rahmawati",
  },
];

export const mockDiscussions: Discussion[] = [
  {
    id: "DIS-001",
    courseId: "CS-101",
    title: "Tanya tentang Flexbox wrap vs CSS Grid",
    content: "Halo teman-teman dan Pak Budi, saya masih agak bingung kapan sebaiknya kita menggunakan flex-wrap pada Flexbox dibandingkan langsung memakai CSS Grid untuk layout grid responsif? Ada tips praktisnya?",
    authorName: "Ahmad Fauzi",
    repliesCount: 2,
    date: "2026-06-05T20:15:00",
    replies: [
      {
        id: "RPY-001",
        authorName: "Dr. Budi Santoso",
        content: "Pertanyaan bagus Ahmad. Secara singkat, Flexbox bersifat one-dimensional (baris saja ATAU kolom saja), cocok untuk komponen kecil atau deretan item. Sedangkan CSS Grid bersifat two-dimensional (baris DAN kolom sekaligus), cocok untuk layout makro halaman utama. Flexbox wrap baik jika ukuran item dinamis dan ingin melipat otomatis.",
        date: "2026-06-06T08:30:00",
      },
      {
        id: "RPY-002",
        authorName: "Siti Rahma",
        content: "Tambahan Ahmad, biasanya saya pakai Grid untuk layout layout besar (misal header, sidebar, main area), lalu di dalam main area kalau ada daftar kartu yang jumlahnya dinamis, saya pakai Flexbox wrap.",
        date: "2026-06-06T09:12:00",
      },
    ],
  },
];
