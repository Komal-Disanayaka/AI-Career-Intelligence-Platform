"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { RiBrainLine } from "react-icons/ri";
import { HiOutlineUser, HiOutlineAcademicCap, HiOutlineBriefcase, HiOutlineGlobe } from "react-icons/hi";

const educationLevels = ["High School", "Bachelor's", "Master's", "PhD"];
const industries = [
  "Information Technology",
  "Finance",
  "Business Development",
  "Sales",
  "Human Resources",
  "Healthcare",
  "Engineering",
  "Marketing",
  "Education",
  "Other",
];

export default function CompleteProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    age: "",
    gender: "",
    education: "",
    university: "",
    degree: "",
    skills: "",
    experience: "",
    preferredIndustry: "",
    preferredCountry: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.skills) {
      toast.error("Please fill in at least your name and skills");
      return;
    }
    setLoading(true);

    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        toast.success("Profile saved successfully!");
        router.push("/dashboard");
        router.refresh();
      } else {
        toast.error("Failed to save profile");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const updateForm = (key: string, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div
      className="grid-pattern"
      style={{ minHeight: "100vh", padding: "40px 24px", background: "var(--background)" }}
    >
      <div style={{ maxWidth: 700, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 40 }}>
          <RiBrainLine size={40} color="var(--primary)" style={{ marginBottom: 16 }} />
          <h1 style={{ fontSize: "1.8rem", fontWeight: 700, marginBottom: 8 }}>
            Complete Your <span className="gradient-text">Profile</span>
          </h1>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
            Tell us about yourself so our AI can give you better career recommendations
          </p>
        </div>

        {/* Form Card */}
        <div className="glass-card" style={{ padding: "36px 32px" }}>
          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            {/* Personal Info Section */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <HiOutlineUser size={20} color="var(--primary)" />
                <span style={{ fontWeight: 600 }}>Personal Information</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
                <div>
                  <label className="input-label">Full Name *</label>
                  <input className="input-field" placeholder="Your full name" value={form.name} onChange={(e) => updateForm("name", e.target.value)} required />
                </div>
                <div>
                  <label className="input-label">Age</label>
                  <input className="input-field" type="number" placeholder="25" value={form.age} onChange={(e) => updateForm("age", e.target.value)} />
                </div>
                <div>
                  <label className="input-label">Gender</label>
                  <select className="input-field" value={form.gender} onChange={(e) => updateForm("gender", e.target.value)}>
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Education Section */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <HiOutlineAcademicCap size={20} color="var(--accent)" />
                <span style={{ fontWeight: 600 }}>Education</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
                <div>
                  <label className="input-label">Education Level</label>
                  <select className="input-field" value={form.education} onChange={(e) => updateForm("education", e.target.value)}>
                    <option value="">Select</option>
                    {educationLevels.map((level) => (
                      <option key={level} value={level}>{level}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="input-label">University</label>
                  <input className="input-field" placeholder="University name" value={form.university} onChange={(e) => updateForm("university", e.target.value)} />
                </div>
                <div>
                  <label className="input-label">Degree</label>
                  <input className="input-field" placeholder="e.g. BSc Computer Science" value={form.degree} onChange={(e) => updateForm("degree", e.target.value)} />
                </div>
              </div>
            </div>

            {/* Skills & Experience */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <HiOutlineBriefcase size={20} color="var(--secondary)" />
                <span style={{ fontWeight: 600 }}>Skills & Experience</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label className="input-label">Current Skills * (comma separated)</label>
                  <input className="input-field" placeholder="Python, JavaScript, Machine Learning, React" value={form.skills} onChange={(e) => updateForm("skills", e.target.value)} required />
                </div>
                <div style={{ maxWidth: 300 }}>
                  <label className="input-label">Years of Experience</label>
                  <input className="input-field" type="number" placeholder="0" value={form.experience} onChange={(e) => updateForm("experience", e.target.value)} />
                </div>
              </div>
            </div>

            {/* Preferences */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <HiOutlineGlobe size={20} color="#22c55e" />
                <span style={{ fontWeight: 600 }}>Preferences</span>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
                <div>
                  <label className="input-label">Preferred Industry</label>
                  <select className="input-field" value={form.preferredIndustry} onChange={(e) => updateForm("preferredIndustry", e.target.value)}>
                    <option value="">Select</option>
                    {industries.map((ind) => (
                      <option key={ind} value={ind}>{ind}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="input-label">Preferred Country</label>
                  <input className="input-field" placeholder="e.g. Sri Lanka" value={form.preferredCountry} onChange={(e) => updateForm("preferredCountry", e.target.value)} />
                </div>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{ width: "100%", justifyContent: "center", padding: "14px", fontSize: "1rem", marginTop: 8, opacity: loading ? 0.7 : 1 }}
            >
              {loading ? "Saving..." : "Save & Continue →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
