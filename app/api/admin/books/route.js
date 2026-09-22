import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { auth } from "@/auth";
import { dbConnect } from "@/lib/dbConnect";

async function checkSuperAdmin() {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      authorized: false,
      response: NextResponse.json(
        { message: "You must be logged in." },
        { status: 401 }
      ),
    };
  }

  if (
    session.user.status !== "approved" ||
    session.user.role !== "superadmin"
  ) {
    return {
      authorized: false,
      response: NextResponse.json(
        { message: "Superadmin access required." },
        { status: 403 }
      ),
    };
  }

  return {
    authorized: true,
    session,
  };
}

/* =========================
   GET
   ========================= */

export async function GET() {
  try {
    const access = await checkSuperAdmin();

    if (!access.authorized) {
      return access.response;
    }

    const books = await dbConnect("books");

    const result = await books
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    const formattedBooks = result.map((book) => ({
      ...book,
      _id: book._id.toString(),
      ownerId: book.ownerId?.toString() || "",
    }));

    return NextResponse.json({
      books: formattedBooks,
    });
  } catch (error) {
    console.error("ADMIN_GET_BOOKS_ERROR:", error);

    return NextResponse.json(
      {
        message: "Failed to load books.",
      },
      { status: 500 }
    );
  }
}

/* =========================
   PATCH
   ========================= */

export async function PATCH(request) {
  try {
    const access = await checkSuperAdmin();

    if (!access.authorized) {
      return access.response;
    }

    const body = await request.json();

    const { bookId, action } = body;

    if (!bookId || !ObjectId.isValid(bookId)) {
      return NextResponse.json(
        {
          message: "Invalid book ID.",
        },
        { status: 400 }
      );
    }

    const allowedActions = [
      "approve",
      "reject",
    ];

    if (!allowedActions.includes(action)) {
      return NextResponse.json(
        {
          message: "Invalid action.",
        },
        { status: 400 }
      );
    }

    const books = await dbConnect("books");

    const book = await books.findOne({
      _id: new ObjectId(bookId),
    });

    if (!book) {
      return NextResponse.json(
        {
          message: "Book not found.",
        },
        { status: 404 }
      );
    }

    if (action === "approve") {
      const result = await books.updateOne(
        {
          _id: new ObjectId(bookId),
        },
        {
          $set: {
            status: "approved",
            availability: "available",
            approvedAt: new Date(),
            approvedBy: new ObjectId(
              access.session.user.id
            ),
            updatedAt: new Date(),
          },
        }
      );

      if (result.matchedCount === 0) {
        return NextResponse.json(
          {
            message: "Book could not be updated.",
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        message: "Book approved successfully.",
      });
    }

    if (action === "reject") {
      const result = await books.updateOne(
        {
          _id: new ObjectId(bookId),
        },
        {
          $set: {
            status: "rejected",
            availability: "unavailable",
            rejectedAt: new Date(),
            rejectedBy: new ObjectId(
              access.session.user.id
            ),
            updatedAt: new Date(),
          },
        }
      );

      if (result.matchedCount === 0) {
        return NextResponse.json(
          {
            message: "Book could not be updated.",
          },
          { status: 404 }
        );
      }

      return NextResponse.json({
        message: "Book rejected successfully.",
      });
    }

    return NextResponse.json(
      {
        message: "Invalid action.",
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("ADMIN_UPDATE_BOOK_ERROR:", error);

    return NextResponse.json(
      {
        message: "Failed to update book.",
      },
      { status: 500 }
    );
  }
}

/* =========================
   DELETE
   ========================= */

export async function DELETE(request) {
  try {
    const access = await checkSuperAdmin();

    if (!access.authorized) {
      return access.response;
    }

    const body = await request.json();

    const { bookId } = body;

    if (!bookId || !ObjectId.isValid(bookId)) {
      return NextResponse.json(
        {
          message: "Invalid book ID.",
        },
        { status: 400 }
      );
    }

    const books = await dbConnect("books");

    const result = await books.deleteOne({
      _id: new ObjectId(bookId),
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        {
          message: "Book not found.",
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Book deleted successfully.",
    });
  } catch (error) {
    console.error("ADMIN_DELETE_BOOK_ERROR:", error);

    return NextResponse.json(
      {
        message: "Failed to delete book.",
      },
      { status: 500 }
    );
  }
}