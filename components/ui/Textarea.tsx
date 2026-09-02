import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "flex w-full rounded-lg border border-charcoal/15 bg-white px-4 py-3 text-sm placeholder:text-charcoal/40 focus:border-clay-400 focus:outline-none focus:ring-1 focus:ring-clay-400 dark:border-cream/20 dark:bg-[#2A2724] dark:placeholder:text-cream/30",
      className
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";
export { Textarea };
