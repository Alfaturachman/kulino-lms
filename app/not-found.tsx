import Link from "next/link";
import { FileQuestion, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-surface3 px-4 text-center font-sans">
      <div className="w-full max-w-md rounded-2xl border border-border bg-white p-8 shadow-sm">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-amber-50 text-amber-600">
          <FileQuestion size={28} />
        </div>

        <h1 className="text-xl font-bold tracking-tight text-ink mb-2">
          Halaman Tidak Ditemukan
        </h1>

        <p className="text-[13px] text-muted leading-relaxed mb-6">
          Halaman yang Anda cari tidak tersedia atau telah dipindahkan.
          Periksa kembali URL atau kembali ke beranda.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-border px-4 py-2 text-[13px] font-medium text-ink bg-white hover:bg-surface2 transition-colors"
          >
            <Home size={14} />
            Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
