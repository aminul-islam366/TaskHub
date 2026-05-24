import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth/next";
import connect from "@/lib/dbConnect";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req, context) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { error: "Task ID is required" },
        { status: 400 },
      );
    }

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const twitterUsername = body.twitterUsername?.trim();

    if (!twitterUsername) {
      return NextResponse.json(
        { error: "Twitter username is required" },
        { status: 400 },
      );
    }

    const tasksCollection = await connect("tasks");
    const submissionsCollection = await connect("submissions");

    const task = await tasksCollection.findOne({ _id: new ObjectId(id) });
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    if (task.completions >= task.requiredCompletions) {
      return NextResponse.json({ error: "Task is full" }, { status: 400 });
    }

    const alreadySubmitted = await submissionsCollection.findOne({
      taskId: new ObjectId(id),
      submittedByEmail: session.user.email,
    });

    if (alreadySubmitted) {
      return NextResponse.json(
        { error: "You have already submitted this task" },
        { status: 400 },
      );
    }

    const newSubmission = {
      taskId: new ObjectId(id),
      taskTitle: task.title,
      taskCategory: task.category,
      taskReward: parseFloat(task.reward),
      username: twitterUsername,
      submittedBy: session.user.name,
      submittedByEmail: session.user.email,
      submittedAt: new Date(),
      status: "pending",
    };

    const result = await submissionsCollection.insertOne(newSubmission);

    await tasksCollection.updateOne(
      { _id: new ObjectId(id) },
      { $inc: { completions: 1 } },
    );

    return NextResponse.json({
      message: "Submission successful",
      submission: { ...newSubmission, _id: result.insertedId },
    });
  } catch (error) {
    console.error("Submission error:", error);
    return NextResponse.json(
      { error: "Server error: " + error.message },
      { status: 500 },
    );
  }
}
