import Link from "next/link";
import type { Team } from "@/app/dashboard/tournaments/lib/types";
import type { StandingRow } from "@/app/dashboard/tournaments/lib/rules";

interface GroupStandingsTableProps {
  groupName: string;
  rows: StandingRow[];
  teamsById: Record<string, Team>;
  viewHref?: string;
}

export default function GroupStandingsTable({
  groupName,
  rows,
  teamsById,
  viewHref,
}: GroupStandingsTableProps) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200">
      <div className="flex items-center justify-between bg-teal-500 px-4 py-2.5 text-white">
        <span className="text-sm font-semibold tracking-wide">{groupName}</span>
        {viewHref && (
          <Link
            href={viewHref}
            className="rounded-md bg-white/15 px-3 py-1 text-xs font-medium hover:bg-white/25"
          >
            View
          </Link>
        )}
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-100 bg-slate-50 text-xs font-medium text-slate-500">
            <th className="px-3 py-2 text-left">Team</th>
            <th className="w-10 px-2 py-2 text-center">P</th>
            <th className="w-10 px-2 py-2 text-center">W</th>
            <th className="w-10 px-2 py-2 text-center">D</th>
            <th className="w-10 px-2 py-2 text-center">L</th>
            <th className="w-12 px-2 py-2 text-center">PTS</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const team = teamsById[row.teamId];
            return (
              <tr key={row.teamId} className="border-b border-slate-100 last:border-0">
                <td className="px-3 py-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base leading-none">{team?.flag}</span>
                    <span className="font-medium text-slate-700">{team?.name}</span>
                  </div>
                </td>
                <td className="px-2 py-2 text-center text-slate-600">{row.played}</td>
                <td className="px-2 py-2 text-center text-slate-600">{row.won}</td>
                <td className="px-2 py-2 text-center text-slate-600">{row.drawn}</td>
                <td className="px-2 py-2 text-center text-slate-600">{row.lost}</td>
                <td className="px-2 py-2 text-center font-semibold text-slate-800">{row.points}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}