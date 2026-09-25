"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const statusStyles = {
  pending:
    "border-yellow-500/20 bg-yellow-500/10 text-yellow-300",

  approved:
    "border-[#8BAF9D]/20 bg-[#8BAF9D]/10 text-[#B9D0C4]",

  rejected:
    "border-red-500/20 bg-red-500/10 text-red-400",
};

export default function MyBooksPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadBooks() {
      try {
        const response = await fetch("/api/books", {
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load books."
          );
        }

        setBooks(data.books || []);
      } catch (error) {
        console.error(error);

        setError(
          error.message || "Failed to load your books."
        );
      } finally {
        setLoading(false);
      }
    }

    loadBooks();
  }, []);

  return (
    <main className="min-h-screen bg-[#101D23] px-4 py-10 text-[#EDE6D6]">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#8BAF9D]">
              Your Library
            </p>

            <h1 className="mt-2 text-3xl font-black md:text-4xl">
              My Books
            </h1>

            <p className="mt-2 max-w-xl text-sm leading-6 text-[#899692]">
              Manage the books you have added to BookNest.
            </p>
          </div>

          <Link
            href="/book/add"
            className="inline-flex w-fit rounded-xl bg-[#EDE6D6] px-5 py-3 text-sm font-extrabold text-[#101D23] transition hover:bg-white"
          >
            + Add New Book
          </Link>
        </div>

        {/* Stats */}
        {!loading && !error && (
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
              <p className="text-xs font-semibold text-[#899692]">
                Total Books
              </p>

              <p className="mt-2 text-3xl font-black text-[#EDE6D6]">
                {books.length}
              </p>
            </div>

            <div className="rounded-2xl border border-yellow-500/10 bg-yellow-500/5 p-5">
              <p className="text-xs font-semibold text-[#899692]">
                Pending
              </p>

              <p className="mt-2 text-3xl font-black text-yellow-300">
                {
                  books.filter(
                    (book) => book.status === "pending"
                  ).length
                }
              </p>
            </div>

            <div className="rounded-2xl border border-[#8BAF9D]/10 bg-[#8BAF9D]/5 p-5">
              <p className="text-xs font-semibold text-[#899692]">
                Approved
              </p>

              <p className="mt-2 text-3xl font-black text-[#B9D0C4]">
                {
                  books.filter(
                    (book) => book.status === "approved"
                  ).length
                }
              </p>
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="h-72 animate-pulse rounded-2xl border border-white/10 bg-white/5"
              />
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="mt-8 rounded-2xl border border-red-500/20 bg-red-500/10 p-6">
            <p className="font-bold text-red-400">
              {error}
            </p>

            <button
              onClick={() => window.location.reload()}
              className="mt-4 rounded-lg border border-red-500/20 px-4 py-2 text-xs font-bold text-red-300 hover:bg-red-500/10"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && books.length === 0 && (
          <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 px-6 py-20 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#8BAF9D]/10 text-2xl">
              +
            </div>

            <h2 className="mt-5 text-xl font-bold">
              No books yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#899692]">
              You haven't added any books to your BookNest
              collection yet.
            </p>

            <Link
              href="/book/add"
              className="mt-6 inline-flex rounded-xl bg-[#EDE6D6] px-5 py-3 text-sm font-extrabold text-[#101D23] hover:bg-white"
            >
              Add Your First Book
            </Link>
          </div>
        )}

        {/* Books */}
        {!loading && !error && books.length > 0 && (
          <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {books.map((book) => (
              <article
                key={book._id}
                className="overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition duration-300 hover:border-white/20 hover:bg-white/[0.07]"
              >
                {/* Cover */}
                <div className="relative h-52 overflow-hidden bg-[#17262D]">
                  {book.coverImage ? (
                    <img
                      src={book.coverImage}
                      alt={book.title}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center">
                      <span className="text-5xl font-black text-white/10">
                        BN
                      </span>
                    </div>
                  )}

                  <span
                    className={`absolute right-3 top-3 rounded-full border px-3 py-1 text-[10px] font-bold capitalize backdrop-blur-md ${
                      statusStyles[book.status] ||
                      "border-white/10 bg-white/10 text-white"
                    }`}
                  >
                    {book.status}
                  </span>
                </div>

                {/* Content */}
                <div className="p-5">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#8BAF9D]">
                    {book.category}
                  </p>

                  <h2 className="mt-2 line-clamp-2 text-lg font-bold text-[#EDE6D6]">
                    {book.title}
                  </h2>

                  <p className="mt-1 text-sm text-[#899692]">
                    {book.author}
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <div className="rounded-lg bg-[#101D23] p-3">
                      <p className="text-[9px] uppercase text-[#596762]">
                        Pages
                      </p>

                      <p className="mt-1 text-xs font-bold text-[#C6D0CC]">
                        {book.pages}
                      </p>
                    </div>

                    <div className="rounded-lg bg-[#101D23] p-3">
                      <p className="text-[9px] uppercase text-[#596762]">
                        Condition
                      </p>

                      <p className="mt-1 truncate text-xs font-bold text-[#C6D0CC]">
                        {book.condition}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center justify-between">
                    <span
                      className={`text-[10px] font-semibold ${
                        book.availability === "available"
                          ? "text-[#8BAF9D]"
                          : "text-[#899692]"
                      }`}
                    >
                      {book.availability}
                    </span>

                    {book.status === "approved" && (
                      <Link
                        href={`/book/${book._id}`}
                        className="rounded-lg border border-white/10 px-3 py-2 text-[10px] font-bold text-[#AEB8B4] transition hover:bg-white/5 hover:text-[#EDE6D6]"
                      >
                        View Book
                      </Link>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}