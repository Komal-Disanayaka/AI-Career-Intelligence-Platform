"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { RiBrainLine } from "react-icons/ri";
import { HiOutlineMail, HiOutlineLockClosed, HiOutlineUser } from "react-icons/hi";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Registration failed");
      } else {
        toast.success("Account created! Please login.");
        router.push("/login");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="hero-bg grid-pattern"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div
        className="glass-card animate-fade-in-up"
        style={{
          width: "100%",
          maxWidth: 440,
          padding: "48px 36px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Top accent line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            background: "linear-gradient(90deg, var(--secondary), var(--primary))",
          }}
        />

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              textDecoration: "none",
              color: "var(--foreground)",
              marginBottom: 16,
            }}
          >
            <RiBrainLine size={32} color="var(--primary)" />
            <span style={{ fontSize: "1.4rem", fontWeight: 700 }}>
              Career<span style={{ color: "var(--primary)" }}>IQ</span> AI
            </span>
          </Link>
          <h1
            style={{
              fontSize: "1.5rem",
              fontWeight: 700,
              marginTop: 16,
              marginBottom: 8,
            }}
          >
            Create Account
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>
            Start your AI-powered career journey
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div>
            <label className="input-label">Full Name</label>
            <div style={{ position: "relative" }}>
              <HiOutlineUser
                size={18}
                color="var(--text-muted)"
                style={{ position: "absolute", left: 14, top: 14 }}
              />
              <input
                type="text"
                className="input-field"
                placeholder="Your name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                style={{ paddingLeft: 42 }}
              />
            </div>
          </div>

          <div>
            <label className="input-label">Email</label>
            <div style={{ position: "relative" }}>
              <HiOutlineMail
                size={18}
                color="var(--text-muted)"
                style={{ position: "absolute", left: 14, top: 14 }}
              />
              <input
                type="email"
                className="input-field"
                placeholder="your@email.com"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
                style={{ paddingLeft: 42 }}
              />
            </div>
          </div>

          <div>
            <label className="input-label">Password</label>
            <div style={{ position: "relative" }}>
              <HiOutlineLockClosed
                size={18}
                color="var(--text-muted)"
                style={{ position: "absolute", left: 14, top: 14 }}
              />
              <input
                type="password"
                className="input-field"
                placeholder="Min. 6 characters"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
                style={{ paddingLeft: 42 }}
              />
            </div>
          </div>

          <div>
            <label className="input-label">Confirm Password</label>
            <div style={{ position: "relative" }}>
              <HiOutlineLockClosed
                size={18}
                color="var(--text-muted)"
                style={{ position: "absolute", left: 14, top: 14 }}
              />
              <input
                type="password"
                className="input-field"
                placeholder="Confirm your password"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                required
                style={{ paddingLeft: 42 }}
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn-primary"
            disabled={loading}
            style={{
              width: "100%",
              justifyContent: "center",
              padding: "14px",
              fontSize: "1rem",
              marginTop: 8,
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        {/* Login Link */}
        <p
          style={{
            textAlign: "center",
            marginTop: 28,
            fontSize: "0.9rem",
            color: "var(--text-muted)",
          }}
        >
          Already have an account?{" "}
          <Link
            href="/login"
            style={{
              color: "var(--primary)",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
