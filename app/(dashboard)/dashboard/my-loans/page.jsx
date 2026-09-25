"use client";

import PayFineButton from "@/components/loans/PayFineButton";
import { useEffect, useState } from "react";
import Link from "next/link";

function formatDate(date) {
  if (!date) return "N/A";

  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getStatusStyle(status) {
  switch (status) {
    case "active":
      return "border-blue-400/20 bg-blue-500/10 text-blue-300";

    case "returned":
      return "border-emerald-400/20 bg-emerald-500/10 text-emerald-300";

    case "damaged":
      return "border-orange-400/20 bg-orange-500/10 text-orange-300";

    case "lost":
      return "border-red-400/20 bg-red-500/10 text-red-300";

    default:
      return "border-white/10 bg-white/5 text-slate-300";
  }
}

function getStatusLabel(status) {
  switch (status) {
    case "active":
      return "Active";

    case "returned":
      return "Returned";

    case "damaged":
      return "Damaged";

    case "lost":
      return "Lost";

    default:
      return status || "Unknown";
  }
}

export default function MyLoansPage() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [returningLoan, setReturningLoan] = useState(null);
  const [condition, setCondition] = useState("good");
  const [returning, setReturning] = useState(false);
  const [returnMessage, setReturnMessage] = useState("");
  const [returnError, setReturnError] = useState("");

  async function loadLoans() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/loans", {
        cache: "no-store",
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to load loans."
        );
      }

      setLoans(data.loans || []);
    } catch (err) {
      console.error("MY_LOANS_ERROR:", err);

      setError(
        err.message || "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLoans();
  }, []);

  function openReturnModal(loan) {
    setReturningLoan(loan);
    setCondition("good");
    setReturnMessage("");
    setReturnError("");
  }

  function closeReturnModal() {
    if (returning) return;

    setReturningLoan(null);
    setCondition("good");
    setReturnMessage("");
    setReturnError("");
  }

  async function handleReturn() {
    if (!returningLoan) return;

    try {
      setReturning(true);
      setReturnMessage("");
      setReturnError("");

      const response = await fetch(
        `/api/loans/${returningLoan._id}/return`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            condition,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setReturnError(
          data.message ||
            "Failed to return the book."
        );

        return;
      }

      setReturnMessage(
        data.message ||
          "Book return processed successfully."
      );

      await loadLoans();

      setTimeout(() => {
        setReturningLoan(null);
        setReturnMessage("");
      }, 1200);
    } catch (err) {
      console.error(
        "RETURN_BOOK_ERROR:",
        err
      );

      setReturnError(
        "Something went wrong. Please try again."
      );
    } finally {
      setReturning(false);
    }
  }

  const activeLoans = loans.filter(
    (loan) => loan.status === "active"
  );

  const completedLoans = loans.filter(
    (loan) => loan.status !== "active"
  );

  const unpaidFine = loans.reduce(
    (sum, loan) => {
      if (
        loan.paymentStatus !== "paid" &&
        Number(loan.totalFine || 0) > 0
      ) {
        return (
          sum + Number(loan.totalFine || 0)
        );
      }

      return sum;
    },
    0
  );

  if (loading) {
    return (
      <main className="min-h-screen bg-[#07141a] px-4 py-8 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 h-10 w-56 animate-pulse rounded-xl bg-[#10242d]" />

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[1, 2, 3, 4].map((item) => (
              <div
                key={item}
                className="h-32 animate-pulse rounded-2xl border border-white/5 bg-[#0d2028]"
              />
            ))}
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {[1, 2].map((item) => (
              <div
                key={item}
                className="h-72 animate-pulse rounded-2xl border border-white/5 bg-[#0d2028]"
              />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#07141a] px-4 py-10 text-white">
        <div className="mx-auto max-w-xl rounded-3xl border border-red-400/20 bg-[#0d2028] p-8 text-center shadow-2xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 text-2xl font-black text-red-400">
            !
          </div>

          <h1 className="mt-5 text-xl font-black">
            Unable to load your loans
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            {error}
          </p>

          <button
            type="button"
            onClick={loadLoans}
            className="mt-6 rounded-xl bg-[#e9e1cf] px-6 py-3 text-sm font-black text-[#07141a] transition hover:bg-white"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#07141a] text-slate-100">
      {/* Background Glow */}
      <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
        <div className="absolute left-[-180px] top-[-180px] h-[420px] w-[420px] rounded-full bg-blue-500/5 blur-[120px]" />

        <div className="absolute bottom-[-180px] right-[-120px] h-[420px] w-[420px] rounded-full bg-cyan-500/5 blur-[120px]" />
      </div>

      {/* Header */}
      <section className="relative z-10 border-b border-white/[0.07] bg-[#08171e]/90 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.25em] text-[#718b94]">
                My Library
              </div>

              <h1 className="text-3xl font-black tracking-tight text-[#f1eee5] sm:text-4xl">
                My Loans
              </h1>

              <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
                Track your borrowed books, due dates,
                fines and return history from one place.
              </p>
            </div>

            <Link
              href="/catalog"
              className="inline-flex items-center justify-center rounded-xl border border-white/10 bg-[#10242d] px-5 py-3 text-sm font-bold text-slate-200 transition hover:border-white/20 hover:bg-[#142d37]"
            >
              ← Browse Catalog
            </Link>
          </div>
        </div>
      </section>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Stats */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Total */}
          <div className="group rounded-2xl border border-white/[0.08] bg-[#0d2028] p-5 shadow-xl shadow-black/10 transition hover:-translate-y-1 hover:border-white/10">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                  Total Loans
                </p>

                <p className="mt-3 text-3xl font-black text-white">
                  {loans.length}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-400/10 bg-blue-500/10 text-xl">
                📚
              </div>
            </div>
          </div>

          {/* Active */}
          <div className="group rounded-2xl border border-white/[0.08] bg-[#0d2028] p-5 shadow-xl shadow-black/10 transition hover:-translate-y-1 hover:border-blue-400/20">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                  Active Loans
                </p>

                <p className="mt-3 text-3xl font-black text-blue-300">
                  {activeLoans.length}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-400/10 bg-blue-500/10 text-xl">
                ⏳
              </div>
            </div>
          </div>

          {/* Completed */}
          <div className="group rounded-2xl border border-white/[0.08] bg-[#0d2028] p-5 shadow-xl shadow-black/10 transition hover:-translate-y-1 hover:border-emerald-400/20">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                  Completed
                </p>

                <p className="mt-3 text-3xl font-black text-emerald-300">
                  {completedLoans.length}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-emerald-400/10 bg-emerald-500/10 text-xl">
                ✓
              </div>
            </div>
          </div>

          {/* Fine */}
          <div className="group rounded-2xl border border-white/[0.08] bg-[#0d2028] p-5 shadow-xl shadow-black/10 transition hover:-translate-y-1 hover:border-orange-400/20">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                  Unpaid Fine
                </p>

                <p className="mt-3 text-3xl font-black text-orange-300">
                  ৳{unpaidFine}
                </p>
              </div>

              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-orange-400/10 bg-orange-500/10 text-xl">
                ৳
              </div>
            </div>
          </div>
        </section>

        {/* Active Loans */}
        <section className="mt-12">
          <div className="mb-6 flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-black text-[#f1eee5]">
                Active Loans
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Books currently borrowed by you.
              </p>
            </div>

            <span className="rounded-full border border-blue-400/15 bg-blue-500/10 px-3 py-1.5 text-[11px] font-bold text-blue-300">
              {activeLoans.length} Active
            </span>
          </div>

          {activeLoans.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-white/10 bg-[#0d2028] px-6 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/5 bg-[#10242d] text-3xl">
                📖
              </div>

              <h3 className="mt-5 text-lg font-black text-white">
                No active loans
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                You are not currently borrowing any
                books. Explore the catalog and discover
                something worth reading.
              </p>

              <Link
                href="/catalog"
                className="mt-6 inline-flex rounded-xl bg-[#e9e1cf] px-6 py-3 text-sm font-black text-[#07141a] transition hover:bg-white"
              >
                Browse Books
              </Link>
            </div>
          ) : (
            <div className="grid gap-5 lg:grid-cols-2">
              {activeLoans.map((loan) => (
                <div
                  key={loan._id}
                  className="group overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0d2028] shadow-2xl shadow-black/20 transition hover:-translate-y-1 hover:border-white/15"
                >
                  <div className="p-6">
                    {/* Card Header */}
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="mb-3 flex flex-wrap items-center gap-2">
                          <span className="rounded-full border border-blue-400/20 bg-blue-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-blue-300">
                            Active Loan
                          </span>

                          {loan.isOverdue && (
                            <span className="rounded-full border border-red-400/20 bg-red-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-red-300">
                              Overdue
                            </span>
                          )}
                        </div>

                        <h3 className="truncate text-xl font-black text-[#f1eee5]">
                          {loan.bookTitle}
                        </h3>

                        <p className="mt-1 text-sm text-slate-500">
                          Owner:{" "}
                          {loan.ownerName ||
                            "Book Owner"}
                        </p>
                      </div>

                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/5 bg-[#10242d] text-2xl">
                        📚
                      </div>
                    </div>

                    {/* Dates */}
                    <div className="mt-6 grid grid-cols-2 gap-3">
                      <div className="rounded-2xl border border-white/5 bg-[#091a21] p-4">
                        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600">
                          Borrowed
                        </p>

                        <p className="mt-2 text-sm font-bold text-slate-200">
                          {formatDate(
                            loan.startDate
                          )}
                        </p>
                      </div>

                      <div
                        className={`rounded-2xl border p-4 ${
                          loan.isOverdue
                            ? "border-red-400/10 bg-red-500/10"
                            : "border-white/5 bg-[#091a21]"
                        }`}
                      >
                        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600">
                          Due Date
                        </p>

                        <p
                          className={`mt-2 text-sm font-bold ${
                            loan.isOverdue
                              ? "text-red-300"
                              : "text-slate-200"
                          }`}
                        >
                          {formatDate(
                            loan.dueDate
                          )}
                        </p>
                      </div>
                    </div>

                    {/* Book Information */}
                    <div className="mt-3 rounded-2xl border border-white/5 bg-[#091a21] p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-slate-500">
                          Book Pages
                        </span>

                        <span className="font-bold text-slate-200">
                          {loan.pages} pages
                        </span>
                      </div>

                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-sm text-slate-500">
                          Free Period
                        </span>

                        <span className="font-bold text-slate-200">
                          {loan.freeMonths} month
                          {loan.freeMonths > 1
                            ? "s"
                            : ""}
                        </span>
                      </div>
                    </div>

                    {/* Current Fine */}
                    <div className="mt-3 rounded-2xl border border-orange-400/10 bg-orange-500/[0.06] p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold text-slate-400">
                          Current Fine
                        </span>

                        <span className="text-lg font-black text-orange-300">
                          ৳{loan.totalFine || 0}
                        </span>
                      </div>

                      {loan.lateFine > 0 && (
                        <div className="mt-2 flex items-center justify-between text-xs text-orange-300">
                          <span>
                            Late Fine (
                            {loan.lateDays} days
                            late)
                          </span>

                          <span className="font-bold">
                            ৳{loan.lateFine}
                          </span>
                        </div>
                      )}

                      <p className="mt-2 text-[11px] leading-5 text-slate-600">
                        Late fine is ৳10 for every
                        10 days after the free period,
                        with a maximum of ৳50.
                      </p>
                    </div>

                    {/* Return */}
                    <button
                      type="button"
                      onClick={() =>
                        openReturnModal(loan)
                      }
                      className="mt-5 w-full rounded-2xl bg-[#e9e1cf] px-5 py-4 text-sm font-black text-[#07141a] transition hover:bg-white active:scale-[0.99]"
                    >
                      Return This Book
                    </button>

                    {/* Pay Fine */}
                    {Number(
                      loan.totalFine || 0
                    ) > 0 && (
                      <div className="mt-3">
                        <PayFineButton
                          loan={loan}
                          onSuccess={loadLoans}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Loan History */}
        <section className="mt-14">
          <div className="mb-6">
            <h2 className="text-2xl font-black text-[#f1eee5]">
              Loan History
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Your previously completed book loans.
            </p>
          </div>

          {completedLoans.length === 0 ? (
            <div className="rounded-3xl border border-white/5 bg-[#0d2028] p-10 text-center">
              <p className="text-sm text-slate-500">
                No completed loans yet.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0d2028] shadow-2xl shadow-black/20">
              <div className="divide-y divide-white/5">
                {completedLoans.map((loan) => (
                  <div
                    key={loan._id}
                    className="p-5 transition hover:bg-white/[0.02] sm:p-6"
                  >
                    <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex min-w-0 items-start gap-4">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-white/5 bg-[#10242d] text-xl">
                          📖
                        </div>

                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="truncate text-base font-black text-slate-100">
                              {loan.bookTitle}
                            </h3>

                            <span
                              className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${getStatusStyle(
                                loan.status
                              )}`}
                            >
                              {getStatusLabel(
                                loan.status
                              )}
                            </span>
                          </div>

                          <p className="mt-1 text-sm text-slate-500">
                            Owner:{" "}
                            {loan.ownerName ||
                              "Book Owner"}
                          </p>

                          <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-slate-600">
                            <span>
                              Borrowed:{" "}
                              <strong className="text-slate-400">
                                {formatDate(
                                  loan.startDate
                                )}
                              </strong>
                            </span>

                            <span>
                              Returned:{" "}
                              <strong className="text-slate-400">
                                {formatDate(
                                  loan.returnedAt
                                )}
                              </strong>
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Fine + Payment */}
                      <div className="w-full rounded-2xl border border-white/5 bg-[#091a21] px-5 py-4 lg:w-auto lg:min-w-[240px]">
                        <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600">
                          Total Fine
                        </p>

                        <p className="mt-1 text-xl font-black text-slate-100">
                          ৳{loan.totalFine || 0}
                        </p>

                        {Number(
                          loan.totalFine || 0
                        ) > 0 ? (
                          <>
                            {loan.paymentStatus ===
                            "paid" ? (
                              <div className="mt-2">
                                <p className="text-[11px] font-bold text-emerald-300">
                                  ✓ Payment Verified
                                </p>

                                <p className="mt-1 text-[10px] text-slate-600">
                                  Fine has been paid
                                  successfully.
                                </p>
                              </div>
                            ) : loan.paymentStatus ===
                              "pending" ? (
                              <div className="mt-2">
                                <p className="text-[11px] font-bold text-blue-300">
                                  Payment Under Review
                                </p>

                                <p className="mt-1 text-[10px] leading-4 text-slate-600">
                                  Waiting for Superadmin
                                  verification.
                                </p>
                              </div>
                            ) : (
                              <div className="mt-3">
                                <p className="mb-3 text-[11px] font-bold text-orange-300">
                                  Payment Required
                                </p>

                                <PayFineButton
                                  loan={loan}
                                  onSuccess={loadLoans}
                                />
                              </div>
                            )}
                          </>
                        ) : (
                          <p className="mt-2 text-[11px] font-bold text-emerald-300">
                            No fine
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Return Modal */}
      {returningLoan && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
          <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-[#0d2028] shadow-2xl shadow-black/50">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/5 px-6 py-5">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">
                  Return Book
                </p>

                <h2 className="mt-1 truncate text-xl font-black text-[#f1eee5]">
                  {returningLoan.bookTitle}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeReturnModal}
                disabled={returning}
                className="ml-4 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/5 bg-white/5 text-xl text-slate-400 transition hover:bg-white/10 hover:text-white disabled:opacity-50"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              <p className="text-sm leading-6 text-slate-500">
                Please select the condition of the
                book before confirming the return.
              </p>

              {/* Conditions */}
              <div className="mt-5 space-y-3">
                {/* Good */}
                <button
                  type="button"
                  onClick={() =>
                    setCondition("good")
                  }
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    condition === "good"
                      ? "border-emerald-400/30 bg-emerald-500/10"
                      : "border-white/5 bg-[#091a21] hover:border-white/10 hover:bg-[#10242d]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-100">
                        ✓ Good Condition
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Book is returned normally.
                      </p>
                    </div>

                    {condition === "good" && (
                      <span className="font-black text-emerald-300">
                        ✓
                      </span>
                    )}
                  </div>
                </button>

                {/* Damaged */}
                <button
                  type="button"
                  onClick={() =>
                    setCondition("damaged")
                  }
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    condition === "damaged"
                      ? "border-orange-400/30 bg-orange-500/10"
                      : "border-white/5 bg-[#091a21] hover:border-white/10 hover:bg-[#10242d]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-100">
                        ⚠ Damaged
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Damage fee: ৳
                        {returningLoan.damageFee ||
                          0}
                      </p>
                    </div>

                    {condition === "damaged" && (
                      <span className="font-black text-orange-300">
                        ✓
                      </span>
                    )}
                  </div>
                </button>

                {/* Lost */}
                <button
                  type="button"
                  onClick={() =>
                    setCondition("lost")
                  }
                  className={`w-full rounded-2xl border p-4 text-left transition ${
                    condition === "lost"
                      ? "border-red-400/30 bg-red-500/10"
                      : "border-white/5 bg-[#091a21] hover:border-white/10 hover:bg-[#10242d]"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-bold text-slate-100">
                        ✕ Lost
                      </p>

                      <p className="mt-1 text-xs text-slate-500">
                        Lost book fee: ৳
                        {returningLoan.damageFee ||
                          0}
                      </p>
                    </div>

                    {condition === "lost" && (
                      <span className="font-black text-red-300">
                        ✓
                      </span>
                    )}
                  </div>
                </button>
              </div>

              {/* Fine Preview */}
              <div className="mt-5 rounded-2xl border border-white/5 bg-[#091a21] p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-slate-500">
                    Current late fine
                  </span>

                  <span className="font-bold text-slate-200">
                    ৳{returningLoan.lateFine || 0}
                  </span>
                </div>

                {condition !== "good" && (
                  <div className="mt-2 flex items-center justify-between text-sm">
                    <span className="text-slate-500">
                      {condition === "lost"
                        ? "Lost fee"
                        : "Damage fee"}
                    </span>

                    <span className="font-bold text-slate-200">
                      ৳
                      {returningLoan.damageFee ||
                        0}
                    </span>
                  </div>
                )}

                <div className="mt-3 border-t border-white/5 pt-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-300">
                      Estimated Total Fine
                    </span>

                    <span className="text-xl font-black text-orange-300">
                      ৳
                      {(returningLoan.lateFine ||
                        0) +
                        (condition !== "good"
                          ? returningLoan.damageFee ||
                            0
                          : 0)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Messages */}
              {returnError && (
                <div className="mt-4 rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                  {returnError}
                </div>
              )}

              {returnMessage && (
                <div className="mt-4 rounded-xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm font-semibold text-emerald-300">
                  {returnMessage}
                </div>
              )}

              {/* Actions */}
              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeReturnModal}
                  disabled={returning}
                  className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-slate-300 transition hover:bg-white/10 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleReturn}
                  disabled={returning}
                  className="rounded-xl bg-[#e9e1cf] px-6 py-3 text-sm font-black text-[#07141a] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {returning
                    ? "Processing Return..."
                    : "Confirm Return"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}