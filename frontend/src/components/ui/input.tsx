import * as React from "react";
import { cn } from "../../utils/cn";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  icon?: React.ReactNode;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, icon, id, ...props }, ref) => {
    return (
      <div className="space-y-1.5">
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500">
              {icon}
            </div>
          )}
          <input
            id={id}
            type={type}
            className={cn(
              "flex h-10 w-full rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800/50 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
              icon && "pl-10",
              className
            )}
            ref={ref}
            {...props}
          />
        </div>
      </div>
    );
  }
);
Input.displayName = "Input";

export { Input };
