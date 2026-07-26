"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Building2,
  MapPin,
  Globe,
  CalendarDays,
  FileText,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Mail,
  Phone,
  Eye,
  EyeOff,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { ScheduleStep } from "./steps/ScheduleStep";
import { registerCourtManagerAction } from "@/actions/registration.action";
import { toast } from "sonner";
import type { RegistrationSchedule } from "@/types/Registration.type";
import { MapLocationPicker } from "./MapLocationPicker";
import {
  registrationFieldValidators,
  registrationScheduleSchema,
  registrationPayloadObjectSchema,
  timeStringSchema,
  type RegistrationField,
} from "@/schemas/Registration.schema";

const steps = [
  { id: 1, label: "Basic Info", icon: Building2 },
  { id: 2, label: "Location Details", icon: MapPin },
  { id: 3, label: "Map Location", icon: Globe },
  { id: 4, label: "Schedule", icon: CalendarDays },
  { id: 5, label: "Terms", icon: FileText },
];

const defaultSchedule: RegistrationSchedule = {
  monday: { is_open: true, open: "10:00", close: "22:00" },
  tuesday: { is_open: true, open: "10:00", close: "22:00" },
  wednesday: { is_open: true, open: "10:00", close: "22:00" },
  thursday: { is_open: true, open: "10:00", close: "22:00" },
  friday: { is_open: true, open: "10:00", close: "23:00" },
  saturday: { is_open: true, open: "09:00", close: "23:00" },
  sunday: { is_open: false, open: "10:00", close: "22:00" },
};

// Fields checked when gating "Next" on Step 1 / Step 2.
const step1Fields: RegistrationField[] = ["firstName", "lastName", "clubName", "email", "phone", "password", "website"];
const step2Fields: RegistrationField[] = ["country", "city", "street", "state", "zip"];

interface FormErrors {
  firstName?: string;
  lastName?: string;
  clubName?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  website?: string;
  country?: string;
  city?: string;
  street?: string;
  state?: string;
  zip?: string;
  location?: string;
  cancellationHours?: string;
  schedule?: Partial<Record<keyof RegistrationSchedule, { open?: string; close?: string }>>;
}

// Helper components moved outside of main component
const InputWithIcon = ({
  label,
  required,
  icon: Icon,
  rightIcon,
  error,
  ...props
}: any) => (
  <div className="flex flex-col">
    <label className="text-sm text-slate-700 font-bold mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Icon className="w-5 h-5 text-slate-400" />
        </div>
      )}
      <Input
        className={cn(
          "h-12 text-slate-700 font-medium",
          Icon && "pl-11",
          error ? "border-red-400 focus-visible:ring-red-400" : "border-slate-200"
        )}
        {...props}
      />
      {rightIcon && (
        <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
          {rightIcon}
        </div>
      )}
    </div>
    {error && <p className="text-xs text-red-500 font-medium mt-1.5">{error}</p>}
  </div>
);

