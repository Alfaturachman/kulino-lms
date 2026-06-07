import { Suspense } from "react";
import StaffDashboardClient from "./StaffDashboardClient";

export default async function StaffPage(props: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const searchParams = await props.searchParams;
  const tab = searchParams.tab || "overview";

  return (
    <Suspense fallback={
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-iris-500 border-t-transparent"></div>
      </div>
    }>
      <StaffDashboardClient initialTab={tab} />
    </Suspense>
  );
}
