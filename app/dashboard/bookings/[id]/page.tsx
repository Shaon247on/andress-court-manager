import { notFound } from "next/navigation";
import BookingDetails from "./BookingDetails";
import { getManagerBookingDetailsAction } from "@/actions/booking.action";

export default async function BookingDetailsPage({
  params,
}: {
  params?: Promise<{ id: string }>;
}) {
  const { id } = await params || { id: '' };
  
  if (!id) {
    notFound();
  }

  const res = await getManagerBookingDetailsAction(id);
  
  if (!res.success || !res.data) {
    notFound();
  }

  return <BookingDetails booking={res.data.booking} />;
}