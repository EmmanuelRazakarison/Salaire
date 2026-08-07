import { useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Header } from "../components/Header";
import { CalculatorForm } from "../components/CalculatorForm";
import { ResultsPanel } from "../components/ResultsPanel";
import { ResultsSkeleton } from "../components/ResultsSkeleton";
import { HistoryPanel } from "../components/HistoryPanel";
import { useSalaryCalculation } from "../hooks/useSalaryCalculation";
import { useHistory } from "../hooks/useHistory";
import type { SalaryResult } from "../types";

export function HomePage() {
  const {
    register,
    errors,
    control,
    setValue,
    result,
    currentInput,
    isNetToGross,
    isServerOnline,
    isCalculating,
    toggleMode,
    applyPreset,
  } = useSalaryCalculation();

  const { history, addToHistory, removeFromHistory, clearHistory } =
    useHistory(isServerOnline);

  const lastSavedRef = useRef<string>("");

  // Sauvegarder automatiquement dans l'historique avec debounce
  useEffect(() => {
    if (!result) return;

    const resultKey = `${result.grossSalary}-${result.netPay}-${result.totalDeductions}-${isNetToGross}`;
    if (resultKey === lastSavedRef.current) return;
    lastSavedRef.current = resultKey;

    const timer = setTimeout(() => {
      addToHistory(result, isNetToGross, currentInput);
    }, 1200);

    return () => clearTimeout(timer);
  }, [result?.grossSalary, result?.netPay, result?.totalDeductions, isNetToGross, currentInput, addToHistory]);

  // Charger un résultat depuis l'historique
  const handleLoad = useCallback(
    (loadedResult: SalaryResult, loadMode: boolean) => {
      setValue("isNetToGross", loadMode, { shouldValidate: false });

      if (loadMode) {
        setValue("netSalary", loadedResult.netPay.toString(), { shouldValidate: true });
      } else {
        setValue("grossSalary", loadedResult.grossSalary.toString(), { shouldValidate: true });
      }
      setValue("bonuses", loadedResult.bonuses.toString(), { shouldValidate: true });
      setValue("allowances", loadedResult.allowances.toString(), { shouldValidate: true });
      setValue("otherGains", loadedResult.otherGains.toString(), { shouldValidate: true });
      setValue("dependents", loadedResult.dependents.toString(), { shouldValidate: true });
    },
    [setValue]
  );

  // Sauvegarde manuelle via le bouton
  const handleSave = useCallback(() => {
    if (result) {
      addToHistory(result, isNetToGross, currentInput);
    }
  }, [result, isNetToGross, currentInput, addToHistory]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-200">
      <Header isServerOnline={isServerOnline} />

      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="max-w-6xl mx-auto px-4 py-6 sm:py-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Colonne gauche : Formulaire + Historique */}
          <div className="lg:col-span-5 space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <CalculatorForm
                register={register}
                errors={errors}
                control={control}
                onToggleMode={toggleMode}
                onApplyPreset={applyPreset}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <HistoryPanel
                history={history}
                onLoad={handleLoad}
                onDelete={removeFromHistory}
                onClear={clearHistory}
              />
            </motion.div>
          </div>

          {/* Colonne droite : Résultats & Bulletin ou Skeleton */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {isCalculating ? (
                <ResultsSkeleton key="skeleton" />
              ) : result ? (
                <ResultsPanel
                  key="results"
                  result={result}
                  isNetToGross={isNetToGross}
                  onSave={handleSave}
                />
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="flex flex-col items-center justify-center py-24 text-gray-400 dark:text-gray-500 bg-white dark:bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700/50 shadow-xs"
                >
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-50 dark:from-emerald-950/40 dark:to-teal-900/20 flex items-center justify-center mb-4 shadow-sm border border-emerald-200/50 dark:border-emerald-800/30">
                    <svg
                      className="w-8 h-8 text-emerald-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-gray-700 dark:text-gray-300 mb-1">
                    Calculateur de salaire prêt
                  </h3>
                  <p className="text-sm text-center max-w-xs text-gray-500 dark:text-gray-400">
                    Saisissez un montant ou cliquez sur un préréglage rapide pour générer le décompte des cotisations.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <footer className="mt-12 pb-6 text-center">
          <p className="text-xs text-gray-400 dark:text-gray-500">
            Salaire Mada 2026 · Calcul basé sur le Code du Travail & la Loi de Finances Malagasy ·
            {isServerOnline ? " Connecté au backend FastAPI" : " Mode calcul local réactif"}
          </p>
        </footer>
      </motion.main>
    </div>
  );
}
