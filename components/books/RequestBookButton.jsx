"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RequestBookButton({ bookId }) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleRequest() {
    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookId,
          type: "borrow",
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to submit request.");
        return;
      }

      setMessage(
        "Your borrow request has been submitted successfully."
      );

      setTimeout(() => {
        router.push("/my-requests");
      }, 1000);
    } catch (error) {
      console.error("REQUEST_BOOK_ERROR:", error);

      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={handleRequest}
        disabled={loading}
        className="w-full rounded-xl bg-[#EDE6D6] px-5 py-4 text-sm font-black text-[#101D23] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading
          ? "Submitting Request..."
          : "Borrow / Collect Request"}
      </button>

      {message && (
        <div className="mt-3 rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-center text-sm font-semibold text-emerald-300">
          {message}
        </div>
      )}

      {error && (
        <div className="mt-3 rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-center text-sm font-semibold text-red-300">
          {error}
        </div>
      )}
    </div>
  );
}