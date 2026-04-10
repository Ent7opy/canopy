import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  /** Show a bottom-border-only style (inline/underline inputs) */
  underline?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, underline = false, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "font-reading text-ink placeholder:text-ink-3 bg-transparent",
        "focus:outline-none transition-colors duration-150",
        underline
          ? "border-b border-bark focus:border-forest w-full py-2 text-[16px] sm:text-[14px]"
          : [
              // 16px on mobile is the magic number to stop iOS Safari from
              // zooming the whole viewport when an input is focused. We shrink
              // back to 14px at sm+ where that behavior no longer applies.
              "w-full rounded-[6px] border border-bark px-3 py-2 text-[16px] sm:text-[14px]",
              "hover:border-forest focus:border-forest focus:ring-1 focus:ring-forest",
              "bg-surface",
            ],
        className
      )}
      {...props}
    />
  )
);
Input.displayName = "Input";

export { Input };
