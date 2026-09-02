import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva("inline-flex items-center rounded-md px-2.5 py-1 text-xs font-medium", {
  variants: {
    variant: {
      clay: "bg-clay-100 text-clay-700 dark:bg-clay-900/40 dark:text-clay-200",
      sage: "bg-sage-100 text-sage-700 dark:bg-sage-900/40 dark:text-sage-200",
      neutral: "bg-charcoal/5 text-charcoal/70 dark:bg-cream/10 dark:text-cream/70",
      warning: "bg-amber-100 text-amber-800",
      danger: "bg-red-100 text-red-700",
    },
  },
  defaultVariants: { variant: "neutral" },
});

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement>, VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}
