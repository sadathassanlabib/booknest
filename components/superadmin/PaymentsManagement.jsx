"use client";

import { useMemo, useState } from "react";

function formatDate(date) {
  if (!date) return "N/A";

  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function formatDateTime(date) {
  if (!date) return "N/A";

  return new Date(date).toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function getStatusStyle(status) {
  switch (status) {
    case "pending":
      return "border-blue-400/20 bg-blue-500/10 text-blue-300";

    case "paid":
      return "border-emerald-400/20 bg-emerald-500/10 text-emerald-300";

    case "rejected":
      return "border-red-400/20 bg-red-500/10 text-red-300";

    default:
      return "border-white/10 bg-white/5 text-slate-300";
  }
}

function getStatusLabel(status) {
  switch (status) {
    case "pending":
      return "Pending";

    case "paid":
      return "Paid";

    case "rejected":
      return "Rejected";

    default:
      return status || "Unknown";
  }
}

function getPaymentMethodLabel(method) {
  switch (method) {
    case "bkash":
      return "bKash";

    case "nagad":
      return "Nagad";

    case "bank":
      return "Bank Transfer";

    case "cash":
      return "Cash";

    default:
      return method || "Unknown";
  }
}

export default function PaymentsManagement({
  initialPayments,
}) {
  const [payments, setPayments] =
    useState(initialPayments);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] =
    useState("all");

  const [selectedPayment, setSelectedPayment] =
    useState(null);

  const [processingId, setProcessingId] =
    useState(null);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const stats = useMemo(() => {
    const pending = payments.filter(
      (payment) => payment.status === "pending"
    ).length;

    const paid = payments.filter(
      (payment) => payment.status === "paid"
    ).length;

    const rejected = payments.filter(
      (payment) => payment.status === "rejected"
    ).length;

    const collected = payments
      .filter((payment) => payment.status === "paid")
      .reduce(
        (sum, payment) =>
          sum + Number(payment.amount || 0),
        0
      );

    const pendingAmount = payments
      .filter(
        (payment) => payment.status === "pending"
      )
      .reduce(
        (sum, payment) =>
          sum + Number(payment.amount || 0),
        0
      );

    return {
      total: payments.length,
      pending,
      paid,
      rejected,
      collected,
      pendingAmount,
    };
  }, [payments]);

  const filteredPayments = useMemo(() => {
    const query = search.trim().toLowerCase();

    return payments.filter((payment) => {
      const matchesStatus =
        statusFilter === "all" ||
        payment.status === statusFilter;

      if (!matchesStatus) return false;

      if (!query) return true;

      return (
        payment.bookTitle
          ?.toLowerCase()
          .includes(query) ||
        payment.borrowerName
          ?.toLowerCase()
          .includes(query) ||
        payment.borrowerEmail
          ?.toLowerCase()
          .includes(query) ||
        payment.transactionId
          ?.toLowerCase()
          .includes(query) ||
        payment.paymentMethod
          ?.toLowerCase()
          .includes(query)
      );
    });
  }, [payments, search, statusFilter]);

  async function handleAction(paymentId, action) {
    try {
      setProcessingId(paymentId);
      setMessage("");
      setError("");

      const response = await fetch(
        "/api/admin/payments",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentId,
            action,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to update payment."
        );
      }

      setPayments((current) =>
        current.map((payment) => {
          if (payment._id !== paymentId) {
            return payment;
          }

          return {
            ...payment,
            status:
              action === "approve"
                ? "paid"
                : "rejected",
            paidAt:
              action === "approve"
                ? new Date().toISOString()
                : payment.paidAt,
          };
        })
      );

      setSelectedPayment(null);

      setMessage(
        action === "approve"
          ? "Payment approved successfully."
          : "Payment rejected successfully."
      );
    } catch (err) {
      console.error(
        "ADMIN_PAYMENT_ACTION_ERROR:",
        err
      );

      setError(
        err.message ||
          "Something went wrong."
      );
    } finally {
      setProcessingId(null);
    }
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
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#718b94]">
            Superadmin
          </p>

          <h1 className="mt-2 text-3xl font-black tracking-tight text-[#f1eee5] sm:text-4xl">
            Payment Management
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
            Review fine payments submitted by
            BookNest members and verify their
            transactions.
          </p>
        </div>
      </section>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Message */}
        {message && (
          <div className="mb-6 rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-5 py-4 text-sm font-semibold text-emerald-300">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-500/10 px-5 py-4 text-sm font-semibold text-red-300">
            {error}
          </div>
        )}

        {/* Stats */}
        <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="rounded-2xl border border-white/[0.08] bg-[#0d2028] p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
              Total Payments
            </p>

            <p className="mt-3 text-3xl font-black text-white">
              {stats.total}
            </p>
          </div>

          <div className="rounded-2xl border border-blue-400/10 bg-[#0d2028] p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
              Pending
            </p>

            <p className="mt-3 text-3xl font-black text-blue-300">
              {stats.pending}
            </p>

            <p className="mt-1 text-xs text-slate-600">
              ৳{stats.pendingAmount} waiting
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-400/10 bg-[#0d2028] p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
              Paid
            </p>

            <p className="mt-3 text-3xl font-black text-emerald-300">
              {stats.paid}
            </p>
          </div>

          <div className="rounded-2xl border border-red-400/10 bg-[#0d2028] p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
              Rejected
            </p>

            <p className="mt-3 text-3xl font-black text-red-300">
              {stats.rejected}
            </p>
          </div>

          <div className="rounded-2xl border border-orange-400/10 bg-[#0d2028] p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
              Collected
            </p>

            <p className="mt-3 text-3xl font-black text-orange-300">
              ৳{stats.collected}
            </p>
          </div>
        </section>

        {/* Filters */}
        <section className="mt-8 rounded-3xl border border-white/[0.08] bg-[#0d2028] p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center">
            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search book, member, email or transaction ID..."
              className="w-full rounded-xl border border-white/10 bg-[#091a21] px-4 py-3 text-sm text-white placeholder:text-slate-600 outline-none transition focus:border-blue-400/40 lg:flex-1"
            />

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="rounded-xl border border-white/10 bg-[#091a21] px-4 py-3 text-sm font-semibold text-slate-300 outline-none focus:border-blue-400/40"
            >
              <option value="all">
                All Payments
              </option>

              <option value="pending">
                Pending
              </option>

              <option value="paid">
                Paid
              </option>

              <option value="rejected">
                Rejected
              </option>
            </select>
          </div>
        </section>

        {/* Payments */}
        <section className="mt-6 overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0d2028] shadow-2xl shadow-black/20">
          <div className="border-b border-white/5 px-5 py-5 sm:px-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-[#f1eee5]">
                  Payment Requests
                </h2>

                <p className="mt-1 text-xs text-slate-600">
                  {filteredPayments.length} payment
                  {filteredPayments.length !== 1
                    ? "s"
                    : ""}{" "}
                  found
                </p>
              </div>

              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {statusFilter === "all"
                  ? "All"
                  : getStatusLabel(statusFilter)}
              </span>
            </div>
          </div>

          {filteredPayments.length === 0 ? (
            <div className="px-6 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-white/5 bg-[#10242d] text-3xl">
                ৳
              </div>

              <h3 className="mt-5 text-lg font-black text-white">
                No payments found
              </h3>

              <p className="mt-2 text-sm text-slate-600">
                No payment matches your current
                search or filter.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {filteredPayments.map(
                (payment) => (
                  <div
                    key={payment._id}
                    className="p-5 transition hover:bg-white/[0.02] sm:p-6"
                  >
                    <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                      {/* Main */}
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="truncate text-base font-black text-slate-100">
                            {payment.bookTitle ||
                              "Unknown Book"}
                          </h3>

                          <span
                            className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${getStatusStyle(
                              payment.status
                            )}`}
                          >
                            {getStatusLabel(
                              payment.status
                            )}
                          </span>
                        </div>

                        <p className="mt-1 text-sm text-slate-500">
                          {payment.borrowerName ||
                            "Unknown User"}
                        </p>

                        <p className="mt-1 text-xs text-slate-600">
                          {payment.borrowerEmail ||
                            "No email"}
                        </p>

                        <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-600">
                          <span>
                            Method:{" "}
                            <strong className="text-slate-400">
                              {getPaymentMethodLabel(
                                payment.paymentMethod
                              )}
                            </strong>
                          </span>

                          <span>
                            Transaction:{" "}
                            <strong className="text-slate-400">
                              {payment.transactionId}
                            </strong>
                          </span>

                          <span>
                            Submitted:{" "}
                            <strong className="text-slate-400">
                              {formatDate(
                                payment.createdAt
                              )}
                            </strong>
                          </span>
                        </div>
                      </div>

                      {/* Amount */}
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                        <div className="rounded-2xl border border-orange-400/10 bg-orange-500/5 px-5 py-4 sm:min-w-[150px]">
                          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600">
                            Amount
                          </p>

                          <p className="mt-1 text-xl font-black text-orange-300">
                            ৳{payment.amount || 0}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() =>
                            setSelectedPayment(
                              payment
                            )
                          }
                          className="rounded-xl border border-white/10 bg-[#10242d] px-5 py-3 text-sm font-bold text-slate-200 transition hover:border-white/20 hover:bg-[#142d37]"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                )
              )}
            </div>
          )}
        </section>
      </div>

      {/* Details Modal */}
      {selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md">
          <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-white/10 bg-[#0d2028] shadow-2xl shadow-black/50">
            <div className="flex items-start justify-between border-b border-white/5 px-6 py-5">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">
                  Payment Details
                </p>

                <h2 className="mt-1 truncate text-xl font-black text-[#f1eee5]">
                  {selectedPayment.bookTitle ||
                    "Unknown Book"}
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedPayment(null)
                }
                className="ml-4 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/5 bg-white/5 text-xl text-slate-400 hover:bg-white/10 hover:text-white"
              >
                ×
              </button>
            </div>

            <div className="space-y-4 p-6">
              {/* User */}
              <div className="rounded-2xl border border-white/5 bg-[#091a21] p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Borrower
                </p>

                <p className="mt-2 font-bold text-white">
                  {selectedPayment.borrowerName ||
                    "Unknown"}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  {selectedPayment.borrowerEmail ||
                    "No email"}
                </p>
              </div>

              {/* Amount */}
              <div className="rounded-2xl border border-orange-400/10 bg-orange-500/5 p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-orange-300">
                  Payment Amount
                </p>

                <p className="mt-2 text-3xl font-black text-orange-300">
                  ৳{selectedPayment.amount || 0}
                </p>
              </div>

              {/* Breakdown */}
              <div className="rounded-2xl border border-white/5 bg-[#091a21] p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Fine Breakdown
                </p>

                <div className="mt-3 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-500">
                      Late Fine
                    </span>

                    <span className="font-bold text-slate-200">
                      ৳
                      {selectedPayment.lateFine ||
                        0}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">
                      Damage Fine
                    </span>

                    <span className="font-bold text-slate-200">
                      ৳
                      {selectedPayment.damageFine ||
                        0}
                    </span>
                  </div>

                  <div className="flex justify-between">
                    <span className="text-slate-500">
                      Lost Fine
                    </span>

                    <span className="font-bold text-slate-200">
                      ৳
                      {selectedPayment.lostFine ||
                        0}
                    </span>
                  </div>

                  <div className="border-t border-white/5 pt-3">
                    <div className="flex justify-between">
                      <span className="font-bold text-slate-300">
                        Total
                      </span>

                      <span className="font-black text-orange-300">
                        ৳
                        {selectedPayment.amount ||
                          0}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Transaction */}
              <div className="rounded-2xl border border-white/5 bg-[#091a21] p-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-slate-600">
                  Transaction Information
                </p>

                <div className="mt-3 space-y-3">
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-slate-500">
                      Method
                    </span>

                    <span className="font-bold text-slate-200">
                      {getPaymentMethodLabel(
                        selectedPayment.paymentMethod
                      )}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-slate-500">
                      Transaction ID
                    </span>

                    <span className="break-all text-right font-bold text-slate-200">
                      {selectedPayment.transactionId ||
                        "N/A"}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-slate-500">
                      Submitted
                    </span>

                    <span className="text-right text-xs font-bold text-slate-300">
                      {formatDateTime(
                        selectedPayment.createdAt
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="rounded-2xl border border-white/5 bg-[#091a21] p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    Status
                  </span>

                  <span
                    className={`rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide ${getStatusStyle(
                      selectedPayment.status
                    )}`}
                  >
                    {getStatusLabel(
                      selectedPayment.status
                    )}
                  </span>
                </div>
              </div>

              {/* Actions */}
              {selectedPayment.status ===
                "pending" && (
                <div className="grid gap-3 pt-2 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() =>
                      handleAction(
                        selectedPayment._id,
                        "reject"
                      )
                    }
                    disabled={
                      processingId ===
                      selectedPayment._id
                    }
                    className="rounded-xl border border-red-400/20 bg-red-500/10 px-5 py-4 text-sm font-black text-red-300 transition hover:bg-red-500/15 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {processingId ===
                    selectedPayment._id
                      ? "Processing..."
                      : "Reject Payment"}
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      handleAction(
                        selectedPayment._id,
                        "approve"
                      )
                    }
                    disabled={
                      processingId ===
                      selectedPayment._id
                    }
                    className="rounded-xl bg-[#e9e1cf] px-5 py-4 text-sm font-black text-[#07141a] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {processingId ===
                    selectedPayment._id
                      ? "Processing..."
                      : "Approve Payment"}
                  </button>
                </div>
              )}

              {selectedPayment.status ===
                "paid" && (
                <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 p-4 text-center">
                  <p className="font-bold text-emerald-300">
                    ✓ Payment Verified
                  </p>

                  <p className="mt-1 text-xs text-slate-500">
                    {formatDateTime(
                      selectedPayment.paidAt
                    )}
                  </p>
                </div>
              )}

              {selectedPayment.status ===
                "rejected" && (
                <div className="rounded-2xl border border-red-400/20 bg-red-500/10 p-4 text-center">
                  <p className="font-bold text-red-300">
                    Payment Rejected
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  );
}