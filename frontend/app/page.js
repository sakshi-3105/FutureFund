// frontend/app/page.js
"use client";

import { useState } from "react";
import { 
  ShieldAlert, 
  User, 
  Building2, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Briefcase, 
  DollarSign, 
  Lightbulb, 
  ArrowRight,
  Filter,
  BarChart3
} from "lucide-react";

export default function App() {
  const [activeTab, setActiveTab] = useState("student"); // "student" or "lender"

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Top Navigation Bar */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ShieldAlert className="h-7 w-7 text-indigo-500" />
            <span className="font-bold text-lg text-white">EduSuccess AI</span>
          </div>

          {/* Role Switcher */}
          <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setActiveTab("student")}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                activeTab === "student"
                  ? "bg-indigo-600 text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <User className="h-4 w-4" /> Student Portal
            </button>
            <button
              onClick={() => setActiveTab("lender")}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-sm font-medium transition-all ${
                activeTab === "lender"
                  ? "bg-indigo-600 text-white shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              <Building2 className="h-4 w-4" /> Lender Dashboard
            </button>
          </div>
        </div>
      </header>

      {/* Main View Area */}
      <main className="max-w-7xl mx-auto p-6 md:p-10">
        {activeTab === "student" ? <StudentView /> : <LenderView />}
      </main>
    </div>
  );
}

