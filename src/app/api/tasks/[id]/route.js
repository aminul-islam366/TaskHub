import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import connect from "@/lib/dbConnect";

export async function GET(req, context) {
  try {
    console.log("context  this is ", context.id);

    const params = await context.params;
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const tasksCollection = connect("tasks");

    const task = await tasksCollection.findOne({ _id: new ObjectId(id) });

    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json(task);
  } catch (error) {
    console.error("Get task error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

// DELETE task

export async function DELETE(req, context) {
  try {
    const params = await context.params;
    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const tasksCollection = connect("tasks");

    const result = await tasksCollection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Task deleted successfully",
      deletedCount: result.deletedCount,
    });
  } catch (error) {
    console.error("Delete task error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
