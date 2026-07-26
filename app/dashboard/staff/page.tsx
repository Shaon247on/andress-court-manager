import ManagerTeamList from "./ManagerTeamList";
import { getTeamListAction, getTeamRolesAction } from "@/actions/manager-team.action";

export default async function ManagerTeamPage() {
  const [teamRes, rolesRes] = await Promise.all([
    getTeamListAction(),
    getTeamRolesAction(),
  ]);

  const staff = teamRes.success ? teamRes.data.staff : [];
  const cards = teamRes.success ? teamRes.data.cards : null;
  const roles = rolesRes.success ? rolesRes.data.roles : [];
  const errorMessage = !teamRes.success ? teamRes.message : undefined;

  return (
    <ManagerTeamList
      staff={staff}
      cards={cards}
      roles={roles}
      errorMessage={errorMessage}
    />
  );
}