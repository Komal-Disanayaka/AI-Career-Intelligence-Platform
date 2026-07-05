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

    const { skills, education, experience, location, industry } = await req.json();

    if (!skills) {
      return NextResponse.json({ error: "Skills are required" }, { status: 400 });
    }

    // Parse user skills
    const userSkills = skills.split(",").map((s: string) => s.trim().toLowerCase());

    // Generate recommendations based on skill matching
    const jobDatabase = [
      { title: "Software Engineer", requiredSkills: ["python", "javascript", "react", "sql", "git"], avgSalary: "$95,000/yr", companies: ["Google", "Microsoft", "Meta"] },
      { title: "Data Scientist", requiredSkills: ["python", "machine learning", "sql", "statistics", "tensorflow"], avgSalary: "$105,000/yr", companies: ["Amazon", "Netflix", "IBM"] },
      { title: "Full Stack Developer", requiredSkills: ["javascript", "react", "node.js", "mongodb", "css"], avgSalary: "$90,000/yr", companies: ["Shopify", "Stripe", "Vercel"] },
      { title: "ML Engineer", requiredSkills: ["python", "machine learning", "deep learning", "tensorflow", "docker"], avgSalary: "$120,000/yr", companies: ["OpenAI", "DeepMind", "Tesla"] },
      { title: "DevOps Engineer", requiredSkills: ["docker", "kubernetes", "aws", "linux", "ci/cd"], avgSalary: "$100,000/yr", companies: ["AWS", "DigitalOcean", "GitLab"] },
      { title: "Frontend Developer", requiredSkills: ["javascript", "react", "css", "html", "typescript"], avgSalary: "$85,000/yr", companies: ["Airbnb", "Uber", "Twitter"] },
      { title: "Backend Developer", requiredSkills: ["python", "java", "sql", "api", "microservices"], avgSalary: "$92,000/yr", companies: ["PayPal", "Salesforce", "Oracle"] },
      { title: "Data Analyst", requiredSkills: ["sql", "python", "excel", "data visualization", "statistics"], avgSalary: "$70,000/yr", companies: ["Deloitte", "Accenture", "PwC"] },
      { title: "Cloud Architect", requiredSkills: ["aws", "azure", "kubernetes", "networking", "security"], avgSalary: "$130,000/yr", companies: ["AWS", "Azure", "GCP"] },
      { title: "AI Research Scientist", requiredSkills: ["python", "deep learning", "nlp", "computer vision", "research"], avgSalary: "$140,000/yr", companies: ["Google AI", "OpenAI", "MIT"] },
    ];

    // Calculate match scores
    const results = jobDatabase
      .map((job) => {
        const matched = job.requiredSkills.filter((skill) =>
          userSkills.some((us: string) => us.includes(skill) || skill.includes(us))
        );
        const matchScore = Math.round((matched.length / job.requiredSkills.length) * 100);
        return {
          title: job.title,
          matchScore,
          avgSalary: job.avgSalary,
          requiredSkills: job.requiredSkills,
          companies: job.companies,
        };
      })
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 5);

    // Save to database
    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (user) {
      await prisma.jobRecommendation.create({
        data: {
          userId: user.id,
          skills,
          education: education || null,
          experience: experience ? parseInt(experience) : null,
          location: location || null,
          industry: industry || null,
          results: results,
        },
      });
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Job recommendation error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
