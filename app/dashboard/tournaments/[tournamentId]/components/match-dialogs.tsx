"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface SetMatchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  homeTeamName: string;
  awayTeamName: string;
  defaultDate?: string;
  defaultTime?: string;
  onSave: (date: string, time: string) => void;
}

export function SetMatchDialog({
  open,
  onOpenChange,
  homeTeamName,
  awayTeamName,
  defaultDate = "",
  defaultTime = "",
  onSave,
}: SetMatchDialogProps) {
  const [date, setDate] = useState(defaultDate);
  const [time, setTime] = useState(defaultTime);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Schedule match</DialogTitle>
        </DialogHeader>

        <p className="text-sm text-slate-600">
          {homeTeamName} <span className="text-slate-400">vs</span> {awayTeamName}
        </p>

        <div className="grid grid-cols-2 gap-3 pt-2">
          <div className="space-y-1.5">
            <Label htmlFor="match-date">Date</Label>
            <Input id="match-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="match-time">Time</Label>
            <Input id="match-time" type="time" value={time} onChange={(e) => setTime(e.target.value)} />
          </div>
        </div>

        <DialogFooter className="pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            disabled={!date || !time}
            onClick={() => {
              onSave(date, time);
              onOpenChange(false);
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

interface FinalScoreDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  homeTeamName: string;
  homeTeamFlag: string;
  awayTeamName: string;
  awayTeamFlag: string;
  defaultHomeScore?: number | null;
  defaultAwayScore?: number | null;
  onSave: (homeScore: number, awayScore: number) => void;
}

export function FinalScoreDialog({
  open,
  onOpenChange,
  homeTeamName,
  homeTeamFlag,
  awayTeamName,
  awayTeamFlag,
  defaultHomeScore,
  defaultAwayScore,
  onSave,
}: FinalScoreDialogProps) {
  const [homeScore, setHomeScore] = useState(defaultHomeScore != null ? String(defaultHomeScore) : "");
  const [awayScore, setAwayScore] = useState(defaultAwayScore != null ? String(defaultAwayScore) : "");
  const isValid = homeScore !== "" && awayScore !== "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle>Enter final score</DialogTitle>
        </DialogHeader>

        <div className="flex items-center justify-center gap-4 pt-2">
          <div className="flex flex-1 flex-col items-center gap-2">
            <span className="text-2xl">{homeTeamFlag}</span>
            <Label className="text-center text-sm">{homeTeamName}</Label>
            <Input
              type="number"
              min={0}
              inputMode="numeric"
              value={homeScore}
              onChange={(e) => setHomeScore(e.target.value)}
              className="w-16 text-center text-lg font-semibold"
            />
          </div>
          <span className="pt-8 text-slate-400">—</span>
          <div className="flex flex-1 flex-col items-center gap-2">
            <span className="text-2xl">{awayTeamFlag}</span>
            <Label className="text-center text-sm">{awayTeamName}</Label>
            <Input
              type="number"
              min={0}
              inputMode="numeric"
              value={awayScore}
              onChange={(e) => setAwayScore(e.target.value)}
              className="w-16 text-center text-lg font-semibold"
            />
          </div>
        </div>

        <DialogFooter className="pt-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            disabled={!isValid}
            onClick={() => {
              onSave(Number(homeScore), Number(awayScore));
              onOpenChange(false);
            }}
          >
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}