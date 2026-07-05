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
        jobRecommendations: { orderBy: { createdAt: "desc" }, take: 10 },
        salaryPredictions: { orderBy: { createdAt: "desc" }, take: 10 },
        skillGapAnalyses: { orderBy: { createdAt: "desc" }, take: 10 },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Combine all history items
    const history = [
      ...user.jobRecommendations.map((item) => ({
        id: item.id,
        type: "job-recommendation",
        date: item.createdAt.toISOString(),
        summary: `Skills: ${item.skills.substring(0, 50)}...`,
      })),
      ...user.salaryPredictions.map((item) => ({
        id: item.id,
        type: "salary-prediction",
        date: item.createdAt.toISOString(),
        summary: `Job: ${item.jobTitle}`,
      })),
      ...user.skillGapAnalyses.map((item) => ({
        id: item.id,
        type: "skill-gap",
        date: item.createdAt.toISOString(),
        summary: `Target: ${item.desiredJob}`,
      })),
    ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json({ history });
  } catch (error) {
    console.error("History error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { type, data } = await req.json();

    const user = await prisma.user.findUnique({ where: { email: session.user.email } });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    await prisma.careerReport.create({
      data: {
        userId: user.id,
        reportData: { type, ...data },
      },
    });

    return NextResponse.json({ message: "Saved" }, { status: 201 });
  } catch (error) {
    console.error("Save history error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
