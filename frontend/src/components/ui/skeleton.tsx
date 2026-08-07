import * as React from "react";
import { cn } from "../../utils/cn";

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-xl bg-gray-200/80 dark:bg-gray-700/50",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