// ==========================================
// 1. STUDENT VIEW
// ==========================================
function StudentView() {
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/v1/predict-risk", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Student Career Readiness & Salary Advisor</h1>
        <p className="text-slate-400 text-sm mt-1">
          Estimate your career readiness, projected global compensation, and get prioritized upskilling actions.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Form Card */}
        <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-4">
          <h2 className="text-base font-semibold text-slate-200">Your Academic & Work Profile</h2>
          <form onSubmit={handleSubmit} className="space-y-4 text-sm">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Target Degree</label>
                <select name="degree_level" value={formData.degree_level} onChange={handleChange} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white">
                  <option value="UG">Undergraduate (UG)</option>
                  <option value="PG">Postgraduate (PG)</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Stream</label>
                <select name="course_stream" value={formData.course_stream} onChange={handleChange} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white">
                  <option value="STEM">STEM</option>
                  <option value="MBA">MBA</option>
                  <option value="Finance">Finance</option>
                  <option value="Nursing">Nursing</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">UG CGPA (/10)</label>
                <input type="number" step="0.1" name="ug_cgpa" value={formData.ug_cgpa} onChange={handleChange} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white" />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Current CGPA (/10)</label>
                <input type="number" step="0.1" name="current_cgpa" value={formData.current_cgpa} onChange={handleChange} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <label className="block text-slate-400 mb-1">Internships</label>
                <input type="number" name="internships_count" value={formData.internships_count} onChange={handleChange} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white" />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Work Exp (mo)</label>
                <input type="number" name="prior_work_exp_months" value={formData.prior_work_exp_months} onChange={handleChange} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white" />
              </div>
              <div>
                <label className="block text-slate-400 mb-1">Certifications</label>
                <input type="number" name="certifications_count" value={formData.certifications_count} onChange={handleChange} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-400 mb-1">Country</label>
                <select name="destination_country" value={formData.destination_country} onChange={handleChange} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white">
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
                <select name="institution_tier" value={formData.institution_tier} onChange={handleChange} className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white">
                  <option value="Tier-1">Tier-1</option>
                  <option value="Tier-2">Tier-2</option>
                  <option value="Tier-3">Tier-3</option>
                </select>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full mt-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2">
              {loading ? "Analyzing Profile..." : "Assess My Career Outlook"}
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>

        {/* Student Results Card */}
        <div className="lg:col-span-7 space-y-6">
          {!result ? (
            <div className="h-full border border-dashed border-slate-800 rounded-xl flex flex-col items-center justify-center p-12 text-slate-500">
              <Lightbulb className="h-10 w-10 stroke-1 mb-2 text-slate-600" />
              <p>Submit your profile to view your placement forecast & personalized action plan.</p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Highlights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-xs uppercase text-indigo-400 font-semibold flex items-center gap-2">
                    <Briefcase className="h-4 w-4" /> Expected Placement Time
                  </div>
                  <div className="text-xl font-bold text-white mt-1">{result.predicted_timeline}</div>
                </div>

                <div className="p-5 rounded-xl bg-slate-900 border border-slate-800">
                  <div className="text-xs uppercase text-emerald-400 font-semibold flex items-center gap-2">
                    <DollarSign className="h-4 w-4" /> Estimated Starting CTC
                  </div>
                  <div className="text-xl font-bold text-white mt-1">
                    {result.salary_currency} {result.estimated_local_salary.toLocaleString()} /yr
                  </div>
                  <span className="text-xs text-slate-400 mt-0.5 block">≈ ₹{(result.estimated_annual_salary_inr / 100000).toFixed(2)} LPA</span>
                </div>
              </div>

              {/* Action Plan */}
              <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl space-y-3">
                <h3 className="text-base font-semibold text-slate-200 flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-amber-400" />
                  Your Personalized Preparation Roadmap
                </h3>
                <div className="space-y-2.5">
                  {result.recommended_interventions.map((action, idx) => (
                    <div key={idx} className="p-3 bg-slate-950 border border-slate-800/80 rounded-lg text-sm text-slate-300 flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-emerald-500 flex-shrink-0 mt-0.5" />
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
  );
}

// ==========================================
// 2. LENDER DASHBOARD
// ==========================================
function LenderView() {
  // Sample portfolio mock data
  const [portfolio] = useState([
    { id: "APP-1021", student: "Rohan M.", country: "USA", stream: "STEM", loan: "₹35,00,000", emi: "₹42,000", timeline: "0-3 mo", risk: "Low", dti: "24.5%", flag: "None" },
    { id: "APP-1022", student: "Aanya P.", country: "UK", stream: "MBA", loan: "₹45,00,000", emi: "₹54,000", timeline: "3-6 mo", risk: "Medium", dti: "34.1%", flag: "Moderate Delay" },
    { id: "APP-1023", student: "Vikram S.", country: "Canada", stream: "Finance", loan: "₹30,00,000", emi: "₹36,000", timeline: ">12 mo", risk: "High", dti: "52.8%", flag: "Elevated DTI / Labor Softening" },
    { id: "APP-1024", student: "Sneha K.", country: "Germany", stream: "STEM", loan: "₹25,00,000", emi: "₹30,000", timeline: "0-3 mo", risk: "Low", dti: "21.0%", flag: "None" },
    { id: "APP-1025", student: "Arjun D.", country: "Australia", stream: "Nursing", loan: "₹40,00,000", emi: "₹48,000", timeline: "6-12 mo", risk: "High", dti: "48.2%", flag: "Weak Internship Exposure" },
  ]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Underwriter Portfolio & Placement Risk Monitor</h1>
        <p className="text-slate-400 text-sm mt-1">
          Monitor placement timeline risks, debt-service coverage, and early borrower support interventions.
        </p>
      </div>

      {/* Portfolio Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-5 bg-slate-900 border border-slate-800 rounded-xl">
          <span className="text-xs uppercase text-slate-400 font-semibold">Active Loan Pipeline</span>
          <div className="text-2xl font-bold text-white mt-1">5 Applicants</div>
          <span className="text-xs text-slate-500 mt-1 block">Total Sanctioned: ₹1.75 Cr</span>
        </div>
        <div className="p-5 bg-emerald-950/30 border border-emerald-800/80 rounded-xl">
          <span className="text-xs uppercase text-emerald-400 font-semibold">Low Risk Ratio</span>
          <div className="text-2xl font-bold text-emerald-300 mt-1">40.0%</div>
          <span className="text-xs text-emerald-500 mt-1 block">Expected on-time placement</span>
        </div>
        <div className="p-5 bg-amber-950/30 border border-amber-800/80 rounded-xl">
          <span className="text-xs uppercase text-amber-400 font-semibold">Watchlist (Medium)</span>
          <div className="text-2xl font-bold text-amber-300 mt-1">20.0%</div>
          <span className="text-xs text-amber-500 mt-1 block">Potential 3-6m delay</span>
        </div>
        <div className="p-5 bg-rose-950/30 border border-rose-800/80 rounded-xl">
          <span className="text-xs uppercase text-rose-400 font-semibold">High Risk / Alert</span>
          <div className="text-2xl font-bold text-rose-300 mt-1">40.0%</div>
          <span className="text-xs text-rose-500 mt-1 block">Intervention mandatory</span>
        </div>
      </div>

      {/* Underwriting Portfolio Table */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <h2 className="font-semibold text-slate-200 flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-indigo-400" />
            Loan Applicant Risk Matrix
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-950 text-slate-400 uppercase text-xs border-b border-slate-800">
              <tr>
                <th className="p-4">App ID</th>
                <th className="p-4">Applicant</th>
                <th className="p-4">Destination</th>
                <th className="p-4">Stream</th>
                <th className="p-4">Loan / EMI</th>
                <th className="p-4">Est. Placement</th>
                <th className="p-4">DTI</th>
                <th className="p-4">Risk Tier</th>
                <th className="p-4">Primary Flag / Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800 text-slate-300">
              {portfolio.map((row) => (
                <tr key={row.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="p-4 font-mono text-xs text-slate-400">{row.id}</td>
                  <td className="p-4 font-medium text-white">{row.student}</td>
                  <td className="p-4">{row.country}</td>
                  <td className="p-4">{row.stream}</td>
                  <td className="p-4">
                    <div>{row.loan}</div>
                    <div className="text-xs text-slate-500">{row.emi}/mo</div>
                  </td>
                  <td className="p-4">{row.timeline}</td>
                  <td className="p-4 font-mono">{row.dti}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                      row.risk === "Low" 
                        ? "bg-emerald-950 text-emerald-400 border border-emerald-800" 
                        : row.risk === "Medium"
                        ? "bg-amber-950 text-amber-400 border border-amber-800"
                        : "bg-rose-950 text-rose-400 border border-rose-800"
                    }`}>
                      {row.risk}
                    </span>
                  </td>
                  <td className="p-4 text-xs text-slate-400">{row.flag}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}