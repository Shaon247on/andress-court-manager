import type { KnockoutMatch, Team } from "@/app/dashboard/tournaments/lib/types";
import { getRoundNames } from "@/app/dashboard/tournaments/lib/rules";
import BracketMatchCard from "./bracket-match-card";

// Height of one leaf row (one Round-of-first-round match slot), in rem.
// Every later round's match spans a multiple of this. Tune this one number
// if cards ever overlap or look too spaced out — everything else, including
// the connector lines, derives from it.
const ROW_HEIGHT_REM = 9;
const CONNECTOR_WIDTH_PX = 48;
const LINE_COLOR = "#14b8a6"; // teal-500, matches the card border

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

  if (totalRounds === 1) {
    const finalMatch = roundsGrouped[0][0];
    return (
      <div className="flex justify-center py-6 ">
        <div className="w-64">
          <p className="mb-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
            {roundNames[0]}
          </p>
          {finalMatch && <BracketMatchCard match={finalMatch} teamsById={teamsById} />}
        </div>
      </div>
    );
  }

  const finalRound = roundsGrouped[totalRounds - 1];
  const preFinalRounds = roundsGrouped.slice(0, totalRounds - 1);
  const preFinalRoundNames = roundNames.slice(0, totalRounds - 1);

  const leftRounds = preFinalRounds.map((r) => r.slice(0, r.length / 2));
  const rightRounds = preFinalRounds.map((r) => r.slice(r.length / 2));

  const unitRows = leftRounds[0]?.length ?? 1;
  const gridHeightRem = unitRows * ROW_HEIGHT_REM;

  return (
    <div className="w-full overflow-x-auto pb-4">
      <div className="flex min-w-max items-stretch">
        <BracketHalf
          rounds={leftRounds}
          roundNames={preFinalRoundNames}
          teamsById={teamsById}
          unitRows={unitRows}
        />

        <StraightConnector heightRem={gridHeightRem} />

        <div className="flex w-64 flex-shrink-0 flex-col justify-center">
          <p className="mb-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
            {roundNames[totalRounds - 1]}
          </p>
          {finalRound[0] && <BracketMatchCard match={finalRound[0]} teamsById={teamsById} />}
        </div>

        <StraightConnector heightRem={gridHeightRem} />

        <BracketHalf
          rounds={[...rightRounds].reverse()}
          roundNames={[...preFinalRoundNames].reverse()}
          teamsById={teamsById}
          unitRows={unitRows}
          mirrored
        />
      </div>
    </div>
  );
}

interface BracketHalfProps {
  rounds: KnockoutMatch[][];
  roundNames: string[];
  teamsById: Record<string, Team>;
  unitRows: number;
  mirrored?: boolean;
}

function BracketHalf({ rounds, roundNames, teamsById, unitRows, mirrored = false }: BracketHalfProps) {
  const gridHeightRem = unitRows * ROW_HEIGHT_REM;

  const nodes: React.ReactNode[] = [];

  rounds.forEach((roundMatches, colIdx) => {
    const rowSpan = unitRows / roundMatches.length;

    nodes.push(
      <div key={`col-${colIdx}`} className="flex w-64 flex-shrink-0 flex-col">
        <p className="mb-3 text-center text-xs font-semibold uppercase tracking-wide text-slate-500">
          {roundNames[colIdx]}
        </p>
        <div
          className="grid"
          style={{ height: `${gridHeightRem}rem`, gridTemplateRows: `repeat(${unitRows}, 1fr)` }}
        >
          {roundMatches.map((match, idx) => (
            <div
              key={match.id}
              style={{ gridRow: `${idx * rowSpan + 1} / span ${rowSpan}` }}
              className="flex items-center px-1"
            >
              <div className="w-full">
                <BracketMatchCard match={match} teamsById={teamsById} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );

    const nextRoundMatches = rounds[colIdx + 1];
    if (nextRoundMatches) {
      // Whichever side of the pair has MORE matches is always the "source"
      // (closer to the leaves); the one with fewer is the "target" — true
      // regardless of left/right, since count always halves toward the Final.
      const thisHasMore = roundMatches.length > nextRoundMatches.length;
      const pairsMatches = thisHasMore ? roundMatches : nextRoundMatches;
      const targetMatches = thisHasMore ? nextRoundMatches : roundMatches;

      nodes.push(
        <BracketConnector
          key={`conn-${colIdx}`}
          pairsCenters={computeCenters(pairsMatches.length, unitRows)}
          targetCenters={computeCenters(targetMatches.length, unitRows)}
          heightRem={gridHeightRem}
          sourceSide={mirrored ? "right" : "left"}
        />
      );
    }
  });

  return <div className="flex flex-shrink-0 items-stretch">{nodes}</div>;
}

function computeCenters(numMatches: number, unitRows: number): number[] {
  const rowSpan = unitRows / numMatches;
  return Array.from({ length: numMatches }, (_, i) => (i * rowSpan + rowSpan / 2) * ROW_HEIGHT_REM);
}

function BracketConnector({
  pairsCenters,
  targetCenters,
  heightRem,
  sourceSide,
}: {
  pairsCenters: number[];
  targetCenters: number[];
  heightRem: number;
  sourceSide: "left" | "right";
}) {
  const heightPx = heightRem * 16;
  const midX = CONNECTOR_WIDTH_PX / 2;
  const paths: string[] = [];

  targetCenters.forEach((targetCenterRem, i) => {
    const y1 = pairsCenters[i * 2] * 17;
    const y2 = pairsCenters[i * 2 + 1] * 16.5;
    const yMid = targetCenterRem * 17;

    if (sourceSide === "left") {
      paths.push(`M0 ${y1} H${midX}`, `M0 ${y2} H${midX}`, `M${midX} ${y1} V${y2}`, `M${midX} ${yMid} H${CONNECTOR_WIDTH_PX}`);
    } else {
      paths.push(`M${CONNECTOR_WIDTH_PX} ${y1} H${midX}`, `M${CONNECTOR_WIDTH_PX} ${y2} H${midX}`, `M${midX} ${y1} V${y2}`, `M${midX} ${yMid} H0`);
    }
  });

  return (
    <svg width={CONNECTOR_WIDTH_PX} height={heightPx} viewBox={`0 0 ${CONNECTOR_WIDTH_PX} ${heightPx}`} className="flex-shrink-0">
      {paths.map((d, i) => (
        <path key={i} d={d} stroke={LINE_COLOR} strokeWidth={2} fill="none" />
      ))}
    </svg>
  );
}

function StraightConnector({ heightRem }: { heightRem: number }) {
  const heightPx = heightRem * 17;
  return (
    <svg width={CONNECTOR_WIDTH_PX} height={heightPx} viewBox={`0 0 ${CONNECTOR_WIDTH_PX} ${heightPx}`} className="flex-shrink-0">
      <line x1={0} y1={heightPx / 2} x2={CONNECTOR_WIDTH_PX} y2={heightPx / 2} stroke={LINE_COLOR} strokeWidth={2} />
    </svg>
  );
}