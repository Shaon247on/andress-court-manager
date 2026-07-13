import SettingsOverview from "./SettingsOverview";
import { getProfileAction, getScheduleAction } from "@/actions/settings.action";

export default async function SettingsPage() {
  const [profileRes, scheduleRes] = await Promise.all([
    getProfileAction(),
    getScheduleAction(),
  ]);

  const profile = profileRes.success ? profileRes.data.profile : null;
  const schedule = scheduleRes.success ? scheduleRes.data.schedule : null;
  const errorMessage = !profileRes.success ? profileRes.message : undefined;
  const scheduleError = !scheduleRes.success ? scheduleRes.message : undefined;

  return (
    <SettingsOverview 
      profile={profile} 
      schedule={schedule}
      errorMessage={errorMessage}
      scheduleError={scheduleError}
    />
  );
}