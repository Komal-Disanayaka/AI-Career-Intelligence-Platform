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

    const { jobTitle, experience, education, location, skills } = await req.json();

    if (!jobTitle) {
      return NextResponse.json({ error: "Job title is required" }, { status: 400 });
    }

    // Salary prediction logic based on role and experience
    const baseSalaries: Record<string, number> = {
      "software engineer": 90000,
      "data scientist": 105000,
      "data analyst": 65000,
      "full stack developer": 88000,
      "frontend developer": 80000,
      "backend developer": 90000,
      "devops engineer": 95000,
      "ml engineer": 115000,
      "product manager": 100000,
      "project manager": 85000,
      "ui/ux designer": 75000,
      "cloud architect": 125000,
      "cybersecurity analyst": 90000,
      "business analyst": 72000,
    };

    const normalizedTitle = jobTitle.toLowerCase().trim();
    let baseSalary = baseSalaries[normalizedTitle] || 75000;

    // Experience multiplier
    const exp = parseInt(experience) || 0;
    const expMultiplier = 1 + exp * 0.05;

    // Education multiplier
    const eduMultipliers: Record<string, number> = {
      "PhD": 1.25,
      "Master's": 1.15,
      "Bachelor's": 1.0,
      "High School": 0.85,
    };
    const eduMultiplier = eduMultipliers[education] || 1.0;

    const estimatedSalary = Math.round(baseSalary * expMultiplier * eduMultiplier / 12);
    const minSalary = Math.round(estimatedSalary * 0.85);
    const maxSalary = Math.round(estimatedSalary * 1.2);

    // Growth projection
    const growthData = [];
    for (let i = 0; i <= 5; i++) {
      growthData.push({
        year: `Year ${i}`,
        salary: Math.round(estimatedSalary * (1 + i * 0.1)),
      });
    }

    const result = {
      estimatedSalary,
      salaryRange: { min: minSalary, max: maxSalary },
      currency: "USD",
      growthData,
    };

    // Save to database
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (user) {
      await prisma.salaryPrediction.create({
        data: {
          userId: user.id,
          jobTitle,
          experience: exp,
          education: education || null,
          location: location || null,
          skills: skills || null,
          result: result,
        },
      });
    }

    return NextResponse.json({ result });
  } catch (error) {
    console.error("Salary prediction error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
