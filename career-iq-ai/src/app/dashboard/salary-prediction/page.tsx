"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { HiOutlineCurrencyDollar, HiOutlineTrendingUp } from "react-icons/hi";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface SalaryResult {
  estimatedSalary: number;
  salaryRange: { min: number; max: number };
  currency: string;
  growthData: { year: string; salary: number }[];
}

export default function SalaryPredictionPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SalaryResult | null>(null);
  const [form, setForm] = useState({
    jobTitle: "",
    experience: "",
    education: "",
    location: "",
    skills: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.jobTitle) {
      toast.error("Please enter a job title");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/predict/salary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setResults(data.result);
        toast.success("Salary predicted!");
      } else {
        toast.error(data.error || "Prediction failed");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      {/* Header */}
      <div className="animate-fade-in-up" style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(251, 191, 36, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <HiOutlineCurrencyDollar size={22} color="var(--accent)" />
          </div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 700 }}>Salary Prediction</h1>
        </div>
        <p style={{ color: "var(--text-muted)" }}>Predict your expected salary based on your profile</p>
      </div>

      {/* Form */}
      <div className="glass-card animate-fade-in-up delay-100" style={{ padding: 28, marginBottom: 24 }}>
        <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 20 }}>
          <div>
            <label className="input-label">Job Title *</label>
            <input className="input-field" placeholder="e.g. Software Engineer" value={form.jobTitle} onChange={(e) => setForm({ ...form, jobTitle: e.target.value })} required />
          </div>
          <div>
            <label className="input-label">Years of Experience</label>
            <input className="input-field" type="number" placeholder="0" value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} />
          </div>
          <div>
            <label className="input-label">Education Level</label>
            <select className="input-field" value={form.education} onChange={(e) => setForm({ ...form, education: e.target.value })}>
              <option value="">Select</option>
              <option value="High School">High School</option>
              <option value="Bachelor's">Bachelor&apos;s</option>
              <option value="Master's">Master&apos;s</option>
              <option value="PhD">PhD</option>
            </select>
          </div>
          <div>
            <label className="input-label">Location</label>
            <input className="input-field" placeholder="e.g. Colombo" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <label className="input-label">Skills (comma separated)</label>
            <input className="input-field" placeholder="Python, JavaScript, SQL" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} />
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <button type="submit" className="btn-primary" disabled={loading} style={{ width: "100%", justifyContent: "center", padding: "14px", opacity: loading ? 0.7 : 1 }}>
              {loading ? "Predicting..." : "Predict Salary"}
            </button>
          </div>
        </form>
      </div>

      {/* Results */}
      {results && (
        <div className="animate-fade-in-up">
          {/* Salary Display */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 16, marginBottom: 24 }}>
            <div className="glass-card" style={{ padding: 28, textAlign: "center" }}>
              <HiOutlineCurrencyDollar size={32} color="var(--accent)" style={{ marginBottom: 12 }} />
              <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: 4 }}>Estimated Salary</div>
              <div style={{ fontSize: "2rem", fontWeight: 800, color: "var(--accent)" }}>
                {results.currency} {results.estimatedSalary.toLocaleString()}
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: 4 }}>per month</div>
            </div>
            <div className="glass-card" style={{ padding: 28, textAlign: "center" }}>
              <HiOutlineTrendingUp size={32} color="var(--primary)" style={{ marginBottom: 12 }} />
              <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: 4 }}>Salary Range</div>
              <div style={{ fontSize: "1.4rem", fontWeight: 700, color: "var(--primary)" }}>
                {results.currency} {results.salaryRange.min.toLocaleString()} - {results.salaryRange.max.toLocaleString()}
              </div>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginTop: 4 }}>market range</div>
            </div>
          </div>

          {/* Salary Growth Chart */}
          <div className="glass-card" style={{ padding: 28 }}>
            <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: 20 }}>Salary Growth Projection</h3>
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                <AreaChart data={results.growthData}>
                  <defs>
                    <linearGradient id="salaryGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="year" stroke="var(--text-muted)" fontSize={12} />
                  <YAxis stroke="var(--text-muted)" fontSize={12} />
                  <Tooltip
                    contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 8, color: "var(--foreground)" }}
                  />
                  <Area type="monotone" dataKey="salary" stroke="var(--primary)" fillOpacity={1} fill="url(#salaryGradient)" strokeWidth={2} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
