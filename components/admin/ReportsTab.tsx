'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Activity, Download } from 'lucide-react';

interface ReportsTabProps {
    onExport: (reportType: string) => void;
}

export function ReportsTab({ onExport }: ReportsTabProps) {
    return (
        <div className="space-y-6">
            <h3 className="text-[15px] font-bold text-ink">
                Pusat Laporan Akademik
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className="p-6 space-y-4 flex flex-col justify-between">
                    <div>
                        <h4 className="text-[14px] font-bold text-ink leading-snug flex items-center gap-2">
                            <FileText size={18} className="text-iris-500" />{' '}
                            Laporan Indeks Nilai Mahasiswa (Gradebook)
                        </h4>
                        <p className="text-[12px] text-muted leading-relaxed mt-2">
                            Ekspor rekapitulasi nilai mahasiswa di seluruh mata
                            kuliah semester ini dalam format berkas PDF
                            terstruktur untuk keperluan arsip fakultas.
                        </p>
                    </div>
                    <Button
                        onClick={() => onExport('Gradebook')}
                        className="gap-2 w-full mt-4 cursor-pointer"
                    >
                        <Download size={14} /> Generate & Ekspor Laporan
                    </Button>
                </Card>
                <Card className="p-6 space-y-4 flex flex-col justify-between">
                    <div>
                        <h4 className="text-[14px] font-bold text-ink leading-snug flex items-center gap-2">
                            <Activity size={18} className="text-success" />{' '}
                            Laporan Statistik Penggunaan Server
                        </h4>
                        <p className="text-[12px] text-muted leading-relaxed mt-2">
                            Unduh ringkasan log engagement mahasiswa, durasi
                            sesi rata-rata, dan statistik lalu lintas request
                            server KULINO.
                        </p>
                    </div>
                    <Button
                        onClick={() => onExport('Statistik Server')}
                        className="gap-2 w-full mt-4 cursor-pointer"
                    >
                        <Download size={14} /> Generate & Ekspor Laporan
                    </Button>
                </Card>
            </div>
        </div>
    );
}
