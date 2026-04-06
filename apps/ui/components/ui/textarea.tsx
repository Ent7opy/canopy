import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  underline?: boolean;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, underline = false, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "font-reading text-[15px] text-ink placeholder:text-ink-3 bg-transparent",
        "focus:outline-none transition-colors duration-150 resize-none",
        underline
          ? "border-b border-bark focus:border-forest w-full py-2"
          : [
              "w-full rounded-[6px] border border-bark px-3 py-2",
              "hover:border-forest focus:border-forest focus:ring-1 focus:ring-forest",
              "bg-surface",
            ],
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";

export { Textarea };
