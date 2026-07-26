import { getSession } from "@/lib/cookies";
import ScheduleMaintenance from "./ScheduleMaintenance";
import { getScheduleAction, getCancellationAction } from "@/actions/settings.action";
import { getFirstAvailableRoute } from "@/lib/navigation";
import { redirect } from "next/navigation";

export default async function SchedulePage() {
  const [scheduleRes, cancellationRes] = await Promise.all([
    getScheduleAction(),
    getCancellationAction(),
  ]);

   const session = await getSession();
  
  // Only Owners can access schedule settings
  if (session?.role_label !== 'Owner') {
    const redirectTo = getFirstAvailableRoute(session?.permissions || {});
    redirect(redirectTo);
  }

  const schedule = scheduleRes.success ? scheduleRes.data.schedule : null;
  const cancellationHours = cancellationRes.success ? cancellationRes.data.cancellation_hours : 24;
  const errorMessage = !scheduleRes.success ? scheduleRes.message : undefined;
  const cancellationError = !cancellationRes.success ? cancellationRes.message : undefined;

  return (
    <ScheduleMaintenance 
      schedule={schedule} 
      cancellationHours={cancellationHours}
      errorMessage={errorMessage}
      cancellationError={cancellationError}
    />
  );
}