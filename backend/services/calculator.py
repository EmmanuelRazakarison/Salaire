"""
Module centralisé de calcul du salaire à Madagascar.

Règles appliquées (2026) :
- CNAPS (employé) : 1% du brut, plafonné à 2 400 000 MGA
- OSTIE (employé) : 1% du brut, plafonné à 2 400 000 MGA
- CNAPS (employeur) : 13% du brut, plafonné à 2 400 000 MGA
- OSTIE (employeur) : 5% du brut, plafonné à 2 400 000 MGA
- IRSA : barème progressif mensuel
  - Jusqu'à 350 000 MGA : 0%
  - 350 001 – 400 000 MGA : 5%
  - 400 001 – 500 000 MGA : 10%
  - 500 001 – 600 000 MGA : 15%
  - 600 001 – 4 000 000 MGA : 20%
  - Au-dessus de 4 000 000 MGA : 25%
- Abattement familial : 2 000 MGA par personne à charge
- IRSA minimum : 3 000 MGA
"""

from typing import TypedDict

# --- Constantes de plafond ---
CNAPS_CEILING = 2_400_000
OSTIE_CEILING = 2_400_000

# --- Taux de cotisation employé ---
CNAPS_EMPLOYEE_RATE = 0.01  # 1%
OSTIE_EMPLOYEE_RATE = 0.01  # 1%

# --- Taux de cotisation employeur ---
CNAPS_EMPLOYER_RATE = 0.13  # 13%
OSTIE_EMPLOYER_RATE = 0.05  # 5%

# --- Barème IRSA 2026 : [(seuil_min, seuil_max, taux)] ---
IRSA_BRACKETS = [
    (0, 350_000, 0.00),
    (350_001, 400_000, 0.05),
    (400_001, 500_000, 0.10),
    (500_001, 600_000, 0.15),
    (600_001, 4_000_000, 0.20),
    (4_000_001, float("inf"), 0.25),
]

IRSA_MINIMUM = 3_000
FAMILY_DEDUCTION_PER_DEPENDENT = 2_000


class TaxBracketDetail(TypedDict):
    bracket: str
    rate: str
    amount: float
    tax: float


class SalaryResult(TypedDict):
    gross_salary: float
    net_salary: float
    net_pay: float
    bonuses: float
    allowances: float
    other_gains: float
    total_gains: float
    taxable_income: float
    cnaps_employee: float
    ostie_employee: float
    total_social_contributions: float
    cnaps_employer: float
    ostie_employer: float
    total_employer_contributions: float
    total_employer_cost: float
    irsa_tax: float
    irsa_details: list[TaxBracketDetail]
    total_deductions: float
    dependents: int
    deduction_breakdown: dict[str, float]


def calculate_cnaps(gross_salary: float) -> float:
    """Calcule la cotisation CNAPS employé (1% plafonné)."""
    capped_salary = min(gross_salary, CNAPS_CEILING)
    return round(capped_salary * CNAPS_EMPLOYEE_RATE, 2)


def calculate_ostie(gross_salary: float) -> float:
    """Calcule la cotisation OSTIE employé (1% plafonné)."""
    capped_salary = min(gross_salary, OSTIE_CEILING)
    return round(capped_salary * OSTIE_EMPLOYEE_RATE, 2)


def calculate_cnaps_employer(gross_salary: float) -> float:
    """Calcule la cotisation CNAPS employeur (13% plafonné)."""
    capped_salary = min(gross_salary, CNAPS_CEILING)
    return round(capped_salary * CNAPS_EMPLOYER_RATE, 2)


def calculate_ostie_employer(gross_salary: float) -> float:
    """Calcule la cotisation OSTIE employeur (5% plafonné)."""
    capped_salary = min(gross_salary, OSTIE_CEILING)
    return round(capped_salary * OSTIE_EMPLOYER_RATE, 2)


