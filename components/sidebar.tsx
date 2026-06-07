'use client';

import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useAuthStore } from '@/store/auth';
import {
    LayoutDashboard,
    BookOpen,
    Calendar,
    GraduationCap,
    Megaphone,
    Users,
    BarChart3,
    FileText,
    Settings,
    UserCheck,
} from 'lucide-react';
import React from 'react';
import { cn } from '@/lib/utils';

interface SidebarItem {
    label: string;
    tab: string;
    icon: React.ElementType;
}

export function Sidebar() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const activeTab = searchParams.get('tab') || 'overview';
    const { user } = useAuthStore();

    if (!user) return null;

    // Define sidebar items based on role
    const getNavItems = (): SidebarItem[] => {
        switch (user.role) {
            case 'mahasiswa':
                return [
                    {
                        label: 'Dashboard',
                        tab: 'overview',
                        icon: LayoutDashboard,
                    },
                    { label: 'Kelas Saya', tab: 'courses', icon: BookOpen },
                    { label: 'Nilai', tab: 'grades', icon: GraduationCap },
                    { label: 'Kalender', tab: 'calendar', icon: Calendar },
                    {
                        label: 'Pengumuman',
                        tab: 'announcements',
                        icon: announcementsIcon(),
                    },
                ];
            case 'dosen':
                return [
                    {
                        label: 'Dashboard',
                        tab: 'overview',
                        icon: LayoutDashboard,
                    },
                    { label: 'Kelas Diampu', tab: 'courses', icon: BookOpen },
                    {
                        label: 'Pengumuman',
                        tab: 'announcements',
                        icon: Megaphone,
                    },
                    { label: 'Analitik', tab: 'analytics', icon: BarChart3 },
                ];
            case 'tu':
                return [
                    {
                        label: 'Dashboard',
                        tab: 'overview',
                        icon: LayoutDashboard,
                    },
                    { label: 'Kelola Kelas', tab: 'courses', icon: BookOpen },
                    { label: 'Kelola User', tab: 'users', icon: Users },
                    { label: 'Registrasi', tab: 'register', icon: UserCheck },
                ];
            case 'admin':
                return [
                    {
                        label: 'Dashboard',
                        tab: 'overview',
                        icon: LayoutDashboard,
                    },
                    { label: 'Kelola User', tab: 'users', icon: Users },
                    { label: 'Kalender', tab: 'calendar', icon: Calendar },
                    { label: 'Laporan', tab: 'reports', icon: FileText },
                    { label: 'Pengaturan', tab: 'settings', icon: Settings },
                ];
            default:
                return [];
        }
    };

    const announcementsIcon = () => Megaphone;

    const navItems = getNavItems();

    // Get base path for redirects (e.g. /dashboard or /lecturer or /staff or /admin)
    const getBasePath = () => {
        if (user.role === 'mahasiswa') return '/dashboard';
        if (user.role === 'dosen') return '/lecturer';
        if (user.role === 'tu') return '/staff';
        return '/admin';
    };

    const basePath = getBasePath();

    return (
        <>
            {/* Desktop Sidebar (260px) */}
            <aside className="hidden w-[260px] shrink-0 border-r border-border bg-surface flex-col justify-between h-[calc(100vh-56px)] sticky top-14 lg:flex z-20">
                <div className="flex flex-col gap-1 p-4">
                    <div className="mb-4 px-2 py-1 text-[11px] font-bold text-muted uppercase tracking-wider">
                        Menu Utama
                    </div>
                    <nav className="flex flex-col gap-1">
                        {navItems.map((item) => {
                            const isSelected =
                                activeTab === item.tab && pathname === basePath;
                            return (
                                <Link
                                    key={item.tab}
                                    href={`${basePath}?tab=${item.tab}`}
                                    className={cn(
                                        'flex items-center gap-3 rounded-lg px-3 py-2 text-[13px] font-medium transition-colors',
                                        isSelected
                                            ? 'bg-iris-50 text-iris-800'
                                            : 'text-muted hover:bg-surface2 hover:text-ink',
                                    )}
                                >
                                    <item.icon
                                        size={16}
                                        className={
                                            isSelected
                                                ? 'text-iris-500'
                                                : 'text-muted'
                                        }
                                    />
                                    <span>{item.label}</span>
                                </Link>
                            );
                        })}
                    </nav>
                </div>
            </aside>

            {/* Mobile Bottom Navigation (Visible on screen < 1024px) */}
            <nav className="fixed bottom-0 left-0 right-0 h-16 border-t border-border bg-surface flex items-center justify-around lg:hidden z-30 px-2 pb-safe shadow-lg">
                {navItems.slice(0, 5).map((item) => {
                    const isSelected =
                        activeTab === item.tab && pathname === basePath;
                    return (
                        <Link
                            key={item.tab}
                            href={`${basePath}?tab=${item.tab}`}
                            className={cn(
                                'flex flex-col items-center justify-center flex-1 py-1 gap-1 text-[10px] font-semibold transition-colors',
                                isSelected ? 'text-iris-800' : 'text-muted',
                            )}
                        >
                            <item.icon
                                size={18}
                                className={cn(
                                    'transition-transform active:scale-90',
                                    isSelected ? 'text-iris-500' : 'text-muted',
                                )}
                            />
                            <span className="truncate max-w-[70px]">
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </nav>
        </>
    );
}
