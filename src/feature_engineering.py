from sklearn.compose import ColumnTransformer
from sklearn.preprocessing import OneHotEncoder, StandardScaler, OrdinalEncoder

def build_preprocessor() -> ColumnTransformer:
    # Categorical features requiring standard One-Hot Encoding
    nominal_features = [
        "degree_level",
        "course_stream",
        "target_sector",
        "destination_country"
    ]
    
    # Ordinal features with explicit ordering
    ordinal_features = ["institution_tier"]
    tier_order = [["Tier-3", "Tier-2", "Tier-1"]]
    
    # Continuous & discrete numeric features
    numeric_features = [
        "ug_cgpa",
        "current_cgpa",
        "cgpa_consistency",
        "internships_count",
        "internship_duration_months",
        "internship_rating",
        "prior_work_exp_months",
        "certifications_count",
        "historical_placement_rate",
        "recruiter_density_score",
        "sector_hiring_growth_index",
        "country_labor_market_index",
        "loan_amount_inr",
        "expected_emi_inr",
    ]
    
    preprocessor = ColumnTransformer(
        transformers=[
            ("num", StandardScaler(), numeric_features),
            ("nom", OneHotEncoder(drop="first", handle_unknown="ignore"), nominal_features),
            ("ord", OrdinalEncoder(categories=tier_order), ordinal_features),
        ],
        remainder="drop"
    )
    
    return preprocessor

def get_feature_names(fitted_preprocessor: ColumnTransformer) -> list:
    """Helper to extract generated feature names after fitting for explainability/SHAP."""
    feature_names = []
    
    # Numeric features
    feature_names.extend(fitted_preprocessor.transformers_[0][2])
    
    # One-hot encoded features
    nom_encoder = fitted_preprocessor.transformers_[1][1]
    nom_cols = fitted_preprocessor.transformers_[1][2]
    feature_names.extend(nom_encoder.get_feature_names_out(nom_cols).tolist())
    
    # Ordinal features
    feature_names.extend(fitted_preprocessor.transformers_[2][2])
    
    return feature_names