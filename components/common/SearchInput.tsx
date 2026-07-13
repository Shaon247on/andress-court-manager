"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface SearchInputProps {
  name?: string;
  placeholder?: string;
  debounceDelay?: number;
}

export default function SearchInput({
  name = "search",
  placeholder = "Search...",
  debounceDelay = 300,
}: SearchInputProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initial = searchParams.get(name) ?? "";
  const [value, setValue] = useState(initial);
  const [debouncedValue, setDebouncedValue] = useState(initial);

  // Handle debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, debounceDelay);

    return () => clearTimeout(timer);
  }, [value, debounceDelay]);

  // Update URL when debounced value changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    if (debouncedValue) {
      params.set(name, debouncedValue);
    } else {
      params.delete(name);
    }
    params.delete("page");
    router.push(`${window.location.pathname}?${params.toString()}`);
  }, [debouncedValue, name, router, searchParams]);

  const handleClear = () => {
    setValue("");
    const params = new URLSearchParams(searchParams.toString());
    params.delete(name);
    params.delete("page");
    router.push(`${window.location.pathname}?${params.toString()}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(name, value);
    } else {
      params.delete(name);
    }
    params.delete("page");
    router.push(`${window.location.pathname}?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full">
      <div className="relative flex items-center">
        <Search className="absolute left-3 h-4 w-4 text-slate-400 pointer-events-none" />
        <Input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          className="w-full h-10 pl-9 pr-20 rounded-lg bg-white border-slate-200 focus:border-primary focus:ring-primary/20"
        />
        <div className="absolute right-4 flex items-center gap-1">
          {value && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear search"
              className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
          {/* <Button 
            type="submit" 
            size="sm" 
            className="h-8 px-3 text-xs font-medium rounded-md bg-primary hover:bg-primary/90 text-white"
          >
            Search
          </Button> */}
        </div>
      </div>
    </form>
  );
}