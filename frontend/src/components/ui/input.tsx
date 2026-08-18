import * as React from "react";
import { cn } from "../../utils/cn";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
  suffix?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, icon, suffix, id, ...props }, ref) => {
    const isNumeric = type === "number";

    return (
      <div className="space-y-1">
        {label && (
          <label
            htmlFor={id}
            className="text-xs font-semibold uppercase tracking-wider text-[#666159] dark:text-[#9E9A90] block"
          >
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9E978C] dark:text-[#67635A] pointer-events-none">
              {icon}
            </div>
          )}
          <input
            id={id}
            type={type}
            inputMode={isNumeric ? "numeric" : undefined}
            className={cn(
              "flex h-10 w-full rounded-md border border-[#E2DDD5] dark:border-[#24303E] bg-[#FFFFFF] dark:bg-[#141C25] px-3 py-2 text-sm text-[#24221F] dark:text-[#EAE7E1] placeholder:text-[#9E978C] dark:placeholder:text-[#67635A] focus:outline-none focus:border-[#3F7D5C] dark:focus:border-[#4E9B73] focus:ring-1 focus:ring-[#3F7D5C] dark:focus:ring-[#4E9B73] disabled:cursor-not-allowed disabled:opacity-50 transition-colors",
              isNumeric && "font-mono tabular-nums",
              icon && "pl-9",
              suffix && "pr-12",
              className
            )}
            ref={ref}
            {...props}
          />
          {suffix && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-[#666159] dark:text-[#9E9A90] pointer-events-none">
              {suffix}
            </div>
          )}
        </div>
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };

