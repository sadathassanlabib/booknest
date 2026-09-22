import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { auth } from "@/auth";
import { dbConnect } from "@/lib/dbConnect";

/*
 * GET PROFILE
 */
export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          message: "Unauthorized.",
        },
        {
          status: 401,
        }
      );
    }

    if (!ObjectId.isValid(session.user.id)) {
      return NextResponse.json(
        {
          message: "Invalid user ID.",
        },
        {
          status: 400,
        }
      );
    }

    const users = await dbConnect("users");

    const user = await users.findOne(
      {
        _id: new ObjectId(session.user.id),
      },
      {
        projection: {
          password: 0,
          resetToken: 0,
          resetTokenExpiry: 0,
        },
      }
    );

    if (!user) {
      return NextResponse.json(
        {
          message: "User not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        area: user.area || "",
        role: user.role || "user",
        status: user.status || "pending",
        image: user.image || "",
      },
    });
  } catch (error) {
    console.error(
      "GET_PROFILE_ERROR:",
      error
    );

    return NextResponse.json(
      {
        message: "Failed to load profile.",
      },
      {
        status: 500,
      }
    );
  }
}


/*
 * UPDATE PROFILE
 */
export async function PATCH(request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          message: "Unauthorized.",
        },
        {
          status: 401,
        }
      );
    }

    if (!ObjectId.isValid(session.user.id)) {
      return NextResponse.json(
        {
          message: "Invalid user ID.",
        },
        {
          status: 400,
        }
      );
    }

    const body = await request.json();

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    const phone =
      typeof body.phone === "string"
        ? body.phone.trim()
        : "";

    const area =
      typeof body.area === "string"
        ? body.area.trim()
        : "";

    /*
     * Validation
     */

    if (!name) {
      return NextResponse.json(
        {
          message: "Full name is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (name.length < 2) {
      return NextResponse.json(
        {
          message:
            "Name must contain at least 2 characters.",
        },
        {
          status: 400,
        }
      );
    }

    if (name.length > 80) {
      return NextResponse.json(
        {
          message: "Name is too long.",
        },
        {
          status: 400,
        }
      );
    }

    if (phone.length > 30) {
      return NextResponse.json(
        {
          message: "Phone number is too long.",
        },
        {
          status: 400,
        }
      );
    }

    if (area.length > 120) {
      return NextResponse.json(
        {
          message: "Area is too long.",
        },
        {
          status: 400,
        }
      );
    }

    const users = await dbConnect("users");

    const result = await users.updateOne(
      {
        _id: new ObjectId(session.user.id),
      },
      {
        $set: {
          name,
          phone,
          area,
          updatedAt: new Date(),
        },
      }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        {
          message: "User not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      message: "Profile updated successfully.",

      user: {
        name,
        phone,
        area,
      },
    });
  } catch (error) {
    console.error(
      "UPDATE_PROFILE_ERROR:",
      error
    );

    return NextResponse.json(
      {
        message: "Failed to update profile.",
      },
      {
        status: 500,
      }
    );
  }
}