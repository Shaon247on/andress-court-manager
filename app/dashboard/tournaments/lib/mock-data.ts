import type { Tournament } from "./types";
import type { Team } from "./types";
import type { Group, Match } from "./types";
import type { KnockoutMatch } from "./types";

export const mockTournaments: Tournament[] = [
  {
    id: "t-001",
    name: "Summer Cup 2026",
    shortDescription: "Annual 5-a-side summer tournament open to all clubs.",
    category: "open",
    teamType: "5v5",
    teamCount: 8,
    capacity: 40,
    entryFeePerTeam: 50,
    prizeMoney: 1000,
    hasGroupStage: true,
    status: "ongoing",
    createdAt: "2026-06-01",
  },
  {
    id: "t-002",
    name: "Rookie Knockout",
    shortDescription: "Beginner-friendly knockout-only tournament.",
    category: "beginners",
    teamType: "6v6",
    teamCount: 4,
    capacity: 24,
    entryFeePerTeam: 20,
    prizeMoney: 200,
    hasGroupStage: false,
    status: "upcoming",
    createdAt: "2026-08-10",
  },
  {
    id: "t-003",
    name: "Elite Championship",
    shortDescription: "Advanced-level tournament with group and knockout stages.",
    category: "advanced",
    teamType: "7v7",
    teamCount: 16,
    capacity: 112,
    entryFeePerTeam: 100,
    prizeMoney: 5000,
    hasGroupStage: true,
    status: "ongoing",
    createdAt: "2026-05-20",
  },
  {
    id: "t-004",
    name: "Mid-Level Masters",
    shortDescription: "Intermediate 8v8 league-style groups leading to knockout.",
    category: "intermediate",
    teamType: "8v8",
    teamCount: 8,
    capacity: 64,
    entryFeePerTeam: 75,
    prizeMoney: 1500,
    hasGroupStage: true,
    status: "completed",
    createdAt: "2026-03-15",
  },
  {
    id: "t-005",
    name: "City Cup Qualifiers",
    shortDescription: "Direct knockout to decide the city cup finalists.",
    category: "open",
    teamType: "11v11",
    teamCount: 8,
    capacity: 176,
    entryFeePerTeam: 150,
    prizeMoney: 3000,
    hasGroupStage: false,
    status: "upcoming",
    createdAt: "2026-08-25",
  },
];

