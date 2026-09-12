// app/dashboard/courts/marged/[id]/page.tsx

import { notFound } from "next/navigation";
import MergedCourtDetail from "./MergedCourtDetail";
import { getMergedCourtDetailsAction } from "@/actions/court-manager-court.action";

export default async function MergedCourtDetailPage({
  params,
}: {
  params?: Promise<{ id: string }>;
}) {
  const { id } = (await params) || { id: "" };

  if (!id) {
    notFound();
  }

  const res = await getMergedCourtDetailsAction(id);

  if (!res.success || !res.data) {
    notFound();
  }

  return <MergedCourtDetail data={res.data.data} />;
}