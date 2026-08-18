import * as React from "react";
import { cn } from "../../utils/cn";

const buttonVariants = {
  default:
    "bg-[#3F7D5C] hover:bg-[#34694D] dark:bg-[#4E9B73] dark:hover:bg-[#3F7D5C] text-white border border-[#34694D] dark:border-[#3F7D5C] shadow-xs",
  destructive:
    "bg-[#A3483C] hover:bg-[#8D3B30] dark:bg-[#D96859] dark:hover:bg-[#C05244] text-white border border-[#8D3B30] shadow-xs",
  outline:
    "border border-[#E2DDD5] dark:border-[#24303E] bg-[#FFFFFF] dark:bg-[#18202A] hover:bg-[#F4F1EA] dark:hover:bg-[#141C25] text-[#24221F] dark:text-[#EAE7E1]",
  secondary:
    "bg-[#F4F1EA] dark:bg-[#141C25] text-[#24221F] dark:text-[#EAE7E1] hover:bg-[#EAE5DC] dark:hover:bg-[#1C2530] border border-[#E2DDD5] dark:border-[#24303E]",
  ghost:
    "hover:bg-[#F4F1EA] dark:hover:bg-[#141C25] text-[#666159] dark:text-[#9E9A90] hover:text-[#24221F] dark:hover:text-[#EAE7E1]",
  link: "text-[#3F7D5C] dark:text-[#4E9B73] underline-offset-4 hover:underline",
};

const buttonSizes = {
  default: "h-10 px-4 py-2 text-sm",
  sm: "h-8.5 rounded-md px-3 text-xs",
  lg: "h-11 rounded-md px-6 text-base",
  icon: "h-9 w-9 rounded-md",
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
          "inline-flex items-center justify-center whitespace-nowrap rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#3F7D5C] focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98] cursor-pointer",
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

