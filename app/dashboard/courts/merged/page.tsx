// app/dashboard/courts/merged/page.tsx

import { Suspense } from "react";
import MergedCourtsList from "./MergedCourtsList";
import { getMergedCourtsAction } from "@/actions/court-manager-court.action";

export default async function MergedCourtsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | undefined>>;
}) {
  const params = (await searchParams) || {};

  const queryParams = {
    q: params?.q,
    status: params?.status as
      | "upcoming"
      | "merged"
      | "completed"
      | "cancelled"
      | "active"
      | undefined,
    page: params?.page ? parseInt(params.page) : undefined,
  };

  const res = await getMergedCourtsAction(queryParams);
  const data = res.success ? res.data : null;
  const errorMessage = !res.success ? res.message : undefined;

  return (
    <div className="h-full flex flex-col p-4 sm:p-6 lg:p-8 overflow-y-auto bg-white">
      <Suspense fallback={<div>Loading...</div>}>
        <MergedCourtsList data={data} errorMessage={errorMessage} />
      </Suspense>
    </div>
  );
}