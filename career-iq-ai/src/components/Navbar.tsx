"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { HiMenu, HiX } from "react-icons/hi";
import { RiBrainLine } from "react-icons/ri";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const isLanding = pathname === "/";

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        background: "rgba(10, 11, 15, 0.8)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px",
          height: 64,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            textDecoration: "none",
            color: "var(--foreground)",
          }}
        >
          <RiBrainLine size={28} color="var(--primary)" />
          <span style={{ fontSize: "1.2rem", fontWeight: 700 }}>
            Career<span style={{ color: "var(--primary)" }}>IQ</span>{" "}
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
              AI
            </span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
          className="hidden md:flex"
        >
          {isLanding ? (
            <>
              <Link href="/login">
                <button className="btn-ghost">Login</button>
              </Link>
              <Link href="/register">
                <button className="btn-primary" style={{ padding: "10px 24px" }}>
                  Get Started
                </button>
              </Link>
            </>
          ) : (
            <>
              <Link href="/dashboard">
                <button className="btn-ghost">Dashboard</button>
              </Link>
              <Link href="/dashboard/profile">
                <button className="btn-ghost">Profile</button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
          style={{
            background: "none",
            border: "none",
            color: "var(--foreground)",
            cursor: "pointer",
            padding: 8,
          }}
        >
          {mobileOpen ? <HiX size={24} /> : <HiMenu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          style={{
            padding: "16px 24px",
            borderTop: "1px solid var(--border)",
            background: "var(--surface)",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
          className="md:hidden"
        >
          {isLanding ? (
            <>
              <Link
                href="/login"
                onClick={() => setMobileOpen(false)}
                style={{ textDecoration: "none" }}
              >
                <button className="btn-ghost" style={{ width: "100%", justifyContent: "flex-start" }}>
                  Login
                </button>
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileOpen(false)}
                style={{ textDecoration: "none" }}
              >
                <button className="btn-primary" style={{ width: "100%" }}>
                  Get Started
                </button>
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/dashboard"
                onClick={() => setMobileOpen(false)}
                style={{ textDecoration: "none" }}
              >
                <button className="btn-ghost" style={{ width: "100%", justifyContent: "flex-start" }}>
                  Dashboard
                </button>
              </Link>
              <Link
                href="/dashboard/profile"
                onClick={() => setMobileOpen(false)}
                style={{ textDecoration: "none" }}
              >
                <button className="btn-ghost" style={{ width: "100%", justifyContent: "flex-start" }}>
                  Profile
                </button>
              </Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
