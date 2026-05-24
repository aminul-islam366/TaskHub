import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getServerSession } from "next-auth/next";
import connect from "@/lib/dbConnect";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

// PATCH - approve or reject a submission
export async function PATCH(req, context) {
  try {
    const { id, submissionId } = await context.params;
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { action } = await req.json();
    if (!["approve", "reject"].includes(action)) {
      return NextResponse.json({ error: "Invalid action" }, { status: 400 });
    }

    // Verify the task belongs to the session user
    const tasksCollection = await connect("tasks");
    const task = await tasksCollection.findOne({ _id: new ObjectId(id) });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    if (task.createdBy !== session.user.email) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const submissionsCollection = await connect("submissions");
    const result = await submissionsCollection.updateOne(
      { _id: new ObjectId(submissionId) },
      { $set: { status: action === "approve" ? "approved" : "rejected" } },
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Submission not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ message: `Submission ${action}d successfully` });
  } catch (error) {
    console.error("Update submission error:", error);
    return NextResponse.json(
      { error: "Server error: " + error.message },
      { status: 500 },
    );
  }
}
