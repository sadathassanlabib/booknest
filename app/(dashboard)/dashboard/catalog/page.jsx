"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export default function CatalogPage() {
  const [books, setBooks] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadBooks() {
      try {
        const response = await fetch(
          "/api/books/approved",
          {
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Failed to load books."
          );
        }

        setBooks(data.books || []);
      } catch (error) {
        console.error(error);

        setError(
          error.message ||
            "Failed to load catalog."
        );
      } finally {
        setLoading(false);
      }
    }

    loadBooks();
  }, []);

  const categories = useMemo(() => {
    const values = books
      .map((book) => book.category)
      .filter(Boolean);

    return [...new Set(values)];
  }, [books]);

  const filteredBooks = useMemo(() => {
    const query = search
      .toLowerCase()
      .trim();

    return books.filter((book) => {
      const matchesSearch =
        !query ||
        book.title
          ?.toLowerCase()
          .includes(query) ||
        book.author
          ?.toLowerCase()
          .includes(query) ||
        book.ownerName
          ?.toLowerCase()
          .includes(query);

      const matchesCategory =
        category === "all" ||
        book.category === category;

      return (
        matchesSearch &&
        matchesCategory
      );
    });
  }, [books, search, category]);

  return (
    <main className="min-h-screen bg-[#101D23] px-4 py-10 text-[#EDE6D6]">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#8BAF9D]">
              BookNest Library
            </p>

            <h1 className="mt-2 text-3xl font-black md:text-5xl">
              Explore Books
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-[#899692]">
              Discover books shared by BookNest
              members. Only approved books appear
              in the public catalog.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-3">
            <p className="text-[10px] uppercase tracking-wider text-[#596762]">
              Available Books
            </p>

            <p className="mt-1 text-2xl font-black">
              {books.length}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="grid gap-3 md:grid-cols-[1fr_220px]">
            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search by title, author or owner..."
              className="rounded-xl border border-white/10 bg-[#101D23] px-4 py-3 text-sm text-[#EDE6D6] outline-none placeholder:text-[#596762] focus:border-[#8BAF9D]/50"
            />

            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
              className="rounded-xl border border-white/10 bg-[#101D23] px-4 py-3 text-sm text-[#EDE6D6] outline-none"
            >
              <option value="all">
                All Categories
              </option>

              {categories.map((item) => (
                <option
                  key={item}
                  value={item}
                >
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div className="mt-3 text-xs text-[#899692]">
            Showing {filteredBooks.length} of{" "}
            {books.length} books
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-96 animate-pulse rounded-2xl border border-white/10 bg-white/5"
              />
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="mt-8 rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-red-400">
            {error}
          </div>
        )}

        {/* Empty */}
        {!loading &&
          !error &&
          filteredBooks.length === 0 && (
            <div className="mt-8 rounded-2xl border border-white/10 bg-white/5 px-6 py-20 text-center">
              <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-[#8BAF9D]/10 text-xl font-black text-[#8BAF9D]">
                BN
              </div>

              <h2 className="mt-5 text-xl font-bold">
                No books found
              </h2>

              <p className="mt-2 text-sm text-[#899692]">
                Try another search or category.
              </p>
            </div>
          )}

        {/* Books */}
        {!loading &&
          !error &&
          filteredBooks.length > 0 && (
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredBooks.map((book) => (
                <article
                  key={book._id}
                  className="group overflow-hidden rounded-2xl border border-white/10 bg-white/5 transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.07]"
                >
                  {/* Cover */}
                  <div className="relative h-64 overflow-hidden bg-[#17262D]">
                    {book.coverImage ? (
                      <img
                        src={book.coverImage}
                        alt={book.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <span className="text-6xl font-black text-white/10">
                          BN
                        </span>
                      </div>
                    )}

                    <div className="absolute left-3 top-3 rounded-full border border-[#8BAF9D]/20 bg-[#101D23]/80 px-3 py-1 text-[10px] font-bold text-[#B9D0C4] backdrop-blur-md">
                      Available
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#8BAF9D]">
                      {book.category}
                    </p>

                    <h2 className="mt-2 line-clamp-2 text-lg font-bold">
                      {book.title}
                    </h2>

                    <p className="mt-1 text-sm text-[#899692]">
                      {book.author}
                    </p>

                    <div className="mt-4 flex gap-2">
                      <div className="flex-1 rounded-lg bg-[#101D23] p-3">
                        <p className="text-[9px] uppercase text-[#596762]">
                          Pages
                        </p>

                        <p className="mt-1 text-xs font-bold">
                          {book.pages}
                        </p>
                      </div>

                      <div className="flex-1 rounded-lg bg-[#101D23] p-3">
                        <p className="text-[9px] uppercase text-[#596762]">
                          Language
                        </p>

                        <p className="mt-1 truncate text-xs font-bold">
                          {book.language}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 border-t border-white/10 pt-4">
                      <p className="text-[9px] uppercase tracking-wider text-[#596762]">
                        Shared by
                      </p>

                      <p className="mt-1 truncate text-xs font-semibold text-[#C6D0CC]">
                        {book.ownerName ||
                          "BookNest Member"}
                      </p>
                    </div>

                    <Link
                      href={`/book/${book._id}`}
                      className="mt-4 block rounded-xl border border-white/10 px-4 py-3 text-center text-xs font-bold text-[#AEB8B4] transition hover:bg-white/5 hover:text-[#EDE6D6]"
                    >
                      View Book
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
      </div>
    </main>
  );
}