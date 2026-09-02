import { cn } from "@/lib/utils";

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-lg border border-charcoal/10 bg-white dark:border-cream/10 dark:bg-[#28251F]",
        className
      )}
      {...props}
    />
  );
}
