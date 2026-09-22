"use client";

import { useMemo, useState } from "react";
import BookCard from "@/components/books/BookCard";
import { demoBooks } from "@/lib/demoBooks";

const CatalogClient = () => {
  const [search, setSearch] = useState("");
  const [genre, setGenre] = useState("");
  const [availability, setAvailability] = useState("");
  const [sort, setSort] = useState("latest");

  const filteredBooks = useMemo(() => {
    const query = search.trim().toLowerCase();

    let result = demoBooks.filter((book) => {
      const matchesSearch =
        !query ||
        book.title.toLowerCase().includes(query) ||
        book.author.toLowerCase().includes(query) ||
        book.owner.toLowerCase().includes(query) ||
        book.genre.toLowerCase().includes(query);

      const matchesGenre =
        !genre || book.genre === genre;

      const matchesAvailability =
        !availability ||
        book.availability === availability;

      return (
        matchesSearch &&
        matchesGenre &&
        matchesAvailability
      );
    });

    if (sort === "price") {
      result = [...result].sort(
        (a, b) => a.monthlyRate - b.monthlyRate
      );
    }

    if (sort === "rating") {
      result = [...result].sort(
        (a, b) => b.rating - a.rating
      );
    }

    return result;
  }, [search, genre, availability, sort]);

  const clearFilters = () => {
    setSearch("");
    setGenre("");
    setAvailability("");
    setSort("latest");
  };

  return (
    <>
      {/* Filters */}
      <div className="mb-5 flex flex-wrap gap-2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search title, author, or owner..."
          className="min-w-[270px] flex-1 rounded-xl border border-[#e7ebe7] bg-white px-3 py-2.5 text-[11px] outline-none transition focus:border-[#214b3a]"
        />

        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          className="rounded-xl border border-[#e7ebe7] bg-white px-3 py-2.5 text-[11px] outline-none"
        >
          <option value="">
            All genres
          </option>

          <option value="Bengali classic">
            Bengali classic
          </option>

          <option value="Islamic">
            Islamic
          </option>

          <option value="History">
            History
          </option>

          <option value="Self-help">
            Self-help
          </option>

          <option value="Technology">
            Technology
          </option>
        </select>

        <select
          value={availability}
          onChange={(e) =>
            setAvailability(e.target.value)
          }
          className="rounded-xl border border-[#e7ebe7] bg-white px-3 py-2.5 text-[11px] outline-none"
        >
          <option value="">
            Any availability
          </option>

          <option value="Available">
            Available
          </option>

          <option value="On loan">
            On loan
          </option>
        </select>

        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="rounded-xl border border-[#e7ebe7] bg-white px-3 py-2.5 text-[11px] outline-none"
        >
          <option value="latest">
            Latest added
          </option>

          <option value="price">
            Lowest rate
          </option>

          <option value="rating">
            Highest rated
          </option>
        </select>

        {(search || genre || availability) && (
          <button
            onClick={clearFilters}
            className="rounded-xl border border-[#e7ebe7] bg-white px-3 py-2.5 text-[11px] font-bold text-[#69736d] hover:bg-[#f0f3ef]"
          >
            Clear
          </button>
        )}
      </div>

      {/* Result count */}
      <div className="mb-4 text-[10px] text-[#69736d]">
        Showing{" "}
        <span className="font-extrabold text-[#214b3a]">
          {filteredBooks.length}
        </span>{" "}
        book{filteredBooks.length === 1 ? "" : "s"}
      </div>

      {/* Books */}
      {filteredBooks.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {filteredBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-[#e7ebe7] bg-white px-5 py-16 text-center">
          <div className="text-2xl">
            ⌕
          </div>

          <h3 className="mt-3 text-sm font-extrabold">
            No books found
          </h3>

          <p className="mt-1 text-[10px] text-[#69736d]">
            Try a different title, author, genre,
            or availability filter.
          </p>
        </div>
      )}
    </>
  );
};

export default CatalogClient;