def calculate_irsa(taxable_income: float, dependents: int = 0) -> tuple[float, list[dict]]:
    """
    Calcule l'IRSA selon le barème progressif.
    Retourne (montant_irsa, détails_par_tranche).
    """
    remaining = taxable_income
    tax = 0.0
    details: list[TaxBracketDetail] = []

    for bracket_min, bracket_max, rate in IRSA_BRACKETS:
        if remaining <= 0 or taxable_income < bracket_min:
            continue

        amount_in_bracket = (
            remaining if bracket_max == float("inf")
            else min(remaining, bracket_max - bracket_min + 1)
        )

        if amount_in_bracket > 0:
            bracket_tax = round(amount_in_bracket * rate, 2)
            tax += bracket_tax
            details.append({
                "bracket": (
                    f"{bracket_min:,}+"
                    if bracket_max == float("inf")
                    else f"{bracket_min:,} - {bracket_max:,}"
                ),
                "rate": f"{rate * 100:.0f}%",
                "amount": amount_in_bracket,
                "tax": bracket_tax,
            })
            remaining -= amount_in_bracket

    # Abattement familial
    family_deduction = min(dependents * FAMILY_DEDUCTION_PER_DEPENDENT, tax)
    tax -= family_deduction

    if family_deduction > 0:
        details.append({
            "bracket": "Abattement familial",
            "rate": f"{FAMILY_DEDUCTION_PER_DEPENDENT:,} MGA/pers",
            "amount": float(dependents),
            "tax": -family_deduction,
        })

    # IRSA minimum
    tax = max(tax, IRSA_MINIMUM)

    return round(tax, 2), details


def calculate_salary_from_gross(
    gross_salary: float,
    bonuses: float = 0.0,
    allowances: float = 0.0,
    other_gains: float = 0.0,
    dependents: int = 0,
) -> SalaryResult:
    """Calcule le salaire net et le coût employeur à partir du salaire brut."""
    total_gains = gross_salary + bonuses + allowances + other_gains
    cnaps = calculate_cnaps(total_gains)
    ostie = calculate_ostie(total_gains)
    cnaps_emp = calculate_cnaps_employer(total_gains)
    ostie_emp = calculate_ostie_employer(total_gains)

    total_social_contributions = round(cnaps + ostie, 2)
    total_employer_contributions = round(cnaps_emp + ostie_emp, 2)

    taxable_income = round(total_gains - total_social_contributions, 2)
    irsa_tax, irsa_details = calculate_irsa(taxable_income, dependents)
    total_deductions = round(total_social_contributions + irsa_tax, 2)
    net_pay = round(total_gains - total_deductions, 2)

    total_employer_cost = round(total_gains + total_employer_contributions, 2)

    return {
        "gross_salary": round(gross_salary, 2),
        "net_salary": round(net_pay, 2),
        "net_pay": round(net_pay, 2),
        "bonuses": round(bonuses, 2),
        "allowances": round(allowances, 2),
        "other_gains": round(other_gains, 2),
        "total_gains": round(total_gains, 2),
        "taxable_income": taxable_income,
        "cnaps_employee": cnaps,
        "ostie_employee": ostie,
        "total_social_contributions": total_social_contributions,
        "cnaps_employer": cnaps_emp,
        "ostie_employer": ostie_emp,
        "total_employer_contributions": total_employer_contributions,
        "total_employer_cost": total_employer_cost,
        "irsa_tax": irsa_tax,
        "irsa_details": irsa_details,
        "total_deductions": total_deductions,
        "dependents": dependents,
        "deduction_breakdown": {
            "CNAPS (1%)": cnaps,
            "OSTIE (1%)": ostie,
            "IRSA": irsa_tax,
        },
    }


def calculate_salary_from_net(
    target_net: float,
    bonuses: float = 0.0,
    allowances: float = 0.0,
    other_gains: float = 0.0,
    dependents: int = 0,
    max_iterations: int = 100,
    tolerance: float = 0.01,
) -> SalaryResult:
    """
    Estime le salaire brut à partir d'un salaire net cible (dichotomie haute précision).
    """
    low = target_net
    high = target_net * 3
    mid = (low + high) / 2

    for _ in range(max_iterations):
        mid = (low + high) / 2
        result = calculate_salary_from_gross(mid, bonuses, allowances, other_gains, dependents)

        diff = result["net_pay"] - target_net
        if abs(diff) < tolerance:
            return result

        if diff > 0:
            high = mid
        else:
            low = mid

    return calculate_salary_from_gross(mid, bonuses, allowances, other_gains, dependents)
