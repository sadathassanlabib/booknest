import { NextResponse } from "next/server";
import crypto from "crypto";
import { dbConnect } from "@/lib/dbConnect";
import { sendPasswordResetEmail } from "@/lib/sendEmail";

export async function POST(req) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        {
          message: "Email is required.",
        },
        { status: 400 }
      );
    }

    const normalizedEmail = email.toLowerCase().trim();

    const users = await dbConnect("users");

    const user = await users.findOne({
      email: normalizedEmail,
    });

    /*
      Security:
      We do not reveal whether an email exists
      in the database.
    */
    if (!user) {
      return NextResponse.json({
        message:
          "If an account exists with this email, a password reset link has been sent.",
      });
    }

    // Generate secure random token
    const rawToken = crypto.randomBytes(32).toString("hex");

    // Hash token before storing it in MongoDB
    const hashedToken = crypto
      .createHash("sha256")
      .update(rawToken)
      .digest("hex");

    // Token expires after 15 minutes
    const tokenExpiry = new Date(
      Date.now() + 15 * 60 * 1000
    );

    await users.updateOne(
      { _id: user._id },
      {
        $set: {
          resetPasswordToken: hashedToken,
          resetPasswordTokenExpiry: tokenExpiry,
          updatedAt: new Date(),
        },
      }
    );

    const appUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      "http://localhost:3000";

    const resetUrl =
      `${appUrl}/reset-password?token=${rawToken}`;

    const emailResult = await sendPasswordResetEmail({
      email: user.email,
      name: user.name,
      resetUrl,
    });

    if (!emailResult.success) {
      console.error(
        "RESEND_EMAIL_ERROR:",
        emailResult.error
      );

      return NextResponse.json(
        {
          message:
            "Unable to send reset email. Please try again later.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message:
        "If an account exists with this email, a password reset link has been sent.",
    });
  } catch (error) {
    console.error(
      "FORGOT_PASSWORD_ERROR:",
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