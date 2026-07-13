"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface SelectOption {
  label: string;
  value: string;
}

interface SelectFilterProps {
  name?: string;
  placeholder?: string;
  options?: SelectOption[];
  defaultValue?: string;
  className?: string;
  clearable?: boolean;
  clearLabel?: string;
}

export default function SelectFilter({
  name = "filter",
  placeholder = "All",
  options = [],
  defaultValue = "all",
  className = "",
  clearable = true,
  clearLabel = "All",
}: SelectFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const current = searchParams.get(name) ?? defaultValue;

  const onChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== defaultValue) {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    params.delete("page");
    router.push(`${window.location.pathname}?${params.toString()}`);
  };

  // Filter out any options with empty string values
  const validOptions = options.filter(opt => opt.value !== "");
  
  // Add "All" option at the beginning if clearable
  const allOptions = clearable 
    ? [{ label: clearLabel, value: defaultValue }, ...validOptions]
    : validOptions;

  return (
    <Select value={current} onValueChange={onChange}>
      <SelectTrigger 
        className={`h-10 min-w-[140px] rounded-lg border border-slate-200 bg-background px-3 text-sm text-foreground shadow-sm outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-colors ${className}`}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="bg-white border border-slate-200 rounded-lg shadow-lg">
        {allOptions.map((opt) => (
          <SelectItem 
            key={opt.value} 
            value={opt.value}
            className="cursor-pointer hover:bg-slate-50 transition-colors focus:bg-slate-50"
          >
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}