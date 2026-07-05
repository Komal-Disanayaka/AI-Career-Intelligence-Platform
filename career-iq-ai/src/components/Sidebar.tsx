"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  HiOutlineHome,
  HiOutlineBriefcase,
  HiOutlineCurrencyDollar,
  HiOutlineAcademicCap,
  HiOutlineDocumentReport,
  HiOutlineClock,
  HiOutlineUser,
  HiOutlineLogout,
} from "react-icons/hi";
import { RiBrainLine } from "react-icons/ri";

const navItems = [
  { href: "/dashboard", icon: HiOutlineHome, label: "Dashboard" },
  { href: "/dashboard/job-recommendation", icon: HiOutlineBriefcase, label: "Job Recommendation" },
  { href: "/dashboard/salary-prediction", icon: HiOutlineCurrencyDollar, label: "Salary Prediction" },
  { href: "/dashboard/skill-gap", icon: HiOutlineAcademicCap, label: "Skill Gap Analysis" },
  { href: "/dashboard/career-report", icon: HiOutlineDocumentReport, label: "AI Career Report" },
  { href: "/dashboard/history", icon: HiOutlineClock, label: "History" },
  { href: "/dashboard/profile", icon: HiOutlineUser, label: "Profile" },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* CSS to hide sidebar on mobile */}
      <style>{`
        #dashboard-sidebar {
          display: none;
        }
        @media (min-width: 1024px) {
          #dashboard-sidebar {
            display: flex;
          }
        }
      `}</style>

      <aside
        id="dashboard-sidebar"
        style={{
          width: 260,
          minHeight: "100vh",
          background: "var(--surface)",
          borderRight: "1px solid var(--border)",
          padding: "0 12px 24px",
          flexDirection: "column",
          position: "fixed",
          left: 0,
          top: 0,
          bottom: 0,
          zIndex: 40,
          overflowY: "auto",
        }}
      >
        {/* Logo */}
        <Link
          href="/dashboard"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            textDecoration: "none",
            color: "var(--foreground)",
            padding: "20px 8px 20px",
            borderBottom: "1px solid var(--border)",
            marginBottom: 16,
          }}
        >
          <RiBrainLine size={26} color="var(--primary)" />
          <span style={{ fontSize: "1.1rem", fontWeight: 700 }}>
            Career<span style={{ color: "var(--primary)" }}>IQ</span>{" "}
            <span style={{ fontSize: "0.7rem", color: "var(--text-muted)", fontWeight: 500 }}>AI</span>
          </span>
        </Link>

        {/* Navigation */}
        <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2 }}>
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: "10px 12px",
                  borderRadius: 10,
                  fontSize: "0.88rem",
                  fontWeight: isActive ? 600 : 500,
                  color: isActive ? "var(--primary)" : "var(--text-secondary)",
                  background: isActive ? "rgba(200, 255, 0, 0.1)" : "transparent",
                  textDecoration: "none",
                  transition: "all 0.2s ease",
                }}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div style={{ marginTop: "auto", paddingTop: 16, borderTop: "1px solid var(--border)" }}>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 12px",
              borderRadius: 10,
              fontSize: "0.88rem",
              fontWeight: 500,
              color: "var(--text-secondary)",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              width: "100%",
              transition: "all 0.2s ease",
            }}
          >
            <HiOutlineLogout size={18} />
            Logout
          </button>
        </div>
      </aside>
    </>
  );
}
