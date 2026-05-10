import { NextResponse } from "next/server";
import connect from "@/lib/dbConnect";

// GET all tasks
export async function GET(request) {
  try {
    const tasks = connect("tasks");
    const result = await tasks.find({}).toArray();
    return NextResponse.json(result);
  } catch (error) {
    console.error("Get tasks error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const taskData = await request.json();
    const tasks = connect("tasks");

    const newTask = {
      ...taskData,
      createdAt: new Date(),
    };

    const result = await tasks.insertOne(newTask);
    return NextResponse.json({ ...newTask, _id: result.insertedId });
  } catch (error) {
    console.error("POST tasks error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
