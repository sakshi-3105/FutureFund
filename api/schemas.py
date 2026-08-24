# api/schemas.py
from pydantic import BaseModel, Field
from typing import List, Optional

class StudentProfileRequest(BaseModel):
    degree_level: str = Field(..., example="PG")
    ug_cgpa: float = Field(..., ge=0.0, le=10.0, example=7.8)
    current_cgpa: float = Field(..., ge=0.0, le=10.0, example=8.2)
    cgpa_consistency: float = Field(..., ge=0.0, example=0.25)
    course_stream: str = Field(..., example="STEM")
    internships_count: int = Field(..., ge=0, example=2)
    internship_duration_months: int = Field(..., ge=0, example=6)
    internship_rating: float = Field(..., ge=0.0, le=5.0, example=4.2)
    prior_work_exp_months: int = Field(..., ge=0, example=12)
    certifications_count: int = Field(..., ge=0, example=2)
    institution_tier: str = Field(..., example="Tier-1")
    historical_placement_rate: float = Field(..., ge=0.0, le=1.0, example=0.88)
    recruiter_density_score: float = Field(..., ge=0.0, le=10.0, example=8.5)
    destination_country: str = Field(..., example="USA")
    target_sector: str = Field(..., example="IT")
    sector_hiring_growth_index: float = Field(..., example=1.15)
    country_labor_market_index: float = Field(..., ge=0.0, le=100.0, example=85.0)
    salary_currency: Optional[str] = Field("USD", example="USD")
    fx_rate_to_inr: Optional[float] = Field(84.0, example=84.0)
    loan_amount_inr: float = Field(..., example=3500000.0)
    expected_emi_inr: float = Field(..., example=42000.0)

class RiskAssessmentResponse(BaseModel):
    predicted_timeline: str
    timeline_confidence_score: float
    estimated_annual_salary_inr: float
    estimated_local_salary: float
    salary_currency: str
    debt_to_income_ratio: float
    overall_repayment_risk: str
    key_risk_drivers: List[str]
    positive_profile_factors: List[str]
    recommended_interventions: List[str]