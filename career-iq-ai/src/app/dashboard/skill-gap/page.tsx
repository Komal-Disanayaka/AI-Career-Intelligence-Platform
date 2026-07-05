"use client";

import { useState } from "react";
import toast from "react-hot-toast";
import { HiOutlineAcademicCap, HiOutlineCheckCircle, HiOutlineExclamationCircle } from "react-icons/hi";

interface SkillGapResult {
  matchPercentage: number;
  matchedSkills: string[];
  missingSkills: string[];
  roadmap: { week: number; task: string; skill: string }[];
}

export default function SkillGapPage() {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SkillGapResult | null>(null);
  const [form, setForm] = useState({ desiredJob: "", currentSkills: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.desiredJob || !form.currentSkills) {
      toast.error("Please fill all fields");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/predict/skill-gap", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setResults(data.result);
        toast.success("Analysis complete!");
      } else {
        toast.error(data.error || "Analysis failed");
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
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(167, 139, 250, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <HiOutlineAcademicCap size={22} color="var(--secondary)" />
          </div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 700 }}>Skill Gap Analysis</h1>
        </div>
        <p style={{ color: "var(--text-muted)" }}>Identify missing skills for your dream job and get a learning roadmap</p>
      </div>

      {/* Form */}
      <div className="glass-card animate-fade-in-up delay-100" style={{ padding: 28, marginBottom: 24 }}>
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <label className="input-label">Desired Job / Category *</label>
            <select className="input-field" value={form.desiredJob} onChange={(e) => setForm({ ...form, desiredJob: e.target.value })} required>
              <option value="">Select a job category</option>
              <option value="INFORMATION-TECHNOLOGY">Information Technology</option>
              <option value="FINANCE">Finance</option>
              <option value="BUSINESS-DEVELOPMENT">Business Development</option>
              <option value="SALES">Sales</option>
              <option value="HR">Human Resources</option>
            </select>
          </div>
          <div>
            <label className="input-label">Your Current Skills * (comma separated)</label>
            <input className="input-field" placeholder="Python, JavaScript, SQL, Communication" value={form.currentSkills} onChange={(e) => setForm({ ...form, currentSkills: e.target.value })} required />
          </div>
          <button type="submit" className="btn-primary" disabled={loading} style={{ width: "100%", justifyContent: "center", padding: "14px", opacity: loading ? 0.7 : 1 }}>
            {loading ? "Analyzing..." : "Analyze Skill Gap"}
          </button>
        </form>
      </div>

      {/* Results */}
      {results && (
        <div className="animate-fade-in-up">
          {/* Match Percentage */}
          <div className="glass-card" style={{ padding: 28, textAlign: "center", marginBottom: 24 }}>
            <div style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: 8 }}>Current Skill Match</div>
            <div style={{ fontSize: "3rem", fontWeight: 800, color: results.matchPercentage >= 70 ? "var(--primary)" : results.matchPercentage >= 40 ? "var(--accent)" : "var(--error)" }}>
              {results.matchPercentage}%
            </div>
            <div className="progress-bar" style={{ maxWidth: 300, margin: "16px auto 0" }}>
              <div className="progress-fill" style={{ width: `${results.matchPercentage}%` }} />
            </div>
          </div>

          {/* Skills Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 16, marginBottom: 24 }}>
            {/* Matched Skills */}
            <div className="glass-card" style={{ padding: 24 }}>
              <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                <HiOutlineCheckCircle size={20} color="var(--success)" /> Matched Skills
              </h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {results.matchedSkills.map((skill) => (
                  <span key={skill} className="badge badge-primary">{skill}</span>
                ))}
              </div>
            </div>

            {/* Missing Skills */}
            <div className="glass-card" style={{ padding: 24 }}>
              <h3 style={{ fontSize: "1rem", fontWeight: 600, marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                <HiOutlineExclamationCircle size={20} color="var(--error)" /> Missing Skills
              </h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {results.missingSkills.map((skill) => (
                  <span key={skill} className="badge badge-warning">{skill}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Learning Roadmap */}
          <div className="glass-card" style={{ padding: 28 }}>
            <h3 style={{ fontSize: "1.1rem", fontWeight: 600, marginBottom: 24 }}>Learning Roadmap</h3>
            <div className="roadmap-line" style={{ paddingLeft: 40 }}>
              {results.roadmap.map((step, idx) => (
                <div key={idx} style={{ position: "relative", paddingBottom: idx < results.roadmap.length - 1 ? 32 : 0, paddingLeft: 8 }}>
                  {/* Dot */}
                  <div style={{
                    position: "absolute",
                    left: -33,
                    top: 4,
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    background: idx === results.roadmap.length - 1 ? "var(--primary)" : "var(--secondary)",
                    border: "2px solid var(--surface)",
                  }} />
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginBottom: 4, fontWeight: 600 }}>
                    Week {step.week}
                  </div>
                  <div style={{ fontSize: "0.95rem", fontWeight: 500 }}>{step.task}</div>
                  <span className="badge badge-purple" style={{ marginTop: 6, fontSize: "0.7rem" }}>{step.skill}</span>
                </div>
              ))}
              {/* Final Ready */}
              <div style={{ position: "relative", paddingLeft: 8, marginTop: 32 }}>
                <div style={{
                  position: "absolute", left: -37, top: 0, width: 20, height: 20, borderRadius: "50%",
                  background: "var(--primary)", display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.7rem", fontWeight: 800, color: "#000",
                }}>
                  ✓
                </div>
                <div style={{ fontSize: "1rem", fontWeight: 700, color: "var(--primary)" }}>Ready! 🎉</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
