export interface SalaryInput {
  grossSalary?: number;
  netSalary?: number;
  bonuses: number;
  allowances: number;
  otherGains: number;
  dependents: number;
  isNetToGross: boolean;
}

export interface TaxBracketDetail {
  bracket: string;
  rate: string;
  amount: number;
  tax: number;
}

export interface SalaryResult {
  grossSalary: number;
  netSalary: number;
  netPay: number;
  bonuses: number;
  allowances: number;
  otherGains: number;
  totalGains: number;
  taxableIncome: number;
  cnapsEmployee: number;
  ostieEmployee: number;
  totalSocialContributions: number;
  cnapsEmployer: number;
  ostieEmployer: number;
  totalEmployerContributions: number;
  totalEmployerCost: number;
  irsaTax: number;
  irsaDetails: TaxBracketDetail[];
  totalDeductions: number;
  dependents: number;
  deductionBreakdown: Record<string, number>;
}

export interface HistoryEntry {
  id: string;
  result: SalaryResult;
  isNetToGross: boolean;
  timestamp: string;
}

export interface StatsData {
  totalCalculations: number;
  averageGrossSalary: number;
  averageNetSalary: number;
  lastCalculationAt?: string;
}

export type CurrencyMode = "MGA" | "FMG";
