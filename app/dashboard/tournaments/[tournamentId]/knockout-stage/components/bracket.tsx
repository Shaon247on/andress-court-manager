import type { KnockoutMatch, Team } from "@/app/dashboard/tournaments/lib/types";
import { getRoundNames } from "@/app/dashboard/tournaments/lib/rules";
import BracketMatchCard from "./bracket-match-card";

interface BracketProps {
  matches: KnockoutMatch[];
  teamsById: Record<string, Team>;
}

export default function Bracket({ matches, teamsById }: BracketProps) {
  const totalRounds = Math.max(...matches.map((m) => m.round)) + 1;
  const roundNames = getRoundNames(totalRounds);

  const roundsGrouped = Array.from({ length: totalRounds }, (_, round) =>
    matches.filter((m) => m.round === round).sort((a, b) => a.position - b.position)
  );

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex min-w-max gap-8">
        {roundsGrouped.map((roundMatches, roundIndex) => (
          <div key={roundIndex} className="flex w-64 flex-shrink-0 flex-col">
            <p className="mb-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
              {roundNames[roundIndex]}
            </p>
            <div className="flex h-full flex-col justify-around gap-6">
              {roundMatches.map((match) => (
                <BracketMatchCard key={match.id} match={match} teamsById={teamsById} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}