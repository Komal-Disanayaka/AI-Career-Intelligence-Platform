"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { HiOutlineBriefcase, HiOutlineStar, HiOutlineBookmark } from "react-icons/hi";

interface JobResult {
  title: string;
  matchScore: number;
  avgSalary: string;
  requiredSkills: string[];
  companies: string[];
}

export default function JobRecommendationPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<JobResult[] | null>(null);
  const [form, setForm] = useState({
    skills: "",
    education: "",
    experience: "",
    location: "",
    industry: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.skills) {
      toast.error("Please enter your skills");
      return;
    }
    setLoading(true);

    try {
      const res = await fetch("/api/predict/job-recommendation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setResults(data.results);
        toast.success("Recommendations generated!");
      } else {
        toast.error(data.error || "Failed to generate recommendations");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!results) return;
    try {
      await fetch("/api/history", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "job-recommendation", data: { input: form, results } }),
      });
      toast.success("Report saved!");
    } catch {
      toast.error("Failed to save");
    }
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      {/* Header */}
      <div className="animate-fade-in-up" style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(200, 255, 0, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <HiOutlineBriefcase size={22} color="var(--primary)" />
          </div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 700 }}>Job Recommendation</h1>
        </div>
        <p style={{ color: "var(--text-muted)" }}>Enter your details to find the best matching jobs</p>
      </div>

      {/* Form */}
      <div className="glass-card animate-fade-in-up delay-100" style={{ padding: 28, marginBottom: 24 }}>
        <form onSubmit={handleSubmit} style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 20 }}>
          <div style={{ gridColumn: "1 / -1" }}>
            <label className="input-label">Skills * (comma separated)</label>
            <input className="input-field" placeholder="Python, JavaScript, Machine Learning, React" value={form.skills} onChange={(e) => setForm({ ...form, skills: e.target.value })} required />
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
            <label className="input-label">Years of Experience</label>
            <input className="input-field" type="number" placeholder="0" value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} />
          </div>
          <div>
            <label className="input-label">Preferred Location</label>
            <input className="input-field" placeholder="e.g. Colombo" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} />
          </div>
          <div>
            <label className="input-label">Preferred Industry</label>
            <select className="input-field" value={form.industry} onChange={(e) => setForm({ ...form, industry: e.target.value })}>
              <option value="">Select</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Finance">Finance</option>
              <option value="Business Development">Business Development</option>
              <option value="Sales">Sales</option>
              <option value="Human Resources">Human Resources</option>
            </select>
          </div>
          <div style={{ gridColumn: "1 / -1" }}>
            <button type="submit" className="btn-primary" disabled={loading} style={{ width: "100%", justifyContent: "center", padding: "14px", opacity: loading ? 0.7 : 1 }}>
              {loading ? "Generating..." : "Generate Recommendations"}
            </button>
          </div>
        </form>
      </div>

      {/* Results */}
      {results && (
        <div className="animate-fade-in-up">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ fontSize: "1.2rem", fontWeight: 600 }}>Top {results.length} Job Matches</h2>
            <button onClick={handleSave} className="btn-secondary" style={{ padding: "8px 16px", fontSize: "0.85rem" }}>
              <HiOutlineBookmark size={16} /> Save Report
            </button>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {results.map((job, idx) => (
              <div key={idx} className="glass-card glass-card-hover" style={{ padding: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: 12 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                      <h3 style={{ fontSize: "1.1rem", fontWeight: 600 }}>{job.title}</h3>
                      <span className="badge badge-primary">{job.matchScore}% match</span>
                    </div>
                    <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: 12 }}>Average Salary: <span style={{ color: "var(--accent)", fontWeight: 600 }}>{job.avgSalary}</span></p>
                    <div style={{ marginBottom: 12 }}>
                      <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", display: "block", marginBottom: 6 }}>Required Skills:</span>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                        {job.requiredSkills.map((skill) => (
                          <span key={skill} className="badge badge-purple" style={{ fontSize: "0.75rem" }}>{skill}</span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Companies: </span>
                      <span style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>{job.companies.join(", ")}</span>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <HiOutlineStar key={star} size={16} color={star <= Math.ceil(job.matchScore / 20) ? "var(--accent)" : "var(--border)"} />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
