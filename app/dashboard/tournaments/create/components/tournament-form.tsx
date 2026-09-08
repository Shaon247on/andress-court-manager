"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

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
import { Switch } from "@/components/ui/switch";

import {
  createTournamentSchema,
  teamCountOptions,
  teamTypeEnum,
  tournamentCategoryEnum,
  type CreateTournamentInput,
  type TeamType,
  type TournamentCategory,
} from "@/app/dashboard/tournaments/lib/types";
import { canEnableGroupStage, getSlotsPerTeam } from "@/app/dashboard/tournaments/lib/rules";

const teamTypeOptions = teamTypeEnum.options;
const categoryOptions = tournamentCategoryEnum.options;

export function TournamentForm() {
  const router = useRouter();

  const form = useForm<CreateTournamentInput>({
    resolver: zodResolver(createTournamentSchema),
    defaultValues: {
      name: "",
      shortDescription: "",
      prizeMoney: 0,
      rulesAndRegulations: "",
      teamType: "5v5",
      category: "open",
      teamCount: 4,
      entryFeePerTeam: 0,
      hasGroupStage: false,
      additionalInfo: [],
    },
  });

  const {
    fields: additionalInfoFields,
    append: appendAdditionalInfo,
    remove: removeAdditionalInfo,
  } = useFieldArray({
    control: form.control,
    name: "additionalInfo",
  });

  const teamType = form.watch("teamType");
  const teamCount = form.watch("teamCount");
  const hasGroupStage = form.watch("hasGroupStage");

  const groupStageEligible = canEnableGroupStage(teamCount);
  const capacity = getSlotsPerTeam(teamType) * teamCount;

  // If team count drops below the minimum while the toggle is on, turn it off
  // automatically so the form can never be submitted in an invalid state.
  useEffect(() => {
    if (!groupStageEligible && hasGroupStage) {
      form.setValue("hasGroupStage", false);
    }
  }, [groupStageEligible, hasGroupStage, form]);

  function onSubmit(data: CreateTournamentInput) {
    console.log("Create tournament", { ...data, capacity });
    toast.success("Tournament created", {
      description: data.name,
    });
    router.push("/dashboard/tournaments");
  }

  return (
    <Card className="mx-auto w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Create Tournament</CardTitle>
        <CardDescription>
          Set up the tournament details, team structure, and stage format.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form id="form-create-tournament" onSubmit={form.handleSubmit(onSubmit)}>
          <FieldGroup className="space-y-0">
            {/* ── Name ── */}
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-tournament-name">Tournament name</FieldLabel>
                  <Input
                    {...field}
                    id="form-tournament-name"
                    aria-invalid={fieldState.invalid}
                    placeholder="Summer Cup 2026"
                    autoComplete="off"
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* ── Short description ── */}
            <Controller
              name="shortDescription"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-tournament-description">Short description</FieldLabel>
                  <Textarea
                    {...field}
                    id="form-tournament-description"
                    placeholder="A brief summary shown at the top of the tournament page."
                    rows={3}
                    className="min-h-24 resize-none"
                    aria-invalid={fieldState.invalid}
                  />
                  <FieldDescription>Keep it under 200 characters.</FieldDescription>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* ── Category & Team type ── */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Controller
                name="category"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-tournament-category">Category</FieldLabel>
                    <Select
                      onValueChange={(value) => field.onChange(value as TournamentCategory)}
                      value={field.value}
                    >
                      <SelectTrigger id="form-tournament-category" className="w-full capitalize">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categoryOptions.map((option) => (
                          <SelectItem key={option} value={option} className="capitalize">
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="teamType"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-tournament-team-type">Team type</FieldLabel>
                    <Select
                      onValueChange={(value) => field.onChange(value as TeamType)}
                      value={field.value}
                    >
                      <SelectTrigger id="form-tournament-team-type" className="w-full">
                        <SelectValue placeholder="Select team type" />
                      </SelectTrigger>
                      <SelectContent>
                        {teamTypeOptions.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>

            {/* ── Team count & Entry fee ── */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Controller
                name="teamCount"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-tournament-team-count">Number of teams</FieldLabel>
                    <Select
                      onValueChange={(value) => field.onChange(Number(value))}
                      value={String(field.value)}
                    >
                      <SelectTrigger id="form-tournament-team-count" className="w-full">
                        <SelectValue placeholder="Select number of teams" />
                      </SelectTrigger>
                      <SelectContent>
                        {teamCountOptions.map((option) => (
                          <SelectItem key={option} value={String(option)}>
                            {option} teams
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />

              <Controller
                name="entryFeePerTeam"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-tournament-entry-fee">Entry fee (per team)</FieldLabel>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                        $
                      </span>
                      <Input
                        {...field}
                        id="form-tournament-entry-fee"
                        type="number"
                        min={0}
                        className="pl-6"
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                        aria-invalid={fieldState.invalid}
                      />
                    </div>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            </div>

            {/* ── Prize money ── */}
            <Controller
              name="prizeMoney"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-tournament-prize">Prize money</FieldLabel>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">
                      $
                    </span>
                    <Input
                      {...field}
                      id="form-tournament-prize"
                      type="number"
                      min={0}
                      className="pl-6"
                      onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      aria-invalid={fieldState.invalid}
                    />
                  </div>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* ── Capacity preview (read-only, auto-calculated) ── */}
            <div className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs text-slate-500">Total capacity (auto-calculated)</p>
              <p className="mt-0.5 text-sm font-medium text-slate-800">
                {getSlotsPerTeam(teamType)} players &times; {teamCount} teams = {capacity} players
              </p>
            </div>

            {/* ── Group stage toggle ── */}
            <Controller
              name="hasGroupStage"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <div className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3">
                    <div className="pr-4">
                      <FieldLabel className="text-sm">Include group stage</FieldLabel>
                      <FieldDescription className="text-xs">
                        {groupStageEligible
                          ? "Teams will be split into groups before the knockout stage."
                          : "Requires at least 8 teams. This tournament will go straight to knockout."}
                      </FieldDescription>
                    </div>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={!groupStageEligible}
                      id="form-tournament-group-stage"
                    />
                  </div>
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* ── Rules & regulations ── */}
            <Controller
              name="rulesAndRegulations"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel htmlFor="form-tournament-rules">Rules & regulations</FieldLabel>
                  <Textarea
                    {...field}
                    id="form-tournament-rules"
                    placeholder="List the rules players and teams must follow..."
                    rows={5}
                    className="min-h-32 resize-none"
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                </Field>
              )}
            />

            {/* ── Additional info ── */}
            <Field>
              <div className="flex items-center justify-between">
                <div>
                  <FieldLabel>Additional info</FieldLabel>
                  <FieldDescription className="text-xs">
                    e.g. location, instructions, player level, cash payment details.
                  </FieldDescription>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="gap-1.5"
                  onClick={() => appendAdditionalInfo({ label: "", value: "" })}
                >
                  <Plus className="h-3.5 w-3.5" />
                  Add info
                </Button>
              </div>

              {additionalInfoFields.length === 0 && (
                <p className="mt-3 rounded-lg border border-dashed border-slate-200 px-4 py-6 text-center text-sm text-slate-400">
                  No additional info added yet.
                </p>
              )}

              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {additionalInfoFields.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex items-start gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3"
                  >
                    <div className="flex-1 space-y-2">
                      <Controller
                        name={`additionalInfo.${index}.label`}
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <Input
                              {...field}
                              placeholder="Label (e.g. Location)"
                              className="h-8 text-sm"
                              aria-invalid={fieldState.invalid}
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                          </Field>
                        )}
                      />
                      <Controller
                        name={`additionalInfo.${index}.value`}
                        control={form.control}
                        render={({ field, fieldState }) => (
                          <Field data-invalid={fieldState.invalid}>
                            <Input
                              {...field}
                              placeholder="Value (e.g. Riverside Park)"
                              className="h-8 text-sm"
                              aria-invalid={fieldState.invalid}
                            />
                            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                          </Field>
                        )}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => removeAdditionalInfo(index)}
                      aria-label="Remove info"
                      className="mt-1 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-md text-slate-400 hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
      <CardFooter>
        <div className="flex w-full justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Cancel
          </Button>
          <Button type="submit" form="form-create-tournament">
            Create Tournament
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}