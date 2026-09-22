import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { auth } from "@/auth";
import { dbConnect } from "@/lib/dbConnect";

export async function POST(request) {
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

    const body = await request.json();

    const {
      title,
      author,
      category,
      isbn,
      publisher,
      edition,
      pages,
      language,
      description,
      coverImage,
      condition,
    } = body;

    if (!title || !author || !category || !pages) {
      return NextResponse.json(
        {
          message:
            "Title, author, category and page count are required.",
        },
        { status: 400 }
      );
    }

    const pageCount = Number(pages);

    if (!Number.isInteger(pageCount) || pageCount <= 0) {
      return NextResponse.json(
        {
          message: "Page count must be a valid positive number.",
        },
        { status: 400 }
      );
    }

    if (title.trim().length < 2) {
      return NextResponse.json(
        {
          message: "Book title must contain at least 2 characters.",
        },
        { status: 400 }
      );
    }

    if (author.trim().length < 2) {
      return NextResponse.json(
        {
          message: "Author name must contain at least 2 characters.",
        },
        { status: 400 }
      );
    }

    const books = await dbConnect("books");

    const book = {
      title: title.trim(),
      author: author.trim(),
      category: category.trim(),

      isbn: typeof isbn === "string" ? isbn.trim() : "",
      publisher:
        typeof publisher === "string" ? publisher.trim() : "",
      edition:
        typeof edition === "string" ? edition.trim() : "",

      pages: pageCount,

      language:
        typeof language === "string"
          ? language.trim()
          : "Bangla",

      description:
        typeof description === "string"
          ? description.trim()
          : "",

      coverImage:
        typeof coverImage === "string"
          ? coverImage.trim()
          : "",

      condition:
        typeof condition === "string"
          ? condition.trim()
          : "Good",

      ownerId: new ObjectId(session.user.id),
      ownerName: session.user.name || "",
      ownerEmail: session.user.email || "",

      status: "pending",
      availability: "available",

      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await books.insertOne(book);

    return NextResponse.json(
      {
        message:
          "Book submitted successfully. Waiting for admin approval.",
        bookId: result.insertedId.toString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("ADD_BOOK_ERROR:", error);

    return NextResponse.json(
      {
        message: "Failed to add book.",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "You must be logged in." },
        { status: 401 }
      );
    }

    if (!ObjectId.isValid(session.user.id)) {
      return NextResponse.json(
        { message: "Invalid user ID." },
        { status: 400 }
      );
    }

    const books = await dbConnect("books");

    const result = await books
      .find({
        ownerId: new ObjectId(session.user.id),
      })
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
    console.error("GET_MY_BOOKS_ERROR:", error);

    return NextResponse.json(
      { message: "Failed to load your books." },
      { status: 500 }
    );
  }
}