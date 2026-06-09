# UI/UX Design System

## KULINO — Interface Specification & Design Guide

**Versi:** 1.1 | **Style:** Modern SaaS · Minimalis · Card-Based Flat 2.0

---

## 1. Design Philosophy

KULINO menggunakan pendekatan **"Soft SaaS Minimalism"** — tampilan bersih dan fungsional yang menonjolkan konten akademik tanpa distraksi visual. Prinsip utama:

> Setiap elemen memiliki tujuan. Tidak ada dekorasi tanpa makna.

### 6 Design Principles

| Prinsip               | Deskripsi                                                                    |
| --------------------- | ---------------------------------------------------------------------------- |
| **Clarity First**     | Setiap elemen UI harus memiliki tujuan jelas                                 |
| **Efficiency**        | Task utama (lihat materi, submit tugas) dapat diselesaikan dalam ≤ 3 klik    |
| **Mobile-First**      | Layout didesain untuk layar 375px terlebih dahulu, di-scale ke desktop       |
| **Consistent Rhythm** | Spacing 4px grid, radius konsisten, typescale harmonis                       |
| **Feedback Always**   | Setiap aksi user mendapat respons visual: loading, sukses, error, konfirmasi |
| **Inclusive Design**  | Contrast ratio ≥ 4.5:1, keyboard navigable, screen reader friendly, WCAG AA  |

---

## 2. Brand Color System

### Primary — Blue Iris

