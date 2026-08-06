import * as React from "react";
import { cn } from "../../utils/cn";

const badgeVariants = {
  default: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
  secondary: "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600",
  destructive: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-200 dark:border-red-800",
  outline: "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300",
};

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof badgeVariants;
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors",
        badgeVariants[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
