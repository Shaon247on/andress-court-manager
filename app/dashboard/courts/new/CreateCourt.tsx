// app/dashboard/courts/new/CreateCourt.tsx

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Check, Users, X, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { createCourtAction } from "@/actions/court-manager-court.action";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const gameFormats = [
  { title: "5v5", desc: "10 players" },
  { title: "6v6", desc: "12 players" },
  { title: "7v7", desc: "14 players" },
  { title: "8v8", desc: "16 players" },
  { title: "11v11", desc: "22 players" },
];

export default function CreateCourt() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  // Form state
  const [name, setName] = useState("");
  const [courtType, setCourtType] = useState<"indoor" | "outdoor">("indoor");
  const [selectedFormats, setSelectedFormats] = useState<string[]>([]);
  const [price, setPrice] = useState("");

  const toggleFormat = (format: string) => {
    setSelectedFormats((prev) =>
      prev.includes(format)
        ? prev.filter((f) => f !== format)
        : [...prev, format],
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Court name is required");
      return;
    }
    if (selectedFormats.length === 0) {
      toast.error("At least one game format is required");
      return;
    }
    if (!price) {
      toast.error("Price per hour is required");
      return;
    }

    setLoading(true);
    const formData = new FormData();
    formData.append("name", name);
    formData.append("court_type", courtType);
    formData.append("game_formats", JSON.stringify(selectedFormats));
    formData.append("price_per_hour", price);

    const res = await createCourtAction(formData);
    if (res.success) {
      toast.success(res.data.message);
      router.push(`/dashboard/courts/${res.data.court.id}`);
    } else {
      toast.error(res.message);
    }
    setLoading(false);
  };

  return (
    <div className="h-full flex flex-col bg-white overflow-y-auto">
      <div className="p-4 sm:p-6 lg:p-8 pb-32 max-w-5xl mx-auto w-full">
        <div className="flex items-center mb-6 sm:mb-8">
          <Link
            href="/dashboard/courts"
            className="p-2 hover:bg-slate-100 rounded-full mr-3 sm:mr-4 text-slate-600 transition-colors"
          >
            <ArrowLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </Link>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900">
              Add New Court
            </h1>
            <p className="text-slate-500 text-sm">Create a court listing</p>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* ── Single Page Form ── */}
          <div className="border border-slate-200 rounded-xl p-4 sm:p-6 lg:p-8 bg-white max-w-4xl">
            <div className="space-y-6">
              {/* Court Name */}
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  Court Name <span className="text-red-500">*</span>
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Arena Pro"
                  className="h-12"
                  required
                />
              </div>

              {/* Court Type */}
              <div className="flex items-start justify-between gap-6">
                <div className="w-full">
                  <label className="block text-sm font-bold text-slate-900 mb-2">
                    Court Type <span className="text-red-500">*</span>
                  </label>
                  <div className="flex flex-wrap gap-2 border border-slate-200 rounded-full p-1 max-w-md">
                    <button
                      type="button"
                      onClick={() => setCourtType("indoor")}
                      className={cn(
                        "flex-1 rounded-full py-2.5 text-sm font-bold transition-colors min-w-[60px]",
                        courtType === "indoor"
                          ? "bg-primary text-white"
                          : "text-slate-500 hover:text-slate-900",
                      )}
                    >
                      Indoor
                    </button>
                    <button
                      type="button"
                      onClick={() => setCourtType("outdoor")}
                      className={cn(
                        "flex-1 rounded-full py-2.5 text-sm font-bold transition-colors min-w-[60px]",
                        courtType === "outdoor"
                          ? "bg-primary text-white"
                          : "text-slate-500 hover:text-slate-900",
                      )}
                    >
                      Outdoor
                    </button>
                  </div>
                  <p className="text-xs text-slate-400 mt-2">
                    Select whether the court is indoors, outdoors, or both
                  </p>
                </div>
                <div className="w-full">
                  <label className="block text-sm font-bold text-slate-900 mb-2">
                    Price per Hour (€) <span className="text-red-500">*</span>
                  </label>
                  <div className="max-w-xs">
                    <div className="relative flex items-center">
                      <div className="absolute left-4 font-bold text-slate-400">
                        €
                      </div>
                      <input
                        type="number"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="50.00"
                        step="0.01"
                        min="0"
                        className="flex h-12 w-full rounded-full border border-slate-200 bg-white pl-8 pr-4 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Game Format */}
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-2">
                  Game Format <span className="text-red-500">*</span>
                  <span className="text-xs font-normal text-slate-400 ml-1">
                    (Select multiple)
                  </span>
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 sm:gap-4">
                  {gameFormats.map((format) => {
                    const isSelected = selectedFormats.includes(format.title);
                    return (
                      <button
                        key={format.title}
                        type="button"
                        onClick={() => toggleFormat(format.title)}
                        className={cn(
                          "flex flex-col items-center justify-center p-3 sm:p-4 rounded-xl border transition-all relative",
                          isSelected
                            ? "border-blue-400 bg-blue-50 ring-1 ring-blue-400"
                            : "border-slate-200 hover:border-blue-300",
                        )}
                      >
                        {/* Checkbox in top-right corner */}
                        <div className="absolute top-2 right-2">
                          <div
                            className={cn(
                              "w-4 h-4 rounded border-2 flex items-center justify-center transition-colors",
                              isSelected
                                ? "bg-blue-500 border-blue-500"
                                : "border-slate-300 bg-white",
                            )}
                          >
                            {isSelected && (
                              <Check className="w-3 h-3 text-white" />
                            )}
                          </div>
                        </div>
                        <Users
                          className={cn(
                            "w-6 h-6 sm:w-8 sm:h-8 mb-1 sm:mb-2",
                            isSelected ? "text-slate-800" : "text-slate-400",
                          )}
                        />
                        <div className="font-bold text-slate-900 text-sm sm:text-base">
                          {format.title}
                        </div>
                        <div className="text-xs text-slate-500">
                          {format.desc}
                        </div>
                      </button>
                    );
                  })}
                </div>
                <p className="text-xs text-slate-400 mt-3">
                  Select the game format(s) supported by this court
                </p>
              </div>
              {/* Actions */}
              <div className="pt-6 border-t border-slate-200 flex flex-col sm:flex-row justify-between gap-3 sm:gap-4">
                <Link href="/dashboard/courts" className="sm:flex-1 max-w-xs">
                  <Button
                    variant="outline"
                    className="w-full h-12 rounded-full font-bold"
                  >
                    Cancel
                  </Button>
                </Link>
                <Button
                  type="submit"
                  variant="primary"
                  className="sm:flex-1 max-w-xs h-12 rounded-full font-bold bg-emerald-400 hover:bg-emerald-500"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Check className="w-5 h-5 mr-2" />
                      Create Court
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
