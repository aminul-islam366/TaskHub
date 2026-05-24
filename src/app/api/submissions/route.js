import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import connect from "@/lib/dbConnect";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// GET logged-in user's own submissions
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const submissionsCollection = await connect("submissions");
    const submissions = await submissionsCollection
      .find({ submittedByEmail: session.user.email })
      .sort({ submittedAt: -1 })
      .toArray();

    return NextResponse.json(submissions);
  } catch (error) {
    console.error("Get submissions error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
