# api/app.py
import sys
import os
from pydantic import BaseModel

# Add src to python path for internal imports
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "src")))

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models.risk_scorer import PlacementRiskEngine
from api.schemas import StudentProfileRequest, RiskAssessmentResponse

app = FastAPI(
    title="Education Loan Placement Risk & Salary Engine",
    description="AI-powered engine assessing borrower placement timelines, salary potential, and repayment risks.",
    version="1.0.0"
)

# Enable CORS for frontend dashboard integrations
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize engine on startup
try:
    engine = PlacementRiskEngine()
except Exception as e:
    print(f"Warning: Failed to load risk engine at startup: {e}")
    engine = None

@app.get("/health")
def health_check():
    return {"status": "healthy", "model_loaded": engine is not None}

@app.post("/api/v1/predict-risk", response_model=RiskAssessmentResponse)
def assess_student_risk(profile: StudentProfileRequest):
    if engine is None:
        raise HTTPException(status_code=500, detail="Inference engine not loaded.")
    
    try:
        result = engine.predict_student(profile.dict())
        return result
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Inference error: {str(e)}")
    

class BatchEvaluationRequest(BaseModel):
    students: list[StudentProfileRequest]

@app.post("/api/v1/predict-batch")
def assess_batch_risk(batch: BatchEvaluationRequest):
    if engine is None:
        raise HTTPException(status_code=500, detail="Inference engine not loaded.")
    
    results = []
    for idx, student in enumerate(batch.students):
        eval_result = engine.predict_student(student.dict())
        results.append({
            "applicant_id": f"APP-{1001 + idx}",
            "country": student.destination_country,
            "stream": student.course_stream,
            "loan_amount_inr": student.loan_amount_inr,
            "expected_emi_inr": student.expected_emi_inr,
            **eval_result
        })
    return results