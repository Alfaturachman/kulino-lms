import { cn } from "@/lib/utils";
import type { HTMLAttributes } from "react";

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  size?: "default" | "large";
}

export function Card({
  className,
  size = "default",
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        "border border-border bg-surface",
        size === "default" ? "rounded-md px-5 py-4" : "rounded-lg px-6 py-5",
        className
      )}
      {...props}
    />
  );
}
