import type { SalaryResult, TaxBracketDetail, CurrencyMode } from "../types";

// Constantes de plafonds
const CNAPS_CEILING = 2_400_000;
const OSTIE_CEILING = 2_400_000;

// Taux employés
const CNAPS_EMPLOYEE_RATE = 0.01;
const OSTIE_EMPLOYEE_RATE = 0.01;

// Taux employeurs
const CNAPS_EMPLOYER_RATE = 0.13;
const OSTIE_EMPLOYER_RATE = 0.05;

// IRSA Barème 2026
const IRSA_MINIMUM = 3_000;
const FAMILY_DEDUCTION_PER_DEPENDENT = 2_000;

const IRSA_BRACKETS: [number, number, number][] = [
  [0, 350_000, 0.0],
  [350_001, 400_000, 0.05],
  [400_001, 500_000, 0.1],
  [500_001, 600_000, 0.15],
  [600_001, 4_000_000, 0.2],
  [4_000_001, Infinity, 0.25],
];

export function calculateCnaps(grossSalary: number): number {
  const capped = Math.min(grossSalary, CNAPS_CEILING);
  return Math.round(capped * CNAPS_EMPLOYEE_RATE * 100) / 100;
}

export function calculateOstie(grossSalary: number): number {
  const capped = Math.min(grossSalary, OSTIE_CEILING);
  return Math.round(capped * OSTIE_EMPLOYEE_RATE * 100) / 100;
}

export function calculateCnapsEmployer(grossSalary: number): number {
  const capped = Math.min(grossSalary, CNAPS_CEILING);
  return Math.round(capped * CNAPS_EMPLOYER_RATE * 100) / 100;
}

export function calculateOstieEmployer(grossSalary: number): number {
  const capped = Math.min(grossSalary, OSTIE_CEILING);
  return Math.round(capped * OSTIE_EMPLOYER_RATE * 100) / 100;
}

export function calculateIrsa(
  taxableIncome: number,
  dependents = 0
): { tax: number; details: TaxBracketDetail[] } {
  let remaining = taxableIncome;
  let tax = 0;
  const details: TaxBracketDetail[] = [];

  for (const [bracketMin, bracketMax, rate] of IRSA_BRACKETS) {
    if (remaining <= 0) break;
    if (taxableIncome < bracketMin) continue;

    const amountInBracket =
      bracketMax === Infinity
        ? remaining
        : Math.min(remaining, bracketMax - bracketMin + 1);

    if (amountInBracket > 0) {
      const bracketTax = Math.round(amountInBracket * rate * 100) / 100;
      tax += bracketTax;
      details.push({
        bracket:
          bracketMax === Infinity
            ? `${bracketMin.toLocaleString("fr-FR")}+`
            : `${bracketMin.toLocaleString("fr-FR")} - ${bracketMax.toLocaleString("fr-FR")}`,
        rate: `${(rate * 100).toFixed(0)}%`,
        amount: amountInBracket,
        tax: bracketTax,
      });
      remaining -= amountInBracket;
    }
  }

  // Abattement familial
  const familyDeduction = Math.min(
    dependents * FAMILY_DEDUCTION_PER_DEPENDENT,
    tax
  );
  tax -= familyDeduction;

  if (familyDeduction > 0) {
    details.push({
      bracket: "Abattement familial",
      rate: `${FAMILY_DEDUCTION_PER_DEPENDENT.toLocaleString("fr-FR")} MGA/pers`,
      amount: dependents,
      tax: -familyDeduction,
    });
  }

  // IRSA minimum
  tax = Math.max(tax, IRSA_MINIMUM);

  return {
    tax: Math.round(tax * 100) / 100,
    details,
  };
}

export function calculateSalaryFromGross(
  grossSalary: number,
  bonuses = 0,
  allowances = 0,
  otherGains = 0,
  dependents = 0
): SalaryResult {
  const totalGains = grossSalary + bonuses + allowances + otherGains;

  const cnaps = calculateCnaps(totalGains);
  const ostie = calculateOstie(totalGains);
  const cnapsEmp = calculateCnapsEmployer(totalGains);
  const ostieEmp = calculateOstieEmployer(totalGains);

  const totalSocialContributions = Math.round((cnaps + ostie) * 100) / 100;
  const totalEmployerContributions = Math.round((cnapsEmp + ostieEmp) * 100) / 100;

  const taxableIncome = Math.round((totalGains - totalSocialContributions) * 100) / 100;

  const { tax: irsaTax, details: irsaDetails } = calculateIrsa(
    taxableIncome,
    dependents
  );

  const totalDeductions = Math.round((totalSocialContributions + irsaTax) * 100) / 100;
  const netPay = Math.round((totalGains - totalDeductions) * 100) / 100;
  const totalEmployerCost = Math.round((totalGains + totalEmployerContributions) * 100) / 100;

  return {
    grossSalary: Math.round(grossSalary * 100) / 100,
    netSalary: Math.round(netPay * 100) / 100,
    netPay: Math.round(netPay * 100) / 100,
    bonuses: Math.round(bonuses * 100) / 100,
    allowances: Math.round(allowances * 100) / 100,
    otherGains: Math.round(otherGains * 100) / 100,
    totalGains: Math.round(totalGains * 100) / 100,
    taxableIncome: Math.round(taxableIncome * 100) / 100,
    cnapsEmployee: cnaps,
    ostieEmployee: ostie,
    totalSocialContributions,
    cnapsEmployer: cnapsEmp,
    ostieEmployer: ostieEmp,
    totalEmployerContributions,
    totalEmployerCost,
    irsaTax,
    irsaDetails,
    totalDeductions: Math.round(totalDeductions * 100) / 100,
    dependents,
    deductionBreakdown: {
      "CNAPS (1%)": cnaps,
      "OSTIE (1%)": ostie,
      IRSA: irsaTax,
    },
  };
}

export function calculateSalaryFromNet(
  targetNet: number,
  bonuses = 0,
  allowances = 0,
  otherGains = 0,
  dependents = 0,
  maxIterations = 100,
  tolerance = 0.01
): SalaryResult {
  let low = targetNet;
  let high = targetNet * 3;
  let mid = (low + high) / 2;

  for (let i = 0; i < maxIterations; i++) {
    mid = (low + high) / 2;
    const result = calculateSalaryFromGross(
      mid,
      bonuses,
      allowances,
      otherGains,
      dependents
    );

    const diff = result.netPay - targetNet;
    if (Math.abs(diff) < tolerance) {
      return result;
    }

    if (diff > 0) {
      high = mid;
    } else {
      low = mid;
    }
  }

  return calculateSalaryFromGross(mid, bonuses, allowances, otherGains, dependents);
}

export function formatCurrency(amount: number, mode: CurrencyMode = "MGA"): string {
  if (mode === "FMG") {
    const fmgAmount = amount * 5;
    return `${Math.round(fmgAmount).toLocaleString("fr-FR")} FMG`;
  }
  return `${amount.toLocaleString("fr-FR")} MGA`;
}
