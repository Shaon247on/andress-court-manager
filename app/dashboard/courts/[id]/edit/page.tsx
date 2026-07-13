import { notFound } from "next/navigation";
import EditCourt from "./EditCourt";
import { getCourtDetailsAction } from "@/actions/court-manager-court.action";

export default async function EditCourtPage({
  params,
}: {
  params: Promise<{ id: string }> | { id: string };
}) {
  // Await params if it's a Promise (Next.js 15+)
  const { id } = await params;
  
  if (!id) {
    notFound();
  }

  const res = await getCourtDetailsAction(id);
  console.log("the response of court:",res)
  if (!res.success || !res.data) {
    notFound();
  }

  return <EditCourt court={res.data} />;
}