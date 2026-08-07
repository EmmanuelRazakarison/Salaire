import { motion } from "framer-motion";
import { Card, CardContent } from "./ui/card";
import { Skeleton } from "./ui/skeleton";

export function ResultsSkeleton() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="space-y-4"
    >
      {/* Barre de contrôle skeleton */}
      <div className="flex items-center justify-between gap-2">
        <Skeleton className="h-9 w-52 rounded-xl" />
        <Skeleton className="h-9 w-28 rounded-xl" />
      </div>

      {/* Card principale skeleton */}
      <Card className="overflow-hidden border-gray-200 dark:border-gray-800">
        <div className="p-6 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-emerald-600/20 dark:from-emerald-950/40 dark:to-teal-950/40 space-y-3">
          <div className="flex justify-between items-center">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-5 w-5 rounded-full" />
          </div>
          <Skeleton className="h-10 w-64" />
          <div className="flex gap-3 pt-1">
            <Skeleton className="h-4 w-28" />
            <Skeleton className="h-4 w-28" />
          </div>
        </div>

        <CardContent className="pt-4 pb-3">
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col items-center space-y-1.5">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-6 w-12" />
            </div>
            <div className="flex flex-col items-center space-y-1.5">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-6 w-12" />
            </div>
            <div className="flex flex-col items-center space-y-1.5">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-6 w-12" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Graphique skeleton */}
      <Card className="border-gray-200 dark:border-gray-800 p-4">
        <Skeleton className="h-4 w-44 mb-4" />
        <div className="flex justify-center items-center h-[200px]">
          <Skeleton className="w-40 h-40 rounded-full" />
        </div>
      </Card>

      {/* Accordéon détails skeleton */}
      <Card className="border-gray-200 dark:border-gray-800 p-4 space-y-3">
        <div className="flex justify-between items-center">
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-4" />
        </div>
        <div className="space-y-2 pt-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-5/6" />
        </div>
      </Card>
    </motion.div>
  );
}
