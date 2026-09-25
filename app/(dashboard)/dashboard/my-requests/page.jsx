"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function MyRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadRequests() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/requests", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to load requests.");
        return;
      }

      setRequests(data.requests || []);
    } catch (error) {
      console.error("LOAD_REQUESTS_ERROR:", error);

      setError(
        "Something went wrong while loading your requests."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadRequests();
  }, []);

  function getStatusStyle(status) {
    switch (status) {
      case "pending":
        return "border-yellow-400/20 bg-yellow-400/10 text-yellow-300";

      case "approved":
        return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";

      case "rejected":
        return "border-red-400/20 bg-red-400/10 text-red-300";

      case "returned":
        return "border-blue-400/20 bg-blue-400/10 text-blue-300";

      case "cancelled":
        return "border-gray-400/20 bg-gray-400/10 text-gray-300";

      default:
        return "border-white/10 bg-white/5 text-[#899692]";
    }
  }

  function formatDate(date) {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-BD", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  return (
    <main className="min-h-screen bg-[#101D23] px-5 py-10 text-[#EDE6D6]">
      <div className="mx-auto max-w-6xl">

        {/* Header */}
        <div className="mb-10">
          <Link
            href="/catalog"
            className="text-sm font-semibold text-[#8BAF9D] transition hover:text-[#EDE6D6]"
          >
            ← Back to Catalog
          </Link>

          <h1 className="mt-5 text-3xl font-black md:text-4xl">
            My Requests
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-7 text-[#899692]">
            Track all your book borrowing and collection requests
            from one place.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center">
            <p className="text-sm text-[#899692]">
              Loading your requests...
            </p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-6 text-center">
            <p className="text-sm font-semibold text-red-300">
              {error}
            </p>

            <button
              onClick={loadRequests}
              className="mt-4 rounded-xl bg-[#EDE6D6] px-5 py-2.5 text-sm font-bold text-[#101D23]"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && requests.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-12 text-center">
            <div className="text-5xl">📚</div>

            <h2 className="mt-5 text-xl font-black">
              No Requests Yet
            </h2>

            <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-[#899692]">
              You have not requested any books yet. Explore the
              catalog and find something you would like to borrow.
            </p>

            <Link
              href="/catalog"
              className="mt-6 inline-flex rounded-xl bg-[#EDE6D6] px-5 py-3 text-sm font-black text-[#101D23] transition hover:bg-white"
            >
              Explore Catalog
            </Link>
          </div>
        )}

        {/* Request List */}
        {!loading && !error && requests.length > 0 && (
          <div className="space-y-4">
            {requests.map((request) => (
              <div
                key={request._id}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:bg-white/[0.05]"
              >
                <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

                  {/* Book Info */}
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="truncate text-lg font-black">
                        {request.bookTitle || "Untitled Book"}
                      </h2>

                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-bold uppercase tracking-wide ${getStatusStyle(
                          request.status
                        )}`}
                      >
                        {request.status}
                      </span>
                    </div>

                    <div className="mt-3 space-y-1 text-sm text-[#899692]">
                      <p>
                        Request type:{" "}
                        <span className="font-semibold text-[#B8C4BF]">
                          {request.type || "borrow"}
                        </span>
                      </p>

                      <p>
                        Owner:{" "}
                        <span className="font-semibold text-[#B8C4BF]">
                          {request.ownerName || "BookNest Member"}
                        </span>
                      </p>

                      <p>
                        Requested:{" "}
                        <span className="font-semibold text-[#B8C4BF]">
                          {formatDate(request.requestedAt)}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Action */}
                  <div className="shrink-0">
                    <Link
                      href={`/book/${request.bookId}`}
                      className="inline-flex rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-sm font-bold text-[#EDE6D6] transition hover:bg-white/10"
                    >
                      View Book
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}