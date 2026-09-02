import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => (
  <input
    ref={ref}
    className={cn(
      "flex h-11 w-full rounded-lg border border-charcoal/15 bg-white px-4 text-sm placeholder:text-charcoal/40 focus:border-clay-400 focus:outline-none focus:ring-1 focus:ring-clay-400 dark:border-cream/20 dark:bg-[#2A2724] dark:placeholder:text-cream/30",
      className
    )}
    {...props}
  />
));
Input.displayName = "Input";
export { Input };
