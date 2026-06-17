export default function AdminLoading() {
    return (
        <div className="animate-pulse space-y-6">
            <div className="h-8 w-48 rounded-lg bg-border" />
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div
                        key={i}
                        className="h-28 rounded-xl bg-surface2 border border-border"
                    />
                ))}
            </div>
            <div className="h-64 rounded-xl bg-surface2 border border-border" />
        </div>
    );
}
