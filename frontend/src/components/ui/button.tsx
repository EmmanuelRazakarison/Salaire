import * as React from "react";
import { cn } from "../../utils/cn";

const buttonVariants = {
  default:
    "bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm",
  destructive:
    "bg-red-500 text-white hover:bg-red-600 shadow-sm",
  outline:
    "border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100",
  secondary:
    "bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-600",
  ghost:
    "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300",
  link: "text-emerald-600 underline-offset-4 hover:underline",
};

const buttonSizes = {
  default: "h-10 px-4 py-2",
  sm: "h-9 rounded-md px-3 text-sm",
  lg: "h-12 rounded-xl px-8 text-base",
  icon: "h-10 w-10",
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof buttonVariants;
  size?: keyof typeof buttonSizes;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    return (
      <button
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap rounded-xl text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.97]",
          buttonVariants[variant],
          buttonSizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
