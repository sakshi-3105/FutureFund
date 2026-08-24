# src/train.py
import os
import joblib
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, mean_squared_error, r2_score
from xgboost import XGBClassifier, XGBRegressor

from feature_engineering import build_preprocessor

def run_training():
    os.makedirs("models", exist_ok=True)
    
    # 1. Load data
    data_path = "data/raw/synthetic_borrowers.csv"
    if not os.path.exists(data_path):
        raise FileNotFoundError(f"{data_path} not found. Run generate_data.py first.")
        
    df = pd.read_csv(data_path)
    
    # 2. Separate features from metadata/targets
    drop_cols = [
        "student_id",
        "salary_currency",
        "starting_salary_local",
        "fx_rate_to_inr",
        "placement_timeline",
        "starting_salary_inr_annual",
        "repayment_risk_level",
        "primary_risk_driver"
    ]
    X = df.drop(columns=drop_cols)
    y_timeline = df["placement_timeline"]
    y_salary = df["starting_salary_inr_annual"]
    
    # 3. Train-Test Split (80/20)
    X_train, X_test, y_time_train, y_time_test, y_sal_train, y_sal_test = train_test_split(
        X, y_timeline, y_salary, test_size=0.2, random_state=42, stratify=y_timeline
    )
    
    # 4. Fit & save the feature preprocessor
    preprocessor = build_preprocessor()
    X_train_proc = preprocessor.fit_transform(X_train)
    X_test_proc = preprocessor.transform(X_test)
    joblib.dump(preprocessor, "models/preprocessor.joblib")
    print(" Saved: models/preprocessor.joblib")
    
    # 5. Train & evaluate Placement Classifier
    clf = XGBClassifier(
        n_estimators=120,
        max_depth=5,
        learning_rate=0.08,
        random_state=42,
        eval_metric="mlogloss"
    )
    clf.fit(X_train_proc, y_time_train)
    y_time_pred = clf.predict(X_test_proc)
    
    print("\n--- Placement Timeline Classification Report ---")
    print(classification_report(y_time_test, y_time_pred, digits=4))
    joblib.dump(clf, "models/placement_classifier.joblib")
    print(" Saved: models/placement_classifier.joblib")
    
    # 6. Train & evaluate Salary Regressor
    reg = XGBRegressor(
        n_estimators=150,
        max_depth=5,
        learning_rate=0.07,
        random_state=42
    )
    reg.fit(X_train_proc, y_sal_train)
    y_sal_pred = reg.predict(X_test_proc)
    
    rmse = np.sqrt(mean_squared_error(y_sal_test, y_sal_pred))
    r2 = r2_score(y_sal_test, y_sal_pred)
    
    print("\n--- Salary Regression Metrics ---")
    print(f"R² Score : {r2:.4f}")
    print(f"RMSE (₹) : ₹{rmse:,.2f}")
    joblib.dump(reg, "models/salary_regressor.joblib")
    print(" Saved: models/salary_regressor.joblib")

if __name__ == "__main__":
    run_training()