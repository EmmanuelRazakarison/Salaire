import { motion, AnimatePresence } from "framer-motion";
import {
  Download,
  Copy,
  Save,
  Wallet,
  Calculator,
  ChevronDown,
  ChevronUp,
  Building2,
  User,
  Coins,
  ArrowRightLeft,
} from "lucide-react";
import { useState, useCallback } from "react";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { SalaryChart } from "./SalaryChart";
import { CompareModal } from "./CompareModal";
import type { SalaryResult, CurrencyMode, HistoryEntry } from "../types";
import { formatCurrency } from "../utils/calculations";
import { exportToPDF, copyToClipboard } from "../utils/export";

interface ResultsPanelProps {
  result: SalaryResult;
  isNetToGross: boolean;
  onSave?: () => void;
  history?: HistoryEntry[];
}

export function ResultsPanel({ result, isNetToGross, onSave, history = [] }: ResultsPanelProps) {
  const [showDetails, setShowDetails] = useState(true);
  const [copied, setCopied] = useState(false);
  const [currency, setCurrency] = useState<CurrencyMode>("MGA");
  const [viewTab, setViewTab] = useState<"employee" | "employer">("employee");
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  const handleCopy = useCallback(async () => {
    await copyToClipboard(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [result]);

  const toggleCurrency = () => {
    setCurrency((prev) => (prev === "MGA" ? "FMG" : "MGA"));
  };

  const chartData =
    viewTab === "employee"
      ? [
          {
            name: "Salaire net",
            value: result.netPay,
            color: "#10b981",
          },
          {
            name: "CNAPS + OSTIE (1%+1%)",
            value: result.totalSocialContributions,
            color: "#f59e0b",
          },
          {
            name: "IRSA",
            value: result.irsaTax,
            color: "#ef4444",
          },
        ]
      : [
          {
            name: "Salaire brut",
            value: result.grossSalary,
            color: "#3b82f6",
          },
          {
            name: "CNAPS Patronal (13%)",
            value: result.cnapsEmployer,
            color: "#8b5cf6",
          },
          {
            name: "OSTIE Patronal (5%)",
            value: result.ostieEmployer,
            color: "#ec4899",
          },
        ];

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="space-y-4"
        >
          {/* Barre de contrôle : Devise & Onglets */}
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex bg-gray-100 dark:bg-gray-800 p-1 rounded-xl border border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setViewTab("employee")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewTab === "employee"
                    ? "bg-white dark:bg-gray-700 text-emerald-600 dark:text-emerald-300 shadow-xs"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <User className="h-3.5 w-3.5" />
                Vue Salarié
              </button>
              <button
                onClick={() => setViewTab("employer")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewTab === "employer"
                    ? "bg-white dark:bg-gray-700 text-blue-600 dark:text-blue-300 shadow-xs"
                    : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
                }`}
              >
                <Building2 className="h-3.5 w-3.5" />
                Coût Employeur
              </button>
            </div>

            <button
              onClick={toggleCurrency}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/40 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 transition-colors shadow-xs"
            >
              <Coins className="h-3.5 w-3.5 text-emerald-500" />
              Devise : {currency}
            </button>
          </div>

          {/* Résumé principal */}
          <Card className="overflow-hidden border-emerald-200 dark:border-emerald-800/50 shadow-md">
            <div
              className={`p-6 text-white transition-all ${
                viewTab === "employee"
                  ? "bg-gradient-to-r from-emerald-500 via-teal-600 to-emerald-700"
                  : "bg-gradient-to-r from-blue-600 via-indigo-600 to-slate-700"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-emerald-100 text-xs font-semibold uppercase tracking-wider">
                  {viewTab === "employee"
                    ? isNetToGross
                      ? "Brut estimé"
                      : "Salaire net en poche"
                    : "Coût Total Employeur"}
                </span>
                <Wallet className="h-5 w-5 text-white/80" />
              </div>
              <div className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                {viewTab === "employee"
                  ? formatCurrency(result.netPay, currency)
                  : formatCurrency(result.totalEmployerCost, currency)}
              </div>

              <div className="flex gap-3 mt-3 text-xs sm:text-sm text-white/90 font-medium flex-wrap">
                <span>
                  Brut : {formatCurrency(result.grossSalary, currency)}
                </span>
                <span className="opacity-50">|</span>
                <span>
                  Retenues : {formatCurrency(result.totalDeductions, currency)}
                </span>
                {viewTab === "employer" && (
                  <>
                    <span className="opacity-50">|</span>
                    <span>
                      Cotis. Patronales : {formatCurrency(result.totalEmployerContributions, currency)}
                    </span>
                  </>
                )}
              </div>
            </div>

            <CardContent className="pt-4 pb-3 bg-white dark:bg-gray-800/60">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Cotisations Salarié
                  </div>
                  <div className="text-base sm:text-lg font-bold text-amber-600 dark:text-amber-400">
                    {result.grossSalary > 0
                      ? `${((result.totalSocialContributions / result.totalGains) * 100).toFixed(1)}%`
                      : "0%"}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Taux IRSA
                  </div>
                  <div className="text-base sm:text-lg font-bold text-red-500 dark:text-red-400">
                    {result.taxableIncome > 0
                      ? `${((result.irsaTax / result.taxableIncome) * 100).toFixed(1)}%`
                      : "0%"}
                  </div>
                </div>
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    Charges Patronales
                  </div>
                  <div className="text-base sm:text-lg font-bold text-blue-600 dark:text-blue-400">
                    {result.grossSalary > 0
                      ? `${((result.totalEmployerContributions / result.grossSalary) * 100).toFixed(1)}%`
                      : "0%"}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Graphique */}
          <SalaryChart data={chartData} />

          {/* Détails déroulants */}
          <Card className="border-gray-200 dark:border-gray-800">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="w-full flex items-center justify-between p-4 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors rounded-t-2xl"
            >
              <div className="flex items-center gap-2">
                <Calculator className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                <span className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                  Détail complet du bulletin ({currency})
                </span>
              </div>
              {showDetails ? (
                <ChevronUp className="h-4 w-4 text-gray-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-gray-400" />
              )}
            </button>

            <AnimatePresence>
              {showDetails && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <CardContent className="pt-0 space-y-4">
                    {/* Section Revenus */}
                    <div>
                      <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                        1. Revenus Brut & Gains
                      </h4>
                      <div className="space-y-1.5">
                        <DetailRow
                          label="Salaire de base (brut)"
                          value={formatCurrency(result.grossSalary, currency)}
                        />
                        {result.bonuses > 0 && (
                          <DetailRow
                            label="Primes"
                            value={formatCurrency(result.bonuses, currency)}
                          />
                        )}
                        {result.allowances > 0 && (
                          <DetailRow
                            label="Indemnités"
                            value={formatCurrency(result.allowances, currency)}
                          />
                        )}
                        {result.otherGains > 0 && (
                          <DetailRow
                            label="Autres gains"
                            value={formatCurrency(result.otherGains, currency)}
                          />
                        )}
                        <DetailRow
                          label="Total gains bruts"
                          value={formatCurrency(result.totalGains, currency)}
                          bold
                        />
                      </div>
                    </div>

                    <Separator />

                    {/* Section Cotisations Salariales */}
                    <div>
                      <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                        2. Cotisations Salariales (Retenues)
                      </h4>
                      <div className="space-y-1.5">
                        <DetailRow
                          label="CNAPS employé (1% plafonné 2,4M)"
                          value={formatCurrency(result.cnapsEmployee, currency)}
                          highlight="amber"
                        />
                        <DetailRow
                          label="OSTIE employé (1% plafonné 2,4M)"
                          value={formatCurrency(result.ostieEmployee, currency)}
                          highlight="amber"
                        />
                        <DetailRow
                          label="Total cotisations sociales"
                          value={formatCurrency(result.totalSocialContributions, currency)}
                          bold
                          highlight="amber"
                        />
                      </div>
                    </div>

                    <Separator />

                    {/* Section IRSA */}
                    <div>
                      <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                        3. Impôt sur le Revenu (IRSA)
                      </h4>
                      <div className="space-y-1.5">
                        <DetailRow
                          label="Net imposable"
                          value={formatCurrency(result.taxableIncome, currency)}
                        />
                        {result.irsaDetails.map((detail, i) => (
                          <DetailRow
                            key={i}
                            label={`Tranche ${detail.rate} (${detail.bracket})`}
                            value={
                              detail.tax < 0
                                ? `- ${formatCurrency(Math.abs(detail.tax), currency)}`
                                : formatCurrency(detail.tax, currency)
                            }
                            highlight={detail.tax < 0 ? "green" : "red"}
                            small
                          />
                        ))}
                        <DetailRow
                          label="Montant IRSA net à retenir"
                          value={formatCurrency(result.irsaTax, currency)}
                          bold
                          highlight="red"
                        />
                      </div>
                    </div>

                    <Separator />

                    {/* Section Cotisations Patronales */}
                    <div>
                      <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-2 flex items-center gap-1">
                        <Building2 className="h-3.5 w-3.5" /> 4. Cotisations Patronales (Employeur)
                      </h4>
                      <div className="space-y-1.5">
                        <DetailRow
                          label="CNAPS Employeur (13% plafonné 2,4M)"
                          value={formatCurrency(result.cnapsEmployer, currency)}
                          highlight="blue"
                        />
                        <DetailRow
                          label="OSTIE / Médical Employeur (5% plafonné 2,4M)"
                          value={formatCurrency(result.ostieEmployer, currency)}
                          highlight="blue"
                        />
                        <DetailRow
                          label="Total charges patronales"
                          value={formatCurrency(result.totalEmployerContributions, currency)}
                          bold
                          highlight="blue"
                        />
                      </div>
                    </div>

                    <Separator />

                    {/* Recap global */}
                    <div className="bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/30 rounded-xl p-3.5 border border-emerald-100 dark:border-emerald-800/30 space-y-2">
                      <DetailRow
                        label="Total déductions salariales"
                        value={formatCurrency(result.totalDeductions, currency)}
                        bold
                      />
                      <DetailRow
                        label="NET À PAYER AU SALARIÉ"
                        value={formatCurrency(result.netPay, currency)}
                        bold
                        highlight="green"
                      />
                      <DetailRow
                        label="COÛT GLOBAL EMPLOYEUR"
                        value={formatCurrency(result.totalEmployerCost, currency)}
                        bold
                        highlight="blue"
                      />
                    </div>
                  </CardContent>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>

          {/* Boutons d'actions */}
          <div className="flex gap-2 flex-wrap pt-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportToPDF(result, isNetToGross)}
              className="gap-2 font-semibold"
            >
              <Download className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              Bulletin PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCompareOpen(true)}
              className="gap-2 font-semibold border-amber-300 dark:border-amber-700/60 text-amber-800 dark:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-950/30"
            >
              <ArrowRightLeft className="h-4 w-4 text-amber-500" />
              Comparateur
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="gap-2 font-semibold"
            >
              <Copy className="h-4 w-4" />
              {copied ? "Copié !" : "Copier"}
            </Button>
            {onSave && (
              <Button size="sm" onClick={onSave} className="gap-2 ml-auto bg-emerald-600 hover:bg-emerald-700 font-semibold shadow-xs">
                <Save className="h-4 w-4" />
                Sauvegarder
              </Button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      <CompareModal
        isOpen={isCompareOpen}
        onClose={() => setIsCompareOpen(false)}
        currentResult={result}
        history={history}
      />
    </>
  );
}

interface DetailRowProps {
  label: string;
  value: string;
  bold?: boolean;
  highlight?: "amber" | "red" | "green" | "blue";
  small?: boolean;
}

function DetailRow({ label, value, bold, highlight, small }: DetailRowProps) {
  const valueColors = {
    amber: "text-amber-600 dark:text-amber-400",
    red: "text-red-600 dark:text-red-400",
    green: "text-emerald-600 dark:text-emerald-400 font-bold text-base",
    blue: "text-blue-600 dark:text-blue-400",
  };

  return (
    <div className="flex items-center justify-between">
      <span
        className={`${
          small ? "text-xs" : "text-sm"
        } text-gray-600 dark:text-gray-400 font-medium`}
      >
        {label}
      </span>
      <span
        className={`${
          small ? "text-xs" : "text-sm"
        } ${bold ? "font-bold" : ""} ${
          highlight ? valueColors[highlight] : "text-gray-900 dark:text-gray-100"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
