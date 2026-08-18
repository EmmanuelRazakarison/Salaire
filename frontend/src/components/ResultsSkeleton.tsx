import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

export function ResultsSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.15 }}
      className="space-y-4"
    >
      {/* Barre de contrôle skeleton */}
      <div className="flex items-center justify-between gap-2">
        <Skeleton className="h-8 w-48 rounded-sm bg-[#E2DDD5]/60 dark:bg-[#24303E]" />
        <Skeleton className="h-8 w-24 rounded-sm bg-[#E2DDD5]/60 dark:bg-[#24303E]" />
      </div>

      {/* Feuille de calcul skeleton */}
      <Card className="border border-[#E2DDD5] dark:border-[#24303E] overflow-hidden">
        <CardHeader className="bg-[#FAF8F5] dark:bg-[#141C25] p-4 sm:p-5 space-y-2">
          <div className="flex justify-between items-center">
            <Skeleton className="h-3 w-40 rounded-sm bg-[#E2DDD5]/60 dark:bg-[#24303E]" />
            <Skeleton className="h-5 w-28 rounded-sm bg-[#E2DDD5]/60 dark:bg-[#24303E]" />
          </div>
          <Skeleton className="h-6 w-64 rounded-sm bg-[#E2DDD5]/60 dark:bg-[#24303E]" />
          <Skeleton className="h-3 w-52 rounded-sm bg-[#E2DDD5]/60 dark:bg-[#24303E]" />
        </CardHeader>

        <CardContent className="p-0 divide-y divide-[#E2DDD5] dark:divide-[#24303E]">
          <div className="p-5 bg-[#FAF8F5]/50 dark:bg-[#141C25]/40 space-y-2">
            <Skeleton className="h-3 w-32 rounded-sm bg-[#E2DDD5]/60 dark:bg-[#24303E]" />
            <Skeleton className="h-9 w-60 rounded-sm bg-[#E2DDD5]/60 dark:bg-[#24303E]" />
          </div>

          <div className="grid grid-cols-3 divide-x divide-[#E2DDD5] dark:divide-[#24303E] p-3">
            <div className="p-2 flex flex-col items-center gap-1">
              <Skeleton className="h-2.5 w-16 rounded-sm bg-[#E2DDD5]/60 dark:bg-[#24303E]" />
              <Skeleton className="h-5 w-12 rounded-sm bg-[#E2DDD5]/60 dark:bg-[#24303E]" />
            </div>
            <div className="p-2 flex flex-col items-center gap-1">
              <Skeleton className="h-2.5 w-16 rounded-sm bg-[#E2DDD5]/60 dark:bg-[#24303E]" />
              <Skeleton className="h-5 w-12 rounded-sm bg-[#E2DDD5]/60 dark:bg-[#24303E]" />
            </div>
            <div className="p-2 flex flex-col items-center gap-1">
              <Skeleton className="h-2.5 w-16 rounded-sm bg-[#E2DDD5]/60 dark:bg-[#24303E]" />
              <Skeleton className="h-5 w-12 rounded-sm bg-[#E2DDD5]/60 dark:bg-[#24303E]" />
            </div>
          </div>

          <div className="p-4 space-y-2">
            <Skeleton className="h-4 w-full rounded-sm bg-[#E2DDD5]/60 dark:bg-[#24303E]" />
            <Skeleton className="h-4 w-full rounded-sm bg-[#E2DDD5]/60 dark:bg-[#24303E]" />
            <Skeleton className="h-4 w-full rounded-sm bg-[#E2DDD5]/60 dark:bg-[#24303E]" />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

