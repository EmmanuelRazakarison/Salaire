import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRightLeft, Check } from "lucide-react";
import { useState } from "react";
import type { SalaryResult, HistoryEntry } from "../types";
import { formatCurrency, calculateSalaryFromGross } from "../utils/calculations";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { useMobileHardwareBack } from "../hooks/useMobileHardwareBack";

interface CompareModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentResult: SalaryResult;
  history: HistoryEntry[];
}

export function CompareModal({
  isOpen,
  onClose,
  currentResult,
  history,
}: CompareModalProps) {
  useMobileHardwareBack(isOpen, onClose, "compare_modal");
  const [scenarioB, setScenarioB] = useState<SalaryResult | null>(() => {
    if (history.length > 0 && history[0].result.grossSalary !== currentResult.grossSalary) {
      return history[0].result;
    }
    return calculateSalaryFromGross(Math.round(currentResult.grossSalary * 1.2));
  });

  const [customGrossB, setCustomGrossB] = useState<string>(
    scenarioB ? scenarioB.grossSalary.toString() : ""
  );

  if (!isOpen) return null;

  const handleApplyCustomB = () => {
    const amount = parseFloat(customGrossB);
    if (!isNaN(amount) && amount > 0) {
      setScenarioB(calculateSalaryFromGross(amount));
    }
  };

  const netDiff = scenarioB ? scenarioB.netPay - currentResult.netPay : 0;
  const costDiff = scenarioB ? scenarioB.totalEmployerCost - currentResult.totalEmployerCost : 0;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.97 }}
          transition={{ duration: 0.15 }}
          className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-[#FFFFFF] dark:bg-[#18202A] rounded-lg border border-[#E2DDD5] dark:border-[#24303E] p-4 sm:p-6 space-y-4 text-[#24221F] dark:text-[#EAE7E1]"
        >
          {/* En-tête */}
          <div className="flex items-center justify-between border-b border-[#E2DDD5] dark:border-[#24303E] pb-3">
            <div className="flex items-center gap-2">
              <ArrowRightLeft className="h-4 w-4 text-[#3F7D5C] dark:text-[#4E9B73]" />
              <div>
                <h2 className="font-serif text-base sm:text-lg font-bold tracking-tight">
                  Comparateur Analytique de Scénarios
                </h2>
                <p className="text-[11px] font-mono text-[#666159] dark:text-[#9E9A90]">
                  Évaluation différentielle côte à côte (Montants en MGA)
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1 rounded-sm text-[#666159] hover:text-[#24221F] dark:text-[#9E9A90] dark:hover:text-[#EAE7E1] hover:bg-[#F4F1EA] dark:hover:bg-[#141C25] transition-colors cursor-pointer"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Saisie Scénario B */}
          <div className="p-3 rounded-md bg-[#FAF8F5] dark:bg-[#141C25] border border-[#E2DDD5] dark:border-[#24303E] flex flex-wrap items-center justify-between gap-2.5">
            <span className="text-xs font-mono font-semibold text-[#666159] dark:text-[#9E9A90]">
              Scénario B (Salaire Brut MGA) :
            </span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={customGrossB}
                onChange={(e) => setCustomGrossB(e.target.value)}
                placeholder="Ex: 2 500 000"
                className="h-8.5 px-3 rounded-sm border border-[#E2DDD5] dark:border-[#24303E] bg-[#FFFFFF] dark:bg-[#18202A] text-xs font-mono font-bold text-[#24221F] dark:text-[#EAE7E1] focus:border-[#3F7D5C] focus:outline-none w-36"
              />
              <Button size="sm" onClick={handleApplyCustomB} className="h-8.5 text-xs font-mono">
                Calculer B
              </Button>
            </div>
          </div>

          {/* Tableau comparatif */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Scénario A */}
            <Card className="border border-[#E2DDD5] dark:border-[#24303E]">
              <div className="p-3 bg-[#FAF8F5] dark:bg-[#141C25] border-b border-[#E2DDD5] dark:border-[#24303E]">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#666159] dark:text-[#9E9A90]">
                  Scénario A (Actuel)
                </span>
                <div className="text-xl font-mono font-bold text-[#3F7D5C] dark:text-[#4E9B73] mt-0.5">
                  {formatCurrency(currentResult.netPay)}
                </div>
                <div className="text-[11px] font-mono text-[#666159] dark:text-[#9E9A90]">
                  Net en poche salarié
                </div>
              </div>
              <CardContent className="p-3 space-y-1.5 text-xs font-mono divide-y divide-[#E2DDD5]/60 dark:divide-[#24303E]/60">
                <div className="flex justify-between py-1">
                  <span className="text-[#666159] dark:text-[#9E9A90]">Salaire Brut</span>
                  <span className="font-bold">{formatCurrency(currentResult.grossSalary)}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#666159] dark:text-[#9E9A90]">Cotisations (2%)</span>
                  <span className="font-bold text-[#A3483C] dark:text-[#D96859]">- {formatCurrency(currentResult.totalSocialContributions)}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#666159] dark:text-[#9E9A90]">Impôt IRSA</span>
                  <span className="font-bold text-[#A3483C] dark:text-[#D96859]">- {formatCurrency(currentResult.irsaTax)}</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#666159] dark:text-[#9E9A90]">Charges Pat. (18%)</span>
                  <span className="font-bold text-[#3B647A] dark:text-[#5F8DA8]">+ {formatCurrency(currentResult.totalEmployerContributions)}</span>
                </div>
                <div className="flex justify-between py-1.5 font-bold pt-2">
                  <span>Coût Entreprise</span>
                  <span className="text-[#3B647A] dark:text-[#5F8DA8]">{formatCurrency(currentResult.totalEmployerCost)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Scénario B */}
            {scenarioB ? (
              <Card className="border border-[#E2DDD5] dark:border-[#24303E]">
                <div className="p-3 bg-[#FAF8F5] dark:bg-[#141C25] border-b border-[#E2DDD5] dark:border-[#24303E]">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#666159] dark:text-[#9E9A90]">
                    Scénario B (Comparé)
                  </span>
                  <div className="text-xl font-mono font-bold text-[#3F7D5C] dark:text-[#4E9B73] mt-0.5">
                    {formatCurrency(scenarioB.netPay)}
                  </div>
                  <div className="text-[11px] font-mono text-[#666159] dark:text-[#9E9A90]">
                    Net en poche salarié
                  </div>
                </div>
                <CardContent className="p-3 space-y-1.5 text-xs font-mono divide-y divide-[#E2DDD5]/60 dark:divide-[#24303E]/60">
                  <div className="flex justify-between py-1">
                    <span className="text-[#666159] dark:text-[#9E9A90]">Salaire Brut</span>
                    <span className="font-bold">{formatCurrency(scenarioB.grossSalary)}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-[#666159] dark:text-[#9E9A90]">Cotisations (2%)</span>
                    <span className="font-bold text-[#A3483C] dark:text-[#D96859]">- {formatCurrency(scenarioB.totalSocialContributions)}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-[#666159] dark:text-[#9E9A90]">Impôt IRSA</span>
                    <span className="font-bold text-[#A3483C] dark:text-[#D96859]">- {formatCurrency(scenarioB.irsaTax)}</span>
                  </div>
                  <div className="flex justify-between py-1">
                    <span className="text-[#666159] dark:text-[#9E9A90]">Charges Pat. (18%)</span>
                    <span className="font-bold text-[#3B647A] dark:text-[#5F8DA8]">+ {formatCurrency(scenarioB.totalEmployerContributions)}</span>
                  </div>
                  <div className="flex justify-between py-1.5 font-bold pt-2">
                    <span>Coût Entreprise</span>
                    <span className="text-[#3B647A] dark:text-[#5F8DA8]">{formatCurrency(scenarioB.totalEmployerCost)}</span>
                  </div>
                </CardContent>
              </Card>
            ) : null}
          </div>

          {/* Analyse des écarts différentiels */}
          {scenarioB && (
            <div className="p-3 rounded-md bg-[#FAF8F5] dark:bg-[#141C25] border border-[#E2DDD5] dark:border-[#24303E] grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-mono">
              <div>
                <span className="text-[#666159] dark:text-[#9E9A90] block mb-0.5">
                  Écart Net Salarié (B - A) :
                </span>
                <div
                  className={`text-base font-bold ${
                    netDiff >= 0
                      ? "text-[#3F7D5C] dark:text-[#4E9B73]"
                      : "text-[#A3483C] dark:text-[#D96859]"
                  }`}
                >
                  {netDiff >= 0 ? `+ ${formatCurrency(netDiff)}` : formatCurrency(netDiff)}
                </div>
              </div>
              <div>
                <span className="text-[#666159] dark:text-[#9E9A90] block mb-0.5">
                  Écart Coût Entreprise (B - A) :
                </span>
                <div
                  className={`text-base font-bold ${
                    costDiff <= 0
                      ? "text-[#3F7D5C] dark:text-[#4E9B73]"
                      : "text-[#3B647A] dark:text-[#5F8DA8]"
                  }`}
                >
                  {costDiff >= 0 ? `+ ${formatCurrency(costDiff)}` : formatCurrency(costDiff)}
                </div>
              </div>
            </div>
          )}

          {/* Action de fermeture */}
          <div className="flex justify-end pt-1">
            <Button size="sm" onClick={onClose} className="font-mono text-xs">
              <Check className="h-3.5 w-3.5 mr-1" /> Fermer le comparateur
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

