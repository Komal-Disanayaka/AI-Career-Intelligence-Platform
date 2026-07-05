"use client";

import { useState, useEffect } from "react";
import { HiOutlineClock, HiOutlineEye } from "react-icons/hi";

interface HistoryItem {
  id: string;
  type: string;
  date: string;
  summary: string;
}

export default function HistoryPage() {
  const [loading, setLoading] = useState(true);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("/api/history");
        if (res.ok) {
          const data = await res.json();
          setHistory(data.history || []);
        }
      } catch {
        console.error("Failed to load history");
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const typeLabels: Record<string, { label: string; color: string }> = {
    "job-recommendation": { label: "Job Recommendation", color: "var(--primary)" },
    "salary-prediction": { label: "Salary Prediction", color: "var(--accent)" },
    "skill-gap": { label: "Skill Gap Analysis", color: "var(--secondary)" },
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto" }}>
      {/* Header */}
      <div className="animate-fade-in-up" style={{ marginBottom: 32 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(59, 130, 246, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <HiOutlineClock size={22} color="var(--info)" />
          </div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 700 }}>History</h1>
        </div>
        <p style={{ color: "var(--text-muted)" }}>View your past predictions and analyses</p>
      </div>

      {/* Table */}
      <div className="glass-card animate-fade-in-up delay-100" style={{ overflow: "auto" }}>
        {loading ? (
          <div style={{ padding: 40 }}>
            {[1, 2, 3].map((i) => (
              <div key={i} className="skeleton" style={{ height: 48, marginBottom: 8 }} />
            ))}
          </div>
        ) : history.length === 0 ? (
          <div style={{ padding: 60, textAlign: "center" }}>
            <HiOutlineClock size={48} color="var(--text-muted)" style={{ marginBottom: 16 }} />
            <p style={{ color: "var(--text-muted)", fontSize: "1rem" }}>No history yet</p>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: 4 }}>
              Your predictions and analyses will appear here
            </p>
          </div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Summary</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {history.map((item) => {
                const typeInfo = typeLabels[item.type] || { label: item.type, color: "var(--text-secondary)" };
                return (
                  <tr key={item.id}>
                    <td>{new Date(item.date).toLocaleDateString()}</td>
                    <td>
                      <span className="badge" style={{ background: `${typeInfo.color}20`, color: typeInfo.color }}>
                        {typeInfo.label}
                      </span>
                    </td>
                    <td>{item.summary}</td>
                    <td>
                      <button className="btn-ghost" style={{ padding: "6px 12px" }}>
                        <HiOutlineEye size={16} /> View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
