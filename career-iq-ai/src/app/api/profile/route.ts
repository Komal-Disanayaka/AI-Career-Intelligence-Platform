import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import prisma from "@/lib/prisma";

// GET - Fetch user profile
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        email: true,
        name: true,
        age: true,
        gender: true,
        education: true,
        university: true,
        degree: true,
        skills: true,
        experience: true,
        preferredIndustry: true,
        preferredCountry: true,
        resumeUrl: true,
        profilePhoto: true,
        profileComplete: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Profile fetch error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

// PUT - Update user profile
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();

    const user = await prisma.user.update({
      where: { email: session.user.email },
      data: {
        name: data.name,
        age: data.age ? parseInt(data.age) : null,
        gender: data.gender,
        education: data.education,
        university: data.university,
        degree: data.degree,
        skills: data.skills,
        experience: data.experience ? parseInt(data.experience) : null,
        preferredIndustry: data.preferredIndustry,
        preferredCountry: data.preferredCountry,
        profileComplete: true,
      },
    });

    return NextResponse.json({
      message: "Profile updated successfully",
      user: { id: user.id, profileComplete: user.profileComplete },
    });
  } catch (error) {
    console.error("Profile update error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
