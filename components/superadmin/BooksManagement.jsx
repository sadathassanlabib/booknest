"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

const statusStyles = {
  pending:
    "border-yellow-500/20 bg-yellow-500/10 text-yellow-300",

  approved:
    "border-[#8BAF9D]/20 bg-[#8BAF9D]/10 text-[#B9D0C4]",

  rejected:
    "border-red-500/20 bg-red-500/10 text-red-400",
};

export default function BooksManagement({
  books = [],
}) {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("all");

  const [loadingId, setLoadingId] =
    useState(null);

  const [selectedBook, setSelectedBook] =
    useState(null);

  const [deleteBook, setDeleteBook] =
    useState(null);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

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
          .includes(query) ||
        book.ownerEmail
          ?.toLowerCase()
          .includes(query);

      const matchesStatus =
        statusFilter === "all" ||
        book.status === statusFilter;

      return (
        matchesSearch &&
        matchesStatus
      );
    });
  }, [
    books,
    search,
    statusFilter,
  ]);

  const pendingCount = books.filter(
    (book) => book.status === "pending"
  ).length;

  const approvedCount = books.filter(
    (book) => book.status === "approved"
  ).length;

  const rejectedCount = books.filter(
    (book) => book.status === "rejected"
  ).length;

  async function updateBook(
    bookId,
    action
  ) {
    setLoadingId(bookId);
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        "/api/admin/books",
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            bookId,
            action,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update book."
        );
      }

      setMessage(data.message);
      setSelectedBook(null);

      router.refresh();
    } catch (error) {
      console.error(error);

      setError(
        error.message ||
          "Failed to update book."
      );
    } finally {
      setLoadingId(null);
    }
  }

  async function handleDelete() {
    if (!deleteBook) return;

    setLoadingId(deleteBook._id);
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        "/api/admin/books",
        {
          method: "DELETE",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            bookId:
              deleteBook._id,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to delete book."
        );
      }

      setDeleteBook(null);
      setMessage(data.message);

      router.refresh();
    } catch (error) {
      console.error(error);

      setError(
        error.message ||
          "Failed to delete book."
      );
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <>
      <div className="space-y-6">

        {/* Header */}
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#8BAF9D]">
              Superadmin
            </p>

            <h1 className="mt-2 text-3xl font-black">
              Book Management
            </h1>

            <p className="mt-2 text-sm text-[#899692]">
              Review and manage books submitted
              by BookNest members.
            </p>
          </div>

          <div className="text-sm text-[#899692]">
            {filteredBooks.length} of{" "}
            {books.length} books
          </div>
        </div>

        {/* Messages */}
        {message && (
          <div className="rounded-xl border border-[#8BAF9D]/20 bg-[#8BAF9D]/10 px-4 py-3 text-sm text-[#B9D0C4]">
            {message}
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Stats */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs text-[#899692]">
              Total Books
            </p>

            <p className="mt-2 text-3xl font-black">
              {books.length}
            </p>
          </div>

          <div className="rounded-2xl border border-yellow-500/10 bg-yellow-500/5 p-5">
            <p className="text-xs text-[#899692]">
              Pending
            </p>

            <p className="mt-2 text-3xl font-black text-yellow-300">
              {pendingCount}
            </p>
          </div>

          <div className="rounded-2xl border border-[#8BAF9D]/10 bg-[#8BAF9D]/5 p-5">
            <p className="text-xs text-[#899692]">
              Approved
            </p>

            <p className="mt-2 text-3xl font-black text-[#B9D0C4]">
              {approvedCount}
            </p>
          </div>

          <div className="rounded-2xl border border-red-500/10 bg-red-500/5 p-5">
            <p className="text-xs text-[#899692]">
              Rejected
            </p>

            <p className="mt-2 text-3xl font-black text-red-400">
              {rejectedCount}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="grid gap-3 md:grid-cols-2">
            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search book, author or owner..."
              className="rounded-xl border border-white/10 bg-[#101D23] px-4 py-3 text-sm text-[#EDE6D6] outline-none placeholder:text-[#596762] focus:border-[#8BAF9D]/50"
            />

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(
                  e.target.value
                )
              }
              className="rounded-xl border border-white/10 bg-[#101D23] px-4 py-3 text-sm text-[#EDE6D6] outline-none"
            >
              <option value="all">
                All Status
              </option>

              <option value="pending">
                Pending
              </option>

              <option value="approved">
                Approved
              </option>

              <option value="rejected">
                Rejected
              </option>
            </select>
          </div>
        </div>

        {/* Books */}
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {filteredBooks.map((book) => (
            <article
              key={book._id}
              className="overflow-hidden rounded-2xl border border-white/10 bg-white/5"
            >
              {/* Cover */}
              <div className="relative h-52 bg-[#17262D]">
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
                    statusStyles[
                      book.status
                    ] ||
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

                <h2 className="mt-2 line-clamp-2 text-lg font-bold">
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

                    <p className="mt-1 text-xs font-bold">
                      {book.pages}
                    </p>
                  </div>

                  <div className="rounded-lg bg-[#101D23] p-3">
                    <p className="text-[9px] uppercase text-[#596762]">
                      Condition
                    </p>

                    <p className="mt-1 truncate text-xs font-bold">
                      {book.condition}
                    </p>
                  </div>
                </div>

                {/* Owner */}
                <div className="mt-4 border-t border-white/10 pt-4">
                  <p className="text-[9px] uppercase tracking-wider text-[#596762]">
                    Owner
                  </p>

                  <p className="mt-1 text-xs font-semibold text-[#C6D0CC]">
                    {book.ownerName ||
                      "Unknown"}
                  </p>

                  <p className="mt-1 break-all text-[10px] text-[#899692]">
                    {book.ownerEmail}
                  </p>
                </div>

                {/* Actions */}
                <div className="mt-5 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setSelectedBook(
                        book
                      )
                    }
                    className="flex-1 rounded-lg border border-white/10 px-3 py-2.5 text-xs font-bold text-[#AEB8B4] transition hover:bg-white/5 hover:text-[#EDE6D6]"
                  >
                    Details
                  </button>

                  {book.status ===
                    "pending" && (
                    <>
                      <button
                        type="button"
                        disabled={
                          loadingId ===
                          book._id
                        }
                        onClick={() =>
                          updateBook(
                            book._id,
                            "approve"
                          )
                        }
                        className="rounded-lg bg-[#8BAF9D] px-3 py-2.5 text-xs font-extrabold text-[#101D23] disabled:opacity-50"
                      >
                        {loadingId ===
                        book._id
                          ? "..."
                          : "Approve"}
                      </button>

                      <button
                        type="button"
                        disabled={
                          loadingId ===
                          book._id
                        }
                        onClick={() =>
                          updateBook(
                            book._id,
                            "reject"
                          )
                        }
                        className="rounded-lg border border-red-500/20 px-3 py-2.5 text-xs font-bold text-red-400 hover:bg-red-500/10 disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </>
                  )}

                  <button
                    type="button"
                    disabled={
                      loadingId ===
                      book._id
                    }
                    onClick={() =>
                      setDeleteBook(
                        book
                      )
                    }
                    className="rounded-lg border border-red-500/20 px-3 py-2.5 text-xs font-bold text-red-400 hover:bg-red-500/10 disabled:opacity-50"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Empty */}
        {filteredBooks.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/5 px-6 py-16 text-center">
            <h2 className="font-bold">
              No books found
            </h2>

            <p className="mt-1 text-sm text-[#899692]">
              Try changing your search or
              status filter.
            </p>
          </div>
        )}
      </div>

      {/* Details Modal */}
      {selectedBook && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-5 py-8 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl border border-white/10 bg-[#17262D] p-6 shadow-2xl">

            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#8BAF9D]">
                  Book Details
                </p>

                <h2 className="mt-2 text-2xl font-black">
                  {selectedBook.title}
                </h2>

                <p className="mt-1 text-sm text-[#899692]">
                  {selectedBook.author}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedBook(null)
                }
                className="grid h-9 w-9 place-items-center rounded-lg border border-white/10 text-[#AEB8B4] hover:bg-white/5"
              >
                ×
              </button>
            </div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <Detail
                label="Category"
                value={selectedBook.category}
              />

              <Detail
                label="Pages"
                value={selectedBook.pages}
              />

              <Detail
                label="Language"
                value={selectedBook.language}
              />

              <Detail
                label="Condition"
                value={selectedBook.condition}
              />

              <Detail
                label="Publisher"
                value={
                  selectedBook.publisher ||
                  "Not provided"
                }
              />

              <Detail
                label="Edition"
                value={
                  selectedBook.edition ||
                  "Not provided"
                }
              />

              <Detail
                label="ISBN"
                value={
                  selectedBook.isbn ||
                  "Not provided"
                }
              />

              <Detail
                label="Availability"
                value={
                  selectedBook.availability
                }
              />
            </div>

            <div className="mt-5 rounded-xl border border-white/10 bg-[#101D23] p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#596762]">
                Description
              </p>

              <p className="mt-2 text-sm leading-6 text-[#AEB8B4]">
                {selectedBook.description ||
                  "No description provided."}
              </p>
            </div>

            <div className="mt-5 rounded-xl border border-white/10 bg-[#101D23] p-4">
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#596762]">
                Owner
              </p>

              <p className="mt-2 text-sm font-bold">
                {selectedBook.ownerName}
              </p>

              <p className="mt-1 break-all text-xs text-[#899692]">
                {selectedBook.ownerEmail}
              </p>
            </div>

            <div className="mt-6 flex flex-wrap justify-end gap-2">
              {selectedBook.status ===
                "pending" && (
                <>
                  <button
                    type="button"
                    disabled={
                      loadingId ===
                      selectedBook._id
                    }
                    onClick={() =>
                      updateBook(
                        selectedBook._id,
                        "reject"
                      )
                    }
                    className="rounded-xl border border-red-500/20 px-5 py-3 text-sm font-bold text-red-400 hover:bg-red-500/10"
                  >
                    Reject
                  </button>

                  <button
                    type="button"
                    disabled={
                      loadingId ===
                      selectedBook._id
                    }
                    onClick={() =>
                      updateBook(
                        selectedBook._id,
                        "approve"
                      )
                    }
                    className="rounded-xl bg-[#8BAF9D] px-5 py-3 text-sm font-extrabold text-[#101D23]"
                  >
                    Approve
                  </button>
                </>
              )}

              <button
                type="button"
                onClick={() =>
                  setSelectedBook(null)
                }
                className="rounded-xl border border-white/10 px-5 py-3 text-sm font-bold text-[#AEB8B4] hover:bg-white/5"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Modal */}
      {deleteBook && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 px-5 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#17262D] p-6 shadow-2xl">

            <div className="grid h-11 w-11 place-items-center rounded-xl bg-red-500/10 text-red-400">
              !
            </div>

            <h2 className="mt-5 text-xl font-bold">
              Delete Book?
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#899692]">
              This will permanently remove this
              book from BookNest.
            </p>

            <div className="mt-4 rounded-xl border border-white/10 bg-[#101D23] p-4">
              <p className="font-semibold">
                {deleteBook.title}
              </p>

              <p className="mt-1 text-xs text-[#899692]">
                {deleteBook.author}
              </p>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                disabled={
                  loadingId ===
                  deleteBook._id
                }
                onClick={() =>
                  setDeleteBook(null)
                }
                className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm font-bold text-[#AEB8B4] hover:bg-white/5"
              >
                Cancel
              </button>

              <button
                type="button"
                disabled={
                  loadingId ===
                  deleteBook._id
                }
                onClick={handleDelete}
                className="flex-1 rounded-xl bg-red-500 px-4 py-3 text-sm font-bold text-white hover:bg-red-600 disabled:opacity-50"
              >
                {loadingId ===
                deleteBook._id
                  ? "Deleting..."
                  : "Delete Book"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function Detail({ label, value }) {
  return (
    <div className="rounded-xl border border-white/10 bg-[#101D23] p-4">
      <p className="text-[9px] font-bold uppercase tracking-wider text-[#596762]">
        {label}
      </p>

      <p className="mt-1 break-words text-sm font-semibold text-[#C6D0CC]">
        {value || "Not provided"}
      </p>
    </div>
  );
}