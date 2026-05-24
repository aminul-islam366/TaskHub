import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth/next";
import connect from "@/lib/dbConnect";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// GET all submissions for a specific task (task owner only)
export async function GET(req, context) {
  try {
    const { id } = await context.params;
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const submissionsCollection = await connect("submissions");
    const submissions = await submissionsCollection
      .find({ taskId: new ObjectId(id) })
      .sort({ submittedAt: -1 })
      .toArray();

    return NextResponse.json(submissions);
  } catch (error) {
    console.error("Get task submissions error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
