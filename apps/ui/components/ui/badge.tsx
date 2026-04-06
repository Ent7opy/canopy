import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center font-data text-[10px] rounded-full px-2 py-0.5 leading-none select-none",
  {
    variants: {
      variant: {
        /** Outlined forest green — tags, categories */
        forest:  "border border-bark text-forest",
        /** Amber outlined */
        amber:   "border border-amber-sol text-amber-sol opacity-80",
        /** Subtle filled — status indicators */
        subtle:  "bg-surface-2 border border-bark-subtle text-ink-3",
        /** Active pill — filter buttons */
        active:  "bg-forest border-forest text-surface",
      },
    },
    defaultVariants: {
      variant: "forest",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
