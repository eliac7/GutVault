"use client";

import * as React from "react";
import { X, Plus } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface TagInputProps {
  placeholder?: string;
  tags: string[];
  onTagsChange: (tags: string[]) => void;
  className?: string;
}

export function TagInput({
  placeholder = "Add tag...",
  tags,
  onTagsChange,
  className,
}: TagInputProps) {
  const [inputValue, setInputValue] = React.useState("");
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
      removeTag(tags.length - 1);
    }
  };

  const addTag = () => {
    const trimmed = inputValue.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onTagsChange([...tags, trimmed]);
      setInputValue("");
    }
  };

  const removeTag = (index: number) => {
    const newTags = [...tags];
    newTags.splice(index, 1);
    onTagsChange(newTags);
  };

  return (
    <div
      className={cn(
        "flex flex-wrap gap-2 p-2 bg-slate-100 dark:bg-slate-800 rounded-xl focus-within:ring-2 focus-within:ring-emerald-500/20 transition-all",
        className
      )}
      onClick={() => inputRef.current?.focus()}
    >
      {tags.map((tag, index) => (
        <span
          key={`${tag}-${index}`}
          className="inline-flex items-center gap-1 px-2.5 py-1 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg text-sm shadow-sm border border-slate-200 dark:border-slate-600 animate-in fade-in zoom-in duration-200"
        >
          {tag}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              removeTag(index);
            }}
            className="text-slate-400 hover:text-red-500 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </span>
      ))}
      <div className="flex-1 min-w-[120px] relative">
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addTag}
          placeholder={tags.length === 0 ? placeholder : ""}
          className="w-full h-8 bg-transparent border-0 outline-none text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 p-0"
        />
        {!inputValue && (
          <Plus className="w-4 h-4 text-slate-400 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
        )}
      </div>
    </div>
  );
}
