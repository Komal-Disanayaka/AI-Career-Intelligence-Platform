import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      include: {
        jobRecommendations: { orderBy: { createdAt: "desc" }, take: 1 },
        salaryPredictions: { orderBy: { createdAt: "desc" }, take: 1 },
        skillGapAnalyses: { orderBy: { createdAt: "desc" }, take: 1 },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const report = {
      profile: {
        Name: user.name || "N/A",
        Email: user.email,
        Education: user.education || "N/A",
        Experience: user.experience ? `${user.experience} years` : "N/A",
        Skills: user.skills || "N/A",
        Industry: user.preferredIndustry || "N/A",
      },
      jobRecommendation: user.jobRecommendations[0]?.results || null,
      salaryPrediction: user.salaryPredictions[0]?.result || null,
      skillGap: user.skillGapAnalyses[0]?.result || null,
    };

    return NextResponse.json(report);
  } catch (error) {
    console.error("Report error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
