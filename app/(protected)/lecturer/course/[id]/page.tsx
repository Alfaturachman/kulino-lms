import { Suspense } from "react";
import LecturerCourseDetailClient from "./LecturerCourseDetailClient";

export default async function LecturerCourseDetailPage(props: {
  params: Promise<{ id: string }>;
}) {
  const params = await props.params;
  const courseId = params.id;

  return (
    <Suspense fallback={
      <div className="flex h-[50vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-iris-500 border-t-transparent"></div>
      </div>
    }>
      <LecturerCourseDetailClient courseId={courseId} />
    </Suspense>
  );
}
