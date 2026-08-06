import { DollarSign, Users, Gift, Briefcase, Plus, ArrowLeftRight, Zap } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import type { UseFormRegister, FieldErrors, Control } from "react-hook-form";
import { useWatch } from "react-hook-form";
import type { SalaryFormValues } from "../schemas/salaryForm";

interface CalculatorFormProps {
  register: UseFormRegister<SalaryFormValues>;
  errors: FieldErrors<SalaryFormValues>;
  control: Control<SalaryFormValues>;
  onToggleMode: () => void;
  onApplyPreset?: (amount: number) => void;
}

const PRESETS = [
  { label: "SMIG (262k)", value: 262680 },
  { label: "500k", value: 500000 },
  { label: "1.2M", value: 1200000 },
  { label: "2.5M", value: 2500000 },
  { label: "4M", value: 4000000 },
];

export function CalculatorForm({
  register,
  errors,
  control,
  onToggleMode,
  onApplyPreset,
}: CalculatorFormProps) {
  const isNetToGross = useWatch({ control, name: "isNetToGross" });

  return (
    <Card className="overflow-hidden shadow-lg border-emerald-100 dark:border-gray-800">
      <CardHeader className="border-b border-gray-100 dark:border-gray-800 bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-100/40 dark:from-emerald-950/20 dark:via-teal-950/20 dark:to-emerald-900/10">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <div className="p-1.5 rounded-lg bg-emerald-500 text-white shadow-sm">
              <DollarSign className="h-4 w-4" />
            </div>
            {isNetToGross ? "Calcul Net → Brut" : "Calcul Brut → Net"}
          </CardTitle>
          <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-200 dark:border-emerald-800/40">
            {isNetToGross ? "Recherche de brut" : "Direct"}
          </span>
        </div>
      </CardHeader>
      <CardContent className="pt-6 space-y-5">
        {/* Champ principal */}
        <div className="p-4 rounded-xl bg-gradient-to-br from-emerald-50/70 to-teal-50/70 dark:from-emerald-950/30 dark:to-teal-950/20 border border-emerald-200/60 dark:border-emerald-800/30 shadow-inner">
          {isNetToGross ? (
            <div>
              <Input
                id="netSalary"
                label="Salaire net souhaité (MGA)"
                type="number"
                placeholder="Ex: 1 500 000"
                icon={<DollarSign className="h-4 w-4" />}
                className="text-lg font-semibold bg-white dark:bg-gray-800/70"
                {...register("netSalary")}
              />
              {errors.netSalary && (
                <p className="text-xs text-red-500 font-medium mt-1">
                  {errors.netSalary.message}
                </p>
              )}
            </div>
          ) : (
            <div>
              <Input
                id="grossSalary"
                label="Salaire brut de base (MGA)"
                type="number"
                placeholder="Ex: 2 000 000"
                icon={<DollarSign className="h-4 w-4" />}
                className="text-lg font-semibold bg-white dark:bg-gray-800/70"
                {...register("grossSalary")}
              />
            </div>
          )}

          {/* Boutons de raccourci rapide */}
          {onApplyPreset && (
            <div className="mt-3 flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 flex items-center gap-1">
                <Zap className="h-3 w-3 text-amber-500" /> Préréglages :
              </span>
              {PRESETS.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => onApplyPreset(preset.value)}
                  className="text-xs px-2 py-0.5 rounded-md bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-300 dark:hover:bg-emerald-950/40 transition-colors font-medium shadow-xs"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Options additionnelles */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <Input
              id="bonuses"
              label="Primes (MGA)"
              type="number"
              placeholder="0"
              icon={<Gift className="h-4 w-4 text-emerald-500" />}
              {...register("bonuses")}
            />
            {errors.bonuses && (
              <p className="text-xs text-red-500 mt-1">
                {errors.bonuses.message}
              </p>
            )}
          </div>
          <div>
            <Input
              id="allowances"
              label="Indemnités"
              type="number"
              placeholder="0"
              icon={<Briefcase className="h-4 w-4 text-blue-500" />}
              {...register("allowances")}
            />
            {errors.allowances && (
              <p className="text-xs text-red-500 mt-1">
                {errors.allowances.message}
              </p>
            )}
          </div>
          <div>
            <Input
              id="otherGains"
              label="Autres gains"
              type="number"
              placeholder="0"
              icon={<Plus className="h-4 w-4 text-amber-500" />}
              {...register("otherGains")}
            />
            {errors.otherGains && (
              <p className="text-xs text-red-500 mt-1">
                {errors.otherGains.message}
              </p>
            )}
          </div>
        </div>

        {/* Personnes à charge */}
        <div>
          <Input
            id="dependents"
            label="Personnes à charge (Réduction IRSA 2000 MGA/pers)"
            type="number"
            placeholder="0"
            min="0"
            max="20"
            icon={<Users className="h-4 w-4 text-indigo-500" />}
            {...register("dependents")}
          />
          {errors.dependents && (
            <p className="text-xs text-red-500 mt-1">
              {errors.dependents.message}
            </p>
          )}
        </div>

        {/* Basculer le mode */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onToggleMode}
          className="w-full gap-2 text-xs font-semibold py-2.5 border-emerald-200 dark:border-gray-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300 transition-colors"
        >
          <ArrowLeftRight className="h-3.5 w-3.5" />
          {isNetToGross
            ? "Passer en mode Brut → Net"
            : "Passer en mode Net → Brut"}
        </Button>
      </CardContent>
    </Card>
  );
}