const CustomSelect = ({
  label,
  required,
  value,
  onChange,
  onBlur,
  options,
  placeholder,
  error,
}: any) => (
  <div className="flex flex-col">
    <label className="text-sm text-slate-700 font-bold mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <select
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        className={cn(
          "w-full h-12 px-4 appearance-none rounded-lg border bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-slate-700 font-medium cursor-pointer",
          error ? "border-red-400" : "border-slate-200"
        )}
      >
        <option value="" disabled>
          {placeholder || "Please Select"}
        </option>
        {options.map((opt: string) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
        <ChevronDown className="w-4 h-4 text-slate-400" />
      </div>
    </div>
    {error && <p className="text-xs text-red-500 font-medium mt-1.5">{error}</p>}
  </div>
);

export default function RegisterPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);

  const [errors, setErrors] = useState<FormErrors>({});

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    clubName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    website: "",
    country: "",
    city: "",
    street: "",
    state: "",
    zip: "",
    latitude: 40.7128,
    longitude: -74.006,
    schedule: defaultSchedule,
    cancellationHours: 24,
  });

  const updateForm = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateSchedule = (schedule: RegistrationSchedule) => {
    setFormData((prev) => ({ ...prev, schedule }));
  };

  const updateCancellationHours = (hours: number) => {
    setFormData((prev) => ({ ...prev, cancellationHours: hours }));
  };

  const updateLocation = (lat: number, lng: number) => {
    setFormData((prev) => ({ ...prev, latitude: lat, longitude: lng }));
  };

  // ── Single-field, on-blur validation (Step 1 & 2) ──
  const validateField = (field: RegistrationField, value: string) => {
    const result = registrationFieldValidators[field].safeParse(value);
    setErrors((prev) => ({ ...prev, [field]: result.success ? undefined : result.error.issues[0].message }));
  };

  const validateConfirmPassword = (value: string, passwordValue: string) => {
    const baseResult = registrationFieldValidators.confirmPassword.safeParse(value);
    let message = baseResult.success ? undefined : baseResult.error.issues[0].message;
    if (!message && value !== passwordValue) message = "Passwords don't match";
    setErrors((prev) => ({ ...prev, confirmPassword: message }));
  };

  // ── Per-day schedule field, on-blur validation (Step 4) ──
  const validateDayField = (day: keyof RegistrationSchedule, field: "open" | "close", value: string) => {
    const result = timeStringSchema.safeParse(value);
    setErrors((prev) => ({
      ...prev,
      schedule: {
        ...prev.schedule,
        [day]: { ...prev.schedule?.[day], [field]: result.success ? undefined : result.error.issues[0].message },
      },
    }));
  };

  const validateCancellationHours = (value: number) => {
    const result = registrationPayloadObjectSchema.shape.cancellation_hours.safeParse(value);
    setErrors((prev) => ({ ...prev, cancellationHours: result.success ? undefined : result.error.issues[0].message }));
  };

  // ── Step gates — re-validate everything relevant before advancing ──
  const validateStep1 = () => {
    const nextErrors: FormErrors = { ...errors };
    let isValid = true;

    step1Fields.forEach((field) => {
      const result = registrationFieldValidators[field].safeParse(formData[field]);
      nextErrors[field] = result.success ? undefined : result.error.issues[0].message;
      if (!result.success) isValid = false;
    });

    const confirmResult = registrationFieldValidators.confirmPassword.safeParse(formData.confirmPassword);
    if (!confirmResult.success) {
      nextErrors.confirmPassword = confirmResult.error.issues[0].message;
      isValid = false;
    } else if (formData.confirmPassword !== formData.password) {
      nextErrors.confirmPassword = "Passwords don't match";
      isValid = false;
    } else {
      nextErrors.confirmPassword = undefined;
    }

    setErrors(nextErrors);
    return isValid;
  };

  const validateStep2 = () => {
    const nextErrors: FormErrors = { ...errors };
    let isValid = true;

    step2Fields.forEach((field) => {
      const result = registrationFieldValidators[field].safeParse(formData[field]);
      nextErrors[field] = result.success ? undefined : result.error.issues[0].message;
      if (!result.success) isValid = false;
    });

    setErrors(nextErrors);
    return isValid;
  };

  const validateStep4 = () => {
    const scheduleResult = registrationScheduleSchema.safeParse(formData.schedule);
    const cancellationResult = registrationPayloadObjectSchema.shape.cancellation_hours.safeParse(formData.cancellationHours);

    const nextScheduleErrors: FormErrors["schedule"] = {};
    if (!scheduleResult.success) {
      scheduleResult.error.issues.forEach((issue) => {
        const day = issue.path[0] as keyof RegistrationSchedule;
        const field = issue.path[1] as "open" | "close";
        nextScheduleErrors[day] = { ...nextScheduleErrors[day], [field]: issue.message };
      });
    }

    setErrors((prev) => ({
      ...prev,
      schedule: Object.keys(nextScheduleErrors).length ? nextScheduleErrors : undefined,
      cancellationHours: cancellationResult.success ? undefined : cancellationResult.error.issues[0].message,
    }));

    return scheduleResult.success && cancellationResult.success;
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      const payload = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        club_name: formData.clubName,
        email: formData.email,
        phone_number: formData.phone,
        password: formData.password,
        confirm_password: formData.confirmPassword,
        website: formData.website,
        country: formData.country,
        city: formData.city,
        street_address: formData.street,
        state_province: formData.state,
        zip_postal_code: formData.zip,
        latitude: formData.latitude,
        longitude: formData.longitude,
        agreed_to_terms: agreed,
        schedule: formData.schedule,
        cancellation_hours: formData.cancellationHours,
      };

      const result = await registerCourtManagerAction(payload);

      if (result.success) {
        setShowSuccessModal(true);
        toast.success("Application submitted successfully!");
      } else {
        toast.error(result.message || "Registration failed");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col items-center py-12 px-4">
      {/* Header */}
      <div className="text-center mb-10 w-full max-w-4xl">
        <div className="flex justify-center items-center mb-8">
          <Image
            src="/assets/athlon_logo.png"
            alt="AthlonGo Logo"
            width={250}
            height={80}
          />
        </div>
        <h2 className="text-[32px] font-bold text-slate-900 mb-2">
          Welcome to Court Manager
        </h2>
        <p className="text-slate-500">
          Let&apos;s set up your club profile to get started
        </p>
      </div>

      {/* Progress Bar */}
      <div className="w-full max-w-[900px] bg-white rounded-2xl p-8 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-slate-100 mb-8 mx-auto flex justify-center items-center">
        <div className="flex items-center">
          {steps.map((step, idx) => {
            const isActive = step.id === currentStep;
            const isCompleted = step.id < currentStep;

            return (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center w-20">
                  <div
                    className={cn(
                      "w-[52px] h-[52px] rounded-full flex items-center justify-center shrink-0 mb-3 transition-colors duration-300",
                      isCompleted
                        ? "bg-emerald-500 text-white"
                        : isActive
                          ? "bg-emerald-500 text-white"
                          : "bg-slate-100 text-slate-400",
                    )}
                  >
                    {isCompleted ? (
                      <Check className="w-6 h-6" />
                    ) : (
                      <step.icon className="w-6 h-6" />
                    )}
                  </div>
                  <span
                    className={cn(
                      "text-[11px] font-bold text-center leading-tight max-w-[80px]",
                      isCompleted || isActive
                        ? "text-slate-900"
                        : "text-slate-500",
                    )}
                  >
                    {step.label}
                  </span>
                </div>
                {idx < steps.length - 1 && (
                  <div
                    className={cn(
                      "w-12 md:w-20 h-1 mx-2 -mt-[30px] rounded-full transition-colors duration-300",
                      isCompleted ? "bg-emerald-500" : "bg-slate-200",
                    )}
                  />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Form Container */}
      <div className="w-full max-w-[900px] bg-white rounded-2xl p-10 shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)] border border-slate-100 mb-20 mx-auto">
        <div className="flex items-center mb-8">
          {steps[currentStep - 1].id === 1 && (
            <Building2 className="w-6 h-6 text-emerald-500 mr-3" />
          )}
          {steps[currentStep - 1].id === 2 && (
            <MapPin className="w-6 h-6 text-emerald-500 mr-3" />
          )}
          {steps[currentStep - 1].id === 3 && (
            <Globe className="w-6 h-6 text-emerald-500 mr-3" />
          )}
          {steps[currentStep - 1].id === 4 && (
            <CalendarDays className="w-6 h-6 text-emerald-500 mr-3" />
          )}
          {steps[currentStep - 1].id === 5 && (
            <FileText className="w-6 h-6 text-slate-900 mr-3" />
          )}
          <h3 className="text-xl font-bold text-slate-900">
            {steps[currentStep - 1].label}
          </h3>
        </div>

        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-12">
              <InputWithIcon
                label="First Name"
                required
                value={formData.firstName}
                onChange={(e: any) => updateForm("firstName", e.target.value)}
                onBlur={(e: any) => validateField("firstName", e.target.value)}
                error={errors.firstName}
              />
              <InputWithIcon
                label="Last Name"
                required
                value={formData.lastName}
                onChange={(e: any) => updateForm("lastName", e.target.value)}
                onBlur={(e: any) => validateField("lastName", e.target.value)}
                error={errors.lastName}
              />

              <div className="md:col-span-2">
                <InputWithIcon
                  label="Club Name"
                  required
                  value={formData.clubName}
                  onChange={(e: any) => updateForm("clubName", e.target.value)}
                  onBlur={(e: any) => validateField("clubName", e.target.value)}
                  error={errors.clubName}
                />
              </div>

              <InputWithIcon
                label="Email Address"
                required
                icon={Mail}
                type="email"
                value={formData.email}
                onChange={(e: any) => updateForm("email", e.target.value)}
                onBlur={(e: any) => validateField("email", e.target.value)}
                error={errors.email}
              />
              <InputWithIcon
                label="Phone Number"
                required
                icon={Phone}
                value={formData.phone}
                onChange={(e: any) => updateForm("phone", e.target.value)}
                onBlur={(e: any) => validateField("phone", e.target.value)}
                error={errors.phone}
              />

              <InputWithIcon
                label="Password"
                required
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={(e: any) => updateForm("password", e.target.value)}
                onBlur={(e: any) => {
                  validateField("password", e.target.value);
                  if (formData.confirmPassword) validateConfirmPassword(formData.confirmPassword, e.target.value);
                }}
                error={errors.password}
                placeholder="••••••••"
                rightIcon={
                  <button
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                }
              />
              <InputWithIcon
                label="Confirm Password"
                required
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e: any) =>
                  updateForm("confirmPassword", e.target.value)
                }
                onBlur={(e: any) => validateConfirmPassword(e.target.value, formData.password)}
                error={errors.confirmPassword}
                placeholder="••••••••"
                rightIcon={
                  <button
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-slate-400 hover:text-slate-600"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                }
              />

              <div className="md:col-span-2">
                <InputWithIcon
                  label="Website (Optional)"
                  icon={Globe}
                  value={formData.website}
                  onChange={(e: any) => updateForm("website", e.target.value)}
                  onBlur={(e: any) => validateField("website", e.target.value)}
                  error={errors.website}
                />
              </div>
            </div>
            <div className="flex justify-end pt-6 border-t border-slate-100">
              <Button
                className="h-12 px-10 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-base shadow-sm"
                onClick={() => { if (validateStep1()) setCurrentStep(2); }}
              >
                Next <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 2: Location Details */}
        {currentStep === 2 && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-12">
              <CustomSelect
                label="Country"
                required
                value={formData.country}
                onChange={(e: any) => updateForm("country", e.target.value)}
                onBlur={(e: any) => validateField("country", e.target.value)}
                options={["United States", "United Kingdom", "Canada"]}
                placeholder="Please select Country"
                error={errors.country}
              />
              <InputWithIcon
                label="City"
                required
                value={formData.city}
                onChange={(e: any) => updateForm("city", e.target.value)}
                onBlur={(e: any) => validateField("city", e.target.value)}
                error={errors.city}
              />

              <div className="md:col-span-2">
                <InputWithIcon
                  label="Street Address"
                  required
                  value={formData.street}
                  onChange={(e: any) => updateForm("street", e.target.value)}
                  onBlur={(e: any) => validateField("street", e.target.value)}
                  error={errors.street}
                />
              </div>

              <InputWithIcon
                label="State/Province"
                required
                value={formData.state}
                onChange={(e: any) => updateForm("state", e.target.value)}
                onBlur={(e: any) => validateField("state", e.target.value)}
                error={errors.state}
              />
              <InputWithIcon
                label="ZIP/Postal Code"
                required
                value={formData.zip}
                onChange={(e: any) => updateForm("zip", e.target.value)}
                onBlur={(e: any) => validateField("zip", e.target.value)}
                error={errors.zip}
              />
            </div>

            <div className="flex justify-between items-center pt-6 border-t border-slate-100">
              <Button
                variant="outline"
                className="h-12 px-8 rounded-xl font-bold text-slate-600 border-slate-200 hover:bg-slate-50"
                onClick={() => setCurrentStep(1)}
              >
                <ChevronLeft className="w-5 h-5 mr-2" /> Previous
              </Button>
              <Button
                className="h-12 px-10 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-base shadow-sm"
                onClick={() => { if (validateStep2()) setCurrentStep(3); }}
              >
                Next <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 3: Map Location */}
        {currentStep === 3 && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-500">
            <p className="text-slate-500 text-sm mb-6 -mt-4">
              We centered the map near the address you entered — drag the pin or
              click to fine-tune it
            </p>

            <MapLocationPicker
              latitude={formData.latitude}
              longitude={formData.longitude}
              addressQuery={`${formData.street}, ${formData.city}, ${formData.state} ${formData.zip}, ${formData.country}`}
              onLocationChange={(lat, lng) => updateLocation(lat, lng)}
            />

            <div className="bg-[#fff9eb] border border-[#ffedc2] p-5 rounded-xl mb-12 flex items-center text-sm font-medium text-[#8a6100]">
              <span className="font-bold mr-2 text-[#b07c00]">Note:</span> Make
              sure the pin is placed at your exact club location. This will be
              used for customer navigation and verification.
            </div>

            <div className="flex justify-between items-center pt-6 border-t border-slate-100">
              <Button
                variant="outline"
                className="h-12 px-8 rounded-xl font-bold text-slate-600 border-slate-200 hover:bg-slate-50"
                onClick={() => setCurrentStep(2)}
              >
                <ChevronLeft className="w-5 h-5 mr-2" /> Previous
              </Button>
              <Button
                className="h-12 px-10 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-base shadow-sm"
                onClick={() => setCurrentStep(4)}
              >
                Next <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
            </div>
          </div>
        )}

        {/* Step 4: Schedule */}
        {currentStep === 4 && (
          <ScheduleStep
            schedule={formData.schedule}
            cancellationHours={formData.cancellationHours}
            errors={{ schedule: errors.schedule, cancellationHours: errors.cancellationHours }}
            onScheduleChange={updateSchedule}
            onCancellationChange={updateCancellationHours}
            onDayFieldBlur={validateDayField}
            onCancellationBlur={validateCancellationHours}
            onNext={() => { if (validateStep4()) setCurrentStep(5); }}
            onPrevious={() => setCurrentStep(3)}
          />
        )}

        {/* Step 5: Terms & Conditions */}
        {currentStep === 5 && (
          <div className="animate-in fade-in slide-in-from-right-8 duration-500">
            <div className="bg-[#f8faff] rounded-2xl p-8 border border-[#e6efff] mb-8">
              <h3 className="font-bold text-slate-900 mb-6 text-lg">Summary</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                <div>
                  <h4 className="font-bold text-slate-700 mb-4 text-sm pb-2 border-b border-slate-200">
                    Basic Information
                  </h4>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Club Name:</span>
                      <span className="font-bold text-slate-900 text-right">
                        {formData.clubName || "Not provided"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Email:</span>
                      <span className="font-bold text-slate-900 text-right">
                        {formData.email || "Not provided"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Phone:</span>
                      <span className="font-bold text-slate-900 text-right">
                        {formData.phone || "Not provided"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Website:</span>
                      <span className="font-bold text-slate-900 text-right">
                        {formData.website || "Not provided"}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-slate-700 mb-4 text-sm pb-2 border-b border-slate-200">
                    Location
                  </h4>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Country:</span>
                      <span className="font-bold text-slate-900 text-right">
                        {formData.country || "Not provided"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">City:</span>
                      <span className="font-bold text-slate-900 text-right">
                        {formData.city || "Not provided"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">State:</span>
                      <span className="font-bold text-slate-900 text-right">
                        {formData.state || "Not provided"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500 flex-shrink-0">
                        Address:
                      </span>
                      <span className="font-bold text-slate-900 text-right text-balance pl-6 leading-relaxed">
                        {formData.street || "Not provided"}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">GPS Location:</span>
                      <span className="font-bold text-slate-900 text-right">
                        {formData.latitude}, {formData.longitude}
                      </span>
                    </div>
                  </div>

                  <h4 className="font-bold text-slate-700 mb-4 mt-10 text-sm pb-2 border-b border-slate-200">
                    Schedule
                  </h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">
                        Cancellation Window:
                      </span>
                      <span className="font-bold text-slate-900 text-right">
                        {formData.cancellationHours} hours
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-slate-500">Days Open:</span>
                      <span className="font-bold text-slate-900 text-right">
                        {
                          Object.entries(formData.schedule).filter(
                            ([_, day]) => day.is_open,
                          ).length
                        }{" "}
                        days
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              className="flex items-start bg-white border border-slate-200 rounded-2xl p-6 mb-6 hover:border-emerald-300 transition-colors cursor-pointer"
              onClick={() => setAgreed(!agreed)}
            >
              <div
                className={cn(
                  "w-6 h-6 rounded border flex items-center justify-center mr-4 mt-0.5 shrink-0 transition-colors",
                  agreed
                    ? "bg-emerald-500 border-emerald-500"
                    : "border-slate-300 bg-slate-50",
                )}
              >
                {agreed && <Check className="w-4 h-4 text-white" />}
              </div>
              <p className="text-[15px] text-slate-700 font-medium leading-relaxed">
                I agree to the{" "}
                <span className="text-emerald-600 font-bold hover:underline">
                  Terms and Conditions
                </span>{" "}
                and{" "}
                <span className="text-emerald-600 font-bold hover:underline">
                  Privacy Policy
                </span>
                . I confirm that all the information provided is accurate and I
                have the authority to manage the mentioned facility.
              </p>
            </div>

            <div className="bg-[#f0fdf6] border border-[#dcfce7] rounded-xl p-5 mb-10 text-[15px] text-[#166534] font-medium">
              <span className="font-bold text-[#15803d] mr-2">Next Steps:</span>{" "}
              After submission, our team will verify your club information.
              You&apos;ll receive an email confirmation within 24-48 hours.
            </div>

            <div className="flex justify-between items-center pt-6 border-t border-slate-100">
              <Button
                variant="outline"
                className="h-12 px-8 rounded-xl font-bold text-slate-600 border-slate-200 hover:bg-slate-50"
                onClick={() => setCurrentStep(4)}
              >
                <ChevronLeft className="w-5 h-5 mr-2" /> Previous
              </Button>
              <Button
                className="h-12 px-8 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-base shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!agreed || isSubmitting}
                onClick={handleSubmit}
              >
                {isSubmitting ? (
                  <span className="flex items-center">
                    <span className="animate-spin mr-2">⏳</span> Submitting...
                  </span>
                ) : (
                  <>
                    <Check className="w-5 h-5 mr-2" /> Submit for Verification
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] p-10 max-w-[480px] w-full shadow-2xl relative animate-in zoom-in-95 duration-200">
            <div className="w-20 h-20 rounded-full bg-emerald-50 border-[6px] border-emerald-100 flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-emerald-500" />
            </div>
            <h2 className="text-[26px] font-bold text-slate-900 text-center mb-3">
              Application Submitted!
            </h2>
            <p className="text-slate-500 text-center text-[15px] leading-relaxed mb-8">
              Thank you for applying to become a Court Manager. Your application
              has been submitted successfully and is now under review by our
              admin team.
            </p>

            <div className="bg-[#f0fdf6] rounded-2xl p-6 mb-10 border border-[#dcfce7]">
              <h4 className="font-bold text-[#15803d] mb-4">
                What&apos;s Next?
              </h4>
              <ul className="space-y-3">
                <li className="flex items-start text-sm text-[#166534] font-medium leading-tight">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1 mr-3 shrink-0" />
                  Admin will review your application
                </li>
                <li className="flex items-start text-sm text-[#166534] font-medium leading-tight">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1 mr-3 shrink-0" />
                  You&apos;ll receive an email notification
                </li>
                <li className="flex items-start text-sm text-[#166534] font-medium leading-tight">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1 mr-3 shrink-0" />
                  Approval typically takes 1-3 business days
                </li>
              </ul>
            </div>

            <Link href="/" className="w-full block">
              <Button className="w-full h-14 rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-bold text-lg shadow-md">
                Back to Login
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}