import type { Tournament, Team } from "../../lib/types";

interface TournamentHeaderProps {
  tournament: Tournament;
  teams: Team[];
}

export default function TournamentHeader({
  tournament,
  teams,
}: TournamentHeaderProps) {
  const infoItems = [
    { label: "Prize money", value: `$${tournament.prizeMoney.toLocaleString()}` },
    { label: "Entry fee", value: `$${tournament.entryFeePerTeam} / team` },
    { label: "Capacity", value: `${tournament.capacity} players` },
    { label: "Team type", value: tournament.teamType },
    { label: "Category", value: tournament.category, capitalize: true },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-semibold text-slate-800">
          {tournament.name}
        </h1>
        <p className="mt-1 max-w-2xl text-sm text-slate-500">
          {tournament.shortDescription}
        </p>
      </div>

      {/* Grey info cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {infoItems.map((item) => (
          <div
            key={item.label}
            className="rounded-lg border border-slate-200 bg-slate-50 px-3 py-2.5"
          >
            <p className="text-xs text-slate-500">{item.label}</p>
            <p
              className={`mt-0.5 text-sm font-medium text-slate-800 ${
                item.capitalize ? "capitalize" : ""
              }`}
            >
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Teams strip */}
      <div>
        <p className="mb-2 text-xs font-medium text-slate-500">
          Teams ({teams.length})
        </p>
        <div className="flex flex-wrap gap-2">
          {teams.map((team) => (
            <div
              key={team.id}
              className="flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm text-slate-700"
            >
              <span className="text-base leading-none">{team.flag}</span>
              <span>{team.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}