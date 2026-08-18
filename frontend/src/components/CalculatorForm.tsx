import { ArrowLeftRight, HelpCircle } from "lucide-react";
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
  { label: "SMIG (262 680)", value: 262680 },
  { label: "500 000", value: 500000 },
  { label: "1 200 000", value: 1200000 },
  { label: "2 500 000", value: 2500000 },
  { label: "4 000 000", value: 4000000 },
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
    <Card className="border border-[#E2DDD5] dark:border-[#24303E]">
      <CardHeader className="bg-[#FAF8F5] dark:bg-[#141C25] pb-3">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-mono font-bold tracking-widest text-[#666159] dark:text-[#9E9A90] uppercase">
              Feuille de saisie N° 01
            </span>
            <CardTitle className="text-base sm:text-lg">
              {isNetToGross
                ? "Recherche du Salaire Brut (Net → Brut)"
                : "Calcul du Salaire Net (Brut → Net)"}
            </CardTitle>
          </div>
          <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-sm bg-[#F4F1EA] dark:bg-[#1C2530] text-[#24221F] dark:text-[#EAE7E1] border border-[#E2DDD5] dark:border-[#24303E]">
            {isNetToGross ? "Dichotomie" : "Direct 2026"}
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-4 sm:p-5 space-y-4">
        {/* Section 1 : Montant Principal */}
        <div className="p-3.5 rounded-md bg-[#FAF8F5] dark:bg-[#141C25] border border-[#E2DDD5] dark:border-[#24303E] space-y-3">
          {isNetToGross ? (
            <div>
              <Input
                id="netSalary"
                label="Salaire Net Souhaité en Poche (MGA)"
                type="number"
                pattern="[0-9]*"
                placeholder="Ex: 1 500 000"
                suffix="MGA"
                className="text-base sm:text-lg font-bold h-11"
                {...register("netSalary")}
              />
              {errors.netSalary && (
                <p className="text-xs font-mono text-[#A3483C] dark:text-[#D96859] mt-1">
                  {errors.netSalary.message}
                </p>
              )}
            </div>
          ) : (
            <div>
              <Input
                id="grossSalary"
                label="Salaire Brut de Base Contractuel (MGA)"
                type="number"
                pattern="[0-9]*"
                placeholder="Ex: 2 000 000"
                suffix="MGA"
                className="text-base sm:text-lg font-bold h-11"
                {...register("grossSalary")}
              />
              {errors.grossSalary && (
                <p className="text-xs font-mono text-[#A3483C] dark:text-[#D96859] mt-1">
                  {errors.grossSalary.message}
                </p>
              )}
            </div>
          )}

          {/* Barème des Préréglages Rapides */}
          {onApplyPreset && (
            <div className="pt-2 border-t border-[#E2DDD5] dark:border-[#24303E]">
              <div className="flex items-center justify-between text-[11px] font-mono text-[#666159] dark:text-[#9E9A90] mb-1.5">
                <span>Barème de référence rapide (MGA) :</span>
              </div>
              <div className="grid grid-cols-2 xs:grid-cols-3 sm:flex sm:flex-wrap items-center gap-1.5">
                {PRESETS.map((preset) => (
                  <button
                    key={preset.value}
                    type="button"
                    onClick={() => {
                      if (navigator.vibrate) navigator.vibrate(10);
                      onApplyPreset(preset.value);
                    }}
                    className="text-[11px] font-mono py-2 px-2.5 min-h-[40px] sm:min-h-[32px] rounded-sm bg-[#FFFFFF] dark:bg-[#18202A] text-[#24221F] dark:text-[#EAE7E1] border border-[#E2DDD5] dark:border-[#24303E] hover:border-[#3F7D5C] hover:text-[#3F7D5C] dark:hover:border-[#4E9B73] dark:hover:text-[#4E9B73] active:scale-95 transition-colors cursor-pointer text-center"
                  >
                    {preset.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Section 2 : Compléments de rémunération & Déductions */}
        <div className="space-y-3 pt-1">
          <span className="text-[10px] font-mono font-bold tracking-widest text-[#666159] dark:text-[#9E9A90] uppercase block">
            Éléments complémentaires & Situation
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            <div>
              <Input
                id="bonuses"
                label="Primes (MGA)"
                type="number"
                placeholder="0"
                suffix="MGA"
                {...register("bonuses")}
              />
              {errors.bonuses && (
                <p className="text-xs font-mono text-[#A3483C] dark:text-[#D96859] mt-1">
                  {errors.bonuses.message}
                </p>
              )}
            </div>
            <div>
              <Input
                id="allowances"
                label="Indemnités (MGA)"
                type="number"
                placeholder="0"
                suffix="MGA"
                {...register("allowances")}
              />
              {errors.allowances && (
                <p className="text-xs font-mono text-[#A3483C] dark:text-[#D96859] mt-1">
                  {errors.allowances.message}
                </p>
              )}
            </div>
            <div>
              <Input
                id="otherGains"
                label="Autres gains (MGA)"
                type="number"
                placeholder="0"
                suffix="MGA"
                {...register("otherGains")}
              />
              {errors.otherGains && (
                <p className="text-xs font-mono text-[#A3483C] dark:text-[#D96859] mt-1">
                  {errors.otherGains.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <Input
              id="dependents"
              label="Personnes à charge (Déduction 2 000 MGA/pers)"
              type="number"
              placeholder="0"
              min="0"
              max="20"
              suffix="pers."
              {...register("dependents")}
            />
            {errors.dependents && (
              <p className="text-xs font-mono text-[#A3483C] dark:text-[#D96859] mt-1">
                {errors.dependents.message}
              </p>
            )}
          </div>
        </div>

        {/* Basculer le mode de calcul */}
        <div className="pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onToggleMode}
            className="w-full gap-2 text-xs font-mono py-2 text-[#666159] dark:text-[#9E9A90] hover:text-[#24221F] dark:hover:text-[#EAE7E1]"
          >
            <ArrowLeftRight className="h-3.5 w-3.5 text-[#3F7D5C] dark:text-[#4E9B73]" />
            {isNetToGross
              ? "Basculer vers le mode : Brut → Net"
              : "Basculer vers le mode : Net → Brut"}
          </Button>
        </div>

        {/* Note fiscale légale */}
        <div className="flex items-start gap-1.5 p-2.5 rounded-sm bg-[#FAF8F5] dark:bg-[#141C25] border border-[#E2DDD5] dark:border-[#24303E] text-[11px] text-[#666159] dark:text-[#9E9A90]">
          <HelpCircle className="h-3.5 w-3.5 shrink-0 text-[#3F7D5C] dark:text-[#4E9B73] mt-0.5" />
          <span>
            CNAPS (1% plafonné à 24 000 MGA) · OSTIE (1% plafonné à 24 000 MGA) · IRSA minimum 3 000 MGA.
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

