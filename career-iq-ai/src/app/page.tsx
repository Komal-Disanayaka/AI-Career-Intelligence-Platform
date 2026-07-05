import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import {
  HiOutlineBriefcase,
  HiOutlineCurrencyDollar,
  HiOutlineAcademicCap,
  HiOutlineLightBulb,
  HiOutlineChartBar,
  HiOutlineShieldCheck,
} from "react-icons/hi";

export default function LandingPage() {
  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <section
        className="hero-bg grid-pattern"
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "120px 24px 80px",
          position: "relative",
        }}
      >
        <div style={{ position: "relative", zIndex: 1, maxWidth: 800 }}>
          {/* Badge */}
          <div
            className="animate-fade-in-up"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 20px",
              borderRadius: 50,
              background: "rgba(200, 255, 0, 0.1)",
              border: "1px solid rgba(200, 255, 0, 0.2)",
              marginBottom: 32,
              fontSize: "0.85rem",
              color: "var(--primary)",
              fontWeight: 500,
            }}
          >
            <HiOutlineChartBar size={16} />
            AI-Powered Career Intelligence Platform
          </div>

          {/* Main Heading */}
          <h1
            className="animate-fade-in-up delay-100"
            style={{
              fontSize: "clamp(2.5rem, 6vw, 4.5rem)",
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: 24,
              letterSpacing: "-0.02em",
            }}
          >
            Find Your{" "}
            <span className="gradient-text">Perfect Career</span>
            <br />
            Path with{" "}
            <span style={{ color: "var(--secondary)" }}>AI</span>
          </h1>

          {/* Subtitle */}
          <p
            className="animate-fade-in-up delay-200"
            style={{
              fontSize: "clamp(1rem, 2vw, 1.25rem)",
              color: "var(--text-secondary)",
              maxWidth: 600,
              margin: "0 auto 40px",
              lineHeight: 1.7,
            }}
          >
            Leverage machine learning to get personalized job recommendations,
            accurate salary predictions, and actionable skill gap analysis.
          </p>

          {/* CTA Buttons */}
          <div
            className="animate-fade-in-up delay-300"
            style={{
              display: "flex",
              gap: 16,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Link href="/register">
              <button className="btn-primary" style={{ padding: "14px 36px", fontSize: "1rem" }}>
                Get Started
                <span style={{ fontSize: "1.2rem" }}>→</span>
              </button>
            </Link>
            <Link href="/login">
              <button className="btn-secondary" style={{ padding: "14px 36px", fontSize: "1rem" }}>
                Login
              </button>
            </Link>
          </div>

          {/* Stats */}
          <div
            className="animate-fade-in-up delay-400"
            style={{
              display: "flex",
              gap: 48,
              justifyContent: "center",
              marginTop: 64,
              flexWrap: "wrap",
            }}
          >
            {[
              { value: "3", label: "AI Models" },
              { value: "95%", label: "Accuracy" },
              { value: "10+", label: "Job Categories" },
            ].map((stat) => (
              <div key={stat.label}>
                <div
                  style={{
                    fontSize: "2rem",
                    fontWeight: 800,
                    color: "var(--primary)",
                  }}
                >
                  {stat.value}
                </div>
                <div
                  style={{
                    fontSize: "0.85rem",
                    color: "var(--text-muted)",
                    marginTop: 4,
                  }}
                >
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        style={{
          padding: "100px 24px",
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: 64 }}>
          <h2
            style={{
              fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
              fontWeight: 700,
              marginBottom: 16,
            }}
          >
            Why Choose{" "}
            <span className="gradient-text">CareerIQ AI</span>?
          </h2>
          <p
            style={{
              color: "var(--text-secondary)",
              fontSize: "1.1rem",
              maxWidth: 500,
              margin: "0 auto",
            }}
          >
            Powerful AI tools to accelerate your career growth
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
            gap: 24,
          }}
        >
          {[
            {
              icon: HiOutlineBriefcase,
              title: "AI Job Recommendation",
              desc: "Get personalized job matches based on your skills, experience, and preferences using machine learning.",
              color: "var(--primary)",
              bgColor: "rgba(200, 255, 0, 0.1)",
            },
            {
              icon: HiOutlineCurrencyDollar,
              title: "Salary Prediction",
              desc: "Predict your expected salary based on your profile with high accuracy using trained regression models.",
              color: "var(--accent)",
              bgColor: "rgba(251, 191, 36, 0.1)",
            },
            {
              icon: HiOutlineAcademicCap,
              title: "Skill Gap Analysis",
              desc: "Identify missing skills for your dream job and get a personalized learning roadmap to bridge the gap.",
              color: "var(--secondary)",
              bgColor: "rgba(167, 139, 250, 0.1)",
            },
            {
              icon: HiOutlineLightBulb,
              title: "Personalized Career Insights",
              desc: "Get a comprehensive AI career report combining all analyses into actionable career guidance.",
              color: "#22c55e",
              bgColor: "rgba(34, 197, 94, 0.1)",
            },
            {
              icon: HiOutlineChartBar,
              title: "Track Your Progress",
              desc: "Monitor your career growth with detailed history and track how your predictions evolve over time.",
              color: "#3b82f6",
              bgColor: "rgba(59, 130, 246, 0.1)",
            },
            {
              icon: HiOutlineShieldCheck,
              title: "Data Privacy",
              desc: "Your data is securely stored and never shared. All AI processing happens within our secure platform.",
              color: "#f43f5e",
              bgColor: "rgba(244, 63, 94, 0.1)",
            },
          ].map((feature) => (
            <div
              key={feature.title}
              className="glass-card glass-card-hover"
              style={{ padding: 32 }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 14,
                  background: feature.bgColor,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 20,
                }}
              >
                <feature.icon size={24} color={feature.color} />
              </div>
              <h3
                style={{
                  fontSize: "1.15rem",
                  fontWeight: 600,
                  marginBottom: 10,
                }}
              >
                {feature.title}
              </h3>
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "var(--text-secondary)",
                  lineHeight: 1.7,
                }}
              >
                {feature.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section
        style={{
          padding: "80px 24px",
          textAlign: "center",
        }}
      >
        <div
          className="glass-card"
          style={{
            maxWidth: 700,
            margin: "0 auto",
            padding: "60px 40px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 2,
              background: "linear-gradient(90deg, var(--primary), var(--secondary))",
            }}
          />
          <h2
            style={{
              fontSize: "clamp(1.5rem, 3vw, 2rem)",
              fontWeight: 700,
              marginBottom: 16,
            }}
          >
            Ready to Start Your <span className="gradient-text">AI Career Journey</span>?
          </h2>
          <p
            style={{
              color: "var(--text-secondary)",
              marginBottom: 32,
              fontSize: "1rem",
            }}
          >
            Create your free account and discover your career potential today.
          </p>
          <Link href="/register">
            <button className="btn-primary" style={{ padding: "14px 40px", fontSize: "1rem" }}>
              Create Free Account
            </button>
          </Link>
        </div>
      </section>

      <Footer />
    </>
  );
}
