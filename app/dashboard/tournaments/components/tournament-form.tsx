// app/dashboard/tournaments/components/tournament-form.tsx

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
  teamCountOptions,
  teamTypeEnum,
  skillCategoryEnum,
  currencyEnum,
} from "@/app/dashboard/tournaments/lib/tournament.types";
import {
  canEnableGroupStage,
  getSlotsPerTeam,
  getTeamFee,
  formatCategory,
  CURRENCY_SYMBOLS,
} from "@/app/dashboard/tournaments/lib/rules";
import { cn } from "@/lib/utils";
import { TournamentFormInput, tournamentFormSchema } from "../lib/tournamment.schema";
import { Currency, TeamType } from "../lib/types";

const teamTypeOptions = teamTypeEnum.options;
const categoryOptions = skillCategoryEnum.options;
const currencyOptions = currencyEnum.options;

interface TournamentFormProps {
  mode: "create" | "edit";
  initialValues?: Partial<TournamentFormInput>;
  onSubmitAction: (
    values: TournamentFormInput
  ) => Promise<{ success: boolean; message?: string }>;
  onCancel?: () => void;
}

export function TournamentForm({
  mode,
  initialValues,
  onSubmitAction,
  onCancel,
}: TournamentFormProps) {
  const router = useRouter();

  const form = useForm<TournamentFormInput>({
    resolver: zodResolver(tournamentFormSchema),
    defaultValues: {
      name: "",
      short_description: "",
      rules: "",
      format: "knockout",
      skill_category: "low_beginner",
      team_type: "5v5",
      number_of_teams: 4,
      entry_fee_per_player: 0,
      currency: "USD",
      start_date: null,
      end_date: null,
      ...initialValues,
    },
  });

  const teamType = form.watch("team_type");
  const teamCount = form.watch("number_of_teams");
  const format = form.watch("format");
  const entryFeePerPlayer = form.watch("entry_fee_per_player");
  const currency = form.watch("currency");

  const groupStageEligible = canEnableGroupStage(teamCount);
  const slotsPerTeam = getSlotsPerTeam(teamType);
  const capacity = slotsPerTeam * teamCount;
  const teamFee = getTeamFee(entryFeePerPlayer || 0, teamType);
  const currencySymbol = CURRENCY_SYMBOLS[currency];

  useEffect(() => {
    if (!groupStageEligible && format === "group_stage") {
      form.setValue("format", "knockout");
    }
  }, [groupStageEligible, format, form]);

  async function onSubmit(data: TournamentFormInput) {
    const res = await onSubmitAction(data);
    if (res.success) {
      if (mode === "create") {
        toast.success("Tournament created", { description: data.name });
        router.push("/dashboard/tournaments");
        router.refresh();
      }
      // Edit mode: parent closes the dialog + refreshes
    } else {
      toast.error(res.message ?? "Something went wrong");
    }
  }

  const isSubmitting = form.formState.isSubmitting;

  const handleCancel = () => {
    if (onCancel) onCancel();
    else router.back();
  };

  return (
    <Card className="mx-auto w-full max-w-4xl border-none shadow-none">
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
            {/* Format */}
            <Controller
              name="format"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Tournament format</FieldLabel>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => field.onChange("group_stage")}
                      disabled={!groupStageEligible}
                      className={cn(
                        "flex flex-col items-start gap-1 rounded-lg border-2 p-4 text-left transition-all",
                        field.value === "group_stage"
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
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Name */}
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
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Category */}
            <Controller
              name="skill_category"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="t-category">Skill category</FieldLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
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
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Team type & count */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Controller
                name="team_type"
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
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="number_of_teams"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="t-team-count">
                      Number of teams
                    </FieldLabel>
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
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            {/* Currency & Entry fee */}
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
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="entry_fee_per_player"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    className="sm:col-span-2"
                  >
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
                        onChange={(e) =>
                          field.onChange(e.target.valueAsNumber || 0)
                        }
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
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            {/* Start / End dates */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Controller
                name="start_date"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="t-start-date">Start date</FieldLabel>
                    <Input
                      {...field}
                      id="t-start-date"
                      type="date"
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value || null)}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="end_date"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="t-end-date">End date</FieldLabel>
                    <Input
                      {...field}
                      id="t-end-date"
                      type="date"
                      value={field.value ?? ""}
                      onChange={(e) => field.onChange(e.target.value || null)}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            {/* Capacity preview */}
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs text-slate-500">
                Total capacity (auto-calculated)
              </p>
              <p className="mt-0.5 text-sm font-medium text-slate-800">
                {slotsPerTeam} players × {teamCount} teams = {capacity} players
              </p>
            </div>

            {/* Short description */}
            <Controller
              name="short_description"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="t-description">
                    Short description
                  </FieldLabel>
                  <Textarea
                    {...field}
                    id="t-description"
                    placeholder="Brief summary — also mention prize money breakdown here (1st, 2nd, etc.)"
                    rows={3}
                    className="min-h-24 resize-none"
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldDescription>Under 200 characters.</FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Rules */}
            <Controller
              name="rules"
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
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </FieldGroup>
        </form>
      </CardContent>

      <CardFooter>
        <div className="flex w-full justify-end gap-3">
          <Button type="button" variant="outline" onClick={handleCancel}>
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