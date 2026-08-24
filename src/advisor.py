# src/advisor.py
def generate_recommendations(
    risk_level: str,
    timeline_desc: str,
    dti_ratio: float,
    top_risk_drivers: list,
    internships_count: int,
    certifications_count: int
) -> list:
    """
    Generates rule-based next-best action recommendations tailored to borrower risk factors.
    """
    recommendations = []

    if risk_level == "High":
        recommendations.append("Flag for Early Portfolio Intervention: Assign a placement mentor immediately.")
        
    if dti_ratio > 0.45:
        recommendations.append(f"High Debt-Service Burden (DTI: {dti_ratio:.1%}): Advise extended repayment tenure or co-signer evaluation.")

    if internships_count < 2:
        recommendations.append("Low Internship Exposure: Recommend enrolling in verified virtual internships or capstone industry projects.")

    if certifications_count < 2:
        recommendations.append("Certification Gap: Recommend completing domain-aligned professional certifications before degree completion.")

    # Driver-specific actions based on SHAP
    driver_str = " ".join(top_risk_drivers).lower()
    if "recruiter_density" in driver_str or "placement_rate" in driver_str:
        recommendations.append("Campus Outreach Gap: Connect student with active alumni networks in the destination country.")
    if "cgpa" in driver_str or "consistency" in driver_str:
        recommendations.append("Academic Inconsistency: Set up bi-weekly academic milestone tracking.")

    if not recommendations:
        recommendations.append("Profile On Track: Standard monitoring without immediate intervention required.")

    return recommendations