# src/explainability.py
import joblib
import shap
import pandas as pd
import numpy as np
from src.feature_engineering import get_feature_names

class RiskExplainer:
    def __init__(self, model_path: str = "models/placement_classifier.joblib", preprocessor_path: str = "models/preprocessor.joblib"):
        self.model = joblib.load(model_path)
        self.preprocessor = joblib.load(preprocessor_path)
        self.feature_names = get_feature_names(self.preprocessor)
        self.explainer = shap.TreeExplainer(self.model)

    def explain_profile(self, raw_input_df: pd.DataFrame, top_k: int = 3) -> dict:
        """
        Extract top risk-increasing and risk-mitigating features for a borrower profile.
        """
        proc_features = self.preprocessor.transform(raw_input_df)
        shap_values = self.explainer.shap_values(proc_features)

        # For multi-class output, analyze the SHAP values for high-risk classes (classes 2 and 3)
        if isinstance(shap_values, list):
            delayed_shap = shap_values[2][0] + shap_values[3][0]
        elif len(shap_values.shape) == 3:
            delayed_shap = shap_values[0, :, 2] + shap_values[0, :, 3]
        else:
            delayed_shap = shap_values[0]

        feature_contributions = list(zip(self.feature_names, delayed_shap))
        
        # Sort by impact on placement delay risk
        sorted_drivers = sorted(feature_contributions, key=lambda x: x[1], reverse=True)

        top_risk_drivers = [feat for feat, val in sorted_drivers if val > 0][:top_k]
        top_positive_factors = [feat for feat, val in sorted(feature_contributions, key=lambda x: x[1]) if val < 0][:top_k]

        return {
            "top_risk_drivers": top_risk_drivers,
            "top_positive_factors": top_positive_factors
        }