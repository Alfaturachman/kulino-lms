'use client';

import { Card } from '@/components/ui/card';
import { Label } from '@/components/ui/label';

interface SettingsTabProps {
    maintenanceMode: boolean;
    studentRegistration: boolean;
    ldapSync: boolean;
    onChangeMaintenance: (v: boolean) => void;
    onChangeRegistration: (v: boolean) => void;
    onChangeLdap: (v: boolean) => void;
}

export function SettingsTab({
    maintenanceMode,
    studentRegistration,
    ldapSync,
    onChangeMaintenance,
    onChangeRegistration,
    onChangeLdap,
}: SettingsTabProps) {
    return (
        <Card className="p-6 space-y-6">
            <h3 className="text-[15px] font-bold text-ink border-b border-border pb-3">
                Pengaturan Konfigurasi Sistem
            </h3>
            <div className="space-y-6">
                <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                        <Label className="text-[13px] font-bold text-ink">
                            Mode Pemeliharaan (Maintenance Mode)
                        </Label>
                        <p className="text-[11px] text-muted max-w-lg leading-relaxed">
                            Jika diaktifkan, pengguna umum (mahasiswa, dosen,
                            TU) tidak dapat mengakses portal kuliner kecuali
                            user dengan peran Super Admin.
                        </p>
                    </div>
                    <input
                        type="checkbox"
                        checked={maintenanceMode}
                        onChange={(e) => onChangeMaintenance(e.target.checked)}
                        className="size-5 text-iris-600 rounded border-border focus:ring-iris-500 cursor-pointer"
                    />
                </div>

                <div className="flex items-start justify-between gap-4 border-t border-border pt-6">
                    <div className="space-y-1">
                        <Label className="text-[13px] font-bold text-ink">
                            Sinkronisasi Server LDAP Udinus
                        </Label>
                        <p className="text-[11px] text-muted max-w-lg leading-relaxed">
                            Sinkronisasikan kredensial user, program studi, dan
                            KRS secara berkala dengan server database pusat
                            Universitas Dian Nuswantoro.
                        </p>
                    </div>
                    <input
                        type="checkbox"
                        checked={ldapSync}
                        onChange={(e) => onChangeLdap(e.target.checked)}
                        className="size-5 text-iris-600 rounded border-border focus:ring-iris-500 cursor-pointer"
                    />
                </div>
            </div>
        </Card>
    );
}
