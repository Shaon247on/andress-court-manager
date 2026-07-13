import ScheduleMaintenance from "./ScheduleMaintenance";
import { getScheduleAction, getCancellationAction } from "@/actions/settings.action";

export default async function SchedulePage() {
  const [scheduleRes, cancellationRes] = await Promise.all([
    getScheduleAction(),
    getCancellationAction(),
  ]);

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