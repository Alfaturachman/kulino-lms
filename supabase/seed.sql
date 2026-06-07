-- Seed data untuk KULINO LMS

-- 1. Menyisipkan Dosen ke tabel users
INSERT INTO public.users (id, name, email, password, nim_nip, role) VALUES
('d101d101-d101-d101-d101-d101d101d101', 'Dr. Budi Santoso', 'budi.santoso@dsn.dinus.ac.id', 'hashed_by_supabase_auth', '197608242001121002', 'dosen'),
('d102d102-d102-d102-d102-d102d102d102', 'Dr. Siti Rahmawati', 'siti.rahmawati@dsn.dinus.ac.id', 'hashed_by_supabase_auth', '198203112008032001', 'dosen'),
('d103d103-d103-d103-d103-d103d103d103', 'Dr. Ahmad Hidayat', 'ahmad.hidayat@dsn.dinus.ac.id', 'hashed_by_supabase_auth', '197905152003121001', 'dosen'),
('d104d104-d104-d104-d104-d104d104d104', 'Dr. Dewi Lestari', 'dewi.lestari@dsn.dinus.ac.id', 'hashed_by_supabase_auth', '198511222010122002', 'dosen'),
('d105d105-d105-d105-d105-d105d105d105', 'Dr. Rudi Hartono', 'rudi.hartono@dsn.dinus.ac.id', 'hashed_by_supabase_auth', '198007142005011003', 'dosen')
ON CONFLICT (id) DO NOTHING;

-- 2. Menyisipkan Data Mata Kuliah (Courses)
INSERT INTO public.courses (id, name, code, class_name, semester, sks, lecturer_id, description, status) VALUES
('c101c101-c101-c101-c101-c101c101c101', 'Pemrograman Web', 'TI301', 'TI-3A', 'Semester Ganjil 2025/2026', 3, 'd101d101-d101-d101-d101-d101d101d101', 'Mata kuliah ini membahas pengembangan aplikasi web modern menggunakan HTML, CSS, JavaScript, dan framework terkini. Mencakup frontend dan backend development.', 'active'),
('c102c102-c102-c102-c102-c102c102c102', 'Basis Data', 'TI202', 'TI-3A', 'Semester Ganjil 2025/2026', 3, 'd102d102-d102-d102-d102-d102d102d102', 'Perancangan dan implementasi basis data relasional. Meliputi ERD, SQL, normalisasi, dan optimasi query.', 'active'),
('c103c103-c103-c103-c103-c103c103c103', 'Struktur Data & Algoritma', 'TI203', 'TI-3A', 'Semester Ganjil 2025/2026', 4, 'd103d103-d103-d103-d103-d103d103d103', 'Kajian mendalam tentang struktur data linear dan non-linear, algoritma sorting, searching, dan kompleksitas waktu.', 'active'),
('c104c104-c104-c104-c104-c104c104c104', 'Jaringan Komputer', 'TI304', 'TI-3B', 'Semester Ganjil 2025/2026', 3, 'd104d104-d104-d104-d104-d104d104d104', 'Konsep dasar jaringan komputer, model OSI dan TCP/IP, routing, subnetting, dan keamanan jaringan.', 'active'),
('c105c105-c105-c105-c105-c105c105c105', 'Sistem Operasi', 'TI205', 'TI-3B', 'Semester Ganjil 2025/2026', 3, 'd105d105-d105-d105-d105-d105d105d105', 'Manajemen proses, memory management, file system, I/O, dan konsep deadlock pada sistem operasi modern.', 'active'),
('c106c106-c106-c106-c106-c106c106c106', 'Rekayasa Perangkat Lunak', 'TI306', 'TI-3A', 'Semester Ganjil 2025/2026', 3, 'd101d101-d101-d101-d101-d101d101d101', 'Metodologi pengembangan perangkat lunak dari requirements hingga maintenance. Mencakup SDLC, UML, dan agile development.', 'active'),
('c107c107-c107-c107-c107-c107c107c107', 'Matematika Diskrit', 'TI107', 'TI-3A', 'Semester Ganjil 2025/2026', 3, 'd103d103-d103-d103-d103-d103d103d103', 'Logika matematika, teori himpunan, kombinatorika, graf, dan aplikasinya dalam ilmu komputer.', 'completed'),
('c108c108-c108-c108-c108-c108c108c108', 'Praktikum Pemrograman Web', 'TI311', 'TI-3A', 'Semester Ganjil 2025/2026', 1, 'd101d101-d101-d101-d101-d101d101d101', 'Praktikum implementasi teknologi web secara langsung dengan studi kasus nyata.', 'active')
ON CONFLICT (id) DO NOTHING;

