from datetime import datetime
from sqlalchemy import Column, Integer, Float, DateTime, Boolean
from database.session import Base


class Calculation(Base):
    __tablename__ = "calculations"

    id = Column(Integer, primary_key=True, index=True)
    gross_salary = Column(Float, nullable=False)
    net_salary = Column(Float, nullable=False)
    bonuses = Column(Float, default=0.0)
    allowances = Column(Float, default=0.0)
    other_gains = Column(Float, default=0.0)
    cnaps_employee = Column(Float, nullable=False, default=0.0)
    ostie_employee = Column(Float, nullable=False, default=0.0)
    cnaps_employer = Column(Float, nullable=False, default=0.0)
    ostie_employer = Column(Float, nullable=False, default=0.0)
    total_employer_cost = Column(Float, nullable=False, default=0.0)
    taxable_income = Column(Float, nullable=False)
    irsa_tax = Column(Float, nullable=False)
    total_deductions = Column(Float, nullable=False)
    dependents = Column(Integer, default=0)
    is_net_to_gross = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
