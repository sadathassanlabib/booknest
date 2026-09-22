import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { auth } from "@/auth";
import { dbConnect } from "@/lib/dbConnect";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "You must be logged in." },
        { status: 401 }
      );
    }

    if (session.user.status !== "approved") {
      return NextResponse.json(
        { message: "Your account is not approved yet." },
        { status: 403 }
      );
    }

    if (!ObjectId.isValid(session.user.id)) {
      return NextResponse.json(
        { message: "Invalid user ID." },
        { status: 400 }
      );
    }

    const requests = await dbConnect("requests");

    const result = await requests
      .find({
        ownerId: new ObjectId(session.user.id),
      })
      .sort({ createdAt: -1 })
      .toArray();

    const formattedRequests = result.map((request) => ({
      ...request,
      _id: request._id.toString(),
      bookId: request.bookId?.toString() || "",
      ownerId: request.ownerId?.toString() || "",
      requesterId: request.requesterId?.toString() || "",
    }));

    return NextResponse.json({
      requests: formattedRequests,
    });
  } catch (error) {
    console.error("GET_OWNER_REQUESTS_ERROR:", error);

    return NextResponse.json(
      {
        message: "Failed to load owner requests.",
      },
      { status: 500 }
    );
  }
}