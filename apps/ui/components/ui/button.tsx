import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  // Base styles shared by all variants
  [
    "inline-flex items-center justify-center font-display font-semibold",
    "transition-all duration-200 select-none",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-40",
  ],
  {
    variants: {
      variant: {
        /** Forest green fill — primary actions */
        primary:
          "bg-forest text-surface hover:bg-forest-light shadow-[0_4px_14px_rgba(61,107,79,0.2)] hover:shadow-[0_4px_18px_rgba(61,107,79,0.3)]",
        /** Amber fill — secondary / highlight actions */
        amber:
          "bg-amber-sol text-surface hover:bg-amber-light shadow-[0_4px_14px_rgba(192,125,46,0.2)]",
        /** Outlined — tertiary actions */
        outline:
          "border border-bark text-ink-2 hover:border-forest hover:text-forest",
        /** No background — icon buttons, inline actions */
        ghost:
          "text-ink-2 hover:text-forest hover:bg-forest-dim",
        /** Danger */
        danger:
          "text-red-600 hover:text-red-700 hover:bg-red-50",
      },
      size: {
        sm:   "h-8 px-3 text-[12px] rounded-[6px] gap-1.5",
        md:   "h-10 px-5 text-[14px] rounded-[8px] gap-2",
        lg:   "h-12 px-6 text-[15px] rounded-[10px] gap-2",
        /** Square icon button */
        icon: "h-8 w-8 rounded-full",
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
    VariantProps<typeof buttonVariants> {}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
);
Button.displayName = "Button";

export { Button, buttonVariants };
