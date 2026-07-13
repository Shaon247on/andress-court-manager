import { notFound } from "next/navigation";
import CourtDetails from "./CourtDetails";
import { getCourtDetailsAction } from "@/actions/court-manager-court.action";

export default async function CourtDetailsPage({
  params,
}: {
  params?: Promise<{ id: string }>;
}) {
  const { id } = await params || { id: '' };
  
  if (!id) {
    notFound();
  }

  const res = await getCourtDetailsAction(id);

  console.log("the image:",res)
  
  if (!res.success || !res.data) {
    notFound();
  }

  return <CourtDetails court={res.data} />;
}