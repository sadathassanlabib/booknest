import React from "react";
import { dbConnect } from "@/lib/dbConnect";
import BookCard from "@/components/books/BookCard";

const BooksPage = async () => {
  const booksCollection = await dbConnect("books");

  const books = await booksCollection
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  return (
    <main className="min-h-screen bg-[#050505] px-4 py-16 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-10">
          <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-white/40">
            Books World
          </p>

          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            Explore Books
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-white/50 sm:text-base">
            Discover books from our collection and find something worth reading.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-8 flex items-center justify-between border-b border-white/10 pb-5">
          <p className="text-sm text-white/50">
            <span className="font-medium text-white">
              {books.length}
            </span>{" "}
            books available
          </p>
        </div>

        {/* Books */}
        {books.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {books.map((book) => (
              <BookCard
                key={book._id.toString()}
                book={{
                  ...book,
                  _id: book._id.toString(),
                }}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-white/10 py-20 text-center">
            <p className="text-lg font-medium text-white/70">
              No books found
            </p>

            <p className="mt-2 text-sm text-white/40">
              Books will appear here once they are added.
            </p>
          </div>
        )}
      </div>
    </main>
  );
};

export default BooksPage;