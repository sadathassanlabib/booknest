import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";

export async function GET() {
  try {
    const books = await dbConnect("books");

    const result = await books
      .find({
        status: "approved",
        availability: "available",
      })
      .sort({ createdAt: -1 })
      .toArray();

    const formattedBooks = result.map((book) => ({
      _id: book._id.toString(),
      title: book.title || "",
      author: book.author || "",
      category: book.category || "",
      pages: book.pages || 0,
      language: book.language || "",
      description: book.description || "",
      coverImage: book.coverImage || "",
      condition: book.condition || "",
      ownerId: book.ownerId?.toString() || "",
      ownerName: book.ownerName || "",
      availability: book.availability || "available",
    }));

    return NextResponse.json({
      books: formattedBooks,
    });
  } catch (error) {
    console.error("GET_APPROVED_BOOKS_ERROR:", error);

    return NextResponse.json(
      {
        message: "Failed to load catalog.",
      },
      { status: 500 }
    );
  }
}