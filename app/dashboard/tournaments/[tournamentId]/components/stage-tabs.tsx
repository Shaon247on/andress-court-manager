"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface StageTabsProps {
  tournamentId: string;
  hasGroupStage: boolean;
}

export default function StageTabs({
  tournamentId,
  hasGroupStage,
}: StageTabsProps) {
  const pathname = usePathname();
  const base = `/dashboard/tournaments/${tournamentId}`;

  const tabs = hasGroupStage
    ? [
        { label: "Group Stage", href: `${base}/group-stage` },
        { label: "Knockout Stage", href: `${base}/knockout-stage` },
      ]
    : [{ label: "Knockout Stage", href: `${base}/knockout-stage` }];

  return (
    <div className="border-b border-slate-200">
      <nav className="flex gap-6">
        {tabs.map((tab) => {
          const isActive = pathname.startsWith(tab.href);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "border-b-2 px-1 pb-3 text-sm font-medium transition-colors",
                isActive
                  ? "border-primary text-primary"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              )}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}