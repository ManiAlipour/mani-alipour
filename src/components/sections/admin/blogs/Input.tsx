"use client";
import React from "react";
import { twMerge } from "tailwind-merge";
import { FaTimesCircle } from "react-icons/fa";

interface FancyInputBoxProps {
  icon: React.ReactNode;
  label: string;
  error?: string | boolean | any;
  trailing?: React.ReactNode;
  as?: "input" | "textarea";
  className?: string;
  value?: string | number;
  id?: string;
  name?: string;
  type?: string;
  placeholder?: string;
  rows?: number;
  onChange?: (e: React.ChangeEvent<any>) => void;
  onBlur?: (e: React.FocusEvent<any>) => void;
  [x: string]: any;
}

export default function FancyInputBox({
  icon,
  label,
  error,
  trailing,
  as = "input",
  className,
  value,
  ...props
}: FancyInputBoxProps) {
  const Tag = as as any;

  // بررسی اینکه آیا اینپوت مقدار دارد یا خیر (برای انیمیشن یا مدیریت آیکون)
  const hasValue =
    typeof value === "string"
      ? value.length > 0
      : value != null && value !== undefined;

  return (
    <div className={twMerge("w-full flex flex-col gap-2", className)}>
      {/* Label */}
      <label className="font-bold flex items-center gap-2 text-base text-neon-blue">
        {icon}
        <span>{label}</span>
      </label>

      {/* Input Wrapper */}
      <div className="relative flex flex-col group">
        <div className="relative flex items-center">
          {/* Icon inside input (will hide when typing for better readability) */}
          <span
            className={twMerge(
              "absolute right-4 top-1/2 -translate-y-1/2 text-xl text-neon-blue/60 group-focus-within:text-neon-green transition-all pointer-events-none",
              hasValue ? "opacity-0 scale-50" : "opacity-100 scale-100",
            )}
          >
            {icon}
          </span>

          <Tag
            {...props}
            value={value}
            className={twMerge(
              "input-fancy peer",
              error
                ? "ring-2 ring-red-500/50 border-red-500/50"
                : "focus:ring-2 focus:ring-neon-blue/30",
              as === "textarea" ? "min-h-[100px] py-3 pr-4" : "h-12 pr-11",
            )}
            style={{
              fontWeight: "bold",
              fontFamily: "inherit",
              fontSize: "1rem",
            }}
          />
        </div>

        {/* Trailing element (like Image Preview) */}
        {trailing && <div className="w-full mt-2">{trailing}</div>}
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 text-xs sm:text-sm text-red-400 mt-1 font-bold animate-in fade-in slide-in-from-top-1">
          <FaTimesCircle /> {error}
        </div>
      )}

      {/* Styles - Injecting CSS scoped to this component if not already in global */}
      <style jsx global>{`
        .input-fancy {
          width: 100%;
          border-radius: 1.25rem;
          padding-left: 1rem;
          border: 1.5px solid #334856;
          background: linear-gradient(99deg, #1e293b 0%, #0f172a 100%);
          color: #f1f5f9;
          transition: all 0.2s ease-in-out;
          outline: none;
        }

        .dark .input-fancy {
          border-color: rgba(42, 220, 118, 0.2);
          background: linear-gradient(123deg, #0f172a 0%, #1e293b 95%);
        }

        .input-fancy:focus {
          border-color: #22d3ee; /* Neon Blue */
          background: #1e293b;
          box-shadow: 0 0 15px rgba(34, 211, 238, 0.1);
        }

        .dark .input-fancy:focus {
          border-color: #4ade80; /* Neon Green */
          background: #111827;
        }

        .input-fancy::placeholder {
          color: #64748b;
          font-weight: 400;
        }
      `}</style>
    </div>
  );
}
