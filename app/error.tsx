"use client";

import { useEffect } from "react";
import { AlertCircle, RotateCcw, Home } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Unhandled Runtime Error:", error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface3 px-4 text-center font-sans">
      <div className="w-full max-w-md rounded-2xl border border-border bg-white p-8 shadow-sm">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-600">
          <AlertCircle size={28} />
        </div>
        
        <h1 className="text-xl font-bold tracking-tight text-ink mb-2">
          Terjadi Kesalahan Sistem
        </h1>
        
        <p className="text-[13px] text-muted leading-relaxed mb-6">
          Aplikasi mengalami kendala teknis saat memuat halaman ini. Silakan coba memuat ulang halaman atau kembali ke beranda.
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
          <Button
            onClick={() => reset()}
            className="flex items-center justify-center gap-2"
          >
            <RotateCcw size={14} />
            Coba Lagi
          </Button>
          
          <Link href="/" passHref legacyBehavior>
            <a className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-border px-4 py-2 text-[13px] font-medium text-ink bg-white hover:bg-surface2 transition-colors">
              <Home size={14} />
              Kembali ke Beranda
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}
