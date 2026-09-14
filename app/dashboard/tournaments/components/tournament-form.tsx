"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Trophy, Swords, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  tournamentFormSchema,
  teamCountOptions,
  teamTypeEnum,
  tournamentCategoryEnum,
  currencyEnum,
  type TournamentFormInput,
  type TeamType,
  type TournamentCategory,
  type Currency,
  type TournamentFormat,
} from "@/app/dashboard/tournaments/lib/types";
import {
  canEnableGroupStage,
  getSlotsPerTeam,
  getTeamFee,
  formatCategory,
  CURRENCY_SYMBOLS,
} from "@/app/dashboard/tournaments/lib/rules";
import { cn } from "@/lib/utils";

const teamTypeOptions = teamTypeEnum.options;
const categoryOptions = tournamentCategoryEnum.options;
const currencyOptions = currencyEnum.options;

interface TournamentFormProps {
  mode: "create" | "edit";
  initialValues?: Partial<TournamentFormInput>;
  onSubmitAction: (values: TournamentFormInput) => Promise<{ success: boolean; message?: string }>;
}

export function TournamentForm({
  mode,
  initialValues,
  onSubmitAction,
}: TournamentFormProps) {
  const router = useRouter();

  const form = useForm<TournamentFormInput>({
    resolver: zodResolver(tournamentFormSchema),
    defaultValues: {
      name: "",
      shortDescription: "",
      rulesAndRegulations: "",
      format: "knockout",
      category: "low_beginner",
      teamType: "5v5",
      teamCount: 4,
      entryFeePerPlayer: 0,
      currency: "USD",
      ...initialValues,
    },
  });

  const teamType = form.watch("teamType");
  const teamCount = form.watch("teamCount");
  const format = form.watch("format");
  const entryFeePerPlayer = form.watch("entryFeePerPlayer");
  const currency = form.watch("currency");

  const groupStageEligible = canEnableGroupStage(teamCount);
  const slotsPerTeam = getSlotsPerTeam(teamType);
  const capacity = slotsPerTeam * teamCount;
  const teamFee = getTeamFee(entryFeePerPlayer || 0, teamType);
  const currencySymbol = CURRENCY_SYMBOLS[currency];

  // If user picks "group" but then drops team count below 8, force back to knockout
  useEffect(() => {
    if (!groupStageEligible && format === "group") {
      form.setValue("format", "knockout");
    }
  }, [groupStageEligible, format, form]);

  async function onSubmit(data: TournamentFormInput) {
    const res = await onSubmitAction(data);
    if (res.success) {
      toast.success(
        mode === "create" ? "Tournament created" : "Tournament updated",
        { description: data.name }
      );
      router.push("/dashboard/tournaments");
      router.refresh();
    } else {
      toast.error(res.message ?? "Something went wrong");
    }
  }

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">
          {mode === "create" ? "Create Tournament" : "Edit Tournament"}
        </CardTitle>
        <CardDescription>
          {mode === "create"
            ? "Set up the tournament details, format, and stage structure."
            : "Update the tournament details. Changes apply immediately."}
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form id="form-tournament" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="space-y-5">
            {/* ── 1. Format selector (top, drives everything else) ── */}
            <Controller
              name="format"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Tournament format</FieldLabel>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => field.onChange("group")}
                      disabled={!groupStageEligible}
                      className={cn(
                        "flex flex-col items-start gap-1 rounded-lg border-2 p-4 text-left transition-all",
                        field.value === "group"
                          ? "border-teal-500 bg-teal-50"
                          : "border-slate-200 bg-white hover:border-slate-300",
                        !groupStageEligible && "opacity-50 cursor-not-allowed"
                      )}
                    >
                      <Trophy className="h-5 w-5 text-teal-600" />
                      <span className="text-sm font-semibold text-slate-800">
                        Group Stage
                      </span>
                      <span className="text-xs text-slate-500">
                        {groupStageEligible
                          ? "Split into groups, then knockouts."
                          : "Requires 8+ teams."}
                      </span>
                    </button>

                    <button
                      type="button"
                      onClick={() => field.onChange("knockout")}
                      className={cn(
                        "flex flex-col items-start gap-1 rounded-lg border-2 p-4 text-left transition-all",
                        field.value === "knockout"
                          ? "border-teal-500 bg-teal-50"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      )}
                    >
                      <Swords className="h-5 w-5 text-teal-600" />
                      <span className="text-sm font-semibold text-slate-800">
                        Knockout
                      </span>
                      <span className="text-xs text-slate-500">
                        Single elimination bracket.
                      </span>
                    </button>
                  </div>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* ── 2. Name ── */}
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="t-name">Tournament name</FieldLabel>
                  <Input
                    {...field}
                    id="t-name"
                    placeholder="Summer Cup 2026"
                    autoComplete="off"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* ── 3. Category (9-level) ── */}
            <Controller
              name="category"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="t-category">Skill category</FieldLabel>
                  <Select
                    onValueChange={(v) => field.onChange(v as TournamentCategory)}
                    value={field.value}
                  >
                    <SelectTrigger id="t-category" className="w-full">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map((opt) => (
                        <SelectItem key={opt} value={opt}>
                          {formatCategory(opt)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* ── 4. Team type & count ── */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Controller
                name="teamType"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="t-team-type">Team type</FieldLabel>
                    <Select
                      onValueChange={(v) => field.onChange(v as TeamType)}
                      value={field.value}
                    >
                      <SelectTrigger id="t-team-type" className="w-full">
                        <SelectValue placeholder="Select team type" />
                      </SelectTrigger>
                      <SelectContent>
                        {teamTypeOptions.map((opt) => (
                          <SelectItem key={opt} value={opt}>
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="teamCount"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="t-team-count">Number of teams</FieldLabel>
                    <Select
                      onValueChange={(v) => field.onChange(Number(v))}
                      value={String(field.value)}
                    >
                      <SelectTrigger id="t-team-count" className="w-full">
                        <SelectValue placeholder="Select number of teams" />
                      </SelectTrigger>
                      <SelectContent>
                        {teamCountOptions.map((opt) => (
                          <SelectItem key={opt} value={String(opt)}>
                            {opt} teams
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>

            {/* ── 5. Currency & Entry fee (per player) ── */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Controller
                name="currency"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="t-currency">Currency</FieldLabel>
                    <Select
                      onValueChange={(v) => field.onChange(v as Currency)}
                      value={field.value}
                    >
                      <SelectTrigger id="t-currency" className="w-full">
                        <SelectValue placeholder="Currency" />
                      </SelectTrigger>
                      <SelectContent>
                        {currencyOptions.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c} ({CURRENCY_SYMBOLS[c]})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="entryFeePerPlayer"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} className="sm:col-span-2">
                    <FieldLabel htmlFor="t-entry-fee">
                      Entry fee (per player)
                    </FieldLabel>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                        {currencySymbol}
                      </span>
                      <Input
                        {...field}
                        id="t-entry-fee"
                        type="number"
                        min={0}
                        className="pl-8 pr-32"
                        onChange={(e) => field.onChange(e.target.valueAsNumber || 0)}
                      />
                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400">
                        {currencySymbol}
                        {teamFee} / team
                      </span>
                    </div>
                    <FieldDescription className="text-xs">
                      Auto-calculated: {currencySymbol}
                      {entryFeePerPlayer || 0} × {slotsPerTeam} players ={" "}
                      {currencySymbol}
                      {teamFee} per team
                    </FieldDescription>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>

            {/* ── 6. Capacity preview ── */}
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs text-slate-500">Total capacity (auto-calculated)</p>
              <p className="mt-0.5 text-sm font-medium text-slate-800">
                {slotsPerTeam} players × {teamCount} teams = {capacity} players
              </p>
            </div>

            {/* ── 7. Short description (with prize info) ── */}
            <Controller
              name="shortDescription"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="t-description">Short description</FieldLabel>
                  <Textarea
                    {...field}
                    id="t-description"
                    placeholder="Brief summary — also mention prize money breakdown here (1st, 2nd, etc.)"
                    rows={3}
                    className="min-h-24 resize-none"
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldDescription>Under 200 characters.</FieldDescription>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* ── 8. Rules & regulations ── */}
            <Controller
              name="rulesAndRegulations"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="t-rules">Rules & regulations</FieldLabel>
                  <Textarea
                    {...field}
                    id="t-rules"
                    placeholder="List the rules players and teams must follow..."
                    rows={5}
                    className="min-h-32 resize-none"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter>
        <div className="flex w-full justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" form="form-tournament" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                {mode === "create" ? "Creating..." : "Saving..."}
              </>
            ) : mode === "create" ? (
              "Create Tournament"
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}