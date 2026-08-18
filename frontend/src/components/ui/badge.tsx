import * as React from "react";
import { cn } from "../../utils/cn";

const badgeVariants = {
  default: "bg-[#EBF4EF] text-[#2F6347] dark:bg-[#162B21] dark:text-[#62BD8F] border-[#3F7D5C]/30",
  secondary: "bg-[#F4F1EA] text-[#666159] dark:bg-[#141C25] dark:text-[#9E9A90] border-[#E2DDD5] dark:border-[#24303E]",
  destructive: "bg-[#FBEBE8] text-[#A3483C] dark:bg-[#2E1815] dark:text-[#D96859] border-[#A3483C]/30",
  outline: "border-[#E2DDD5] dark:border-[#24303E] text-[#24221F] dark:text-[#EAE7E1] bg-transparent",
};

interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: keyof typeof badgeVariants;
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-sm border px-2 py-0.5 text-xs font-mono font-semibold transition-colors",
        badgeVariants[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge, badgeVariants };

