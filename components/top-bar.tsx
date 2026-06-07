'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import { ChevronDown, LogOut } from 'lucide-react';

export function TopBar() {
    const router = useRouter();
    const { user, isAuthenticated, logout } = useAuthStore();
    const [isOpen, setIsOpen] = useState(false);

    function handleLogout() {
        logout();
        router.push('/');
    }

    if (!isAuthenticated || !user) return null;

    const userInitials = user.name
        ? user.name
              .split(' ')
              .map((n) => n[0])
              .join('')
              .slice(0, 2)
              .toUpperCase()
        : 'U';

    return (
        <header className="flex h-14 items-center justify-between border-b border-border bg-surface px-6">
            <div className="flex items-center gap-2">
                <span
                    className="text-[18px] font-black tracking-[0.05em] text-[#005695] select-none font-sans"
                    style={
                        {
                            fontWeight: 900,
                            WebkitTextStroke: '1px #005695',
                            textStroke: '1px #005695',
                        } as any
                    }
                >
                    KULINO
                </span>
            </div>

            <div className="relative">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center gap-2 rounded-full p-1.5 hover:bg-surface2 transition-colors cursor-pointer select-none focus:outline-hidden"
                >
                    <div className="flex size-8 items-center justify-center rounded-full bg-iris-100 text-iris-700 font-bold text-[12px]">
                        {userInitials}
                    </div>
                    <span className="hidden sm:inline text-[12px] font-medium text-ink pr-1">
                        {user.name}
                    </span>
                    <ChevronDown size={14} className="text-muted" />
                </button>

                {isOpen && (
                    <>
                        {/* Backdrop to close when clicking outside */}
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Dropdown Pop-up */}
                        <div className="absolute right-0 mt-2 w-56 rounded-lg border border-border bg-surface p-3 shadow-lg z-50 animate-in fade-in slide-in-from-top-1 duration-100">
                            <div className="px-2 py-1.5">
                                <p className="text-[13px] font-bold text-ink truncate">
                                    {user.name}
                                </p>
                                <p className="text-[10px] text-muted capitalize mt-0.5">
                                    {user.role}
                                </p>
                            </div>
                            <div className="my-2 border-t border-border" />
                            <button
                                onClick={handleLogout}
                                className="flex w-full items-center gap-2 rounded-md px-2 py-2 text-[12px] font-medium text-danger hover:bg-red-50/50 transition-colors text-left cursor-pointer"
                            >
                                <LogOut size={14} />
                                <span>Keluar Sesi</span>
                            </button>
                        </div>
                    </>
                )}
            </div>
        </header>
    );
}