-- 3. Menyisipkan Data Modul (Modules)
INSERT INTO public.modules (id, course_id, title, week_no, type, content_url, description, is_published) VALUES
('m10101-01-01-01-010101010101', 'c101c101-c101-c101-c101-c101c101c101', 'Pengenalan Web Modern & HTML5', 1, 'pdf', 'https://example.com/pdf/html5-intro.pdf', 'Materi dasar arsitektur web dan elemen semantik HTML5.', true),
('m10102-02-02-02-020202020202', 'c101c101-c101-c101-c101-c101c101c101', 'Dasar CSS3 & Layout Flexbox', 2, 'video', 'https://www.youtube.com/embed/dQw4w9WgXcQ', 'Video tutorial styling halaman web menggunakan CSS Flexbox.', true),
('m10103-03-03-03-030303030303', 'c101c101-c101-c101-c101-c101c101c101', 'Responsive Web Design & Grid System', 3, 'ppt', 'https://example.com/ppt/responsive-design.pptx', 'Slide presentasi tentang media queries dan CSS Grid.', true),
('m10104-04-04-04-040404040404', 'c101c101-c101-c101-c101-c101c101c101', 'Dasar JavaScript & DOM Manipulation', 4, 'video', 'https://www.youtube.com/embed/y17RuWkW6M', 'Belajar membuat halaman web interaktif dengan JavaScript.', true),
('m10201-01-01-01-010101010101', 'c102c102-c102-c102-c102-c102c102c102', 'Konsep Dasar Basis Data & ERD', 1, 'pdf', 'https://example.com/pdf/erd-concepts.pdf', 'Dasar-dasar sistem basis data dan diagram hubungan entitas.', true),
('m10202-02-02-02-020202020202', 'c102c102-c102-c102-c102-c102c102c102', 'Normalisasi Basis Data (1NF, 2NF, 3NF)', 2, 'ppt', 'https://example.com/ppt/normalization.pptx', 'Langkah-langkah menormalisasi database untuk mengurangi redundansi.', true)
ON CONFLICT (id) DO NOTHING;

-- 4. Menyisipkan Data Tugas (Assignments)
INSERT INTO public.assignments (id, course_id, title, description, deadline, weight_pct, allowed_formats, max_size_mb) VALUES
('a10101-01-01-01-010101010101', 'c101c101-c101-c101-c101-c101c101c101', 'Tugas 1: Membuat Halaman Portofolio Pribadi', 'Buatlah sebuah website portofolio pribadi menggunakan HTML5 semantik dan CSS3 murni (tanpa framework). Website harus memiliki struktur yang baik, navigasi, bagian profil, portofolio karya, dan formulir kontak yang responsif. Kriteria Penilaian: 1. Penggunaan elemen semantik HTML5 - 30%. 2. Responsivitas layout - 30%. 3. Kreativitas & estetika styling CSS - 30%. 4. Kerapihan kode - 10%', '2026-06-15 23:59:00', 15, ARRAY['zip', 'html', 'css'], 10),
('a10102-02-02-02-020202020202', 'c101c101-c101-c101-c101-c101c101c101', 'Tugas 2: Kalkulator Interaktif JavaScript', 'Buat aplikasi kalkulator berbasis web menggunakan HTML, CSS, dan JavaScript DOM manipulation. Kalkulator harus mendukung operasi dasar matematika (+, -, *, /) serta fungsi clear.', '2026-06-25 23:59:00', 20, ARRAY['zip', 'pdf'], 5),
('a10201-01-01-01-010101010101', 'c102c102-c102-c102-c102-c102c102c102', 'Tugas 1: Desain ERD Sistem E-Commerce', 'Rancang ERD untuk sistem penjualan online (e-commerce). Tentukan entitas, atribut, primary key, foreign key, serta kardinalitas relasi antar entitas. Kumpulkan dalam format PDF.', '2026-06-18 23:59:00', 15, ARRAY['pdf'], 10)
ON CONFLICT (id) DO NOTHING;

