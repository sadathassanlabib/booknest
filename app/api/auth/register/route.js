
// app/api/auth/register/route.js

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/dbConnect";

export async function POST(req) {
  try {
    const { name, email, password, phone, area } = await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Name, email, and password are required." },
        { status: 400 }
      );
    }

    const users = await dbConnect("users");

    // Email already exists?
    const existing = await users.findOne({ email });

    if (existing) {
      return NextResponse.json(
        { message: "Email already in use." },
        { status: 409 }
      );
    }

    // Password hash
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const result = await users.insertOne({
      name,
      email,
      password: hashedPassword,
      phone: phone || "",
      area: area || "",

      // Default account permissions
      role: "user",
      status: "pending",

      createdAt: new Date(),
      updatedAt: new Date(),
    });

    return NextResponse.json(
      {
        message: "User created successfully. Your account is pending approval.",
        userId: result.insertedId,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[REGISTER ERROR]", err);

    return NextResponse.json(
      { message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}

