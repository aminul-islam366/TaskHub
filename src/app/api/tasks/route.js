import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import connect from "@/lib/dbConnect";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  try {
    const tasks = await connect("tasks");
    const result = await tasks.find({}).toArray();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Get tasks error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const taskData = await request.json();
    const tasks = await connect("tasks");

    const newTask = {
      ...taskData,
      completions: 0,
      createdBy: session.user.email,
      createdByName: session.user.name,
      createdAt: new Date(),
    };

    const result = await tasks.insertOne(newTask);
    return NextResponse.json({ ...newTask, _id: result.insertedId });
  } catch (error) {
    console.error("POST tasks error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