Bukan biru generik (#007bff / Bootstrap Blue). **Iris Blue** memiliki undertone violet yang lebih elegan dan membedakan KULINO dari platform generik.

| Shade   | Hex           | Penggunaan                      |
| ------- | ------------- | ------------------------------- |
| 50      | `#eef2ff`     | Background hover, subtle fill   |
| 100     | `#c5d5f8`     | Border biru, card outline       |
| 200     | `#8aaef1`     | Icon accent, decorative         |
| 300     | `#4d82e8`     | Secondary button hover          |
| **500** | **`#1a56db`** | **★ Primary CTA, active state** |
| 600     | `#1240b0`     | Button hover, link hover        |
| 800     | `#0c2e84`     | Dark text on light blue bg      |

### Semantic Colors

| Nama    | Hex       | Penggunaan                   |
| ------- | --------- | ---------------------------- |
| Success | `#059669` | Submitted, selesai, berhasil |
| Warning | `#d97706` | Deadline dekat, pending      |
| Danger  | `#dc2626` | Error, terlambat, hapus      |
| Accent  | `#7c3aed` | Tag ujian, badge khusus      |

### Neutral Colors

| Nama     | Hex       | Penggunaan        |
| -------- | --------- | ----------------- |
| Ink      | `#0d1117` | Body text utama   |
| Ink2     | `#374151` | Secondary text    |
| Muted    | `#6b7280` | Placeholder, hint |
| Hint     | `#9ca3af` | Label tersier     |
| Surface  | `#ffffff` | Background utama  |
| Surface2 | `#f8f9fc` | Card background   |
| Surface3 | `#f1f4fb` | Page background   |
| Border   | `#e5e9f2` | Border default    |

### Color Usage Rules

```
Latar belakang halaman  →  #ffffff
Surface card            →  #f8f9fc
CTA button primary      →  #1a56db
Button hover state      →  #1240b0
Icon accent             →  #4d82e8
Focus ring              →  rgba(26, 86, 219, 0.15)
```

---

## 3. Typography

### Font Families

| Peran                | Font    | Fallback               |
| -------------------- | ------- | ---------------------- |
| **Display & Body**   | DM Sans | system-ui, sans-serif  |
| **Monospace / Code** | DM Mono | Courier New, monospace |

### Type Scale

| Level   | Size | Weight | Line Height | Penggunaan                |
| ------- | ---- | ------ | ----------- | ------------------------- |
| Display | 32px | 600    | 1.2         | Hero, judul halaman utama |
| H1      | 20px | 600    | 1.3         | Page headings             |
| H2      | 15px | 500    | 1.4         | Section headings          |
| H3      | 13px | 600    | 1.4         | Card titles, sub-section  |
| Body    | 14px | 400    | 1.7         | Paragraf utama            |
| Small   | 12px | 400    | 1.6         | Caption, meta info        |
| Label   | 11px | 500    | 1.4         | Form labels, badge text   |
| Micro   | 10px | 500    | 1.3         | Tag, kode kecil           |
| Code    | 12px | 400    | 1.6         | ID teknis, kode (DM Mono) |

### Typography Rules

- Letter spacing Display: `-1px`, H1: `-0.3px`
- **Sentence case** di semua heading dan label
- Tidak menggunakan ALL CAPS kecuali label navigasi (letter-spacing 0.6px)
- Maksimal 2 font weight dalam satu halaman (400 & 600, atau 400 & 500)

---

## 4. Spacing System

Berbasis **4px grid**. Semua spacing adalah kelipatan 4.

| Token    | Value | Penggunaan                    |
| -------- | ----- | ----------------------------- |
| space-1  | 4px   | Gap antar ikon, micro spacing |
| space-2  | 8px   | Padding badge, gap inline     |
| space-3  | 12px  | Gap antar komponen kecil      |
| space-4  | 16px  | Padding card, gap grid        |
| space-5  | 20px  | Padding section               |
| space-6  | 24px  | Gap antar card                |
| space-7  | 28px  | Page content padding          |
| space-8  | 32px  | Section margin                |
| space-10 | 40px  | Antar major section           |

---

## 5. Border Radius

| Token       | Value  | Komponen                   |
| ----------- | ------ | -------------------------- |
| radius-xs   | 4px    | Badge, tag, kode inline    |
| radius-sm   | 8px    | Button, input, select      |
| radius-md   | 12px   | Card default, dropdown     |
| radius-lg   | 16px   | Card besar, modal, sheet   |
| radius-xl   | 20px   | Panel utama                |
| radius-full | 9999px | Pill badge, avatar, toggle |

---

## 6. Component Specifications

### Button

```
Primary:   bg #1a56db, text #fff, radius 8px, padding 9px 18px
Secondary: bg #fff, border 1.5px #d1d9ee, text #374151
Success:   bg #ecfdf5, border #a7f3d0, text #059669
Danger:    bg #fef2f2, border #fca5a5, text #dc2626
Ghost:     bg transparent, text #6b7280, hover bg #f8f9fc
Size SM:   font 12px, padding 7px 14px
Size MD:   font 13px, padding 9px 18px (default)
Size LG:   font 14px, padding 11px 22px
```

### Input / Form

```
Height:         40px
Padding:        10px 14px
Border:         1.5px solid #d1d9ee
Border radius:  8px
Focus border:   1.5px solid #1a56db
Focus ring:     0 0 0 3px rgba(26,86,219,0.1)
Font size:      13px
Placeholder:    color #9ca3af
Error state:    border #dc2626, ring rgba(220,38,38,0.1)
```

### Card

```
Background:     #ffffff
Border:         1px solid #e5e9f2
Border radius:  12px (default), 16px (large)
Padding:        16px 20px (default), 20px 24px (large)
Hover:          border-color #c5d5f8
Shadow:         none (flat design)
```

### Badge / Tag

```
Padding:     3px 9px
Border radius: 9999px (pill)
Font size:   11px
Font weight: 500

Blue:   bg #eef2ff, text #0c2e84
Green:  bg #ecfdf5, text #059669
Warn:   bg #fffbeb, text #d97706
Red:    bg #fef2f2, text #dc2626
Gray:   bg #f1f4fb, text #6b7280, border #e5e9f2
Purple: bg #f0edff, text #5b21b6
```

### Navigation Sidebar

```
Width:        260px
Background:   #ffffff
Border right: 1px solid #e5e9f2

Nav Item:
  Padding:      9px 10px
  Border radius: 8px
  Font size:    13px
  Color default: #6b7280
  Color active:  #0c2e84
  Bg active:     #eef2ff
  Hover bg:      #f8f9fc
```

### Course Card

```
Border radius:  16px
Thumbnail:      height 80px, emoji/illustration
Body padding:   12px
Title:          13px 600
Meta:           10px muted
Progress bar:   height 3px, bg #e5e9f2, fill #1a56db
```

---

## 7. Icon System

Menggunakan **Lucide React** sebagai icon library utama.

| Konteks          | Ukuran |
| ---------------- | ------ |
| Inline teks      | 14px   |
| Navigasi sidebar | 16px   |
| Card action      | 18px   |
| Hero / feature   | 24px   |
| Empty state      | 40px   |

**Stroke width:** 1.5–2px (konsisten)
**Color:** Inherit dari parent, atau gunakan token warna

---

## 8. Illustration Style (Flat 2.0)

- **Style:** Flat 2.0 — figur geometris sederhana dengan sedikit depth melalui warna
- **Palet:** Menggunakan color system yang sama (Iris Blue, soft tones)
- **Elemen:** Tidak ada bayangan realistik; boleh ada subtle shadow sebagai depth indicator
- **Tone:** Friendly, akademik, tidak terlalu playful
- **Penggunaan:** Empty states, onboarding, error pages, landing page

---

## 9. Responsive Breakpoints

| Breakpoint | Width           | Layout                      |
| ---------- | --------------- | --------------------------- |
| mobile     | 320px – 639px   | Single column, bottom nav   |
| tablet     | 640px – 1023px  | 2 column, sidebar collapsed |
| desktop    | 1024px – 1279px | Full sidebar + content      |
| wide       | 1280px+         | Max content width 1200px    |

### Mobile Adaptations

- Sidebar kolaps menjadi bottom navigation (5 icon utama)
- Card grid berubah dari 3-4 kolom ke 1-2 kolom
- Font size Display turun dari 32px ke 24px
- Touch target minimum 44×44px
- Padding halaman: 16px (mobile) vs 28px (desktop)

---

## 10. Animation & Motion

| Elemen             | Animasi                 | Durasi         |
| ------------------ | ----------------------- | -------------- |
| Page transition    | Fade + slide 8px        | 200ms ease     |
| Modal open         | Scale 0.96 → 1 + fade   | 180ms ease-out |
| Toast/Notification | Slide in dari kanan     | 250ms ease     |
| Button click       | Scale 0.97              | 100ms          |
| Sidebar item hover | Background fade         | 150ms          |
| Progress bar fill  | Width animate           | 400ms ease     |
| Skeleton loading   | Pulse shimmer           | 1.5s infinite  |
| Card hover         | Border color transition | 150ms          |

**Prinsip:** Animasi tidak boleh melebihi 300ms untuk interaksi, dan tidak boleh menghalangi aksi pengguna.

---

## 11. Page Layout Templates

### Student Dashboard

```
┌─────────────────────────────────────────────┐
│  Topbar (60px): Logo + Page Title + Actions │
├───────────┬─────────────────────────────────┤
│ Sidebar   │  Content Area                   │
│ (260px)   │  ┌─────────────────────────┐    │
│           │  │  Welcome + Stats Row    │    │
│ - Dashboard│  ├─────────────────────────┤    │
│ - Courses │  │  Course Cards Grid      │    │
│ - Tasks   │  ├─────────────────────────┤    │
│ - Calendar│  │  Upcoming Tasks + Notif │    │
│ - Forum   │  └─────────────────────────┘    │
│ - Grades  │                                 │
└───────────┴─────────────────────────────────┘
```

### Course Detail Page

```
┌───────────────────────────────────────────────┐
│  Course Header: Nama MK, Kelas, Semester       │
├────────────────┬──────────────────────────────┤
│ Info Panel     │  Tab: Materi / Tugas / Forum  │
│ - Kontrak      │  ─────────────────────────── │
│ - Dosen        │  Week Timeline (accordion)   │
│ - Komting      │  ─────────────────────────── │
│ - RPS PDF      │  Module / Assignment List    │
│ - Zoom Link    │                              │
└────────────────┴──────────────────────────────┘
```

---

## 12. Accessibility Checklist

- [x] Semua gambar memiliki `alt` text yang deskriptif
- [x] Semua form input memiliki `<label>` yang terhubung
- [x] Contrast ratio teks ≥ 4.5:1 (normal), ≥ 3:1 (large)
- [x] Focus ring terlihat jelas di semua interactive element
- [x] Keyboard navigable: Tab order logis, Enter untuk submit
- [x] ARIA labels untuk icon-only buttons
- [x] Skip-to-content link di awal halaman
- [x] Error messages terhubung dengan `aria-describedby`
- [x] Tidak ada informasi yang hanya disampaikan lewat warna
- [x] Animated content menghormati `prefers-reduced-motion`
