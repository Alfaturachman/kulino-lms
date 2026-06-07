import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-1">
        <textarea
          className={cn(
            "w-full rounded-sm border px-3.5 py-2.5 text-[13px] text-ink placeholder:text-hint transition-colors resize-y min-h-[80px]",
            "focus:border-iris-500 focus:ring-3 focus:ring-[rgba(26,86,219,0.1)] focus:outline-none",
            error
              ? "border-danger focus:border-danger focus:ring-[rgba(220,38,38,0.1)]"
              : "border-border",
            className
          )}
          ref={ref}
          {...props}
        />
        {error && (
          <span className="text-[11px] font-medium text-danger">
            {error}
          </span>
        )}
      </div>
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
