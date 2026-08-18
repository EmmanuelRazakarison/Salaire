import { motion, AnimatePresence } from "framer-motion";
import {
  Copy,
  Save,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Building2,
  User,
  ArrowRightLeft,
  FileSpreadsheet,
  Coins,
  Share2,
} from "lucide-react";
import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader } from "./ui/card";
import { Button } from "./ui/button";
import { SalaryChart } from "./SalaryChart";
import { CompareModal } from "./CompareModal";
import type { SalaryResult, CurrencyMode, HistoryEntry } from "../types";
import { formatCurrency } from "../utils/calculations";
import { shareOrExportPDF, copyToClipboard } from "../utils/export";

interface ResultsPanelProps {
  result: SalaryResult;
  isNetToGross: boolean;
  onSave?: () => void;
  history?: HistoryEntry[];
}

export function ResultsPanel({
  result,
  isNetToGross,
  onSave,
  history = [],
}: ResultsPanelProps) {
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
            color: "#3F7D5C",
          },
          {
            name: "Cotisations (CNAPS+OSTIE)",
            value: result.totalSocialContributions,
            color: "#A3483C",
          },
          {
            name: "Impôt IRSA",
            value: result.irsaTax,
            color: "#8D3B30",
          },
        ]
      : [
          {
            name: "Salaire brut",
            value: result.grossSalary,
            color: "#3B647A",
          },
          {
            name: "CNAPS Patronal (13%)",
            value: result.cnapsEmployer,
            color: "#5F8DA8",
          },
          {
            name: "OSTIE Patronal (5%)",
            value: result.ostieEmployer,
            color: "#7A9FB5",
          },
        ];

  return (
    <>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="space-y-4"
        >
          {/* Barre de contrôle du registre (Onglets vue + Bascule devise) */}
          <div className="flex items-center justify-between gap-2 flex-wrap pb-1">
            <div className="inline-flex rounded-md border border-[#E2DDD5] dark:border-[#24303E] bg-[#FAF8F5] dark:bg-[#141C25] p-0.5 text-xs font-medium">
              <button
                onClick={() => setViewTab("employee")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm transition-colors cursor-pointer ${
                  viewTab === "employee"
                    ? "bg-[#FFFFFF] dark:bg-[#18202A] text-[#24221F] dark:text-[#EAE7E1] font-bold border border-[#E2DDD5] dark:border-[#24303E]"
                    : "text-[#666159] dark:text-[#9E9A90] hover:text-[#24221F] dark:hover:text-[#EAE7E1]"
                }`}
              >
                <User className="h-3.5 w-3.5 text-[#3F7D5C] dark:text-[#4E9B73]" />
                Vue Salarié (Net)
              </button>
              <button
                onClick={() => setViewTab("employer")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-sm transition-colors cursor-pointer ${
                  viewTab === "employer"
                    ? "bg-[#FFFFFF] dark:bg-[#18202A] text-[#24221F] dark:text-[#EAE7E1] font-bold border border-[#E2DDD5] dark:border-[#24303E]"
                    : "text-[#666159] dark:text-[#9E9A90] hover:text-[#24221F] dark:hover:text-[#EAE7E1]"
                }`}
              >
                <Building2 className="h-3.5 w-3.5 text-[#3B647A] dark:text-[#5F8DA8]" />
                Coût Employeur
              </button>
            </div>

            <button
              onClick={toggleCurrency}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-sm text-xs font-mono font-semibold bg-[#FFFFFF] dark:bg-[#18202A] text-[#666159] dark:text-[#9E9A90] border border-[#E2DDD5] dark:border-[#24303E] hover:border-[#3F7D5C] hover:text-[#3F7D5C] transition-colors cursor-pointer"
              title="Basculer entre Ariary (MGA) et Francs Malgaches (FMG)"
            >
              <Coins className="h-3.5 w-3.5 text-[#3F7D5C]" />
              Affichage : {currency}
            </button>
          </div>

          {/* Grand Livre de Décompte : Feuille de paie officielle */}
          <Card className="border border-[#E2DDD5] dark:border-[#24303E] overflow-hidden">
            {/* En-tête du registre */}
            <CardHeader className="bg-[#FAF8F5] dark:bg-[#141C25] p-4 sm:p-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <FileSpreadsheet className="h-4 w-4 text-[#3F7D5C] dark:text-[#4E9B73]" />
                    <span className="text-[10px] font-mono font-bold tracking-widest text-[#666159] dark:text-[#9E9A90] uppercase">
                      BULLETIN DE SIMULATION SALARIALE N° {Date.now().toString().slice(-6)}
                    </span>
                  </div>
                  <h2 className="font-serif text-lg sm:text-xl font-bold tracking-tight text-[#24221F] dark:text-[#EAE7E1]">
                    {viewTab === "employee"
                      ? "Décompte Individuel de Rémunération"
                      : "État Récapitulatif de la Masse Salariale"}
                  </h2>
                  <p className="text-[11px] font-mono text-[#666159] dark:text-[#9E9A90]">
                    Période Mensuelle · Barème Fiscal & Cotisations Sociales 2026
                  </p>
                </div>

                {/* Sceau de validation signature */}
                <div className="stamp-seal self-start sm:self-auto">
                  <CheckCircle2 className="h-3.5 w-3.5 text-[#3F7D5C] dark:text-[#4E9B73]" />
                  <span>Conforme Loi MG · Validé</span>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-0 divide-y divide-[#E2DDD5] dark:divide-[#24303E]">
              {/* Grand Montant Clé : Net à payer ou Coût total employeur */}
              <div className="p-4 sm:p-6 bg-[#FAF8F5]/60 dark:bg-[#141C25]/40 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                <div>
                  <span className="text-xs font-mono uppercase tracking-wider text-[#666159] dark:text-[#9E9A90] block mb-1">
                    {viewTab === "employee"
                      ? isNetToGross
                        ? "Net souhaité (Base du calcul)"
                        : "Net à payer au salarié (Net en poche)"
                      : "Coût global pour l'entreprise"}
                  </span>
                  <div className="font-mono text-3xl sm:text-4xl font-bold text-[#3F7D5C] dark:text-[#4E9B73] tracking-tight">
                    {viewTab === "employee"
                      ? formatCurrency(result.netPay, currency)
                      : formatCurrency(result.totalEmployerCost, currency)}
                  </div>
                </div>

                <div className="text-xs font-mono text-[#666159] dark:text-[#9E9A90] space-y-1">
                  <div>
                    Salaire Brut Total :{" "}
                    <span className="font-bold text-[#24221F] dark:text-[#EAE7E1]">
                      {formatCurrency(result.totalGains, currency)}
                    </span>
                  </div>
                  <div>
                    Total Déductions Salariales :{" "}
                    <span className="font-bold text-[#A3483C] dark:text-[#D96859]">
                      - {formatCurrency(result.totalDeductions, currency)}
                    </span>
                  </div>
                  {viewTab === "employer" && (
                    <div>
                      Charges Patronales (18%) :{" "}
                      <span className="font-bold text-[#3B647A] dark:text-[#5F8DA8]">
                        + {formatCurrency(result.totalEmployerContributions, currency)}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Ratios & Synthèse comptable */}
              <div className="grid grid-cols-3 divide-x divide-[#E2DDD5] dark:divide-[#24303E] bg-[#FFFFFF] dark:bg-[#18202A] text-center p-3">
                <div className="p-2">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#666159] dark:text-[#9E9A90] mb-0.5">
                    Cotis. Sociales
                  </div>
                  <div className="font-mono text-sm sm:text-base font-bold text-[#24221F] dark:text-[#EAE7E1]">
                    {result.totalGains > 0
                      ? `${((result.totalSocialContributions / result.totalGains) * 100).toFixed(1)}%`
                      : "0.0%"}
                  </div>
                  <div className="text-[10px] font-mono text-[#666159] dark:text-[#9E9A90]">
                    2% Salarial
                  </div>
                </div>

                <div className="p-2">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#666159] dark:text-[#9E9A90] mb-0.5">
                    Pression IRSA
                  </div>
                  <div className="font-mono text-sm sm:text-base font-bold text-[#24221F] dark:text-[#EAE7E1]">
                    {result.taxableIncome > 0
                      ? `${((result.irsaTax / result.taxableIncome) * 100).toFixed(1)}%`
                      : "0.0%"}
                  </div>
                  <div className="text-[10px] font-mono text-[#666159] dark:text-[#9E9A90]">
                    Barème progressif
                  </div>
                </div>

                <div className="p-2">
                  <div className="text-[10px] font-mono uppercase tracking-wider text-[#666159] dark:text-[#9E9A90] mb-0.5">
                    Charges Entreprise
                  </div>
                  <div className="font-mono text-sm sm:text-base font-bold text-[#3B647A] dark:text-[#5F8DA8]">
                    {result.grossSalary > 0
                      ? `${((result.totalEmployerContributions / result.grossSalary) * 100).toFixed(1)}%`
                      : "0.0%"}
                  </div>
                  <div className="text-[10px] font-mono text-[#666159] dark:text-[#9E9A90]">
                    18% Patronal
                  </div>
                </div>
              </div>

              {/* Tableau de décomposition ligne par ligne (Livre de paie) */}
              <div className="p-4 sm:p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-[#E2DDD5] dark:border-[#24303E] pb-2">
                  <div className="font-serif text-sm font-semibold text-[#24221F] dark:text-[#EAE7E1] flex items-center gap-1.5">
                    <span>Livre des Décompositions</span>
                  </div>
                  <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="text-xs font-mono text-[#666159] dark:text-[#9E9A90] hover:text-[#24221F] dark:hover:text-[#EAE7E1] flex items-center gap-1 cursor-pointer"
                  >
                    <span>{showDetails ? "Masquer les lignes" : "Afficher toutes les lignes"}</span>
                    {showDetails ? (
                      <ChevronUp className="h-3.5 w-3.5" />
                    ) : (
                      <ChevronDown className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>

                <AnimatePresence>
                  {showDetails && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden space-y-5 text-xs"
                    >
                      {/* Section 1 : Revenus bruts */}
                      <div className="space-y-1.5">
                        <div className="text-[10px] font-mono font-bold tracking-widest uppercase text-[#666159] dark:text-[#9E9A90]">
                          01. Revenus & Éléments du Brut
                        </div>
                        <div className="divide-y divide-[#E2DDD5]/60 dark:divide-[#24303E]/60 border-y border-[#E2DDD5] dark:border-[#24303E]">
                          <LedgerRow
                            code="01.01"
                            label="Salaire de base contractuel"
                            rate="Fixe"
                            amount={formatCurrency(result.grossSalary, currency)}
                          />
                          {result.bonuses > 0 && (
                            <LedgerRow
                              code="01.02"
                              label="Primes & Gratifications"
                              rate="Variable"
                              amount={formatCurrency(result.bonuses, currency)}
                            />
                          )}
                          {result.allowances > 0 && (
                            <LedgerRow
                              code="01.03"
                              label="Indemnités non exonérées"
                              rate="Variable"
                              amount={formatCurrency(result.allowances, currency)}
                            />
                          )}
                          {result.otherGains > 0 && (
                            <LedgerRow
                              code="01.04"
                              label="Autres avantages & gains bruts"
                              rate="Divers"
                              amount={formatCurrency(result.otherGains, currency)}
                            />
                          )}
                          <LedgerRow
                            code="01.00"
                            label="Total Revenus Bruts (Brut Global)"
                            rate="100%"
                            amount={formatCurrency(result.totalGains, currency)}
                            isTotal
                          />
                        </div>
                      </div>

                      {/* Section 2 : Cotisations Salariales */}
                      <div className="space-y-1.5">
                        <div className="text-[10px] font-mono font-bold tracking-widest uppercase text-[#666159] dark:text-[#9E9A90]">
                          02. Cotisations Sociales Salariales (2%)
                        </div>
                        <div className="divide-y divide-[#E2DDD5]/60 dark:divide-[#24303E]/60 border-y border-[#E2DDD5] dark:border-[#24303E]">
                          <LedgerRow
                            code="02.01"
                            label="CNAPS Salarié (Caisse Nationale de Prévoyance)"
                            rate="1% (Plafond 2 400 000 MGA)"
                            amount={`- ${formatCurrency(result.cnapsEmployee, currency)}`}
                            color="deduction"
                          />
                          <LedgerRow
                            code="02.02"
                            label="OSTIE / Médical Salarié"
                            rate="1% (Plafond 2 400 000 MGA)"
                            amount={`- ${formatCurrency(result.ostieEmployee, currency)}`}
                            color="deduction"
                          />
                          <LedgerRow
                            code="02.00"
                            label="Total Cotisations Sociales Salariales"
                            rate="2% max 48 000 MGA"
                            amount={`- ${formatCurrency(result.totalSocialContributions, currency)}`}
                            isTotal
                            color="deduction"
                          />
                        </div>
                      </div>

                      {/* Section 3 : IRSA */}
                      <div className="space-y-1.5">
                        <div className="text-[10px] font-mono font-bold tracking-widest uppercase text-[#666159] dark:text-[#9E9A90]">
                          03. Impôt sur le Revenu des Salariés (IRSA 2026)
                        </div>
                        <div className="divide-y divide-[#E2DDD5]/60 dark:divide-[#24303E]/60 border-y border-[#E2DDD5] dark:border-[#24303E]">
                          <LedgerRow
                            code="03.00"
                            label="Assiette Fiscale (Net Imposable = Brut - Cotisations)"
                            rate="Base"
                            amount={formatCurrency(result.taxableIncome, currency)}
                          />
                          {result.irsaDetails.map((detail, index) => (
                            <LedgerRow
                              key={index}
                              code={`03.0${index + 1}`}
                              label={`Barème Tranche ${detail.rate} (${detail.bracket})`}
                              rate={detail.rate}
                              amount={
                                detail.tax < 0
                                  ? `- ${formatCurrency(Math.abs(detail.tax), currency)}`
                                  : `${formatCurrency(detail.tax, currency)}`
                              }
                              color={detail.tax < 0 ? "validated" : undefined}
                              isSub
                            />
                          ))}
                          <LedgerRow
                            code="03.99"
                            label="Total Impôt IRSA Net à Retenir"
                            rate="Barème légal"
                            amount={`- ${formatCurrency(result.irsaTax, currency)}`}
                            isTotal
                            color="deduction"
                          />
                        </div>
                      </div>

                      {/* Section 4 : Récapitulatif Salarié */}
                      <div className="p-3.5 rounded-sm bg-[#EBF4EF] dark:bg-[#162B21] border border-[#3F7D5C]/30 space-y-2">
                        <div className="flex items-center justify-between text-xs font-mono">
                          <span className="text-[#2F6347] dark:text-[#62BD8F]">Total Retenues Salariales (Cotisations + IRSA) :</span>
                          <span className="font-bold text-[#A3483C] dark:text-[#D96859]">
                            - {formatCurrency(result.totalDeductions, currency)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-sm sm:text-base font-mono font-bold pt-1 border-t border-[#3F7D5C]/20 ledger-double-line pb-1">
                          <span className="font-serif text-[#2F6347] dark:text-[#62BD8F]">
                            NET À PAYER AU SALARIÉ
                          </span>
                          <span className="text-[#2F6347] dark:text-[#62BD8F] text-base sm:text-lg">
                            {formatCurrency(result.netPay, currency)}
                          </span>
                        </div>
                      </div>

                      {/* Section 5 : Charges Patronales */}
                      <div className="space-y-1.5 pt-1">
                        <div className="text-[10px] font-mono font-bold tracking-widest uppercase text-[#3B647A] dark:text-[#5F8DA8]">
                          04. Cotisations & Charges Patronales (18%)
                        </div>
                        <div className="divide-y divide-[#E2DDD5]/60 dark:divide-[#24303E]/60 border-y border-[#E2DDD5] dark:border-[#24303E]">
                          <LedgerRow
                            code="04.01"
                            label="CNAPS Employeur (13% - Plafond 2 400 000 MGA)"
                            rate="13%"
                            amount={formatCurrency(result.cnapsEmployer, currency)}
                            color="charge"
                          />
                          <LedgerRow
                            code="04.02"
                            label="OSTIE / Médical Employeur (5% - Plafond 2 400 000 MGA)"
                            rate="5%"
                            amount={formatCurrency(result.ostieEmployer, currency)}
                            color="charge"
                          />
                          <LedgerRow
                            code="04.00"
                            label="Total Charges Sociales Patronales"
                            rate="18%"
                            amount={formatCurrency(result.totalEmployerContributions, currency)}
                            isTotal
                            color="charge"
                          />
                          <LedgerRow
                            code="05.00"
                            label="COÛT GLOBAL SALARIAL DE L'ENTREPRISE"
                            rate="Brut + Charges"
                            amount={formatCurrency(result.totalEmployerCost, currency)}
                            isTotal
                            color="charge"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </CardContent>
          </Card>

          {/* Graphique de répartition du salaire */}
          <SalaryChart data={chartData} />

          {/* Barre d'actions du registre (Mobile & Desktop) */}
          <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 pt-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => shareOrExportPDF(result, isNetToGross)}
              className="gap-1.5 font-mono text-xs h-9 min-h-[38px] justify-center"
              title="Exporter ou partager le bulletin officiel en PDF"
            >
              <Share2 className="h-3.5 w-3.5 text-[#3F7D5C] dark:text-[#4E9B73]" />
              Partager / PDF
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCompareOpen(true)}
              className="gap-1.5 font-mono text-xs h-9 min-h-[38px] justify-center"
              title="Comparer avec une autre proposition salariale"
            >
              <ArrowRightLeft className="h-3.5 w-3.5 text-[#3B647A] dark:text-[#5F8DA8]" />
              Comparer
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="gap-1.5 font-mono text-xs h-9 min-h-[38px] justify-center"
              title="Copier le décompte textuel"
            >
              <Copy className="h-3.5 w-3.5 text-[#666159]" />
              {copied ? "Copié !" : "Copier"}
            </Button>
            {onSave && (
              <Button
                size="sm"
                onClick={onSave}
                className="gap-1.5 font-mono text-xs h-9 min-h-[38px] justify-center sm:ml-auto"
                title="Consigner dans le journal de l'application"
              >
                <Save className="h-3.5 w-3.5" />
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

interface LedgerRowProps {
  code: string;
  label: string;
  rate: string;
  amount: string;
  isTotal?: boolean;
  isSub?: boolean;
  color?: "validated" | "deduction" | "charge";
}

function LedgerRow({
  code,
  label,
  rate,
  amount,
  isTotal,
  isSub,
  color,
}: LedgerRowProps) {
  const colorClasses = {
    validated: "text-[#3F7D5C] dark:text-[#4E9B73]",
    deduction: "text-[#A3483C] dark:text-[#D96859]",
    charge: "text-[#3B647A] dark:text-[#5F8DA8]",
  };

  return (
    <div
      className={`grid grid-cols-12 gap-2 py-1.5 items-center ${
        isTotal
          ? "font-bold bg-[#FAF8F5]/80 dark:bg-[#141C25]/80 px-2 rounded-sm"
          : isSub
          ? "pl-4 text-[#666159] dark:text-[#9E9A90]"
          : "text-[#24221F] dark:text-[#EAE7E1]"
      }`}
    >
      <div className="col-span-1 hidden sm:block font-mono text-[10px] text-[#9E978C] dark:text-[#67635A]">
        {code}
      </div>
      <div className="col-span-8 sm:col-span-6 font-sans truncate">
        {label}
      </div>
      <div className="col-span-2 hidden sm:block font-mono text-[11px] text-[#666159] dark:text-[#9E9A90] text-right">
        {rate}
      </div>
      <div
        className={`col-span-4 sm:col-span-3 font-mono text-right tabular-nums font-semibold ${
          color ? colorClasses[color] : ""
        }`}
      >
        {amount}
      </div>
    </div>
  );
}

