import { forwardRef } from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-sm font-medium transition-colors focus:outline-none disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary:
          "bg-iris-500 text-white hover:bg-iris-600",
        secondary:
          "bg-surface text-ink2 border border-[#d1d9ee] hover:bg-surface2",
        success:
          "bg-[#ecfdf5] text-[#059669] border border-[#a7f3d0]",
        danger:
          "bg-[#fef2f2] text-[#dc2626] border border-[#fca5a5]",
        ghost:
          "bg-transparent text-muted hover:bg-surface2",
      },
      size: {
        sm: "h-7 px-3.5 text-[12px]",
        md: "h-9 px-[18px] text-[13px]",
        lg: "h-11 px-[22px] text-[14px]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
