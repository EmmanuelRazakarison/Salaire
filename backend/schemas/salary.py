from pydantic import BaseModel, Field, ConfigDict
from pydantic.alias_generators import to_camel
from typing import Optional, List, Dict
from datetime import datetime


class BaseSchema(BaseModel):
    model_config = ConfigDict(
        alias_generator=to_camel,
        populate_by_name=True,
        from_attributes=True,
    )


class TaxBracketDetail(BaseSchema):
    bracket: str
    rate: str
    amount: float
    tax: float


class SalaryRequest(BaseSchema):
    gross_salary: Optional[float] = Field(None, ge=0, description="Salaire brut en MGA")
    net_salary: Optional[float] = Field(None, ge=0, description="Salaire net en MGA")
    bonuses: float = Field(0.0, ge=0, description="Primes")
    allowances: float = Field(0.0, ge=0, description="Indemnités")
    other_gains: float = Field(0.0, ge=0, description="Autres gains")
    dependents: int = Field(0, ge=0, le=20, description="Nombre de personnes à charge")
    is_net_to_gross: bool = Field(False, description="Mode de calcul (net vers brut)")


class SalaryResponse(BaseSchema):
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
    cnaps_employer: float = 0.0
    ostie_employer: float = 0.0
    total_employer_contributions: float = 0.0
    total_employer_cost: float = 0.0
    irsa_tax: float
    irsa_details: List[TaxBracketDetail]
    total_deductions: float
    dependents: int
    deduction_breakdown: Dict[str, float]


class CalculationHistoryItem(BaseSchema):
    id: int
    gross_salary: float
    net_salary: float
    bonuses: float
    allowances: float
    other_gains: float
    cnaps_employee: float
    ostie_employee: float
    cnaps_employer: float = 0.0
    ostie_employer: float = 0.0
    total_employer_cost: float = 0.0
    taxable_income: float
    irsa_tax: float
    total_deductions: float
    dependents: int
    is_net_to_gross: bool
    created_at: datetime


class StatsResponse(BaseSchema):
    total_calculations: int
    average_gross_salary: float
    average_net_salary: float
    last_calculation_at: Optional[datetime] = None
