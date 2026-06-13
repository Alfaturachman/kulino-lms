'use client';

import { useState } from 'react';
import type { CalendarEvent } from '@/types/academic';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, CheckCircle, Trash2 } from 'lucide-react';

interface CalendarTabProps {
    eventsList: CalendarEvent[];
    onAddEvent: (data: {
        title: string;
        date: string;
        type: 'exam' | 'task' | 'academic';
    }) => void;
    onDeleteEvent: (id: string) => void;
}

export function CalendarTab({
    eventsList,
    onAddEvent,
    onDeleteEvent,
}: CalendarTabProps) {
    const [evtTitle, setEvtTitle] = useState('');
    const [evtDate, setEvtDate] = useState('2026-07-01T08:00');
    const [evtType, setEvtType] = useState<'exam' | 'task' | 'academic'>(
        'academic',
    );
    const [evtSuccessMessage, setEvtSuccessMessage] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!evtTitle) return;

        onAddEvent({
            title: evtTitle,
            date: new Date(evtDate).toISOString(),
            type: evtType,
        });
        setEvtTitle('');
        setEvtSuccessMessage(
            'Agenda baru berhasil didaftarkan di kalender akademik!',
        );
        setTimeout(() => setEvtSuccessMessage(''), 3000);
    };

    return (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="lg:col-span-2 space-y-4">
                <h3 className="text-[15px] font-bold text-ink">
                    Kalender Akademik Terdaftar
                </h3>
                <Card className="overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-[12px] border-collapse">
                            <thead>
                                <tr className="border-b border-border text-muted font-bold bg-surface2/60">
                                    <th className="p-3">Tanggal</th>
                                    <th className="p-3">
                                        Nama Agenda / Kegiatan
                                    </th>
                                    <th className="p-3">Tipe</th>
                                    <th className="p-3 text-right">Aksi</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border/60">
                                {eventsList.map((evt) => {
                                    const date = new Date(evt.date);
                                    return (
                                        <tr
                                            key={evt.id}
                                            className="hover:bg-surface2/30"
                                        >
                                            <td className="p-3 font-mono font-semibold">
                                                {date.toLocaleDateString(
                                                    'id-ID',
                                                    {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric',
                                                    },
                                                )}
                                            </td>
                                            <td className="p-3 font-bold text-ink">
                                                {evt.title}
                                            </td>
                                            <td className="p-3">
                                                <Badge
                                                    variant={
                                                        evt.type === 'exam'
                                                            ? 'red'
                                                            : evt.type ===
                                                                'task'
                                                              ? 'warn'
                                                              : 'blue'
                                                    }
                                                >
                                                    {evt.type}
                                                </Badge>
                                            </td>
                                            <td className="p-3 text-right">
                                                <button
                                                    onClick={() =>
                                                        onDeleteEvent(evt.id)
                                                    }
                                                    className="size-8 flex items-center justify-center rounded-lg text-danger hover:bg-red-50 cursor-pointer transition-colors"
                                                    title="Hapus"
                                                >
                                                    <Trash2 size={15} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </Card>
            </div>

            <Card className="p-5 h-fit space-y-4">
                <h3 className="text-[13px] font-bold text-ink uppercase tracking-wider pb-2 border-b border-border">
                    Tambah Agenda Akademik
                </h3>

                {evtSuccessMessage && (
                    <div className="bg-emerald-50 border border-emerald-100 text-emerald-800 p-3 rounded-lg text-[12px] flex items-center gap-2">
                        <CheckCircle size={16} className="text-success" />{' '}
                        {evtSuccessMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                        <Label htmlFor="evt-name">Nama Agenda</Label>
                        <Input
                            id="evt-name"
                            placeholder="Contoh: Rapat Dosen Semester Genap"
                            value={evtTitle}
                            onChange={(e) => setEvtTitle(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="evt-type">Tipe Agenda</Label>
                        <select
                            id="evt-type"
                            value={evtType}
                            onChange={(e) =>
                                setEvtType(
                                    e.target.value as
                                        | 'exam'
                                        | 'task'
                                        | 'academic',
                                )
                            }
                            className="w-full h-10 border border-border rounded-lg px-3 py-2 text-[13px] bg-white outline-none focus:border-iris-500 focus:ring-3 focus:ring-iris-500/10"
                        >
                            <option value="academic">Akademik</option>
                            <option value="exam">Ujian (UTS/UAS)</option>
                            <option value="task">
                                Batas Pengumpulan (Tenggat)
                            </option>
                        </select>
                    </div>
                    <div className="space-y-1.5">
                        <Label htmlFor="evt-date">Waktu Pelaksanaan</Label>
                        <Input
                            id="evt-date"
                            type="datetime-local"
                            value={evtDate}
                            onChange={(e) => setEvtDate(e.target.value)}
                            required
                        />
                    </div>
                    <Button
                        type="submit"
                        className="w-full gap-2 cursor-pointer"
                    >
                        <Plus size={15} /> Daftarkan Agenda
                    </Button>
                </form>
            </Card>
        </div>
    );
}
