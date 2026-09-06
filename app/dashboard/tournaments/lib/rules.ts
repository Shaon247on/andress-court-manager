import type { Match } from "./types";

export interface StandingRow {
  teamId: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  points: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
}

export function computeGroupStandings(
  teamIds: string[],
  matches: Match[]
): StandingRow[] {
  const table = new Map<string, StandingRow>();
  teamIds.forEach((id) =>
    table.set(id, {
      teamId: id,
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      points: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      goalDifference: 0,
    })
  );

  matches
    .filter(
      (m) => m.status === "completed" && m.homeScore !== null && m.awayScore !== null
    )
    .forEach((m) => {
      const home = table.get(m.homeTeamId);
      const away = table.get(m.awayTeamId);
      if (!home || !away) return;

      const homeScore = m.homeScore as number;
      const awayScore = m.awayScore as number;

      home.played += 1;
      away.played += 1;
      home.goalsFor += homeScore;
      home.goalsAgainst += awayScore;
      away.goalsFor += awayScore;
      away.goalsAgainst += homeScore;

      if (homeScore > awayScore) {
        home.won += 1;
        home.points += 3;
        away.lost += 1;
      } else if (homeScore < awayScore) {
        away.won += 1;
        away.points += 3;
        home.lost += 1;
      } else {
        home.drawn += 1;
        away.drawn += 1;
        home.points += 1;
        away.points += 1;
      }
    });

  table.forEach((row) => {
    row.goalDifference = row.goalsFor - row.goalsAgainst;
  });

  return Array.from(table.values()).sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points;
    if (b.goalDifference !== a.goalDifference) return b.goalDifference - a.goalDifference;
    return b.goalsFor - a.goalsFor;
  });
}

export type MatchDisplayStatus =
  | "unscheduled"
  | "upcoming"
  | "awaiting-score"
  | "completed";

// Derives the real-world state of a match from its scheduled time —
// this is what decides whether the row shows "Set Match", "Edit", or "Final Score".
export function getMatchDisplayStatus( match: Pick<Match, "status" | "scheduledAt">): MatchDisplayStatus {
  if (match.status === "completed") return "completed";
  if (!match.scheduledAt) return "unscheduled";
  return new Date(match.scheduledAt).getTime() <= Date.now()
    ? "awaiting-score"
    : "upcoming";
}

export function getRoundNames(totalRounds: number): string[] {
  const namesFromFinal = ["Final", "Semifinals", "Quarterfinals", "Round of 16", "Round of 32"];
  return namesFromFinal.slice(0, totalRounds).reverse();
}