-- 5. Menyisipkan Agenda (Calendar Events)
INSERT INTO public.calendar_events (id, title, date, type, course_id) VALUES
('e001e001-e001-e001-e001-e001e001e001', 'Deadline Tugas 1 Pemrograman Web', '2026-06-15 23:59:00', 'task', 'c101c101-c101-c101-c101-c101c101c101'),
('e002e002-e002-e002-e002-e002e002e002', 'Deadline Tugas 1 Basis Data', '2026-06-18 23:59:00', 'task', 'c102c102-c102-c102-c102-c102c102c102'),
('e003e003-e003-e003-e003-e003e003e003', 'Ujian Tengah Semester (UTS) Ganjil', '2026-07-06 08:00:00', 'exam', NULL),
('e004e004-e004-e004-e004-e004e004e004', 'Batas Akhir Pengisian KRS Susulan', '2026-06-12 16:00:00', 'academic', NULL)
ON CONFLICT (id) DO NOTHING;

-- 6. Menyisipkan Pengumuman (Announcements)
INSERT INTO public.announcements (id, course_id, title, content, date) VALUES
('n001n001-n001-n001-n001-n001n001n001', 'c101c101-c101-c101-c101-c101c101c101', 'Perkuliahan Minggu Ke-5 Daring Via Zoom', 'Diberitahukan kepada seluruh mahasiswa TI-3A bahwa untuk pertemuan minggu ke-5 (JavaScript Lanjutan) akan dilaksanakan secara daring penuh menggunakan Zoom. Link meeting dapat dilihat di halaman detail course.', '2026-06-05 09:00:00'),
('n002n002-n002-n002-n002-n002n002n002', 'c102c102-c102-c102-c102-c102c102c102', 'Pengumuman Asistensi Praktikum Basis Data', 'Bagi mahasiswa yang nilai tugas 1 di bawah 70 wajib mengikuti sesi asistensi tambahan bersama asisten laboratorium pada hari Jum''at pukul 13.00 di Lab RPL.', '2026-06-04 11:30:00')
ON CONFLICT (id) DO NOTHING;

-- 7. Menyisipkan Diskusi (Discussions)
INSERT INTO public.discussions (id, course_id, title, content, author_name, date) VALUES
('d001d001-d001-d001-d001-d001d001d001', 'c101c101-c101-c101-c101-c101c101c101', 'Tanya tentang Flexbox wrap vs CSS Grid', 'Halo teman-teman dan Pak Budi, saya masih agak bingung kapan sebaiknya kita menggunakan flex-wrap pada Flexbox dibandingkan langsung memakai CSS Grid untuk layout grid responsif? Ada tips praktisnya?', 'Ahmad Fauzi', '2026-06-05 20:15:00')
ON CONFLICT (id) DO NOTHING;

-- 8. Menyisipkan Balasan Diskusi (Discussion Replies)
INSERT INTO public.discussion_replies (id, discussion_id, author_name, content, date) VALUES
('r001r001-r001-r001-r001-r001r001r001', 'd001d001-d001-d001-d001-d001d001d001', 'Dr. Budi Santoso', 'Pertanyaan bagus Ahmad. Secara singkat, Flexbox bersifat one-dimensional (baris saja ATAU kolom saja), cocok untuk komponen kecil atau deretan item. Sedangkan CSS Grid bersifat two-dimensional (baris DAN kolom sekaligus), cocok untuk layout makro halaman utama. Flexbox wrap baik jika ukuran item dinamis dan ingin melipat otomatis.', '2026-06-06 08:30:00'),
('r002r002-r002-r002-r002-r002r002r002', 'd001d001-d001-d001-d001-d001d001d001', 'Siti Rahma', 'Tambahan Ahmad, biasanya saya pakai Grid untuk layout layout besar (misal header, sidebar, main area), lalu di dalam main area kalau ada daftar kartu yang jumlahnya dinamis, saya pakai Flexbox wrap.', '2026-06-06 09:12:00')
ON CONFLICT (id) DO NOTHING;
