'use client';

import { useState, useCallback } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCircle, TriangleAlert, X } from 'lucide-react';

interface AlertModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    message: string;
    variant?: 'error' | 'success' | 'warning';
}

export function AlertModal({
    open,
    onOpenChange,
    title,
    message,
    variant = 'error',
}: AlertModalProps) {
    const iconMap = {
        error: AlertCircle,
        warning: AlertCircle,
        success: CheckCircle,
    };
    const Icon = iconMap[variant];
    const colorMap = {
        error:
            'bg-danger/10 text-danger border-danger/20',
        warning:
            'bg-amber-50 text-amber-700 border-amber-200',
        success:
            'bg-emerald-50 text-emerald-700 border-emerald-200',
    };
    const btnColorMap = {
        error: 'bg-danger text-white hover:bg-danger/90',
        warning: 'bg-amber-600 text-white hover:bg-amber-700',
        success: 'bg-emerald-600 text-white hover:bg-emerald-700',
    };

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/40 z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
                <Dialog.Content className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-sm rounded-xl bg-white p-6 shadow-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
                    <div className="flex flex-col items-center text-center gap-4">
                        <div
                            className={cn(
                                'size-12 rounded-full border flex items-center justify-center',
                                colorMap[variant],
                            )}
                        >
                            <Icon size={24} />
                        </div>

                        <div className="space-y-1.5">
                            <Dialog.Title className="text-[15px] font-bold text-ink">
                                {title}
                            </Dialog.Title>
                            <p className="text-[13px] text-ink2 leading-relaxed">
                                {message}
                            </p>
                        </div>

                        <Dialog.Close asChild>
                            <button
                                className={cn(
                                    'h-9 px-6 rounded-lg text-[13px] font-semibold cursor-pointer transition-colors',
                                    btnColorMap[variant],
                                )}
                            >
                                Tutup
                            </button>
                        </Dialog.Close>
                    </div>

                    <Dialog.Close asChild>
                        <button className="absolute top-3 right-3 size-7 flex items-center justify-center rounded-full text-muted hover:bg-surface2 cursor-pointer transition-colors">
                            <X size={16} />
                        </button>
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}

export function useAlert() {
    const [alert, setAlert] = useState<{
        title: string;
        message: string;
        variant?: 'error' | 'success' | 'warning';
    } | null>(null);

    const showError = useCallback(
        (message: string, title = 'Gagal') =>
            setAlert({ title, message, variant: 'error' }),
        [],
    );
    const showSuccess = useCallback(
        (message: string, title = 'Berhasil') =>
            setAlert({ title, message, variant: 'success' }),
        [],
    );
    const showWarning = useCallback(
        (message: string, title = 'Peringatan') =>
            setAlert({ title, message, variant: 'warning' }),
        [],
    );

    const AlertDialog = alert ? (
        <AlertModal
            open={!!alert}
            onOpenChange={() => setAlert(null)}
            title={alert.title}
            message={alert.message}
            variant={alert.variant}
        />
    ) : null;

    return { showError, showSuccess, showWarning, AlertDialog };
}

interface ConfirmModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    title: string;
    message: string;
    onConfirm: () => void;
    confirmLabel?: string;
    cancelLabel?: string;
    variant?: 'danger' | 'warning';
}

export function ConfirmModal({
    open,
    onOpenChange,
    title,
    message,
    onConfirm,
    confirmLabel = 'Ya, Hapus',
    cancelLabel = 'Batal',
    variant = 'danger',
}: ConfirmModalProps) {
    const colorMap = {
        danger:
            'bg-danger/10 text-danger border-danger/20',
        warning:
            'bg-amber-50 text-amber-700 border-amber-200',
    };
    const btnColorMap = {
        danger: 'bg-danger text-white hover:bg-danger/90',
        warning: 'bg-amber-600 text-white hover:bg-amber-700',
    };

    return (
        <Dialog.Root open={open} onOpenChange={onOpenChange}>
            <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 bg-black/40 z-50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
                <Dialog.Content className="fixed left-1/2 top-1/2 z-50 -translate-x-1/2 -translate-y-1/2 w-[90vw] max-w-sm rounded-xl bg-white p-6 shadow-2xl data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]">
                    <div className="flex flex-col items-center text-center gap-4">
                        <div
                            className={cn(
                                'size-12 rounded-full border flex items-center justify-center',
                                colorMap[variant],
                            )}
                        >
                            <TriangleAlert size={24} />
                        </div>

                        <div className="space-y-1.5">
                            <Dialog.Title className="text-[15px] font-bold text-ink">
                                {title}
                            </Dialog.Title>
                            <p className="text-[13px] text-ink2 leading-relaxed">
                                {message}
                            </p>
                        </div>

                        <div className="flex items-center gap-3 w-full">
                            <Dialog.Close asChild>
                                <button className="flex-1 h-9 rounded-lg text-[13px] font-semibold border border-border text-ink hover:bg-surface2 cursor-pointer transition-colors">
                                    {cancelLabel}
                                </button>
                            </Dialog.Close>
                            <button
                                onClick={() => {
                                    onConfirm();
                                    onOpenChange(false);
                                }}
                                className={cn(
                                    'flex-1 h-9 rounded-lg text-[13px] font-semibold cursor-pointer transition-colors',
                                    btnColorMap[variant],
                                )}
                            >
                                {confirmLabel}
                            </button>
                        </div>
                    </div>

                    <Dialog.Close asChild>
                        <button className="absolute top-3 right-3 size-7 flex items-center justify-center rounded-full text-muted hover:bg-surface2 cursor-pointer transition-colors">
                            <X size={16} />
                        </button>
                    </Dialog.Close>
                </Dialog.Content>
            </Dialog.Portal>
        </Dialog.Root>
    );
}

export function useConfirm() {
    const [confirm, setConfirm] = useState<{
        title: string;
        message: string;
        onConfirm: () => void;
        variant?: 'danger' | 'warning';
        confirmLabel?: string;
    } | null>(null);

    const showConfirm = useCallback(
        (
            message: string,
            onConfirm: () => void,
            title = 'Konfirmasi',
            variant: 'danger' | 'warning' = 'danger',
            confirmLabel = 'Ya, Hapus',
        ) => setConfirm({ title, message, onConfirm, variant, confirmLabel }),
        [],
    );

    const ConfirmDialog = confirm ? (
        <ConfirmModal
            open={!!confirm}
            onOpenChange={() => setConfirm(null)}
            title={confirm.title}
            message={confirm.message}
            onConfirm={confirm.onConfirm}
            variant={confirm.variant}
            confirmLabel={confirm.confirmLabel}
        />
    ) : null;

    return { showConfirm, ConfirmDialog };
}
