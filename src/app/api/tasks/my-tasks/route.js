import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import connect from "@/lib/dbConnect";
import { authOptions } from "../../auth/[...nextauth]/route";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const tasksCollection = connect("tasks");
    const tasks = await tasksCollection
      .find({ createdBy: session.user.email })
      .toArray();

    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Get my tasks error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