const countryPool: Omit<Team, "id">[] = [
  { name: "Brazil", flag: "🇧🇷" },
  { name: "Argentina", flag: "🇦🇷" },
  { name: "France", flag: "🇫🇷" },
  { name: "Spain", flag: "🇪🇸" },
  { name: "Germany", flag: "🇩🇪" },
  { name: "Portugal", flag: "🇵🇹" },
  { name: "Netherlands", flag: "🇳🇱" },
  { name: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿" },
  { name: "Belgium", flag: "🇧🇪" },
  { name: "Morocco", flag: "🇲🇦" },
  { name: "Croatia", flag: "🇭🇷" },
  { name: "Switzerland", flag: "🇨🇭" },
  { name: "Colombia", flag: "🇨🇴" },
  { name: "Mexico", flag: "🇲🇽" },
  { name: "Norway", flag: "🇳🇴" },
  { name: "Egypt", flag: "🇪🇬" },
];

function generateTeams(tournamentId: string, count: number): Team[] {
  return Array.from({ length: count }, (_, i) => {
    const base = countryPool[i % countryPool.length];
    return {
      id: `${tournamentId}-team-${i + 1}`,
      ...base,
    };
  });
}

export const mockTeamsByTournament: Record<string, Team[]> = {
  "t-001": generateTeams("t-001", 8),
  "t-002": generateTeams("t-002", 4),
  "t-003": generateTeams("t-003", 16),
  "t-004": generateTeams("t-004", 8),
  "t-005": generateTeams("t-005", 8),
};


function roundRobinMatches(groupId: string, teamIds: string[]): Match[] {
  const matches: Match[] = [];
  let index = 1;
  for (let i = 0; i < teamIds.length; i++) {
    for (let j = i + 1; j < teamIds.length; j++) {
      matches.push({
        id: `${groupId}-m${index}`,
        homeTeamId: teamIds[i],
        awayTeamId: teamIds[j],
        status: "unscheduled",
        scheduledAt: null,
        homeScore: null,
        awayScore: null,
      });
      index++;
    }
  }
  return matches;
}

function chunkTeams(teamIds: string[], size: number): string[][] {
  const chunks: string[][] = [];
  for (let i = 0; i < teamIds.length; i += size) {
    chunks.push(teamIds.slice(i, i + size));
  }
  return chunks;
}

function generateGroupsForTournament(tournamentId: string): Group[] {
  const teamIds = (mockTeamsByTournament[tournamentId] ?? []).map((t) => t.id);
  return chunkTeams(teamIds, 4).map((chunkIds, i) => {
    const groupId = `${tournamentId}-group-${i + 1}`;
    return {
      id: groupId,
      name: `Group ${String.fromCharCode(65 + i)}`,
      tournamentId,
      teamIds: chunkIds,
      matches: roundRobinMatches(groupId, chunkIds),
    };
  });
}

export const mockGroupsByTournament: Record<string, Group[]> = {
  "t-001": generateGroupsForTournament("t-001"),
  "t-003": generateGroupsForTournament("t-003"),
  "t-004": generateGroupsForTournament("t-004"),
};

// Seed a realistic mix of states (completed / awaiting score / upcoming / unscheduled)
// on the first group so the UI shows all four cases out of the box.
const seedGroup = mockGroupsByTournament["t-001"]?.[0];
if (seedGroup) {
  const [m1, m2, m3, m4] = seedGroup.matches;
  if (m1) Object.assign(m1, { status: "completed", scheduledAt: "2026-08-20T15:00:00", homeScore: 2, awayScore: 1 });
  if (m2) Object.assign(m2, { status: "completed", scheduledAt: "2026-08-21T17:00:00", homeScore: 0, awayScore: 0 });
  if (m3) Object.assign(m3, { status: "scheduled", scheduledAt: "2026-08-30T18:00:00" }); // past → awaiting score
  if (m4) Object.assign(m4, { status: "scheduled", scheduledAt: "2026-09-15T18:00:00" }); // future → upcoming
}
function generateKnockoutBracket(tournamentId: string, teamIds: string[]): KnockoutMatch[] {
  const matches: KnockoutMatch[] = [];
  let round = 0;
  let slots = teamIds.length;
  let poolOffset = 0;

  while (slots > 1) {
    const matchCount = slots / 2;
    for (let i = 0; i < matchCount; i++) {
      // NOTE: every round is seeded with placeholder teams purely so Set Match /
      // Edit / Final Score are testable on every match in the UI. Real bracket
      // advancement (winner of round N feeding round N+1) isn't wired up yet —
      // that's deferred until match state is connected to actual results.
      const homeIdx = (poolOffset + i * 2) % teamIds.length;
      let awayIdx = (poolOffset + i * 2 + 1) % teamIds.length;
      if (awayIdx === homeIdx) awayIdx = (awayIdx + 1) % teamIds.length;

      matches.push({
        id: `${tournamentId}-ko-r${round}-m${i}`,
        round,
        position: i,
        homeTeamId: teamIds[homeIdx] ?? null,
        awayTeamId: teamIds[awayIdx] ?? null,
        status: "unscheduled",
        scheduledAt: null,
        homeScore: null,
        awayScore: null,
      });
    }
    poolOffset += 3; // vary pairing per round so it isn't visibly identical
    slots = matchCount;
    round++;
  }
  return matches;
}

export const mockKnockoutByTournament: Record<string, KnockoutMatch[]> = Object.fromEntries(
  mockTournaments.map((t) => {
    const teamIds = (mockTeamsByTournament[t.id] ?? []).map((team) => team.id);
    return [t.id, generateKnockoutBracket(t.id, teamIds)];
  })
);

// Seed a couple of matches so the UI demonstrates every state.
const koSeed = mockKnockoutByTournament["t-005"];
if (koSeed?.[0]) {
  Object.assign(koSeed[0], {
    status: "completed",
    scheduledAt: "2026-08-20T18:00:00",
    homeScore: 3,
    awayScore: 1,
  });
}
if (koSeed?.[1]) {
  Object.assign(koSeed[1], { status: "scheduled", scheduledAt: "2026-08-05T18:00:00" }); // past → awaiting score
}