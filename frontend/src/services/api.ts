import type { SalaryInput, SalaryResult, HistoryEntry, StatsData } from "../types";

const API_BASE_URL = "http://localhost:8000/api/v1";

export async function checkBackendHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, { method: "GET" });
    if (!res.ok) return false;
    const data = await res.json();
    return data.status === "ok";
  } catch {
    return false;
  }
}

export async function calculateSalaryApi(input: SalaryInput): Promise<SalaryResult> {
  const res = await fetch(`${API_BASE_URL}/calculate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      grossSalary: input.grossSalary,
      netSalary: input.netSalary,
      bonuses: input.bonuses,
      allowances: input.allowances,
      otherGains: input.otherGains,
      dependents: input.dependents,
      isNetToGross: input.isNetToGross,
    }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`API Error (${res.status}): ${errorText}`);
  }

  const data = await res.json();
  return mapBackendResponseToSalaryResult(data);
}

export async function saveCalculationApi(input: SalaryInput): Promise<SalaryResult> {
  const res = await fetch(`${API_BASE_URL}/calculate/save`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      grossSalary: input.grossSalary,
      netSalary: input.netSalary,
      bonuses: input.bonuses,
      allowances: input.allowances,
      otherGains: input.otherGains,
      dependents: input.dependents,
      isNetToGross: input.isNetToGross,
    }),
  });

  if (!res.ok) {
    throw new Error("Impossible de sauvegarder la simulation");
  }

  const data = await res.json();
  return mapBackendResponseToSalaryResult(data);
}

export async function fetchHistoryApi(): Promise<HistoryEntry[]> {
  const res = await fetch(`${API_BASE_URL}/history?limit=30`, { method: "GET" });
  if (!res.ok) throw new Error("Erreur de récupération de l'historique");
  const data = await res.json();

  return data.map((item: any) => ({
    id: item.id.toString(),
    isNetToGross: Boolean(item.isNetToGross),
    timestamp: item.createdAt || item.created_at || new Date().toISOString(),
    result: mapBackendResponseToSalaryResult(item),
  }));
}

export async function deleteHistoryItemApi(id: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/history/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error("Erreur lors de la suppression");
}

export async function clearHistoryApi(): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/history`, { method: "DELETE" });
  if (!res.ok) throw new Error("Erreur lors de la réinitialisation");
}

export async function fetchStatsApi(): Promise<StatsData> {
  const res = await fetch(`${API_BASE_URL}/stats`, { method: "GET" });
  if (!res.ok) throw new Error("Erreur lors de la récupération des stats");
  const data = await res.json();
  return {
    totalCalculations: data.totalCalculations ?? data.total_calculations ?? 0,
    averageGrossSalary: data.averageGrossSalary ?? data.average_gross_salary ?? 0,
    averageNetSalary: data.averageNetSalary ?? data.average_net_salary ?? 0,
    lastCalculationAt: data.lastCalculationAt ?? data.last_calculation_at,
  };
}

function mapBackendResponseToSalaryResult(data: any): SalaryResult {
  return {
    grossSalary: data.grossSalary ?? data.gross_salary ?? 0,
    netSalary: data.netSalary ?? data.net_salary ?? 0,
    netPay: data.netPay ?? data.net_pay ?? data.net_salary ?? 0,
    bonuses: data.bonuses ?? 0,
    allowances: data.allowances ?? 0,
    otherGains: data.otherGains ?? data.other_gains ?? 0,
    totalGains: data.totalGains ?? data.total_gains ?? 0,
    taxableIncome: data.taxableIncome ?? data.taxable_income ?? 0,
    cnapsEmployee: data.cnapsEmployee ?? data.cnaps_employee ?? 0,
    ostieEmployee: data.ostieEmployee ?? data.ostie_employee ?? 0,
    totalSocialContributions:
      data.totalSocialContributions ?? data.total_social_contributions ?? 0,
    cnapsEmployer: data.cnapsEmployer ?? data.cnaps_employer ?? 0,
    ostieEmployer: data.ostieEmployer ?? data.ostie_employer ?? 0,
    totalEmployerContributions:
      data.totalEmployerContributions ?? data.total_employer_contributions ?? 0,
    totalEmployerCost: data.totalEmployerCost ?? data.total_employer_cost ?? 0,
    irsaTax: data.irsaTax ?? data.irsa_tax ?? 0,
    irsaDetails: (data.irsaDetails ?? data.irsa_details ?? []).map((d: any) => ({
      bracket: d.bracket,
      rate: d.rate,
      amount: d.amount,
      tax: d.tax,
    })),
    totalDeductions: data.totalDeductions ?? data.total_deductions ?? 0,
    dependents: data.dependents ?? 0,
    deductionBreakdown: data.deductionBreakdown ?? data.deduction_breakdown ?? {
      "CNAPS (1%)": data.cnapsEmployee ?? data.cnaps_employee ?? 0,
      "OSTIE (1%)": data.ostieEmployee ?? data.ostie_employee ?? 0,
      IRSA: data.irsaTax ?? data.irsa_tax ?? 0,
    },
  };
}
