import { useEffect, useRef, useCallback, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, CheckCircle, Smartphone, ArrowUpRight } from "lucide-react";
import { Header } from "../components/Header";
import { CalculatorForm } from "../components/CalculatorForm";
import { ResultsPanel } from "../components/ResultsPanel";
import { ResultsSkeleton } from "../components/ResultsSkeleton";
import { HistoryPanel } from "../components/HistoryPanel";
import { SecurityModal, LockScreen } from "../components/SecurityModal";
import { PayReminderModal } from "../components/PayReminderModal";
import { CurrencyConverterModal } from "../components/CurrencyConverterModal";
import { useSalaryCalculation } from "../hooks/useSalaryCalculation";
import { useHistory } from "../hooks/useHistory";
import { useSecurityLock } from "../hooks/useSecurityLock";
import type { SalaryResult } from "../types";
import { formatCurrency } from "../utils/calculations";

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

  const {
    isPinEnabled,
    isBiometricEnabled,
    isLocked,
    biometricAvailable,
    setPin,
    removePin,
    verifyPin,
    unlockWithBiometric,
  } = useSecurityLock();

  const [isSecurityModalOpen, setIsSecurityModalOpen] = useState(false);
  const [isPayReminderOpen, setIsPayReminderOpen] = useState(false);
  const [isCurrencyModalOpen, setIsCurrencyModalOpen] = useState(false);

  const lastSavedRef = useRef<string>("");

  // Appliquer le montant converti vers le formulaire de salaire
  const handleApplyConvertedAmount = useCallback(
    (amountInMga: number) => {
      if (isNetToGross) {
        setValue("netSalary", amountInMga.toString(), { shouldValidate: true });
      } else {
        setValue("grossSalary", amountInMga.toString(), { shouldValidate: true });
      }
    },
    [isNetToGross, setValue]
  );

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
    <div className="min-h-screen bg-[#F7F5F0] dark:bg-[#12181F] text-[#24221F] dark:text-[#EAE7E1] transition-colors">
      {/* Écran de verrouillage PIN / Biométrie */}
      <LockScreen
        isLocked={isLocked}
        isBiometricEnabled={isBiometricEnabled}
        biometricAvailable={biometricAvailable}
        onVerifyPin={verifyPin}
        onUnlockBiometric={unlockWithBiometric}
      />

      <Header
        isServerOnline={isServerOnline}
        isPinEnabled={isPinEnabled}
        onOpenSecurity={() => setIsSecurityModalOpen(true)}
        onOpenPayReminder={() => setIsPayReminderOpen(true)}
        onOpenCurrencyConverter={() => setIsCurrencyModalOpen(true)}
      />

      <main className="max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-7 space-y-4 sm:space-y-6">
        {/* Widget mobile compact : dernier calcul de paie enregistré */}
        {history.length > 0 && !result && (
          <div className="block lg:hidden p-3 rounded-md bg-[#FAF8F5] dark:bg-[#141C25] border border-[#E2DDD5] dark:border-[#24303E]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="h-4 w-4 text-[#3F7D5C] dark:text-[#4E9B73]" />
                <span className="text-[11px] font-mono text-[#666159] dark:text-[#9E9A90]">
                  Dernier Net Enregistré :
                </span>
                <span className="font-mono font-bold text-xs text-[#3F7D5C] dark:text-[#4E9B73]">
                  {formatCurrency(history[0].result.netPay)}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleLoad(history[0].result, history[0].isNetToGross)}
                className="text-[11px] font-mono font-semibold text-[#3F7D5C] dark:text-[#4E9B73] hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                Rappeler <ArrowUpRight className="h-3 w-3" />
              </button>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          {/* Colonne gauche : Feuille de saisie + Journal des simulations */}
          <div className="lg:col-span-5 space-y-4 sm:space-y-5">
            <CalculatorForm
              register={register}
              errors={errors}
              control={control}
              onToggleMode={toggleMode}
              onApplyPreset={applyPreset}
            />

            <HistoryPanel
              history={history}
              onLoad={handleLoad}
              onDelete={removeFromHistory}
              onClear={clearHistory}
            />
          </div>

          {/* Colonne droite : Grand Livre de calcul / Bulletin de paie */}
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
                  history={history}
                />
              ) : (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className="flex flex-col items-center justify-center py-16 px-4 text-center bg-[#FFFFFF] dark:bg-[#18202A] rounded-lg border border-[#E2DDD5] dark:border-[#24303E]"
                >
                  <div className="w-12 h-12 rounded-sm bg-[#FAF8F5] dark:bg-[#141C25] border border-[#E2DDD5] dark:border-[#24303E] flex items-center justify-center mb-3 text-[#3F7D5C] dark:text-[#4E9B73]">
                    <BookOpen className="h-5 w-5" />
                  </div>
                  <h3 className="font-serif text-base sm:text-lg font-bold text-[#24221F] dark:text-[#EAE7E1] mb-1">
                    Registre de paie en attente de saisie
                  </h3>
                  <p className="text-xs font-sans max-w-sm text-[#666159] dark:text-[#9E9A90] mb-4">
                    Saisissez un salaire de base ou sélectionnez un barème de référence à gauche pour générer automatiquement le décompte légal en MGA.
                  </p>
                  <div className="stamp-seal">
                    <CheckCircle className="h-3.5 w-3.5 text-[#3F7D5C] dark:text-[#4E9B73]" />
                    <span>Prêt · Barème IRSA 2026</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <footer className="mt-8 sm:mt-12 pb-6 border-t border-[#E2DDD5] dark:border-[#24303E] pt-4 text-center">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] font-mono text-[#666159] dark:text-[#9E9A90]">
            <div>
              SALAIRE MADA © 2026 · Réglementation Sociale (CNAPS, OSTIE) & Fiscale (IRSA)
            </div>
            <div>
              Devise officielle : <span className="font-bold text-[#24221F] dark:text-[#EAE7E1]">Ariary (MGA)</span>
              {isServerOnline ? " · Synchronisé FastAPI" : " · Calcul local"}
            </div>
          </div>
        </footer>
      </main>

      {/* Modales mobiles */}
      <SecurityModal
        isOpen={isSecurityModalOpen}
        onClose={() => setIsSecurityModalOpen(false)}
        isPinEnabled={isPinEnabled}
        isBiometricEnabled={isBiometricEnabled}
        biometricAvailable={biometricAvailable}
        onSavePin={setPin}
        onRemovePin={removePin}
      />

      <PayReminderModal
        isOpen={isPayReminderOpen}
        onClose={() => setIsPayReminderOpen(false)}
      />

      <CurrencyConverterModal
        isOpen={isCurrencyModalOpen}
        onClose={() => setIsCurrencyModalOpen(false)}
        onApplySalaryAmount={handleApplyConvertedAmount}
      />
    </div>
  );
}
