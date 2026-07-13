import CourtsList from "./CourtsList";
import { getCourtsAction, getCourtStatsAction } from "@/actions/court-manager-court.action";

export default async function CourtsPage({
  searchParams,
}: {
  searchParams?: Promise<Record<string, string | undefined>>;
}) {
  const params = await searchParams || {};
  
  const queryParams = {
    search: params?.search,
    court_type: params?.court_type as 'indoor' | 'outdoor' | 'both' | undefined,
    status: params?.status as 'active' | 'under_maintenance' | 'closed' | undefined,
    page: params?.page ? parseInt(params.page) : undefined,
  };

  const [courtsRes, statsRes] = await Promise.all([
    getCourtsAction(queryParams),
    getCourtStatsAction(),
  ]);

  const courts = courtsRes.success ? courtsRes.data.results : [];
  const total = courtsRes.success ? courtsRes.data.count : 0;
  const stats = statsRes.success ? statsRes.data : null;
  const errorMessage = !courtsRes.success ? courtsRes.message : undefined;

  return (
    <div className="h-full flex flex-col p-4 sm:p-6 lg:p-8 overflow-y-auto bg-white">
      <CourtsList
        courts={courts}
        total={total}
        stats={stats}
        errorMessage={errorMessage}
      />
    </div>
  );
}