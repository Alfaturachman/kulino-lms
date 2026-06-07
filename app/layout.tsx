import type { Metadata } from 'next';
import { DM_Sans, DM_Mono } from 'next/font/google';
import './globals.css';

const dmSans = DM_Sans({
    variable: '--font-dm-sans',
    subsets: ['latin'],
    weight: ['400', '500', '600'],
});

const dmMono = DM_Mono({
    variable: '--font-dm-mono',
    subsets: ['latin'],
    weight: ['400', '500'],
});

export const metadata: Metadata = {
    title: 'KULINO — Kuliah Online | Learning Management System',
    description:
        'KULINO (Kuliah Online) adalah Learning Management System (LMS) modern untuk kegiatan belajar-mengajar, pengumpulan tugas, dan absensi secara daring.',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html
            lang="id"
            className={`${dmSans.variable} ${dmMono.variable} h-full antialiased`}
        >
            <body className="min-h-full">{children}</body>
        </html>
    );
}
