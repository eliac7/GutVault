"use client";

import { type BristolType } from "@/shared/db";
import { cn } from "@/shared/lib/utils";
import { BristolImage } from "@/shared/ui/bristol-image";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import * as React from "react";

interface BristolPickerProps {
  value: BristolType;
  onChange: (value: BristolType) => void;
  className?: string;
}

export function BristolPicker({
  value,
  onChange,
  className,
}: BristolPickerProps) {
  const [open, setOpen] = React.useState(false);
  const bristolTypes = [1, 2, 3, 4, 5, 6, 7] as BristolType[];

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className={cn(
            "relative group outline-none rounded-xl transition-transform active:scale-95",
            className
          )}
          type="button"
        >
          <div className="absolute -top-2 -right-2 bg-emerald-500 text-white p-1 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
            </svg>
          </div>
          <BristolImage type={value} className="size-full" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-3" align="start">
        <div className="grid grid-cols-4 gap-2">
          {bristolTypes.map((type) => (
            <button
              key={type}
              onClick={() => {
                onChange(type);
                setOpen(false);
              }}
              className={cn(
                "p-2 rounded-xl border flex flex-col items-center gap-1 transition-all",
                value === type
                  ? "bg-emerald-50 dark:bg-emerald-900/20 border-emerald-500"
                  : "bg-transparent border-transparent hover:bg-slate-100 dark:hover:bg-slate-800"
              )}
            >
              <BristolImage type={type} className="size-8" />
              <span className="text-[10px] font-bold text-slate-600 dark:text-slate-400">
                Type {type}
              </span>
            </button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
