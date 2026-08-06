from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func
from typing import List

from database.session import get_db
from schemas.salary import (
    SalaryRequest,
    SalaryResponse,
    CalculationHistoryItem,
    StatsResponse,
)
from models.calculation import Calculation
from services.calculator import (
    calculate_salary_from_gross,
    calculate_salary_from_net,
)

router = APIRouter(prefix="/api/v1", tags=["Salary"])


def _compute_result(request: SalaryRequest) -> dict:
    """Calcule le résultat selon le mode (brut→net ou net→brut)."""
    if request.is_net_to_gross:
        if request.net_salary is None or request.net_salary <= 0:
            raise HTTPException(status_code=400, detail="net_salary valide requis en mode net→brut")
        return calculate_salary_from_net(
            target_net=request.net_salary,
            bonuses=request.bonuses,
            allowances=request.allowances,
            other_gains=request.other_gains,
            dependents=request.dependents,
        )

    if request.gross_salary is None or request.gross_salary <= 0:
        raise HTTPException(status_code=400, detail="gross_salary valide requis en mode brut→net")
    return calculate_salary_from_gross(
        gross_salary=request.gross_salary,
        bonuses=request.bonuses,
        allowances=request.allowances,
        other_gains=request.other_gains,
        dependents=request.dependents,
    )


@router.post("/calculate", response_model=SalaryResponse)
def calculate_salary(request: SalaryRequest):
    """Calcule le salaire net et les cotisations à partir du brut, ou inversement."""
    return _compute_result(request)


@router.post("/calculate/save", response_model=SalaryResponse)
def calculate_and_save(request: SalaryRequest, db: Session = Depends(get_db)):
    """Calcule et sauvegarde le résultat en base de données."""
    result = _compute_result(request)

    calc = Calculation(
        gross_salary=result["gross_salary"],
        net_salary=result["net_pay"],
        bonuses=result["bonuses"],
        allowances=result["allowances"],
        other_gains=result["other_gains"],
        cnaps_employee=result["cnaps_employee"],
        ostie_employee=result["ostie_employee"],
        cnaps_employer=result.get("cnaps_employer", 0.0),
        ostie_employer=result.get("ostie_employer", 0.0),
        total_employer_cost=result.get("total_employer_cost", 0.0),
        taxable_income=result["taxable_income"],
        irsa_tax=result["irsa_tax"],
        total_deductions=result["total_deductions"],
        dependents=result["dependents"],
        is_net_to_gross=request.is_net_to_gross,
    )
    db.add(calc)
    db.commit()
    db.refresh(calc)

    return result


@router.get("/history", response_model=List[CalculationHistoryItem])
def get_history(skip: int = 0, limit: int = 50, db: Session = Depends(get_db)):
    """Récupère l'historique des calculs sauvegardés."""
    return (
        db.query(Calculation)
        .order_by(Calculation.created_at.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )


@router.delete("/history")
def clear_all_history(db: Session = Depends(get_db)):
    """Vide l'ensemble de l'historique."""
    db.query(Calculation).delete()
    db.commit()
    return {"message": "Historique complet effacé"}


@router.delete("/history/{calc_id}")
def delete_history_item(calc_id: int, db: Session = Depends(get_db)):
    """Supprime un élément spécifique de l'historique."""
    calc = db.query(Calculation).filter(Calculation.id == calc_id).first()
    if not calc:
        raise HTTPException(status_code=404, detail="Calcul non trouvé")
    db.delete(calc)
    db.commit()
    return {"message": "Supprimé avec succès"}


@router.get("/stats", response_model=StatsResponse)
def get_stats(db: Session = Depends(get_db)):
    """Retourne des statistiques globales sur les calculs effectués."""
    total = db.query(Calculation).count()
    if total == 0:
        return StatsResponse(
            total_calculations=0,
            average_gross_salary=0.0,
            average_net_salary=0.0,
            last_calculation_at=None,
        )

    avg_gross = db.query(func.avg(Calculation.gross_salary)).scalar() or 0.0
    avg_net = db.query(func.avg(Calculation.net_salary)).scalar() or 0.0
    last_calc = db.query(Calculation).order_by(Calculation.created_at.desc()).first()

    return StatsResponse(
        total_calculations=total,
        average_gross_salary=round(avg_gross, 2),
        average_net_salary=round(avg_net, 2),
        last_calculation_at=last_calc.created_at if last_calc else None,
    )


@router.get("/health")
def health_check():
    """Vérification de l'état de l'API."""
    return {"status": "ok", "app": "Salaire Mada API", "version": "1.1.0"}
