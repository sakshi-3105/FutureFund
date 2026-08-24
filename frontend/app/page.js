"use client";

import { useState } from "react";
import { 
  AlertTriangle, 
  CheckCircle2, 
  TrendingUp, 
  Briefcase, 
  DollarSign, 
  ShieldAlert, 
  Lightbulb, 
  ArrowRight 
} from "lucide-react";

export default function PlacementDashboard() {
  const [formData, setFormData] = useState({
    degree_level: "PG",
    ug_cgpa: 7.8,
    current_cgpa: 8.2,
    cgpa_consistency: 0.25,
    course_stream: "STEM",
    internships_count: 2,
    internship_duration_months: 6,
    internship_rating: 4.2,
    prior_work_exp_months: 12,
    certifications_count: 2,
    institution_tier: "Tier-1",
    historical_placement_rate: 0.88,
    recruiter_density_score: 8.5,
    destination_country: "USA",
    target_sector: "IT",
    sector_hiring_growth_index: 1.15,
    country_labor_market_index: 85.0,
    salary_currency: "USD",
    fx_rate_to_inr: 84.0,
    loan_amount_inr: 3500000.0,
    expected_emi_inr: 42000.0
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const countryCurrencyMap = {
    USA: { currency: "USD", fx: 84.0 },
    UK: { currency: "GBP", fx: 108.0 },
    Canada: { currency: "CAD", fx: 62.0 },
    Germany: { currency: "EUR", fx: 91.0 },
    Australia: { currency: "AUD", fx: 55.0 },
    India: { currency: "INR", fx: 1.0 }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "destination_country") {
      const mapping = countryCurrencyMap[value] || { currency: "USD", fx: 84.0 };
      setFormData(prev => ({
        ...prev,
        destination_country: value,
        salary_currency: mapping.currency,
        fx_rate_to_inr: mapping.fx
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: ["degree_level", "course_stream", "institution_tier", "target_sector", "destination_country"].includes(name)
          ? value
          : parseFloat(value) || 0
      }));
    }
  };

  const handlePredict = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/v1/predict-risk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });

      if (!res.ok) throw new Error("Failed to connect to FastAPI backend.");
      const data = await res.json();
      setResult(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-12 font-sans">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="border-b border-slate-800 pb-6">
          <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <ShieldAlert className="h-8 w-8 text-indigo-500" />
            Study Abroad Career Risk & Salary Evaluation
          </h1>
          <p className="text-slate-400 mt-2 text-sm">
            AI-driven credit intelligence predicting time-to-placement, debt-service feasibility, and feature drivers.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Form */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-6">
            <h2 className="text-lg font-semibold text-slate-200 border-b border-slate-800 pb-3">
              Applicant Profile & Loan Specs
            </h2>
            
            <form onSubmit={handlePredict} className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">Degree Level</label>
                  <select 
                    name="degree_level" 
                    value={formData.degree_level} 
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                  >
                    <option value="UG">Undergraduate (UG)</option>
                    <option value="PG">Postgraduate (PG)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-400 mb-1">Course Stream</label>
                  <select 
                    name="course_stream" 
                    value={formData.course_stream} 
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                  >
                    <option value="STEM">STEM</option>
                    <option value="MBA">MBA</option>
                    <option value="Finance">Finance</option>
                    <option value="Nursing">Nursing</option>
                    <option value="Arts">Arts</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">UG CGPA (out of 10)</label>
                  <input 
                    type="number" step="0.1" name="ug_cgpa" 
                    value={formData.ug_cgpa} onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Current/PG CGPA</label>
                  <input 
                    type="number" step="0.1" name="current_cgpa" 
                    value={formData.current_cgpa} onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Internships</label>
                  <input 
                    type="number" name="internships_count" 
                    value={formData.internships_count} onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Rating (1-5)</label>
                  <input 
                    type="number" step="0.1" name="internship_rating" 
                    value={formData.internship_rating} onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Certs Count</label>
                  <input 
                    type="number" name="certifications_count" 
                    value={formData.certifications_count} onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">Destination Country</label>
                  <select 
                    name="destination_country" 
                    value={formData.destination_country} 
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                  >
                    <option value="USA">USA</option>
                    <option value="UK">UK</option>
                    <option value="Canada">Canada</option>
                    <option value="Germany">Germany</option>
                    <option value="Australia">Australia</option>
                    <option value="India">India</option>
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">University Tier</label>
                  <select 
                    name="institution_tier" 
                    value={formData.institution_tier} 
                    onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                  >
                    <option value="Tier-1">Tier-1</option>
                    <option value="Tier-2">Tier-2</option>
                    <option value="Tier-3">Tier-3</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-400 mb-1">Loan Amount (₹ INR)</label>
                  <input 
                    type="number" step="50000" name="loan_amount_inr" 
                    value={formData.loan_amount_inr} onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Expected EMI (₹ INR)</label>
                  <input 
                    type="number" step="1000" name="expected_emi_inr" 
                    value={formData.expected_emi_inr} onChange={handleChange}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2.5 text-white"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {loading ? "Running Risk Engine..." : "Evaluate Placement Risk"}
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>

          {/* Results Display */}
          <div className="lg:col-span-7 space-y-6">
            {error && (
              <div className="p-4 bg-rose-950/50 border border-rose-800 rounded-xl text-rose-300 flex items-center gap-3">
                <AlertTriangle className="h-5 w-5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {!result && !loading && !error && (
              <div className="h-full border border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center p-12 text-slate-500">
                <ShieldAlert className="h-12 w-12 stroke-1 mb-3 text-slate-600" />
                <p>Submit applicant details on the left to generate model risk inference.</p>
              </div>
            )}

            {result && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  
                  {/* Risk Tier */}
                  <div className={`p-5 rounded-xl border ${
                    result.overall_repayment_risk === "Low"
                      ? "bg-emerald-950/40 border-emerald-800 text-emerald-300"
                      : result.overall_repayment_risk === "Medium"
                      ? "bg-amber-950/40 border-amber-800 text-amber-300"
                      : "bg-rose-950/40 border-rose-800 text-rose-300"
                  }`}>
                    <span className="text-xs uppercase font-bold tracking-wider opacity-80">Portfolio Risk Tier</span>
                    <div className="text-2xl font-bold mt-1">{result.overall_repayment_risk} Risk</div>
                    <span className="text-xs opacity-70 mt-1 block">DTI: {(result.debt_to_income_ratio * 100).toFixed(1)}%</span>
                  </div>

                  {/* Placement Timeline */}
                  <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase">
                      <Briefcase className="h-4 w-4" /> Placement Window
                    </div>
                    <div className="text-lg font-bold text-white mt-1">{result.predicted_timeline}</div>
                    <span className="text-xs text-slate-400 mt-1 block">
                      Confidence: {(result.timeline_confidence_score * 100).toFixed(1)}%
                    </span>
                  </div>

                  {/* Salary Projection */}
                  <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold uppercase">
                      <DollarSign className="h-4 w-4" /> Est. Starting CTC
                    </div>
                    <div className="text-lg font-bold text-white mt-1">
                      ₹{(result.estimated_annual_salary_inr / 100000).toFixed(2)} LPA
                    </div>
                    <span className="text-xs text-slate-400 mt-1 block">
                      {result.salary_currency} {result.estimated_local_salary.toLocaleString()} /yr
                    </span>
                  </div>
                </div>

                {/* SHAP Feature Drivers */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
                  <h3 className="text-md font-semibold text-slate-200 flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-indigo-400" />
                    SHAP Explainability: Key Feature Drivers
                  </h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                      <span className="text-rose-400 font-medium flex items-center gap-1.5 mb-2">
                        <AlertTriangle className="h-4 w-4" /> Top Delay Drivers
                      </span>
                      <ul className="space-y-1.5 text-slate-300">
                        {result.key_risk_drivers.map((driver, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-rose-500 font-bold">•</span>
                            <span className="capitalize">{driver.replace(/_/g, " ")}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-lg border border-slate-800">
                      <span className="text-emerald-400 font-medium flex items-center gap-1.5 mb-2">
                        <CheckCircle2 className="h-4 w-4" /> Positive Catalysts
                      </span>
                      <ul className="space-y-1.5 text-slate-300">
                        {result.positive_profile_factors.map((factor, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-emerald-500 font-bold">•</span>
                            <span className="capitalize">{factor.replace(/_/g, " ")}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Recommended Interventions */}
                <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-3">
                  <h3 className="text-md font-semibold text-slate-200 flex items-center gap-2">
                    <Lightbulb className="h-5 w-5 text-amber-400" />
                    Recommended Next-Best Interventions
                  </h3>
                  <div className="space-y-2">
                    {result.recommended_interventions.map((action, idx) => (
                      <div key={idx} className="p-3 bg-slate-950 border border-slate-800/80 rounded-lg text-sm text-slate-300 flex items-start gap-3">
                        <span className="bg-indigo-900/60 text-indigo-300 text-xs px-2 py-0.5 rounded font-mono mt-0.5">
                          #{idx + 1}
                        </span>
                        <span>{action}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}