import { motion, AnimatePresence } from "framer-motion";
import { Clock, Trash2, RotateCcw, AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import type { SalaryResult, HistoryEntry } from "../types";
import { formatCurrency } from "../utils/calculations";

interface HistoryPanelProps {
  history: HistoryEntry[];
  onLoad: (result: SalaryResult, isNetToGross: boolean) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
}

export function HistoryPanel({
  history,
  onLoad,
  onDelete,
  onClear,
}: HistoryPanelProps) {
  if (history.length === 0) {
    return (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-base">
            <Clock className="h-5 w-5 text-gray-400" />
            Historique
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8 text-gray-400 dark:text-gray-500">
            <AlertCircle className="h-8 w-8 mb-2" />
            <p className="text-sm">Aucun calcul sauvegardé</p>
            <p className="text-xs mt-1">
              Les calculs sont sauvegardés automatiquement
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3 flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2 text-base">
          <Clock className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          Historique ({history.length})
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="text-xs text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
        >
          <Trash2 className="h-3.5 w-3.5 mr-1" />
          Tout effacer
        </Button>
      </CardHeader>
      <CardContent className="space-y-2 max-h-[400px] overflow-y-auto">
        <AnimatePresence initial={false}>
          {history.map((entry) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              layout
              className="group relative p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors border border-gray-100 dark:border-gray-700/30"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                      {formatCurrency(entry.result.netPay)}
                    </span>
                    <span className="text-xs px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
                      {entry.isNetToGross ? "Net→Brut" : "Brut→Net"}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    Brut : {formatCurrency(entry.result.grossSalary)} · Retenues :{" "}
                    {formatCurrency(entry.result.totalDeductions)}
                  </div>
                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">
                    {new Date(entry.timestamp).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onLoad(entry.result, entry.isNetToGross)}
                    className="h-8 w-8"
                    title="Charger ce calcul"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDelete(entry.id)}
                    className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                    title="Supprimer"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
