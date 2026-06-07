import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

type BadgeVariant =
  | "blue"
  | "green"
  | "warn"
  | "red"
  | "gray"
  | "purple";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantStyles: Record<BadgeVariant, string> = {
  blue: "bg-iris-50 text-iris-800",
  green: "bg-[#ecfdf5] text-[#059669]",
  warn: "bg-[#fffbeb] text-[#d97706]",
  red: "bg-[#fef2f2] text-[#dc2626]",
  gray: "bg-surface3 text-muted border border-border",
  purple: "bg-[#f0edff] text-[#5b21b6]",
};

export function Badge({
  className,
  variant = "gray",
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-[9px] py-[3px] text-[11px] font-medium",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  );
}
