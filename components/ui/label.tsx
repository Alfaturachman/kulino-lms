import { forwardRef } from "react";
import { cn } from "@/lib/utils";

const Label = forwardRef<
  HTMLLabelElement,
  React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
  <label
    ref={ref}
    className={cn(
      "text-[11px] font-medium tracking-wide text-ink2",
      className
    )}
    {...props}
  />
));
Label.displayName = "Label";

export { Label };
