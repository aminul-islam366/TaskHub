import connect from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { name, email, password } = await request.json();

    const usersCollection = connect("users");

    // Check if user already exists
    const existingUser = await usersCollection.findOne({ email });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 },
      );
    }

    // Create new user
    const newUser = {
      name,
      email,
      password,
      createdAt: new Date(),
    };

    await usersCollection.insertOne(newUser);

    return NextResponse.json({
      message: "User registered successfully",
      user: { email: newUser.email, name: newUser.name },
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
