'use client';

import { useEffect } from 'react';
import { AlertCircle, RotateCcw, Home } from 'lucide-react';
import { DM_Sans, DM_Mono } from 'next/font/google';
import { captureError } from '@/lib/errors';

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

export default function GlobalError({
    error,
    unstable_retry,
}: {
    error: Error & { digest?: string };
    unstable_retry: () => void;
}) {
  useEffect(() => {
    captureError(error, { source: "global-error.tsx" });
  }, [error]);

    return (
        <html
            lang="id"
            className={`${dmSans.variable} ${dmMono.variable} h-full antialiased`}
        >
            <body className="flex min-h-screen flex-col items-center justify-center bg-surface3 px-4 text-center font-sans">
                <div className="w-full max-w-md rounded-2xl border border-border bg-white p-8 shadow-sm">
                    <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
                        <AlertCircle size={28} />
                    </div>

                    <h1 className="text-xl font-bold tracking-tight text-ink mb-2">
                        Terjadi Kesalahan Sistem
                    </h1>

                    <p className="text-[13px] text-muted leading-relaxed mb-6">
                        Aplikasi mengalami kendala teknis yang tidak dapat
                        dipulihkan. Silakan coba memuat ulang halaman.
                    </p>

                    {error.message && (
                        <div className="mb-6 rounded-lg bg-surface2 p-3 text-left border border-border/60">
                            <span className="block text-[10px] uppercase tracking-wider font-semibold text-muted mb-1">
                                Detail Error:
                            </span>
                            <code className="block text-[11px] font-mono text-red-600 break-all whitespace-pre-wrap">
                                {error.message}
                            </code>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <button
                            onClick={() => unstable_retry()}
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-iris-500 px-4 py-2 text-[13px] font-medium text-white hover:bg-iris-600 transition-colors cursor-pointer"
                        >
                            <RotateCcw size={14} />
                            Coba Lagi
                        </button>

                        <a
                            href="/"
                            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-border px-4 py-2 text-[13px] font-medium text-ink bg-white hover:bg-surface2 transition-colors"
                        >
                            <Home size={14} />
                            Kembali ke Beranda
                        </a>
                    </div>
                </div>
            </body>
        </html>
    );
}
