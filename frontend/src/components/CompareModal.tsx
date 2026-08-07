import { motion, AnimatePresence } from "framer-motion";
import { X, ArrowRightLeft, Check, Sparkles } from "lucide-react";
import { useState } from "react";
import type { SalaryResult, HistoryEntry } from "../types";
import { formatCurrency, calculateSalaryFromGross } from "../utils/calculations";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";

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
  const [scenarioB, setScenarioB] = useState<SalaryResult | null>(() => {
    if (history.length > 0 && history[0].result.grossSalary !== currentResult.grossSalary) {
      return history[0].result;
    }
    // Par défaut, décalage +20% pour démo instantanée
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
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 p-6 space-y-6"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 pb-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-xl bg-emerald-500 text-white shadow-md">
                <ArrowRightLeft className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                  Comparateur de Scénarios Salariaux
                  <span className="text-xs px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-semibold border border-amber-300 dark:border-amber-800/50">
                    <Sparkles className="h-3 w-3 inline mr-1" />
                    Interactif
                  </span>
                </h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Comparez deux propositions côte à côte (Net, Cotisations, IRSA, Coût Employeur)
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-xl text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Choix Scénario B */}
          <div className="p-4 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-200 dark:border-gray-700/60 flex flex-wrap items-center justify-between gap-3">
            <span className="text-xs font-bold text-gray-700 dark:text-gray-300">
              Scénario B (Saisir un brut ou choisir dans l'historique) :
            </span>
            <div className="flex items-center gap-2">
              <input
                type="number"
                value={customGrossB}
                onChange={(e) => setCustomGrossB(e.target.value)}
                placeholder="Ex: 2 500 000"
                className="h-9 px-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-xs font-bold text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
              <Button size="sm" onClick={handleApplyCustomB} className="h-9 text-xs font-bold">
                Comparer
              </Button>
            </div>
          </div>

          {/* Tableau comparatif côte à côte */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Scénario A */}
            <Card className="border-emerald-300 dark:border-emerald-800 shadow-sm">
              <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border-b border-emerald-200 dark:border-emerald-800/40">
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 dark:text-emerald-300">
                  Scénario A (Actuel)
                </span>
                <div className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-400 mt-1">
                  {formatCurrency(currentResult.netPay)}
                </div>
                <div className="text-xs text-emerald-900 dark:text-emerald-200 font-medium">
                  Net en poche salarié
                </div>
              </div>
              <CardContent className="p-4 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-gray-600 dark:text-gray-400">Salaire Brut</span>
                  <span className="font-bold">{formatCurrency(currentResult.grossSalary)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-gray-600 dark:text-gray-400">CNAPS + OSTIE Salarié</span>
                  <span className="font-bold text-amber-600">{formatCurrency(currentResult.totalSocialContributions)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-gray-600 dark:text-gray-400">Impôt IRSA</span>
                  <span className="font-bold text-red-500">{formatCurrency(currentResult.irsaTax)}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-800">
                  <span className="text-gray-600 dark:text-gray-400">Cotis. Patronales</span>
                  <span className="font-bold text-blue-600">{formatCurrency(currentResult.totalEmployerContributions)}</span>
                </div>
                <div className="flex justify-between py-1.5 font-extrabold bg-gray-50 dark:bg-gray-800 p-2 rounded-lg">
                  <span>Coût Total Employeur</span>
                  <span className="text-blue-700 dark:text-blue-300">{formatCurrency(currentResult.totalEmployerCost)}</span>
                </div>
              </CardContent>
            </Card>

            {/* Scénario B */}
            {scenarioB ? (
              <Card className="border-blue-300 dark:border-blue-800 shadow-sm">
                <div className="p-4 bg-blue-50 dark:bg-blue-950/40 border-b border-blue-200 dark:border-blue-800/40">
                  <span className="text-xs font-bold uppercase tracking-wider text-blue-800 dark:text-blue-300">
                    Scénario B (Proposé)
                  </span>
                  <div className="text-2xl font-extrabold text-blue-700 dark:text-blue-400 mt-1">
                    {formatCurrency(scenarioB.netPay)}
                  </div>
                  <div className="text-xs text-blue-900 dark:text-blue-200 font-medium">
                    Net en poche salarié
                  </div>
                </div>
                <CardContent className="p-4 space-y-2 text-xs">
                  <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-800">
                    <span className="text-gray-600 dark:text-gray-400">Salaire Brut</span>
                    <span className="font-bold">{formatCurrency(scenarioB.grossSalary)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-800">
                    <span className="text-gray-600 dark:text-gray-400">CNAPS + OSTIE Salarié</span>
                    <span className="font-bold text-amber-600">{formatCurrency(scenarioB.totalSocialContributions)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-800">
                    <span className="text-gray-600 dark:text-gray-400">Impôt IRSA</span>
                    <span className="font-bold text-red-500">{formatCurrency(scenarioB.irsaTax)}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-gray-100 dark:border-gray-800">
                    <span className="text-gray-600 dark:text-gray-400">Cotis. Patronales</span>
                    <span className="font-bold text-blue-600">{formatCurrency(scenarioB.totalEmployerContributions)}</span>
                  </div>
                  <div className="flex justify-between py-1.5 font-extrabold bg-gray-50 dark:bg-gray-800 p-2 rounded-lg">
                    <span>Coût Total Employeur</span>
                    <span className="text-blue-700 dark:text-blue-300">{formatCurrency(scenarioB.totalEmployerCost)}</span>
                  </div>
                </CardContent>
              </Card>
            ) : null}
          </div>

          {/* Analyse des écarts */}
          {scenarioB && (
            <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-blue-500/10 dark:from-emerald-950/30 dark:to-blue-950/30 border border-emerald-200 dark:border-emerald-800/40 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                  Écart Net Salarié (B vs A) :
                </span>
                <div
                  className={`text-lg font-bold ${
                    netDiff >= 0 ? "text-emerald-600 dark:text-emerald-400" : "text-red-500"
                  }`}
                >
                  {netDiff >= 0 ? `+${formatCurrency(netDiff)}` : formatCurrency(netDiff)}
                </div>
              </div>
              <div>
                <span className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                  Écart Coût Employeur (B vs A) :
                </span>
                <div
                  className={`text-lg font-bold ${
                    costDiff >= 0 ? "text-blue-600 dark:text-blue-400" : "text-emerald-600"
                  }`}
                >
                  {costDiff >= 0 ? `+${formatCurrency(costDiff)}` : formatCurrency(costDiff)}
                </div>
              </div>
            </div>
          )}

          {/* Footer actions */}
          <div className="flex justify-end pt-2">
            <Button onClick={onClose} className="font-bold">
              <Check className="h-4 w-4 mr-1.5" /> Fermer le comparateur
            </Button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
