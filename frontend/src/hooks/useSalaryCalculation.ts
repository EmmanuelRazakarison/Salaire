import { useCallback, useMemo, useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import type { SalaryResult, SalaryInput } from "../types";
import { checkBackendHealth, calculateSalaryApi } from "../services/api";
import {
  calculateSalaryFromGross,
  calculateSalaryFromNet,
} from "../utils/calculations";
import {
  salaryFormSchema,
  type SalaryFormValues,
  DEFAULT_FORM_VALUES,
} from "../schemas/salaryForm";

function parseNumber(val: string | undefined): number {
  if (!val || val.trim() === "") return 0;
  const cleaned = val.replace(/[^0-9.,]/g, "").replace(",", ".");
  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : num;
}

export function useSalaryCalculation() {
  const form = useForm<SalaryFormValues>({
    resolver: zodResolver(salaryFormSchema),
    defaultValues: DEFAULT_FORM_VALUES,
    mode: "onChange",
  });

  const { register, formState, setValue, reset: formReset, control } = form;

  const isNetToGross = useWatch({ control, name: "isNetToGross" });
  const grossSalary = useWatch({ control, name: "grossSalary" });
  const netSalary = useWatch({ control, name: "netSalary" });
  const bonuses = useWatch({ control, name: "bonuses" });
  const allowances = useWatch({ control, name: "allowances" });
  const otherGains = useWatch({ control, name: "otherGains" });
  const dependents = useWatch({ control, name: "dependents" });

  // Vérifier la santé du backend
  const { data: isServerOnline = false } = useQuery({
    queryKey: ["backend-health"],
    queryFn: checkBackendHealth,
    refetchInterval: 10000, // Vérifier toutes les 10s
    staleTime: 5000,
  });

  const [apiResult, setApiResult] = useState<SalaryResult | null>(null);

  // Basculer entre les modes
  const toggleMode = useCallback(() => {
    const newMode = !isNetToGross;
    setValue("isNetToGross", newMode, { shouldValidate: false });
  }, [isNetToGross, setValue]);

  // Appliquer une valeur préréglée
  const applyPreset = useCallback(
    (amount: number) => {
      if (isNetToGross) {
        setValue("netSalary", amount.toString(), { shouldValidate: true });
      } else {
        setValue("grossSalary", amount.toString(), { shouldValidate: true });
      }
    },
    [isNetToGross, setValue]
  );

  // Reset
  const reset = useCallback(() => {
    formReset(DEFAULT_FORM_VALUES);
    setApiResult(null);
  }, [formReset]);

  // Inputs structurés
  const currentInput: SalaryInput = useMemo(() => {
    const gross = parseNumber(grossSalary);
    const net = parseNumber(netSalary);
    const b = parseNumber(bonuses);
    const a = parseNumber(allowances);
    const o = parseNumber(otherGains);
    const d = Math.max(0, Math.floor(parseNumber(dependents)));

    return {
      grossSalary: gross > 0 ? gross : undefined,
      netSalary: net > 0 ? net : undefined,
      bonuses: b,
      allowances: a,
      otherGains: o,
      dependents: d,
      isNetToGross: Boolean(isNetToGross),
    };
  }, [grossSalary, netSalary, bonuses, allowances, otherGains, dependents, isNetToGross]);

  // Calcul local réactif immédiat
  const localResult: SalaryResult | null = useMemo(() => {
    if (isNetToGross) {
      if (!currentInput.netSalary || currentInput.netSalary <= 0) return null;
      return calculateSalaryFromNet(
        currentInput.netSalary,
        currentInput.bonuses,
        currentInput.allowances,
        currentInput.otherGains,
        currentInput.dependents
      );
    }

    if (!currentInput.grossSalary || currentInput.grossSalary <= 0) return null;
    return calculateSalaryFromGross(
      currentInput.grossSalary,
      currentInput.bonuses,
      currentInput.allowances,
      currentInput.otherGains,
      currentInput.dependents
    );
  }, [currentInput, isNetToGross]);

  // Tenter le calcul API en arrière-plan si le serveur est en ligne
  useEffect(() => {
    if (!isServerOnline || !localResult) {
      setApiResult(null);
      return;
    }

    let isMounted = true;
    const timer = setTimeout(async () => {
      try {
        const remote = await calculateSalaryApi(currentInput);
        if (isMounted) setApiResult(remote);
      } catch {
        if (isMounted) setApiResult(null);
      }
    }, 400);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [isServerOnline, currentInput, localResult]);

  // Le résultat final utilise le serveur si disponible, sinon le local
  const activeResult = apiResult || localResult;

  // Effacer les erreurs quand un résultat valide apparaît
  useEffect(() => {
    if (activeResult) {
      form.clearErrors();
    }
  }, [activeResult, form]);

  return {
    register,
    errors: formState.errors,
    setValue,
    control,
    result: activeResult,
    currentInput,
    isNetToGross,
    isServerOnline,
    toggleMode,
    applyPreset,
    reset,
  };
}
