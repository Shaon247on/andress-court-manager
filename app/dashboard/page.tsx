// app/manager/dashboard/page.tsx

import { getScheduleAction } from "@/actions/manager-booking.action";
import { NoCourtFoundWithImage } from "@/components/schedule/NoCourtFoundWithImage";
import { ScheduleBoard } from "@/components/schedule/ScheduleBoard";
interface ManagerDashboardPageProps {
  searchParams: Promise<{ date?: string }>;
}

function isValidDateString(s: string | undefined): s is string {
  return !!s && /^\d{4}-\d{2}-\d{2}$/.test(s);
}

export default async function ManagerDashboardPage({
  searchParams,
}: ManagerDashboardPageProps) {
  const params = await searchParams;
  const todayStr = new Date().toISOString().split("T")[0];
  const formattedDate = isValidDateString(params.date) ? params.date : todayStr;

  const res = await getScheduleAction(formattedDate);
  const schedule = res.success ? res.data : null;
  const errorMessage = !res.success ? res.message : undefined;
  console.log("the  schedule:", res.data.schedule.courts.length);
  return (
    <div className="h-full flex flex-col p-4 md:p-8">
      <div className="mb-6 flex flex-col space-y-1 shrink-0">
        <h1 className="text-2xl font-bold text-slate-900">Schedule Overview</h1>
        <p className="text-slate-500">
          Welcome back! Here&apos;s what&apos;s happening today.
        </p>
      </div>

      {res?.success && res.data.schedule.courts.length === 0 ? (
        <NoCourtFoundWithImage />
      ) : (
        <div className="flex-1 min-h-0 bg-white rounded-lg border border-slate-200 flex flex-col">
          <ScheduleBoard
            initialSchedule={schedule}
            errorMessage={errorMessage}
            initialDate={formattedDate}
          />
        </div>
      )}
    </div>
  );
}
