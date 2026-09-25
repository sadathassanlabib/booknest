"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function MyBookRequestsPage() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [selectedAction, setSelectedAction] = useState(""); // "accept" | "reject"
  const [processing, setProcessing] = useState(false);
  const [modalError, setModalError] = useState("");

  async function loadOwnerRequests() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/owner/requests", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to load requests.");
        return;
      }

      setRequests(data.requests || []);
    } catch (err) {
      console.error("LOAD_OWNER_REQUESTS_ERROR:", err);
      setError("Something went wrong while loading requests.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadOwnerRequests();
  }, []);

  // Modal খোলা
  function openActionModal(request, action) {
    setSelectedRequest(request);
    setSelectedAction(action);
    setModalError("");
    setModalOpen(true);
  }

  // Modal বন্ধ
  function closeModal() {
    if (processing) return;
    setModalOpen(false);
    setSelectedRequest(null);
    setSelectedAction("");
    setModalError("");
  }

  // Confirm action
  async function confirmAction() {
    if (!selectedRequest) return;

    setProcessing(true);
    setModalError("");

    try {
      const response = await fetch("/api/requests", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId: selectedRequest._id,
          action: selectedAction,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setModalError(data.message || "Failed to update request.");
        return;
      }

      // Success — modal বন্ধ + list refresh
      setModalOpen(false);
      setSelectedRequest(null);
      setSelectedAction("");
      await loadOwnerRequests();
    } catch (err) {
      console.error("OWNER_REQUEST_ACTION_ERROR:", err);
      setModalError("Something went wrong. Please try again.");
    } finally {
      setProcessing(false);
    }
  }

  function getStatusStyle(status) {
    switch (status) {
      case "pending":
        return "border-yellow-400/20 bg-yellow-400/10 text-yellow-300";
      case "owner_approved":
        return "border-blue-400/20 bg-blue-400/10 text-blue-300";
      case "admin_approved":
        return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";
      case "rejected":
        return "border-red-400/20 bg-red-400/10 text-red-300";
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
            href="/book/my-books"
            className="text-sm font-semibold text-[#8BAF9D] transition hover:text-[#EDE6D6]"
          >
            ← My Books
          </Link>

          <h1 className="mt-5 text-3xl font-black md:text-4xl">
            Borrow Requests
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-7 text-[#899692]">
            Review requests from BookNest members who want to borrow
            your books.
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-10 text-center">
            <p className="text-sm text-[#899692]">
              Loading requests...
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
              onClick={loadOwnerRequests}
              className="mt-4 rounded-xl bg-[#EDE6D6] px-5 py-2.5 text-sm font-bold text-[#101D23]"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && requests.length === 0 && (
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-12 text-center">
            <div className="text-5xl">📖</div>
            <h2 className="mt-5 text-xl font-black">
              No Borrow Requests
            </h2>
            <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-[#899692]">
              Nobody has requested one of your books yet.
            </p>
          </div>
        )}

        {/* List */}
        {!loading && !error && requests.length > 0 && (
          <div className="space-y-4">
            {requests.map((request) => (
              <div
                key={request._id}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition hover:border-white/20"
              >
                <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-3">
                      <h2 className="text-lg font-black">
                        {request.bookTitle || "Untitled Book"}
                      </h2>

                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-bold uppercase ${getStatusStyle(
                          request.status
                        )}`}
                      >
                        {request.status.replace("_", " ")}
                      </span>
                    </div>

                    <div className="mt-4 grid gap-2 text-sm text-[#899692] md:grid-cols-2">
                      <p>
                        Requester:{" "}
                        <span className="font-semibold text-[#C3CDC8]">
                          {request.requesterName || "Unknown"}
                        </span>
                      </p>
                      <p>
                        Email:{" "}
                        <span className="font-semibold text-[#C3CDC8]">
                          {request.requesterEmail || "N/A"}
                        </span>
                      </p>
                      <p>
                        Type:{" "}
                        <span className="font-semibold text-[#C3CDC8]">
                          {request.type || "borrow"}
                        </span>
                      </p>
                      <p>
                        Requested:{" "}
                        <span className="font-semibold text-[#C3CDC8]">
                          {formatDate(request.requestedAt)}
                        </span>
                      </p>
                    </div>
                  </div>

                  {request.status === "pending" && (
                    <div className="flex shrink-0 gap-3">
                      <button
                        onClick={() =>
                          openActionModal(request, "reject")
                        }
                        className="rounded-xl border border-red-400/20 bg-red-400/10 px-5 py-3 text-sm font-bold text-red-300 transition hover:bg-red-400/20"
                      >
                        Reject
                      </button>
                      <button
                        onClick={() =>
                          openActionModal(request, "accept")
                        }
                        className="rounded-xl bg-[#EDE6D6] px-5 py-3 text-sm font-black text-[#101D23] transition hover:bg-white"
                      >
                        Accept
                      </button>
                    </div>
                  )}

                  {request.status === "active" && (
  <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-5 py-3 text-center text-sm font-bold text-emerald-300">
    Book Currently Borrowed
  </div>
)}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ============================================ */}
      {/* MODERN MODAL — একই file-এ */}
      {/* ============================================ */}
      {modalOpen && selectedRequest && (
        <ActionModal
          action={selectedAction}
          request={selectedRequest}
          processing={processing}
          error={modalError}
          onClose={closeModal}
          onConfirm={confirmAction}
        />
      )}
    </main>
  );
}

/* ============================================ */
/* ActionModal Component — same file-এ */
/* ============================================ */

function ActionModal({
  action,
  request,
  processing,
  error,
  onClose,
  onConfirm,
}) {
  const isAccept = action === "accept";

  // ESC key + body scroll lock
  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape" && !processing) onClose();
    }

    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [processing, onClose]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        onClick={() => !processing && onClose()}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        style={{ animation: "fadeIn 150ms ease-out" }}
      />

      {/* Modal panel */}
      <div
        className="relative z-10 w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d0f] shadow-2xl"
        style={{ animation: "slideUp 200ms ease-out" }}
      >
        {/* Icon + Header */}
        <div className="border-b border-white/10 p-6">
          <div
            className={`mx-auto flex h-14 w-14 items-center justify-center rounded-full ${
              isAccept
                ? "bg-emerald-500/10 text-emerald-400"
                : "bg-red-500/10 text-red-400"
            }`}
          >
            {isAccept ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="26"
                height="26"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            )}
          </div>

          <h2 className="mt-4 text-center text-xl font-black text-white">
            {isAccept ? "Accept Request?" : "Reject Request?"}
          </h2>

          <p className="mt-2 text-center text-sm leading-6 text-gray-400">
            {isAccept
              ? "This will notify the requester that their request has been approved by you."
              : "This will notify the requester that their request has been declined."}
          </p>
        </div>

        {/* Book info */}
        <div className="space-y-3 p-6">
          <InfoRow
            label="Book"
            value={request.bookTitle || "Untitled"}
          />
          <InfoRow
            label="Requester"
            value={request.requesterName || "Unknown"}
          />
          <InfoRow
            label="Email"
            value={request.requesterEmail || "N/A"}
          />
        </div>

        {/* Error */}
        {error && (
          <div className="mx-6 mb-4 rounded-xl border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-300">
            {error}
          </div>
        )}

        {/* Footer */}
        <div className="flex gap-3 border-t border-white/10 bg-white/[0.02] p-6">
          <button
            onClick={onClose}
            disabled={processing}
            className="flex-1 rounded-xl border border-white/15 bg-white/5 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/10 disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={processing}
            className={`flex-1 rounded-xl px-5 py-3 text-sm font-bold transition disabled:opacity-50 ${
              isAccept
                ? "bg-emerald-500 text-black hover:bg-emerald-400"
                : "bg-red-500 text-white hover:bg-red-400"
            }`}
          >
            {processing
              ? "Processing..."
              : isAccept
              ? "Yes, Accept"
              : "Yes, Reject"}
          </button>
        </div>
      </div>

      {/* Keyframes — inline style tag */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(16px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-white/5 pb-2 last:border-0">
      <span className="text-xs uppercase tracking-wide text-gray-500">
        {label}
      </span>
      <span className="text-right text-sm font-medium text-white">
        {value}
      </span>
    </div>
  );
}