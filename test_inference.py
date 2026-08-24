# test_inference.py
from src.models.risk_scorer import PlacementRiskEngine

sample_borrower = {
    "degree_level": "PG",
    "ug_cgpa": 7.2,
    "current_cgpa": 7.5,
    "cgpa_consistency": 0.35,
    "course_stream": "STEM",
    "internships_count": 1,
    "internship_duration_months": 3,
    "internship_rating": 3.5,
    "prior_work_exp_months": 12,
    "certifications_count": 1,
    "institution_tier": "Tier-2",
    "historical_placement_rate": 0.72,
    "recruiter_density_score": 5.0,
    "destination_country": "USA",
    "target_sector": "IT",
    "sector_hiring_growth_index": 1.10,
    "country_labor_market_index": 82.0,
    "salary_currency": "USD",
    "fx_rate_to_inr": 84.0,
    "loan_amount_inr": 3500000.0,
    "expected_emi_inr": 42000.0
}

if __name__ == "__main__":
    engine = PlacementRiskEngine()
    result = engine.predict_student(sample_borrower)
    import json
    print(json.dumps(result, indent=2))