import BookingsList from "./BookingsList";
import { getBookingsTabAction } from "@/actions/booking.action";

export default async function BookingsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams || {};
  
  const today = new Date().toISOString().split('T')[0];
  
  const queryParams = {
    date: params?.date || today,
    type: params?.type as 'all' | 'bookings' | 'lessons' | 'events' | undefined,
    page: params?.page ? parseInt(params.page) : undefined,
  };

  const res = await getBookingsTabAction(queryParams);
  const bookings = res.success ? res.data.bookings : [];
  const cards = res.success ? res.data.cards : null;
  const pagination = res.success ? res.data.pagination : null;
  const currentDate = res.success ? res.data.date : today;
  const errorMessage = !res.success ? res.message : undefined;

  return (
    <div className="h-full flex flex-col p-4 sm:p-6 lg:p-8 overflow-y-auto bg-white">
      <div className="mb-6 flex flex-col space-y-1 shrink-0">
        <h1 className="text-2xl font-bold text-slate-900">Bookings</h1>
        <p className="text-slate-500">Track all bookings and lessons</p>
      </div>

      <BookingsList
        bookings={bookings}
        cards={cards}
        pagination={pagination}
        currentDate={currentDate}
        errorMessage={errorMessage}
      />
    </div>
  );
}