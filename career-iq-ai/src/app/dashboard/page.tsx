"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  HiOutlineBriefcase,
  HiOutlineCurrencyDollar,
  HiOutlineAcademicCap,
  HiOutlineChartBar,
  HiOutlineArrowRight,
  HiOutlineClock,
} from "react-icons/hi";

interface UserProfile {
  name: string;
  skills: string;
  experience: number;
  education: string;
  profileComplete: boolean;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data = await res.json();
          if (!data.profileComplete) {
            router.push("/complete-profile");
            return;
          }
          setProfile(data);
        }
      } catch {
        console.error("Failed to fetch profile");
      }
    };
    if (session) fetchProfile();
  }, [session, router]);

  if (status === "loading" || !profile) {
    return (
      <div style={{ maxWidth: 1100 }}>
        <div className="skeleton" style={{ width: 280, height: 36, marginBottom: 8, borderRadius: 8 }} />
        <div className="skeleton" style={{ width: 200, height: 20, marginBottom: 40, borderRadius: 6 }} />
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 32 }}>
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skeleton" style={{ height: 90, borderRadius: 16 }} />
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton" style={{ height: 88, borderRadius: 20 }} />
          ))}
        </div>
      </div>
    );
  }

  const skillsList = profile.skills?.split(",").map((s) => s.trim()).filter(Boolean) || [];
  const fields = [profile.name, profile.skills, profile.experience, profile.education].filter(Boolean);
  const profilePercent = Math.min(Math.round((fields.length / 4) * 100), 100);

  const statCards = [
    {
      icon: HiOutlineChartBar,
      label: "Profile Completion",
      value: `${profilePercent}%`,
      color: "var(--primary)",
      bg: "rgba(200, 255, 0, 0.12)",
    },
    {
      icon: HiOutlineBriefcase,
      label: "Job Matches",
      value: skillsList.length > 3 ? "Ready" : "—",
      color: "var(--accent)",
      bg: "rgba(251, 191, 36, 0.12)",
    },
    {
      icon: HiOutlineCurrencyDollar,
      label: "Expected Salary",
      value: "Predict →",
      color: "#22c55e",
      bg: "rgba(34, 197, 94, 0.12)",
    },
    {
      icon: HiOutlineAcademicCap,
      label: "Skill Match %",
      value: "Analyze →",
      color: "var(--secondary)",
      bg: "rgba(167, 139, 250, 0.12)",
    },
  ];

  const featureCards = [
    {
      href: "/dashboard/job-recommendation",
      emoji: "🎯",
      title: "Job Recommendation",
      desc: "Find the best jobs that match your skills and experience",
      accentColor: "var(--primary)",
      borderHover: "rgba(200, 255, 0, 0.3)",
      btnBg: "var(--primary)",
    },
    {
      href: "/dashboard/salary-prediction",
      emoji: "💰",
      title: "Salary Prediction",
      desc: "Predict your expected salary based on your profile",
      accentColor: "var(--accent)",
      borderHover: "rgba(251, 191, 36, 0.3)",
      btnBg: "var(--accent)",
    },
    {
      href: "/dashboard/skill-gap",
      emoji: "📚",
      title: "Skill Gap Analysis",
      desc: "Find missing skills for your dream job and get a roadmap",
      accentColor: "var(--secondary)",
      borderHover: "rgba(167, 139, 250, 0.3)",
      btnBg: "var(--secondary)",
    },
  ];

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }}>

      {/* ── Welcome Header ────────────────────────────── */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: "clamp(1.5rem, 3vw, 2rem)", fontWeight: 800, marginBottom: 6 }}>
          Hello {profile.name?.split(" ")[0] || "there"} 👋
        </h1>
        <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
          Welcome back to your career dashboard
        </p>
      </div>

      {/* ── Stat Cards ────────────────────────────────── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
          gap: 16,
          marginBottom: 36,
        }}
      >
        {statCards.map((card) => (
          <div
            key={card.label}
            style={{
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: 16,
              padding: "20px 20px",
              display: "flex",
              alignItems: "center",
              gap: 16,
              transition: "all 0.3s ease",
            }}
          >
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 13,
                background: card.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <card.icon size={22} color={card.color} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginBottom: 3, whiteSpace: "nowrap" }}>
                {card.label}
              </div>
              <div style={{ fontSize: "1.4rem", fontWeight: 800, color: card.color, lineHeight: 1 }}>
                {card.value}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Two-column: Feature Cards + Right Panel ───── */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: 24,
        }}
      >
        {/* Feature cards column */}
        <div>
          <h2
            style={{
              fontSize: "0.8rem",
              fontWeight: 700,
              color: "var(--text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: 16,
            }}
          >
            AI Tools
          </h2>

          <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
            {featureCards.map((card) => (
              <Link key={card.href} href={card.href} style={{ textDecoration: "none", color: "inherit" }}>
                <div
                  style={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    borderRadius: 18,
                    padding: "22px 24px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: 16,
                    transition: "all 0.25s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = card.borderHover;
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(-2px)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = `0 8px 32px ${card.borderHover}`;
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border)";
                    (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)";
                    (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
                  }}
                >
                  {/* Left: emoji + text */}
                  <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
                    <div
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: 14,
                        background: `${card.accentColor}18`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "1.6rem",
                        flexShrink: 0,
                      }}
                    >
                      {card.emoji}
                    </div>
                    <div>
                      <h3 style={{ fontSize: "1.05rem", fontWeight: 700, marginBottom: 4 }}>
                        {card.title}
                      </h3>
                      <p style={{ fontSize: "0.83rem", color: "var(--text-muted)", lineHeight: 1.4 }}>
                        {card.desc}
                      </p>
                    </div>
                  </div>

                  {/* Right: Start button */}
                  <button
                    style={{
                      background: card.btnBg,
                      color: "#000",
                      fontWeight: 700,
                      padding: "10px 22px",
                      borderRadius: 10,
                      border: "none",
                      cursor: "pointer",
                      fontSize: "0.88rem",
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      whiteSpace: "nowrap",
                      flexShrink: 0,
                    }}
                  >
                    Start <HiOutlineArrowRight size={14} />
                  </button>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Right info panel */}
        <div>
          <h2
            style={{
              fontSize: "0.8rem",
              fontWeight: 700,
              color: "var(--text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
              marginBottom: 16,
            }}
          >
            Quick Info
          </h2>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16 }}>
            {/* Skills card */}
            <div
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 16,
                padding: 20,
              }}
            >
              <h3
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "var(--text-secondary)",
                  marginBottom: 14,
                }}
              >
                Your Skills ({skillsList.length})
              </h3>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {skillsList.slice(0, 10).map((skill) => (
                  <span
                    key={skill}
                    style={{
                      background: "rgba(200, 255, 0, 0.1)",
                      color: "var(--primary)",
                      padding: "4px 12px",
                      borderRadius: 20,
                      fontSize: "0.75rem",
                      fontWeight: 600,
                    }}
                  >
                    {skill}
                  </span>
                ))}
                {skillsList.length > 10 && (
                  <span
                    style={{
                      background: "var(--surface-hover)",
                      color: "var(--text-muted)",
                      padding: "4px 12px",
                      borderRadius: 20,
                      fontSize: "0.75rem",
                    }}
                  >
                    +{skillsList.length - 10} more
                  </span>
                )}
              </div>
            </div>

            {/* Recent Activity */}
            <div
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 16,
                padding: 20,
              }}
            >
              <h3
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "var(--text-secondary)",
                  marginBottom: 14,
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                <HiOutlineClock size={15} /> Recent Activity
              </h3>
              <p style={{ fontSize: "0.83rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
                No recent predictions yet.{" "}
                <Link
                  href="/dashboard/job-recommendation"
                  style={{ color: "var(--primary)", textDecoration: "none", fontWeight: 600 }}
                >
                  Try Job Recommendation →
                </Link>
              </p>
            </div>

            {/* Profile completion */}
            <div
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                borderRadius: 16,
                padding: 20,
              }}
            >
              <h3
                style={{
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: "var(--text-secondary)",
                  marginBottom: 14,
                }}
              >
                Profile Completion
              </h3>
              <div
                style={{
                  width: "100%",
                  height: 8,
                  background: "var(--border)",
                  borderRadius: 4,
                  overflow: "hidden",
                  marginBottom: 8,
                }}
              >
                <div
                  style={{
                    width: `${profilePercent}%`,
                    height: "100%",
                    borderRadius: 4,
                    background: "linear-gradient(90deg, var(--primary), var(--accent))",
                    transition: "width 0.8s ease",
                  }}
                />
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                  {profilePercent}% complete
                </span>
                {profilePercent < 100 && (
                  <Link
                    href="/dashboard/profile"
                    style={{ fontSize: "0.78rem", color: "var(--primary)", textDecoration: "none", fontWeight: 600 }}
                  >
                    Complete →
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
