import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  RotateCw,
  Coins,
  Send,
  Calendar,
} from "lucide-react";
import { useCurrencyRates } from "../hooks/useCurrencyRates";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

interface CurrencyConverterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplySalaryAmount?: (amountInMga: number) => void;
}

const AVAILABLE_CURRENCIES = [
  { code: "USD", name: "Dollar américain", symbol: "$", flag: "🇺🇸" },
  { code: "EUR", name: "Euro", symbol: "€", flag: "🇪🇺" },
  { code: "CNY", name: "Yuan chinois", symbol: "¥", flag: "🇨🇳" },
  { code: "GBP", name: "Livre sterling", symbol: "£", flag: "🇬🇧" },
  { code: "CAD", name: "Dollar canadien", symbol: "CA$", flag: "🇨🇦" },
  { code: "CHF", name: "Franc suisse", symbol: "CHF", flag: "🇨🇭" },
  { code: "MGA", name: "Ariary Malagasy", symbol: "Ar", flag: "🇲🇬" },
  { code: "FMG", name: "Franc Malgache", symbol: "FMG", flag: "🇲🇬" },
];

export function CurrencyConverterModal({
  isOpen,
  onClose,
  onApplySalaryAmount,
}: CurrencyConverterModalProps) {
  const {
    rates,
    lastUpdated,
    source,
    isFetching,
    countdown,
    refreshNow,
    convert,
  } = useCurrencyRates();

  const [inputAmount, setInputAmount] = useState<string>("100");
  const [sourceCurrency, setSourceCurrency] = useState<string>("USD");

  const numericAmount = useMemo(() => {
    const val = parseFloat(inputAmount.replace(/\s/g, "").replace(",", "."));
    return isNaN(val) || val <= 0 ? 0 : val;
  }, [inputAmount]);

  // Montant converti en MGA pour le calcul de paie
  const amountInMga = useMemo(() => {
    return convert(numericAmount, sourceCurrency, "MGA");
  }, [numericAmount, sourceCurrency, convert]);

  const amountInFmg = useMemo(() => {
    return amountInMga * 5;
  }, [amountInMga]);

  const todayDateFormatted = useMemo(() => {
    const d = new Date();
    return d.toLocaleDateString("fr-FR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }, []);

  const handleApplyToSalary = () => {
    if (onApplySalaryAmount && amountInMga > 0) {
      onApplySalaryAmount(Math.round(amountInMga));
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-2xl bg-[#F7F5F0] dark:bg-[#12181F] border border-[#E2DDD5] dark:border-[#24303E] rounded-md shadow-2xl overflow-hidden my-auto"
          >
            {/* Header Modal */}
            <div className="p-4 sm:p-5 border-b border-[#E2DDD5] dark:border-[#24303E] bg-[#FFFFFF] dark:bg-[#18202A] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-sm bg-[#EBF4EF] dark:bg-[#162B21] border border-[#3F7D5C]/30 flex items-center justify-center text-[#2F6347] dark:text-[#62BD8F]">
                  <Coins className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="font-serif text-base sm:text-lg font-bold text-[#24221F] dark:text-[#EAE7E1]">
                      Convertisseur MGA · FMG · Devises
                    </h2>
                    <span className="flex h-2 w-2 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-[#666159] dark:text-[#9E9A90] font-mono mt-0.5">
                    <Calendar className="w-3 h-3 text-[#3F7D5C]" />
                    <span>{todayDateFormatted}</span>
                    <span>•</span>
                    <span>Mis à jour : {lastUpdated || "En cours..."}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={refreshNow}
                  disabled={isFetching}
                  className="h-8 text-xs font-mono gap-1.5 border-[#E2DDD5] dark:border-[#24303E]"
                  title="Actualiser les cours immédiatement"
                >
                  <RotateCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin text-[#3F7D5C]" : ""}`} />
                  <span className="hidden sm:inline">Auto dans {countdown}s</span>
                </Button>
                <button
                  onClick={onClose}
                  className="p-1.5 text-[#666159] hover:text-[#24221F] dark:text-[#9E9A90] dark:hover:text-[#EAE7E1] rounded-sm hover:bg-[#F4F1EA] dark:hover:bg-[#141C25] transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Corps du modal */}
            <div className="p-4 sm:p-5 space-y-4 max-h-[80vh] overflow-y-auto">
              {/* Grille des cours de référence direct en MGA */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-serif font-bold tracking-wide uppercase text-[#666159] dark:text-[#9E9A90]">
                    Cours des Devises en direct (en MGA & FMG)
                  </span>
                  <Badge variant="outline" className="text-[10px] font-mono text-[#3F7D5C] border-[#3F7D5C]/30 bg-[#EBF4EF] dark:bg-[#162B21]">
                    Actualisation 30s
                  </Badge>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {/* USD */}
                  <div className="p-2.5 rounded-sm bg-[#FFFFFF] dark:bg-[#18202A] border border-[#E2DDD5] dark:border-[#24303E]">
                    <div className="flex items-center justify-between text-xs text-[#666159] dark:text-[#9E9A90]">
                      <span className="font-bold flex items-center gap-1">🇺🇸 1 USD</span>
                      <span className="text-[10px] font-mono">$</span>
                    </div>
                    <div className="mt-1 font-mono font-bold text-sm text-[#24221F] dark:text-[#EAE7E1]">
                      {rates.USD?.rateInMGA ? Math.round(rates.USD.rateInMGA).toLocaleString("fr-FR") : "4 322"} Ar
                    </div>
                    <div className="text-[10px] font-mono text-[#666159] dark:text-[#9E9A90]">
                      {rates.USD?.rateInFMG ? Math.round(rates.USD.rateInFMG).toLocaleString("fr-FR") : "21 610"} FMG
                    </div>
                  </div>

                  {/* EUR */}
                  <div className="p-2.5 rounded-sm bg-[#FFFFFF] dark:bg-[#18202A] border border-[#E2DDD5] dark:border-[#24303E]">
                    <div className="flex items-center justify-between text-xs text-[#666159] dark:text-[#9E9A90]">
                      <span className="font-bold flex items-center gap-1">🇪🇺 1 EUR</span>
                      <span className="text-[10px] font-mono">€</span>
                    </div>
                    <div className="mt-1 font-mono font-bold text-sm text-[#24221F] dark:text-[#EAE7E1]">
                      {rates.EUR?.rateInMGA ? Math.round(rates.EUR.rateInMGA).toLocaleString("fr-FR") : "5 008"} Ar
                    </div>
                    <div className="text-[10px] font-mono text-[#666159] dark:text-[#9E9A90]">
                      {rates.EUR?.rateInFMG ? Math.round(rates.EUR.rateInFMG).toLocaleString("fr-FR") : "25 040"} FMG
                    </div>
                  </div>

                  {/* CNY */}
                  <div className="p-2.5 rounded-sm bg-[#FFFFFF] dark:bg-[#18202A] border border-[#E2DDD5] dark:border-[#24303E]">
                    <div className="flex items-center justify-between text-xs text-[#666159] dark:text-[#9E9A90]">
                      <span className="font-bold flex items-center gap-1">🇨🇳 1 CNY</span>
                      <span className="text-[10px] font-mono">¥</span>
                    </div>
                    <div className="mt-1 font-mono font-bold text-sm text-[#24221F] dark:text-[#EAE7E1]">
                      {rates.CNY?.rateInMGA ? (rates.CNY.rateInMGA).toFixed(2).replace(".", ",") : "639,80"} Ar
                    </div>
                    <div className="text-[10px] font-mono text-[#666159] dark:text-[#9E9A90]">
                      {rates.CNY?.rateInFMG ? Math.round(rates.CNY.rateInFMG).toLocaleString("fr-FR") : "3 199"} FMG
                    </div>
                  </div>

                  {/* GBP */}
                  <div className="p-2.5 rounded-sm bg-[#FFFFFF] dark:bg-[#18202A] border border-[#E2DDD5] dark:border-[#24303E]">
                    <div className="flex items-center justify-between text-xs text-[#666159] dark:text-[#9E9A90]">
                      <span className="font-bold flex items-center gap-1">🇬🇧 1 GBP</span>
                      <span className="text-[10px] font-mono">£</span>
                    </div>
                    <div className="mt-1 font-mono font-bold text-sm text-[#24221F] dark:text-[#EAE7E1]">
                      {rates.GBP?.rateInMGA ? Math.round(rates.GBP.rateInMGA).toLocaleString("fr-FR") : "5 770"} Ar
                    </div>
                    <div className="text-[10px] font-mono text-[#666159] dark:text-[#9E9A90]">
                      {rates.GBP?.rateInFMG ? Math.round(rates.GBP.rateInFMG).toLocaleString("fr-FR") : "28 850"} FMG
                    </div>
                  </div>
                </div>
              </div>

              {/* Convertisseur interactif */}
              <div className="p-4 rounded-md bg-[#FFFFFF] dark:bg-[#18202A] border border-[#E2DDD5] dark:border-[#24303E] space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-serif font-bold text-[#24221F] dark:text-[#EAE7E1] uppercase tracking-wider">
                    Calculatrice de Conversion
                  </span>
                  <span className="text-[11px] font-mono text-[#666159] dark:text-[#9E9A90]">
                    1 MGA = 5 FMG
                  </span>
                </div>

                {/* Saisie Montant et Devise */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-mono font-bold text-[#666159] dark:text-[#9E9A90] mb-1">
                      MONTANT À CONVERTIR
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={inputAmount}
                        onChange={(e) => setInputAmount(e.target.value)}
                        placeholder="Ex: 500"
                        className="w-full h-11 px-3 bg-[#F7F5F0] dark:bg-[#12181F] border border-[#E2DDD5] dark:border-[#24303E] rounded-sm font-mono font-bold text-base text-[#24221F] dark:text-[#EAE7E1] focus:outline-none focus:border-[#3F7D5C]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-mono font-bold text-[#666159] dark:text-[#9E9A90] mb-1">
                      DEVISE SOURCE
                    </label>
                    <select
                      value={sourceCurrency}
                      onChange={(e) => setSourceCurrency(e.target.value)}
                      className="w-full h-11 px-3 bg-[#F7F5F0] dark:bg-[#12181F] border border-[#E2DDD5] dark:border-[#24303E] rounded-sm font-mono font-bold text-sm text-[#24221F] dark:text-[#EAE7E1] focus:outline-none focus:border-[#3F7D5C]"
                    >
                      {AVAILABLE_CURRENCIES.map((c) => (
                        <option key={c.code} value={c.code}>
                          {c.flag} {c.code} ({c.symbol})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Raccourcis de montants */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] font-mono text-[#666159] dark:text-[#9E9A90] mr-1">
                    Préréglages :
                  </span>
                  {["50", "100", "500", "1000", "2000"].map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setInputAmount(preset)}
                      className="px-2 py-0.5 text-[10px] font-mono font-semibold rounded-sm bg-[#F4F1EA] dark:bg-[#141C25] text-[#24221F] dark:text-[#EAE7E1] border border-[#E2DDD5] dark:border-[#24303E] hover:border-[#3F7D5C] transition-colors"
                    >
                      {preset} {sourceCurrency}
                    </button>
                  ))}
                </div>

                {/* Résultat Principal en MGA & FMG */}
                <div className="p-3.5 rounded-sm bg-[#EBF4EF] dark:bg-[#162B21] border border-[#3F7D5C]/40">
                  <div className="flex items-center justify-between text-xs text-[#2F6347] dark:text-[#62BD8F] font-bold">
                    <span>ÉQUIVALENT EN ARIARY & FRANC MALGACHE :</span>
                    <span className="font-mono text-[11px]">Taux officiel</span>
                  </div>

                  <div className="mt-2 flex flex-col sm:flex-row sm:items-baseline justify-between gap-1">
                    <div>
                      <div className="font-mono font-bold text-xl sm:text-2xl text-[#2F6347] dark:text-[#62BD8F]">
                        {Math.round(amountInMga).toLocaleString("fr-FR")} MGA
                      </div>
                      <div className="font-mono font-medium text-xs text-[#2F6347]/80 dark:text-[#62BD8F]/80">
                        Soit {Math.round(amountInFmg).toLocaleString("fr-FR")} FMG (Francs)
                      </div>
                    </div>

                    {onApplySalaryAmount && (
                      <Button
                        size="sm"
                        onClick={handleApplyToSalary}
                        className="mt-2 sm:mt-0 bg-[#3F7D5C] hover:bg-[#2F6347] text-white text-xs gap-1.5 font-mono"
                      >
                        <Send className="w-3 h-3" />
                        Injecter dans le salaire
                      </Button>
                    )}
                  </div>
                </div>

                {/* Tableau de conversion dans toutes les autres devises */}
                <div>
                  <span className="text-[11px] font-mono font-bold text-[#666159] dark:text-[#9E9A90] block mb-2">
                    CONVERSION DANS TOUTES LES DEVISES :
                  </span>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {AVAILABLE_CURRENCIES.filter((c) => c.code !== sourceCurrency && c.code !== "MGA" && c.code !== "FMG").map((target) => {
                      const convertedVal = convert(numericAmount, sourceCurrency, target.code);
                      return (
                        <div
                          key={target.code}
                          className="p-2 rounded-sm bg-[#F7F5F0] dark:bg-[#12181F] border border-[#E2DDD5] dark:border-[#24303E]"
                        >
                          <div className="text-[10px] font-mono text-[#666159] dark:text-[#9E9A90] flex items-center justify-between">
                            <span>{target.flag} {target.code}</span>
                            <span>{target.symbol}</span>
                          </div>
                          <div className="font-mono font-bold text-xs text-[#24221F] dark:text-[#EAE7E1] mt-0.5">
                            {convertedVal.toLocaleString("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {target.symbol}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Source & Note légale */}
              <div className="text-[10px] text-[#666159] dark:text-[#9E9A90] font-mono flex items-center justify-between">
                <span>Source des flux : {source}</span>
                <span>Taux de change indicatifs pour la paie</span>
              </div>
            </div>

            {/* Footer */}
            <div className="p-3 sm:p-4 border-t border-[#E2DDD5] dark:border-[#24303E] bg-[#FFFFFF] dark:bg-[#18202A] flex items-center justify-between">
              <span className="text-[11px] text-[#666159] dark:text-[#9E9A90] font-mono">
                Actualisé automatiquement toutes les 30 secondes
              </span>
              <Button variant="outline" size="sm" onClick={onClose}>
                Fermer
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
