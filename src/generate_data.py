import numpy as np
import pandas as pd

# Country configurations with base local compensation, standard deviation, FX rate to INR, and labor ranges
COUNTRY_CONFIG = {
    "USA": {"currency": "USD", "base_salary": 75000.0, "salary_std": 14000.0, "fx_to_inr": 84.0, "labor_range": (75.0, 95.0)},
    "UK": {"currency": "GBP", "base_salary": 38000.0, "salary_std": 6000.0, "fx_to_inr": 108.0, "labor_range": (70.0, 90.0)},
    "Canada": {"currency": "CAD", "base_salary": 65000.0, "salary_std": 9500.0, "fx_to_inr": 62.0, "labor_range": (68.0, 88.0)},
    "Germany": {"currency": "EUR", "base_salary": 52000.0, "salary_std": 7000.0, "fx_to_inr": 91.0, "labor_range": (72.0, 92.0)},
    "Australia": {"currency": "AUD", "base_salary": 72000.0, "salary_std": 8500.0, "fx_to_inr": 55.0, "labor_range": (70.0, 90.0)},
    "India": {"currency": "INR", "base_salary": 900000.0, "salary_std": 250000.0, "fx_to_inr": 1.0, "labor_range": (60.0, 85.0)},
}

def generate_synthetic_data(num_samples: int = 5000, seed: int = 42) -> pd.DataFrame:
    np.random.seed(seed)
    
    # 1. Identifiers & Academic Profile
    student_ids = [f"STU_{1000 + i}" for i in range(num_samples)]
    degree_levels = np.random.choice(["UG", "PG"], size=num_samples, p=[0.35, 0.65])
    course_streams = np.random.choice(["STEM", "MBA", "Finance", "Nursing", "Arts"], size=num_samples, p=[0.45, 0.25, 0.15, 0.10, 0.05])
    
    # CGPA generation (out of 10)
    current_cgpas = np.round(np.random.normal(loc=7.8, scale=1.1, size=num_samples), 2)
    current_cgpas = np.clip(current_cgpas, 5.0, 10.0)
    
    ug_cgpas = []
    for deg, curr in zip(degree_levels, current_cgpas):
        if deg == "PG":
            ug_score = np.round(np.random.normal(loc=curr - 0.2, scale=0.8), 2)
            ug_cgpas.append(float(np.clip(ug_score, 5.0, 10.0)))
        else:
            ug_cgpas.append(curr)
            
    cgpa_consistency = np.round(np.random.exponential(scale=0.25, size=num_samples), 3)
    
    # 2. Experience & Certifications
    internships_count = np.random.choice([0, 1, 2, 3, 4], size=num_samples, p=[0.15, 0.35, 0.30, 0.15, 0.05])
    internship_durations = [cnt * np.random.randint(2, 6) if cnt > 0 else 0 for cnt in internships_count]
    internship_ratings = [round(np.random.uniform(2.5, 5.0), 1) if cnt > 0 else 0.0 for cnt in internships_count]
    
    prior_work_exp = []
    for deg in degree_levels:
        if deg == "PG":
            prior_work_exp.append(np.random.choice([0, 12, 24, 36, 48], p=[0.3, 0.3, 0.25, 0.1, 0.05]))
        else:
            prior_work_exp.append(0)
            
    certifications_count = np.random.choice([0, 1, 2, 3, 4, 5], size=num_samples, p=[0.25, 0.35, 0.20, 0.10, 0.07, 0.03])
    
    # 3. Institution Profile
    institution_tiers = np.random.choice(["Tier-1", "Tier-2", "Tier-3"], size=num_samples, p=[0.25, 0.50, 0.25])
    placement_rate_map = {"Tier-1": (0.85, 0.98), "Tier-2": (0.65, 0.85), "Tier-3": (0.40, 0.65)}
    hist_placement_rates = [round(np.random.uniform(*placement_rate_map[t]), 3) for t in institution_tiers]
    
    recruiter_density_map = {"Tier-1": (7.5, 10.0), "Tier-2": (4.5, 7.5), "Tier-3": (1.0, 4.5)}
    recruiter_densities = [round(np.random.uniform(*recruiter_density_map[t]), 1) for t in institution_tiers]
    
    # 4. Destination Country & Macro Demand
    countries = np.random.choice(
        ["USA", "UK", "Canada", "Germany", "Australia", "India"],
        size=num_samples,
        p=[0.35, 0.20, 0.15, 0.12, 0.10, 0.08]
    )
    
    target_sectors = np.random.choice(["IT", "BFSI", "Healthcare", "Manufacturing"], size=num_samples, p=[0.45, 0.25, 0.15, 0.15])
    growth_idx_map = {"IT": (1.05, 1.30), "BFSI": (0.95, 1.15), "Healthcare": (1.00, 1.20), "Manufacturing": (0.85, 1.05)}
    sector_growth = [round(np.random.uniform(*growth_idx_map[s]), 2) for s in target_sectors]
    
    country_labor_indices = [
        round(np.random.uniform(*COUNTRY_CONFIG[c]["labor_range"]), 1) for c in countries
    ]
    
    # 5. Financial / Loan Obligation (in INR)
    loan_amounts_inr = np.random.choice(
        [1500000.0, 2500000.0, 3500000.0, 4500000.0, 6000000.0],
        size=num_samples,
        p=[0.15, 0.30, 0.30, 0.18, 0.07]
    )
    expected_emis_inr = np.round((loan_amounts_inr * 0.012), 2)  # Monthly EMI obligation
    
    # 6. Targets Simulation
    records = []
    for i in range(num_samples):
        country_meta = COUNTRY_CONFIG[countries[i]]
        
        # Base Placement Score Calculation
        tier_weight = 3.5 if institution_tiers[i] == "Tier-1" else (1.8 if institution_tiers[i] == "Tier-2" else 0.0)
        stream_weight = 2.0 if course_streams[i] in ["STEM", "MBA"] else 0.5
        
        placement_score = (
            (current_cgpas[i] * 1.6) +
            (ug_cgpas[i] * 0.4) -
            (cgpa_consistency[i] * 2.2) +
            (internships_count[i] * 1.5) +
            (internship_durations[i] * 0.2) +
            (internship_ratings[i] * 0.5) +
            (prior_work_exp[i] * 0.04) +
            (certifications_count[i] * 0.5) +
            tier_weight +
            stream_weight +
            (recruiter_densities[i] * 0.8) +
            (sector_growth[i] * 3.0) +
            (country_labor_indices[i] * 0.05) +
            np.random.normal(0, 1.5)
        )
        
        # Placement Timeline Target (0: <=3m, 1: 3-6m, 2: 6-12m, 3: >12m)
        if placement_score > 37.0:
            timeline = 0
        elif placement_score > 29.0:
            timeline = 1
        elif placement_score > 22.0:
            timeline = 2
        else:
            timeline = 3
            
        # Starting Salary Calculation (Local Currency -> INR Equivalent)
        base_local = country_meta["base_salary"]
        tier_multiplier = 1.20 if institution_tiers[i] == "Tier-1" else (1.08 if institution_tiers[i] == "Tier-2" else 0.95)
        stream_multiplier = 1.15 if course_streams[i] in ["STEM", "MBA"] else 1.00
        
        local_salary = (
            (base_local * tier_multiplier * stream_multiplier) +
            (current_cgpas[i] * (base_local * 0.03)) +
            (prior_work_exp[i] * (base_local * 0.008)) +
            (internships_count[i] * (base_local * 0.02)) +
            np.random.normal(0, country_meta["salary_std"] * 0.5)
        )
        local_salary = round(max(base_local * 0.6, local_salary), 2)
        
        # Converted INR Annual Salary
        salary_inr_annual = round(local_salary * country_meta["fx_to_inr"], 2)
        
        # Repayment Risk Assessment (EMI vs. Converted Monthly Income)
        monthly_income_inr = salary_inr_annual / 12.0
        dti_ratio = expected_emis_inr[i] / monthly_income_inr
        
        if timeline >= 2 or dti_ratio > 0.45:
            risk_level = "High"
            driver = "Placement Delay / Elevated DTI"
        elif timeline == 1 or dti_ratio > 0.30:
            risk_level = "Medium"
            driver = "Moderate Timeline Delay"
        else:
            risk_level = "Low"
            driver = "Low Repayment Risk"
            
        records.append({
            "student_id": student_ids[i],
            "degree_level": degree_levels[i],
            "ug_cgpa": ug_cgpas[i],
            "current_cgpa": current_cgpas[i],
            "cgpa_consistency": cgpa_consistency[i],
            "course_stream": course_streams[i],
            "internships_count": internships_count[i],
            "internship_duration_months": internship_durations[i],
            "internship_rating": internship_ratings[i],
            "prior_work_exp_months": prior_work_exp[i],
            "certifications_count": certifications_count[i],
            "institution_tier": institution_tiers[i],
            "historical_placement_rate": hist_placement_rates[i],
            "recruiter_density_score": recruiter_densities[i],
            "destination_country": countries[i],
            "target_sector": target_sectors[i],
            "sector_hiring_growth_index": sector_growth[i],
            "country_labor_market_index": country_labor_indices[i],
            "salary_currency": country_meta["currency"],
            "starting_salary_local": local_salary,
            "fx_rate_to_inr": country_meta["fx_to_inr"],
            "loan_amount_inr": loan_amounts_inr[i],
            "expected_emi_inr": expected_emis_inr[i],
            "placement_timeline": timeline,
            "starting_salary_inr_annual": salary_inr_annual,
            "repayment_risk_level": risk_level,
            "primary_risk_driver": driver
        })
        
    return pd.DataFrame(records)

if __name__ == "__main__":
    df = generate_synthetic_data(num_samples=5000)
    df.to_csv("data/raw/synthetic_borrowers.csv", index=False)
    print(f"Generated dataset with shape: {df.shape} and saved to data/raw/synthetic_borrowers.csv")