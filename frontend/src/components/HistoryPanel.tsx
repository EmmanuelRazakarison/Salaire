import { motion, AnimatePresence } from "framer-motion";
import { History, Trash2, RotateCcw, AlertCircle } from "lucide-react";
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
      <Card className="border border-[#E2DDD5] dark:border-[#24303E]">
        <CardHeader className="bg-[#FAF8F5] dark:bg-[#141C25] pb-3">
          <CardTitle className="text-xs font-mono uppercase tracking-widest text-[#666159] dark:text-[#9E9A90] flex items-center gap-1.5">
            <History className="h-3.5 w-3.5" />
            Journal des Simulations (0)
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4 sm:p-5">
          <div className="flex flex-col items-center justify-center py-6 text-[#9E978C] dark:text-[#67635A]">
            <AlertCircle className="h-6 w-6 mb-1.5 opacity-60" />
            <p className="text-xs font-mono">Aucun enregistrement dans le journal</p>
            <p className="text-[11px] font-mono mt-0.5 opacity-80">
              Les calculs validés sont consignés automatiquement
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border border-[#E2DDD5] dark:border-[#24303E]">
      <CardHeader className="bg-[#FAF8F5] dark:bg-[#141C25] pb-3 flex flex-row items-center justify-between">
        <CardTitle className="text-xs font-mono uppercase tracking-widest text-[#666159] dark:text-[#9E9A90] flex items-center gap-1.5">
          <History className="h-3.5 w-3.5 text-[#3F7D5C] dark:text-[#4E9B73]" />
          Journal des Simulations ({history.length})
        </CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="text-[11px] font-mono text-[#A3483C] hover:text-[#8D3B30] hover:bg-[#FAF8F5] dark:hover:bg-[#141C25] h-7 px-2"
        >
          <Trash2 className="h-3 w-3 mr-1" />
          Purger le journal
        </Button>
      </CardHeader>

      <CardContent className="p-0 max-h-[350px] overflow-y-auto divide-y divide-[#E2DDD5] dark:divide-[#24303E]">
        <AnimatePresence initial={false}>
          {history.map((entry) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.15 }}
              layout
              className="p-3 bg-[#FFFFFF] dark:bg-[#18202A] hover:bg-[#FAF8F5] dark:hover:bg-[#141C25] transition-colors flex items-center justify-between gap-3 text-xs"
            >
              <div className="flex-1 min-w-0 font-mono">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[#3F7D5C] dark:text-[#4E9B73] text-sm tabular-nums">
                    {formatCurrency(entry.result.netPay)}
                  </span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-sm bg-[#F4F1EA] dark:bg-[#1C2530] text-[#666159] dark:text-[#9E9A90] border border-[#E2DDD5] dark:border-[#24303E]">
                    {entry.isNetToGross ? "Net→Brut" : "Brut→Net"}
                  </span>
                </div>
                <div className="text-[11px] text-[#666159] dark:text-[#9E9A90] mt-0.5 truncate">
                  Brut : {formatCurrency(entry.result.grossSalary)} · Retenues : -{formatCurrency(entry.result.totalDeductions)}
                </div>
                <div className="text-[10px] text-[#9E978C] dark:text-[#67635A] mt-0.5">
                  {new Date(entry.timestamp).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onLoad(entry.result, entry.isNetToGross)}
                  className="h-7 w-7 rounded-sm"
                  title="Recharger ce calcul dans la feuille de saisie"
                >
                  <RotateCcw className="h-3 w-3 text-[#3F7D5C] dark:text-[#4E9B73]" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(entry.id)}
                  className="h-7 w-7 rounded-sm text-[#A3483C] hover:bg-[#FAF8F5] dark:hover:bg-[#141C25]"
                  title="Supprimer cette ligne du journal"
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}

