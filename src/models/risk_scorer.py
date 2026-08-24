# src/models/risk_scorer.py
import joblib
import pandas as pd
from src.explainability import RiskExplainer
from src.advisor import generate_recommendations

class PlacementRiskEngine:
    def __init__(self):
        self.clf = joblib.load("models/placement_classifier.joblib")
        self.reg = joblib.load("models/salary_regressor.joblib")
        self.preprocessor = joblib.load("models/preprocessor.joblib")
        self.explainer = RiskExplainer()
        
        self.timeline_map = {
            0: "Placed within 0-3 months",
            1: "Placed within 3-6 months",
            2: "Placed within 6-12 months",
            3: "Delayed (>12 months)"
        }

    def predict_student(self, raw_data: dict) -> dict:
        df = pd.DataFrame([raw_data])
        processed = self.preprocessor.transform(df)

        # 1. Timeline & Salary Prediction
        timeline_idx = int(self.clf.predict(processed)[0])
        timeline_probs = self.clf.predict_proba(processed)[0].tolist()
        pred_salary_inr = float(self.reg.predict(processed)[0])
        
        # Converted local salary estimation
        fx_rate = raw_data.get("fx_rate_to_inr", 1.0)
        pred_salary_local = round(pred_salary_inr / fx_rate, 2)

        # 2. Financial Feasibility & Risk Level
        monthly_income_inr = pred_salary_inr / 12.0
        expected_emi = raw_data["expected_emi_inr"]
        dti_ratio = round(expected_emi / monthly_income_inr, 4)

        if timeline_idx >= 2 or dti_ratio > 0.45:
            risk_tier = "High"
        elif timeline_idx == 1 or dti_ratio > 0.30:
            risk_tier = "Medium"
        else:
            risk_tier = "Low"

        # 3. Explainability & Actionable Interventions
        explanations = self.explainer.explain_profile(df)
        actions = generate_recommendations(
            risk_level=risk_tier,
            timeline_desc=self.timeline_map[timeline_idx],
            dti_ratio=dti_ratio,
            top_risk_drivers=explanations["top_risk_drivers"],
            internships_count=raw_data["internships_count"],
            certifications_count=raw_data["certifications_count"]
        )

        return {
            "predicted_timeline": self.timeline_map[timeline_idx],
            "timeline_confidence_score": round(max(timeline_probs), 4),
            "estimated_annual_salary_inr": round(pred_salary_inr, 2),
            "estimated_local_salary": pred_salary_local,
            "salary_currency": raw_data.get("salary_currency", "INR"),
            "debt_to_income_ratio": dti_ratio,
            "overall_repayment_risk": risk_tier,
            "key_risk_drivers": explanations["top_risk_drivers"],
            "positive_profile_factors": explanations["top_positive_factors"],
            "recommended_interventions": actions
        }