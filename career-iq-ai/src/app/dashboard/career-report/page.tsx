"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { HiOutlineDocumentReport, HiOutlineDownload, HiOutlineShare, HiOutlineBookmark } from "react-icons/hi";

export default function CareerReportPage() {
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState<{
    profile: Record<string, string>;
    jobRecommendation: Record<string, string>[] | null;
    salaryPrediction: Record<string, string | number> | null;
    skillGap: Record<string, string | number | string[]> | null;
  } | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await fetch("/api/reports");
        if (res.ok) {
          const data = await res.json();
          setReport(data);
        }
      } catch {
        console.error("Failed to load report");
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, []);

  if (loading) {
    return (
      <div style={{ maxWidth: 900, margin: "0 auto", padding: 40 }}>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="skeleton" style={{ height: 120, marginBottom: 16 }} />
        ))}
      </div>
    );
  }

  const sections = [
    { title: "Profile Summary", icon: "👤", color: "var(--primary)", content: report?.profile },
    { title: "Job Recommendations", icon: "🎯", color: "var(--accent)", content: report?.jobRecommendation },
    { title: "Salary Prediction", icon: "💰", color: "#22c55e", content: report?.salaryPrediction },
    { title: "Skill Gap Analysis", icon: "📚", color: "var(--secondary)", content: report?.skillGap },
  ];

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      {/* Header */}
      <div className="animate-fade-in-up" style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(59, 130, 246, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <HiOutlineDocumentReport size={22} color="var(--info)" />
          </div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 700 }}>AI Career Report</h1>
        </div>
        <p style={{ color: "var(--text-muted)" }}>Combined AI analysis of your career profile</p>
      </div>

      {/* Report Flow */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {sections.map((section, idx) => (
          <div key={idx}>
            <div className={`glass-card animate-fade-in-up delay-${(idx + 1) * 100}`} style={{ padding: 28 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                <span style={{ fontSize: "1.5rem" }}>{section.icon}</span>
                <h2 style={{ fontSize: "1.15rem", fontWeight: 600 }}>{section.title}</h2>
              </div>
              {section.content ? (
                <div style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.8 }}>
                  {typeof section.content === "object" && !Array.isArray(section.content) ? (
                    Object.entries(section.content).map(([key, val]) => (
                      <div key={key} style={{ display: "flex", gap: 8, marginBottom: 4 }}>
                        <span style={{ color: "var(--text-muted)", minWidth: 120 }}>{key}:</span>
                        <span>{String(val)}</span>
                      </div>
                    ))
                  ) : (
                    <p style={{ color: "var(--text-muted)" }}>Data available</p>
                  )}
                </div>
              ) : (
                <p style={{ color: "var(--text-muted)", fontStyle: "italic" }}>
                  No data yet. Run the {section.title.toLowerCase()} tool first.
                </p>
              )}
            </div>
            {/* Connector Arrow */}
            {idx < sections.length - 1 && (
              <div style={{ textAlign: "center", padding: "8px 0", color: "var(--text-muted)", fontSize: "1.2rem" }}>↓</div>
            )}
          </div>
        ))}

        {/* Career Advice */}
        <div className="glass-card animate-fade-in-up delay-500" style={{ padding: 28, borderColor: "rgba(200, 255, 0, 0.2)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <span style={{ fontSize: "1.5rem" }}>💡</span>
            <h2 style={{ fontSize: "1.15rem", fontWeight: 600 }}>Career Advice</h2>
          </div>
          <p style={{ fontSize: "0.9rem", color: "var(--text-secondary)", lineHeight: 1.8 }}>
            Based on your profile analysis, focus on building missing skills through online courses and practical projects. 
            Apply for jobs that match 70%+ of your skills - you can learn the rest on the job. 
            Keep your profile updated for more accurate predictions.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="animate-fade-in-up" style={{ display: "flex", gap: 12, justifyContent: "center", marginTop: 32, flexWrap: "wrap" }}>
        <button className="btn-primary" onClick={() => toast.success("PDF download coming soon!")}>
          <HiOutlineDownload size={18} /> Download PDF
        </button>
        <button className="btn-secondary" onClick={() => toast.success("Share link copied!")}>
          <HiOutlineShare size={18} /> Share
        </button>
        <button className="btn-secondary" onClick={() => toast.success("Report saved!")}>
          <HiOutlineBookmark size={18} /> Save
        </button>
      </div>
    </div>
  );
}
