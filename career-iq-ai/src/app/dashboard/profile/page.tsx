"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { HiOutlineUser, HiOutlinePencil, HiOutlineSave } from "react-icons/hi";

interface Profile {
  name: string;
  email: string;
  age: number | null;
  gender: string | null;
  education: string | null;
  university: string | null;
  degree: string | null;
  skills: string | null;
  experience: number | null;
  preferredIndustry: string | null;
  preferredCountry: string | null;
  createdAt: string;
}

export default function ProfilePage() {
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [form, setForm] = useState<Partial<Profile>>({});

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/profile");
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
          setForm(data);
        }
      } catch {
        console.error("Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleSave = async () => {
    try {
      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast.success("Profile updated!");
        setProfile({ ...profile, ...form } as Profile);
        setEditing(false);
      } else {
        toast.error("Failed to update profile");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  if (loading) {
    return (
      <div style={{ maxWidth: 700, margin: "0 auto", padding: 40 }}>
        <div className="skeleton" style={{ width: 80, height: 80, borderRadius: "50%", marginBottom: 20 }} />
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="skeleton" style={{ height: 48, marginBottom: 12 }} />
        ))}
      </div>
    );
  }

  if (!profile) return null;

  const fields = [
    { key: "name", label: "Full Name", type: "text" },
    { key: "email", label: "Email", type: "email", disabled: true },
    { key: "age", label: "Age", type: "number" },
    { key: "gender", label: "Gender", type: "select", options: ["Male", "Female", "Other"] },
    { key: "education", label: "Education Level", type: "select", options: ["High School", "Bachelor's", "Master's", "PhD"] },
    { key: "university", label: "University", type: "text" },
    { key: "degree", label: "Degree", type: "text" },
    { key: "skills", label: "Skills", type: "text" },
    { key: "experience", label: "Years of Experience", type: "number" },
    { key: "preferredIndustry", label: "Preferred Industry", type: "text" },
    { key: "preferredCountry", label: "Preferred Country", type: "text" },
  ];

  return (
    <div style={{ maxWidth: 700, margin: "0 auto" }}>
      {/* Header */}
      <div className="animate-fade-in-up" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32, flexWrap: "wrap", gap: 16 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ width: 44, height: 44, borderRadius: 12, background: "rgba(167, 139, 250, 0.1)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <HiOutlineUser size={22} color="var(--secondary)" />
          </div>
          <h1 style={{ fontSize: "1.6rem", fontWeight: 700 }}>Profile</h1>
        </div>
        {editing ? (
          <button className="btn-primary" onClick={handleSave} style={{ padding: "10px 20px" }}>
            <HiOutlineSave size={16} /> Save Changes
          </button>
        ) : (
          <button className="btn-secondary" onClick={() => setEditing(true)} style={{ padding: "10px 20px" }}>
            <HiOutlinePencil size={16} /> Edit Profile
          </button>
        )}
      </div>

      {/* Profile Photo */}
      <div className="glass-card animate-fade-in-up delay-100" style={{ padding: 28, textAlign: "center", marginBottom: 20 }}>
        <div style={{
          width: 80, height: 80, borderRadius: "50%",
          background: "linear-gradient(135deg, var(--primary), var(--secondary))",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: "2rem", fontWeight: 700, color: "#000",
          margin: "0 auto 12px",
        }}>
          {profile.name?.charAt(0)?.toUpperCase() || "?"}
        </div>
        <h2 style={{ fontSize: "1.2rem", fontWeight: 600 }}>{profile.name || "User"}</h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>{profile.email}</p>
        <p style={{ color: "var(--text-muted)", fontSize: "0.8rem", marginTop: 4 }}>
          Member since {new Date(profile.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* Fields */}
      <div className="glass-card animate-fade-in-up delay-200" style={{ padding: 28 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 20 }}>
          {fields.map((field) => (
            <div key={field.key}>
              <label className="input-label">{field.label}</label>
              {editing && !field.disabled ? (
                field.type === "select" ? (
                  <select
                    className="input-field"
                    value={(form as unknown as Record<string, string | number | null>)[field.key]?.toString() || ""}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  >
                    <option value="">Select</option>
                    {field.options?.map((opt) => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </select>
                ) : (
                  <input
                    className="input-field"
                    type={field.type}
                    value={(form as unknown as Record<string, string | number | null>)[field.key]?.toString() || ""}
                    onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                  />
                )
              ) : (
                <div style={{
                  padding: "12px 16px",
                  background: "var(--surface)",
                  borderRadius: 10,
                  fontSize: "0.9rem",
                  color: (profile as unknown as Record<string, string | number | null>)[field.key] ? "var(--foreground)" : "var(--text-muted)",
                  border: "1px solid var(--border)",
                }}>
                  {(profile as unknown as Record<string, string | number | null>)[field.key]?.toString() || "Not set"}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
