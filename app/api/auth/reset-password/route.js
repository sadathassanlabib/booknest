import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { dbConnect } from "@/lib/dbConnect";

export async function POST(req) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json(
        {
          message:
            "Token and password are required.",
        },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        {
          message:
            "Password must be at least 8 characters long.",
        },
        { status: 400 }
      );
    }

    // Hash the token received from the URL
    const hashedToken = crypto
      .createHash("sha256")
      .update(token)
      .digest("hex");

    const users = await dbConnect("users");

    // Find user with valid, non-expired token
    const user = await users.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordTokenExpiry: {
        $gt: new Date(),
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          message:
            "This reset link is invalid or has expired.",
        },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(
      password,
      10
    );

    // Update password and remove reset token
    await users.updateOne(
      { _id: user._id },
      {
        $set: {
          password: hashedPassword,
          updatedAt: new Date(),
        },
        $unset: {
          resetPasswordToken: "",
          resetPasswordTokenExpiry: "",
        },
      }
    );

    return NextResponse.json({
      message:
        "Password reset successfully. You can now log in.",
    });
  } catch (error) {
    console.error(
      "RESET_PASSWORD_ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Something went wrong. Please try again.",
      },
      { status: 500 }
    );
  }
}