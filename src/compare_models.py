# src/compare_models.py
import time
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.metrics import (
    accuracy_score,
    f1_score,
    log_loss,
    mean_squared_error,
    r2_score,
    mean_absolute_error
)
from xgboost import XGBClassifier, XGBRegressor
from lightgbm import LGBMClassifier, LGBMRegressor

from feature_engineering import build_preprocessor

def evaluate_models():
    # 1. Load data & separate features/targets
    df = pd.read_csv("data/raw/synthetic_borrowers.csv")
    drop_cols = [
        "student_id",
        "placement_timeline",
        "starting_salary_inr_annual",
        "repayment_risk_level",
        "primary_risk_driver"
    ]
    X = df.drop(columns=drop_cols)
    y_time = df["placement_timeline"]
    y_sal = df["starting_salary_inr_annual"]

    # 2. Train-Test Split (80/20)
    X_train, X_test, y_t_train, y_t_test, y_s_train, y_s_test = train_test_split(
        X, y_time, y_sal, test_size=0.2, random_state=42, stratify=y_time
    )

    # 3. Fit Preprocessor
    preprocessor = build_preprocessor()
    X_train_proc = preprocessor.fit_transform(X_train)
    X_test_proc = preprocessor.transform(X_test)

    # ==========================================
    # 1. CLASSIFICATION COMPARISON (Timeline)
    # ==========================================
    classifiers = {
        "XGBoost": XGBClassifier(
            n_estimators=120, max_depth=5, learning_rate=0.08, random_state=42, eval_metric="mlogloss"
        ),
        "LightGBM": LGBMClassifier(
            n_estimators=120, max_depth=5, learning_rate=0.08, random_state=42, verbose=-1
        )
    }

    clf_results = []
    for name, clf in classifiers.items():
        start_time = time.time()
        clf.fit(X_train_proc, y_t_train)
        train_time = time.time() - start_time

        preds = clf.predict(X_test_proc)
        probs = clf.predict_proba(X_test_proc)

        clf_results.append({
            "Model": name,
            "Accuracy": accuracy_score(y_t_test, preds),
            "Macro F1": f1_score(y_t_test, preds, average="macro"),
            "Log-Loss": log_loss(y_t_test, probs),
            "Train Time (s)": round(train_time, 4)
        })

    # ==========================================
    # 2. REGRESSION COMPARISON (Salary)
    # ==========================================
    regressors = {
        "XGBoost": XGBRegressor(
            n_estimators=150, max_depth=5, learning_rate=0.07, random_state=42
        ),
        "LightGBM": LGBMRegressor(
            n_estimators=150, max_depth=5, learning_rate=0.07, random_state=42, verbose=-1
        )
    }

    reg_results = []
    for name, reg in regressors.items():
        start_time = time.time()
        reg.fit(X_train_proc, y_s_train)
        train_time = time.time() - start_time

        preds = reg.predict(X_test_proc)

        rmse = np.sqrt(mean_squared_error(y_s_test, preds))
        r2 = r2_score(y_s_test, preds)
        mae = mean_absolute_error(y_s_test, preds)

        reg_results.append({
            "Model": name,
            "R² Score": r2,
            "RMSE (₹)": f"₹{rmse:,.2f}",
            "MAE (₹)": f"₹{mae:,.2f}",
            "Train Time (s)": round(train_time, 4)
        })

    # Display Results
    print("\n" + "="*50)
    print("      PLACEMENT TIMELINE CLASSIFICATION")
    print("="*50)
    print(pd.DataFrame(clf_results).to_markdown(index=False))

    print("\n" + "="*50)
    print("          SALARY CTC REGRESSION")
    print("="*50)
    print(pd.DataFrame(reg_results).to_markdown(index=False))

if __name__ == "__main__":
    evaluate_models()