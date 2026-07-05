import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { desiredJob, currentSkills } = await req.json();

    if (!desiredJob || !currentSkills) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    // Category skill requirements
    const categorySkills: Record<string, string[]> = {
      "INFORMATION-TECHNOLOGY": [
        "communication", "problem solving", "adaptability", "teamwork", "collaboration",
        "python", "javascript", "sql", "cloud computing", "cybersecurity",
        "data analysis", "machine learning", "software development", "agile", "devops",
        "react", "node.js", "docker", "kubernetes", "aws",
        "git", "api development", "testing", "linux", "networking",
      ],
      "FINANCE": [
        "communication", "problem solving", "teamwork", "financial analysis", "adaptability",
        "accounting", "budgeting", "risk management", "excel", "data analysis",
        "financial modeling", "compliance", "auditing", "tax", "reporting",
        "statistics", "forecasting", "investment", "banking", "economics",
      ],
      "BUSINESS-DEVELOPMENT": [
        "communication", "problem solving", "adaptability", "business development", "relationship building",
        "negotiation", "sales strategy", "market research", "project management", "leadership",
        "strategic planning", "client management", "networking", "presentation", "crm",
      ],
      "SALES": [
        "communication", "problem solving", "teamwork", "adaptability", "customer service",
        "negotiation", "sales strategy", "crm", "lead generation", "presentation",
        "market analysis", "cold calling", "account management", "closing", "relationship building",
      ],
      "HR": [
        "communication", "problem solving", "employee relations", "adaptability", "teamwork",
        "talent acquisition", "performance management", "training", "compensation", "compliance",
        "conflict resolution", "organizational skills", "payroll", "onboarding", "leadership",
      ],
    };

    const requiredSkills = categorySkills[desiredJob] || [];
    const userSkills = currentSkills.split(",").map((s: string) => s.trim().toLowerCase());

    // Calculate matches
    const matchedSkills = requiredSkills.filter((skill) =>
      userSkills.some((us: string) => us.includes(skill) || skill.includes(us))
    );
    const missingSkills = requiredSkills.filter((skill) =>
      !userSkills.some((us: string) => us.includes(skill) || skill.includes(us))
    ).slice(0, 8);

    const matchPercentage = requiredSkills.length > 0
      ? Math.round((matchedSkills.length / requiredSkills.length) * 100)
      : 0;

    // Generate learning roadmap
    const roadmap = missingSkills.slice(0, 6).map((skill, idx) => ({
      week: idx + 1,
      task: `Learn ${skill.charAt(0).toUpperCase() + skill.slice(1)}`,
      skill,
    }));

    const result = { matchPercentage, matchedSkills, missingSkills, roadmap };

    // Save to database
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (user) {
      await prisma.skillGapAnalysis.create({
        data: {
          userId: user.id,
          desiredJob,
          currentSkills,
          result: result,
        },
      });
    }

    return NextResponse.json({ result });
  } catch (error) {
    console.error("Skill gap error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
