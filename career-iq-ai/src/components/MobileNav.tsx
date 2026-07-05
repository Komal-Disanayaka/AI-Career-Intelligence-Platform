"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { useState } from "react";
import { HiMenu, HiX, HiOutlineHome, HiOutlineBriefcase, HiOutlineCurrencyDollar, HiOutlineAcademicCap, HiOutlineDocumentReport, HiOutlineClock, HiOutlineUser, HiOutlineLogout } from "react-icons/hi";
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

export default function MobileNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      {/* Top Bar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          zIndex: 50,
          background: "rgba(10, 11, 15, 0.95)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid var(--border)",
          padding: "0 16px",
          height: 56,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Link href="/dashboard" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", color: "var(--foreground)" }}>
          <RiBrainLine size={24} color="var(--primary)" />
          <span style={{ fontWeight: 700 }}>Career<span style={{ color: "var(--primary)" }}>IQ</span></span>
        </Link>
        <button onClick={() => setOpen(!open)} style={{ background: "none", border: "none", color: "var(--foreground)", cursor: "pointer", padding: 8 }}>
          {open ? <HiX size={24} /> : <HiMenu size={24} />}
        </button>
      </div>

      {/* Spacer */}
      <div style={{ height: 56 }} />

      {/* Overlay Menu */}
      {open && (
        <div
          style={{
            position: "fixed",
            top: 56,
            left: 0,
            right: 0,
            bottom: 0,
            background: "var(--surface)",
            zIndex: 45,
            padding: 16,
            display: "flex",
            flexDirection: "column",
            gap: 4,
            overflowY: "auto",
          }}
        >
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} onClick={() => setOpen(false)} className={`sidebar-link ${isActive ? "active" : ""}`}>
                <item.icon size={20} />
                {item.label}
              </Link>
            );
          })}
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="sidebar-link"
            style={{ border: "none", background: "none", cursor: "pointer", width: "100%", marginTop: 16, paddingTop: 16, borderTop: "1px solid var(--border)" }}
          >
            <HiOutlineLogout size={20} />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
