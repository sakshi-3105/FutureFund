# FutureFund
# AI-Powered Placement Risk & Salary Estimation Engine for Study Abroad Education Loans

An end-to-end machine learning and credit intelligence platform designed to predict time-to-placement, estimate global post-graduation salaries, evaluate Debt-to-Income (DTI) repayment feasibility, and deliver explainable feature attribution using SHAP for education loan borrowers.

---

## 📌 Problem Overview
Traditional education loan underwriting relies heavily on static collateral or backward-looking credit histories, often overlooking a student's forward-looking earning potential. Furthermore, if a student encounters hiring friction post-graduation, standard 6–12 month moratorium grace periods can expire before their first paycheck arrives, leading to immediate repayment stress.

This platform bridges that gap by:
- **Forecasting Placement Windows:** Multi-class classification predicting job placement timelines ($\le 3$, $3\text{--}6$, $6\text{--}12$, or $>12$ months).
- **Global Salary Estimation:** Regression modeling starting salaries across destination currencies (USD, GBP, EUR, CAD, AUD, INR) and converting to standardized INR equivalents for debt servicing.
- **Explainable Credit Risk (SHAP):** TreeSHAP feature attributions pinpointing exact factors driving placement delay or acceleration.
- **Actionable Interventions:** Automated, personalized recommendations (mock coaching, domain certifications, virtual internships) triggered to mitigate risk before moratorium expiration.

---

## 🏗️ Architecture & Tech Stack

```text
.
├── data/
│   └── raw/                       # Synthetic & raw student profile data
├── models/                        # Serialized preprocessors and GBDT artifacts (.joblib)
├── src/
│   ├── generate_data.py           # Synthetic data generator across global markets
│   ├── feature_engineering.py     # Preprocessing pipelines (OneHot, Ordinal, StandardScaler)
│   ├── train.py                   # XGBoost / LightGBM model training & evaluation
│   ├── explainability.py          # SHAP TreeExplainer integration
│   ├── advisor.py                 # Rule-based intervention engine
│   └── models/risk_scorer.py      # Unified inference pipeline
├── api/
│   ├── app.py                     # FastAPI REST API with CORS middleware
│   └── schemas.py                 # Pydantic data validation schemas
├── frontend/                      # Dual-role Next.js (App Router) + Tailwind CSS dashboard
│   ├── app/page.js                # Interactive Student & Lender portals
│   └── package.json
├── requirements.txt               # Backend Python dependencies
└── README.md
```

### Core Technologies
- **Machine Learning & Analytics:** Python, XGBoost, LightGBM, Scikit-Learn, Pandas, NumPy, SHAP
- **Backend Service:** FastAPI, Uvicorn, Pydantic
- **Frontend Dashboard:** Next.js (JavaScript), Tailwind CSS, Lucide React Icons

---

## 📊 Dataset Schema

| Category | Features |
| :--- | :--- |
| **Academic History** | `ug_cgpa`, `current_cgpa`, `cgpa_consistency`, `degree_level` (UG/PG), `course_stream` (STEM, MBA, Finance, Nursing, Arts) |
| **Experience & Credentials** | `internships_count`, `internship_duration_months`, `internship_rating`, `prior_work_exp_months`, `certifications_count` |
| **Institution Profile** | `institution_tier` (Tier-1, Tier-2, Tier-3), `historical_placement_rate`, `recruiter_density_score` |
| **Macro & Country Demand** | `destination_country`, `target_sector`, `sector_hiring_growth_index`, `country_labor_market_index` |
| **Financial / Obligation** | `loan_amount_inr`, `expected_emi_inr`, `fx_rate_to_inr` |
| **Model Targets** | `placement_timeline` (0–3), `starting_salary_inr_annual`, `repayment_risk_level` (Low, Medium, High) |

---