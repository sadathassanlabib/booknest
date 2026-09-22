import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { auth } from "@/auth";
import { dbConnect } from "@/lib/dbConnect";

async function getSuperadminSession() {
  const session = await auth();

  if (!session?.user) {
    return {
      error: NextResponse.json(
        { message: "Unauthorized." },
        { status: 401 }
      ),
    };
  }

  if (
    session.user.role !== "superadmin" ||
    session.user.status !== "approved"
  ) {
    return {
      error: NextResponse.json(
        { message: "Forbidden." },
        { status: 403 }
      ),
    };
  }

  return { session };
}

// GET USERS
export async function GET() {
  try {
    const authResult = await getSuperadminSession();

    if (authResult.error) {
      return authResult.error;
    }

    const users = await dbConnect("users");

    const data = await users
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    const serializedUsers = data.map((user) => ({
      _id: user._id.toString(),
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      area: user.area || "",
      role: user.role || "user",
      status: user.status || "pending",
      createdAt: user.createdAt
        ? new Date(user.createdAt).toISOString()
        : null,
    }));

    return NextResponse.json({
      users: serializedUsers,
    });
  } catch (error) {
    console.error("GET_USERS_ERROR:", error);

    return NextResponse.json(
      {
        message: "Failed to load users.",
      },
      { status: 500 }
    );
  }
}

// CHANGE ROLE / DELETE USER
export async function PATCH(req) {
  try {
    const authResult = await getSuperadminSession();

    if (authResult.error) {
      return authResult.error;
    }

    const { userId, role } = await req.json();

    if (!userId || !ObjectId.isValid(userId)) {
      return NextResponse.json(
        {
          message: "Invalid user ID.",
        },
        { status: 400 }
      );
    }

    const allowedRoles = [
      "user",
      "moderator",
      "superadmin",
    ];

    if (!allowedRoles.includes(role)) {
      return NextResponse.json(
        {
          message: "Invalid role.",
        },
        { status: 400 }
      );
    }

    const users = await dbConnect("users");

    const targetUser = await users.findOne({
      _id: new ObjectId(userId),
    });

    if (!targetUser) {
      return NextResponse.json(
        {
          message: "User not found.",
        },
        { status: 404 }
      );
    }

    // Prevent changing your own role
    if (targetUser.email === authResult.session.user.email) {
      return NextResponse.json(
        {
          message:
            "You cannot change your own role.",
        },
        { status: 400 }
      );
    }

    const result = await users.updateOne(
      {
        _id: new ObjectId(userId),
      },
      {
        $set: {
          role,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        {
          message: "User not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "User role updated successfully.",
    });
  } catch (error) {
    console.error("UPDATE_ROLE_ERROR:", error);

    return NextResponse.json(
      {
        message: "Failed to update user role.",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    const authResult = await getSuperadminSession();

    if (authResult.error) {
      return authResult.error;
    }

    const { userId } = await req.json();

    if (!userId || !ObjectId.isValid(userId)) {
      return NextResponse.json(
        {
          message: "Invalid user ID.",
        },
        { status: 400 }
      );
    }

    const users = await dbConnect("users");

    const targetUser = await users.findOne({
      _id: new ObjectId(userId),
    });

    if (!targetUser) {
      return NextResponse.json(
        {
          message: "User not found.",
        },
        { status: 404 }
      );
    }

    // Never allow superadmin to delete themselves
    if (targetUser.email === authResult.session.user.email) {
      return NextResponse.json(
        {
          message:
            "You cannot delete your own account.",
        },
        { status: 400 }
      );
    }

    // Prevent deleting another superadmin
    if (targetUser.role === "superadmin") {
      return NextResponse.json(
        {
          message:
            "Another superadmin cannot be deleted from here.",
        },
        { status: 400 }
      );
    }

    const result = await users.deleteOne({
      _id: new ObjectId(userId),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        {
          message: "User could not be deleted.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "User deleted successfully.",
    });
  } catch (error) {
    console.error("DELETE_USER_ERROR:", error);

    return NextResponse.json(
      {
        message: "Failed to delete user.",
      },
      { status: 500 }
    );
  }
}