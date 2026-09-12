"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import {
  Loader2,
  Search,
  X,
  Check,
  Layers,
  AlertCircle,
  Euro,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldDescription,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { DateTimePicker } from "@/components/common/DateTimePicker";
import { cn } from "@/lib/utils";
import {
  createMergedCourtAction,
  getCourtsAction,
} from "@/actions/court-manager-court.action";
import type { CourtResult } from "@/types/CourtManagerCourt.type";

// ── Schema ──
const formSchema = z.object({
  court_ids: z.array(z.string()).min(2, "Select at least 2 courts to merge"),
  start_time: z.string().min(1, "Start time is required"),
  end_time: z.string().min(1, "End time is required"),
  price: z.number().min(0, "Price must be at least 0"),
});

type MergeFormValues = z.infer<typeof formSchema>;

interface MergeCourtDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function MergeCourtDialog({
  open,
  onOpenChange,
  onSuccess,
}: MergeCourtDialogProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = React.useState(false);

  // ── Courts state (infinite scroll) ──
  const [courts, setCourts] = React.useState<CourtResult[]>([]);
  const [page, setPage] = React.useState(1);
  const [hasMore, setHasMore] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [initialLoading, setInitialLoading] = React.useState(false);
  const [loadError, setLoadError] = React.useState<string | null>(null);

  // ── Search ──
  const [searchQuery, setSearchQuery] = React.useState("");
  const [debouncedSearch, setDebouncedSearch] = React.useState("");

  // ── Refs ──
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);
  const loadMoreRef = React.useRef<HTMLDivElement>(null);
  const requestIdRef = React.useRef(0);

  // ── Form ──
  const form = useForm<MergeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      court_ids: [],
      start_time: "",
      end_time: "",
      price: 0,
    },
  });

  const selectedCourtIds = form.watch("court_ids");

  // ── Debounce search ──
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // ── Fetch a page of courts ──
  const fetchCourtsPage = React.useCallback(
    async (pageToLoad: number, search: string, append: boolean) => {
      const requestId = ++requestIdRef.current;

      if (pageToLoad === 1) setInitialLoading(true);
      else setLoading(true);
      setLoadError(null);

      const res = await getCourtsAction({
        status: "active",
        search: search || undefined,
        page: pageToLoad,
      });

      if (requestId !== requestIdRef.current) return;

      if (res.success) {
        const filtered = res.data.results.filter(
          (c) => c.is_merged === false && c.status !== "merged"
        );

        setCourts((prev) => (append ? [...prev, ...filtered] : filtered));

        const pageSize = 10;
        const apiHasMore =
          res.data.count > pageToLoad * pageSize ||
          res.data.results.length === pageSize;
        setHasMore(apiHasMore);
        setPage(pageToLoad);
      } else {
        setLoadError(res.message);
        if (!append) setCourts([]);
      }

      setInitialLoading(false);
      setLoading(false);
    },
    []
  );

  // ── Reset & load first page when dialog opens or search changes ──
  React.useEffect(() => {
    if (!open) return;

    setCourts([]);
    setPage(1);
    setHasMore(true);
    setLoadError(null);

    fetchCourtsPage(1, debouncedSearch, false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, debouncedSearch]);

  // ── Reset everything when dialog closes ──
  React.useEffect(() => {
    if (!open) {
      setSearchQuery("");
      setDebouncedSearch("");
      setCourts([]);
      setPage(1);
      setHasMore(true);
      setLoadError(null);
      form.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // ── Infinite scroll ──
  React.useEffect(() => {
    if (!open) return;
    const sentinel = loadMoreRef.current;
    const container = scrollContainerRef.current;
    if (!sentinel || !container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (
          entry.isIntersecting &&
          hasMore &&
          !loading &&
          !initialLoading &&
          !loadError
        ) {
          fetchCourtsPage(page + 1, debouncedSearch, true);
        }
      },
      { root: container, rootMargin: "120px", threshold: 0.1 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [
    open,
    hasMore,
    loading,
    initialLoading,
    loadError,
    page,
    debouncedSearch,
    fetchCourtsPage,
  ]);

  // ── Selected courts (for chips) ──
  const selectedCourts = React.useMemo(() => {
    return courts.filter((c) => selectedCourtIds.includes(c.id));
  }, [courts, selectedCourtIds]);

  const toggleCourt = (courtId: string) => {
    const current = form.getValues("court_ids");
    if (current.includes(courtId)) {
      form.setValue(
        "court_ids",
        current.filter((id) => id !== courtId),
        { shouldValidate: true }
      );
    } else {
      form.setValue("court_ids", [...current, courtId], {
        shouldValidate: true,
      });
    }
  };

  const removeCourt = (courtId: string) => {
    const current = form.getValues("court_ids");
    form.setValue(
      "court_ids",
      current.filter((id) => id !== courtId),
      { shouldValidate: true }
    );
  };

  async function onSubmit(data: MergeFormValues) {
    setSubmitting(true);
    const res = await createMergedCourtAction(data);
    if (res.success) {
      toast.success(res.data.message);
      form.reset();
      onOpenChange(false);
      onSuccess?.();
      router.refresh();
    } else {
      toast.error(res.message);
    }
    setSubmitting(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-purple-500" />
            Merge Courts
          </DialogTitle>
          <DialogDescription>
            Select at least 2 active courts to merge into a single bookable
            space.
          </DialogDescription>
        </DialogHeader>

        <form id="form-merge-court" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="space-y-6">
            {/* ── Court Selection ── */}
            <Controller
              name="court_ids"
              control={form.control}
              render={({ fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <div className="flex items-center justify-between">
                    <FieldLabel>
                      Select Courts{" "}
                      <span className="text-slate-400 font-normal">
                        ({selectedCourtIds.length} selected)
                      </span>
                    </FieldLabel>
                    {selectedCourtIds.length > 0 && (
                      <button
                        type="button"
                        onClick={() =>
                          form.setValue("court_ids", [], {
                            shouldValidate: true,
                          })
                        }
                        className="text-xs text-red-500 hover:text-red-700 font-medium"
                      >
                        Clear all
                      </button>
                    )}
                  </div>

                  {selectedCourts.length > 0 && (
                    <div className="flex flex-wrap gap-2 p-3 rounded-lg border border-emerald-200 bg-emerald-50/50">
                      {selectedCourts.map((court) => (
                        <div
                          key={court.id}
                          className="inline-flex items-center gap-1.5 pl-2.5 pr-1 py-1 rounded-full bg-white border border-emerald-300 shadow-sm"
                        >
                          <span className="text-xs font-medium text-slate-800">
                            {court.name}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeCourt(court.id)}
                            className="flex h-4 w-4 items-center justify-center rounded-full text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            aria-label={`Remove ${court.name}`}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Search */}
                  <div className="relative flex items-center">
                    <Search className="absolute left-3 h-4 w-4 text-slate-400 pointer-events-none" />
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search courts by name..."
                      className="pl-9 pr-10"
                    />
                    {searchQuery && (
                      <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        aria-label="Clear search"
                        className="absolute right-3 flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                      >
                        <X className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Courts list */}
                  <div
                    ref={scrollContainerRef}
                    className="rounded-lg border border-slate-200 bg-white max-h-64 overflow-y-auto"
                  >
                    {initialLoading ? (
                      <div className="flex flex-col items-center justify-center py-10">
                        <Loader2 className="w-6 h-6 animate-spin text-emerald-500 mb-2" />
                        <p className="text-xs text-slate-500">
                          Loading courts...
                        </p>
                      </div>
                    ) : loadError && courts.length === 0 ? (
                      <div className="px-4 py-8 text-center">
                        <AlertCircle className="w-6 h-6 text-red-500 mx-auto mb-2" />
                        <p className="text-sm text-red-500 mb-3">
                          {loadError}
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            fetchCourtsPage(1, debouncedSearch, false)
                          }
                        >
                          Retry
                        </Button>
                      </div>
                    ) : courts.length === 0 ? (
                      <div className="px-4 py-10 text-center">
                        <p className="text-sm text-slate-500">
                          {debouncedSearch
                            ? `No courts match "${debouncedSearch}"`
                            : "No available courts to merge."}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          Only active, non-merged courts can be selected.
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="divide-y divide-slate-100">
                          {courts.map((court) => {
                            const isSelected = selectedCourtIds.includes(
                              court.id
                            );
                            return (
                              <button
                                key={court.id}
                                type="button"
                                onClick={() => toggleCourt(court.id)}
                                className={cn(
                                  "flex w-full items-center gap-3 px-3 py-2.5 text-left transition-colors",
                                  isSelected
                                    ? "bg-emerald-50/60"
                                    : "hover:bg-slate-50"
                                )}
                              >
                                <div
                                  className={cn(
                                    "flex h-5 w-5 shrink-0 items-center justify-center rounded border-2 transition-colors",
                                    isSelected
                                      ? "border-emerald-500 bg-emerald-500"
                                      : "border-slate-300 bg-white"
                                  )}
                                >
                                  {isSelected && (
                                    <Check className="h-3 w-3 text-white" />
                                  )}
                                </div>

                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2">
                                    <p className="truncate text-sm font-medium text-slate-900">
                                      {court.name}
                                    </p>
                                    <span className="inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600 capitalize">
                                      {court.court_type}
                                    </span>
                                  </div>
                                  <p className="truncate text-xs text-slate-500 mt-0.5">
                                    {court.location} • €{court.price_per_hour}/hr
                                  </p>
                                </div>

                                <div className="hidden sm:flex flex-wrap gap-1 shrink-0">
                                  {court.game_formats.slice(0, 2).map((f) => (
                                    <span
                                      key={f}
                                      className="inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-600"
                                    >
                                      {f}
                                    </span>
                                  ))}
                                  {court.game_formats.length > 2 && (
                                    <span className="inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-500">
                                      +{court.game_formats.length - 2}
                                    </span>
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>

                        {/* Infinite scroll sentinel */}
                        <div ref={loadMoreRef} className="py-3">
                          {loading && (
                            <div className="flex items-center justify-center gap-2">
                              <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                              <span className="text-xs text-slate-500">
                                Loading more...
                              </span>
                            </div>
                          )}
                          {!hasMore && courts.length > 0 && (
                            <div className="text-center">
                              <span className="text-xs text-slate-400">
                                You&apos;ve reached the end
                              </span>
                            </div>
                          )}
                        </div>
                      </>
                    )}
                  </div>

                  <FieldDescription>
                    Minimum 2 courts required. Only active courts that are not
                    already merged are shown. Scroll to load more.
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* ── Start & End Time ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Controller
                name="start_time"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-merge-start">
                      Start Time
                    </FieldLabel>
                    <DateTimePicker
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Pick start date & time"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="end_time"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-merge-end">End Time</FieldLabel>
                    <DateTimePicker
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="Pick end date & time"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            {/* ── Price (fixed layout) ── */}
            <Controller
              name="price"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-merge-price">
                    Price per Hour
                  </FieldLabel>
                  <div className="relative flex items-center">
                    {/* Euro icon */}
                    <Euro className="absolute z-10 left-3 h-4 w-4 text-slate-400 pointer-events-none" />
                    {/* Input */}
                    <Input
                      id="form-merge-price"
                      type="number"
                      min={0}
                      step={0.5}
                      placeholder="0.00"
                      className={cn(
                        "pl-9 pr-14 text-sm font-medium border2",
                        fieldState.invalid && "border-red-500 focus:ring-red-500"
                      )}
                      value={field.value === 0 ? "" : field.value}
                      onChange={(e) =>
                        field.onChange(parseFloat(e.target.value) || 0)
                      }
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                    />
                    {/* Suffix */}
                    <span className="relative left-2 text-sm font-medium text-slate-400 pointer-events-none">
                      / hour
                    </span>
                  </div>
                  <FieldDescription>
                    The hourly rate for the merged court session.
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="form-merge-court"
            variant="primary"
            disabled={submitting || selectedCourtIds.length < 2}
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Merging...
              </>
            ) : (
              `Merge ${selectedCourtIds.length} Courts`
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}