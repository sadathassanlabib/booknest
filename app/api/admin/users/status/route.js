
import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { auth } from "@/auth";
import { dbConnect } from "@/lib/dbConnect";

export async function PATCH(req) {
  try {
    // Check authentication
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { message: "Unauthorized." },
        { status: 401 }
      );
    }

    // Only superadmin
    if (
      session.user.role !== "superadmin" ||
      session.user.status !== "approved"
    ) {
      return NextResponse.json(
        { message: "Forbidden." },
        { status: 403 }
      );
    }

    const body = await req.json();

    const { userId, status } = body;

    // Validate userId
    if (!userId || !ObjectId.isValid(userId)) {
      return NextResponse.json(
        { message: "Invalid user ID." },
        { status: 400 }
      );
    }

    // Validate status
    if (!["approved", "rejected"].includes(status)) {
      return NextResponse.json(
        { message: "Invalid status." },
        { status: 400 }
      );
    }

    const users = await dbConnect("users");

    // Don't allow changing superadmin
    const targetUser = await users.findOne({
      _id: new ObjectId(userId),
    });

    if (!targetUser) {
      return NextResponse.json(
        { message: "User not found." },
        { status: 404 }
      );
    }

    if (targetUser.role === "superadmin") {
      return NextResponse.json(
        { message: "Super admin cannot be modified." },
        { status: 403 }
      );
    }

    // Update user
    const result = await users.updateOne(
      {
        _id: new ObjectId(userId),
        role: "user",
      },
      {
        $set: {
          status,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: "User could not be updated." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message:
        status === "approved"
          ? "User approved successfully."
          : "User rejected successfully.",
    });
  } catch (error) {
    console.error("USER_STATUS_UPDATE_ERROR:", error);

    return NextResponse.json(
      { message: "Something went wrong." },
      { status: 500 }
    );
  }
}

