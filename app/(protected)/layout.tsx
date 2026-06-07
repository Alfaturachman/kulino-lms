import { AuthGuard } from '@/components/auth-guard';
import { TopBar } from '@/components/top-bar';
import { Sidebar } from '@/components/sidebar';

export default function ProtectedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <AuthGuard>
            <div className="flex h-screen flex-col overflow-hidden bg-surface3">
                <TopBar />
                <div className="flex flex-1 overflow-hidden relative">
                    <Sidebar />
                    <main className="flex-1 overflow-y-auto pb-20 lg:pb-12 px-4 py-6 md:px-6">
                        <div className="mx-auto max-w-7xl">{children}</div>
                    </main>
                </div>
            </div>
        </AuthGuard>
    );
}
