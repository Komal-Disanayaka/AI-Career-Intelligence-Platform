import Link from "next/link";
import { RiBrainLine } from "react-icons/ri";
import { FiGithub } from "react-icons/fi";

export default function Footer() {
  return (
    <footer
      style={{
        borderTop: "1px solid var(--border)",
        background: "var(--surface)",
        padding: "48px 24px 24px",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 40,
        }}
      >
        {/* Brand */}
        <div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              marginBottom: 12,
            }}
          >
            <RiBrainLine size={24} color="var(--primary)" />
            <span style={{ fontSize: "1.1rem", fontWeight: 700 }}>
              Career<span style={{ color: "var(--primary)" }}>IQ</span> AI
            </span>
          </div>
          <p
            style={{
              fontSize: "0.85rem",
              color: "var(--text-muted)",
              lineHeight: 1.6,
            }}
          >
            AI-Powered Career Intelligence Platform. Find your perfect career
            path with machine learning.
          </p>
        </div>

        {/* Links */}
        <div>
          <h4
            style={{
              fontSize: "0.8rem",
              fontWeight: 600,
              color: "var(--text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: 16,
            }}
          >
            Platform
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Link
              href="/dashboard/job-recommendation"
              style={{
                fontSize: "0.9rem",
                color: "var(--text-secondary)",
                textDecoration: "none",
              }}
            >
              Job Recommendation
            </Link>
            <Link
              href="/dashboard/salary-prediction"
              style={{
                fontSize: "0.9rem",
                color: "var(--text-secondary)",
                textDecoration: "none",
              }}
            >
              Salary Prediction
            </Link>
            <Link
              href="/dashboard/skill-gap"
              style={{
                fontSize: "0.9rem",
                color: "var(--text-secondary)",
                textDecoration: "none",
              }}
            >
              Skill Gap Analysis
            </Link>
          </div>
        </div>

        <div>
          <h4
            style={{
              fontSize: "0.8rem",
              fontWeight: 600,
              color: "var(--text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: 16,
            }}
          >
            Company
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <Link
              href="#"
              style={{
                fontSize: "0.9rem",
                color: "var(--text-secondary)",
                textDecoration: "none",
              }}
            >
              About
            </Link>
            <Link
              href="#"
              style={{
                fontSize: "0.9rem",
                color: "var(--text-secondary)",
                textDecoration: "none",
              }}
            >
              Contact
            </Link>
            <Link
              href="#"
              style={{
                fontSize: "0.9rem",
                color: "var(--text-secondary)",
                textDecoration: "none",
              }}
            >
              Privacy Policy
            </Link>
          </div>
        </div>

        <div>
          <h4
            style={{
              fontSize: "0.8rem",
              fontWeight: 600,
              color: "var(--text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.05em",
              marginBottom: 16,
            }}
          >
            Connect
          </h4>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontSize: "0.9rem",
              color: "var(--text-secondary)",
              textDecoration: "none",
            }}
          >
            <FiGithub size={18} />
            GitHub
          </a>
        </div>
      </div>

      {/* Bottom */}
      <div
        style={{
          maxWidth: 1200,
          margin: "40px auto 0",
          paddingTop: 20,
          borderTop: "1px solid var(--border)",
          textAlign: "center",
          fontSize: "0.8rem",
          color: "var(--text-muted)",
        }}
      >
        &copy; {new Date().getFullYear()} CareerIQ AI. All rights reserved.
      </div>
    </footer>
  );
}
