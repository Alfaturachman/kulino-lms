import { Suspense } from 'react';
import AdminDashboardClient from '@/app/(protected)/admin/AdminDashboardClient';

export default async function AdminPage(props: {
    searchParams: Promise<{ tab?: string }>;
}) {
    const searchParams = await props.searchParams;
    const tab = searchParams.tab || 'overview';

    return (
        <Suspense
            fallback={
                <div className="flex h-[50vh] items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-iris-500 border-t-transparent"></div>
                </div>
            }
        >
            <AdminDashboardClient initialTab={tab} />
        </Suspense>
    );
}
