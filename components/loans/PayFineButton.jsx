"use client";

import { useState } from "react";

export default function PayFineButton({ loan, onSuccess }) {
  const [open, setOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("bkash");
  const [transactionId, setTransactionId] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const amount = Number(loan?.totalFine || 0);
  const paymentStatus = loan?.paymentStatus || "unpaid";

  if (amount <= 0) {
    return null;
  }

  function openModal() {
    setMessage("");
    setError("");
    setTransactionId("");
    setOpen(true);
  }

  function closeModal() {
    if (loading) return;

    setOpen(false);
    setMessage("");
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    if (!loan?._id && !loan?.id) {
      setError("Loan information is missing.");
      setLoading(false);
      return;
    }

    const loanId = loan._id || loan.id;

    if (
      paymentMethod !== "cash" &&
      !transactionId.trim()
    ) {
      setError("Please enter your transaction ID.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          loanId,
          paymentMethod,
          transactionId:
            paymentMethod === "cash"
              ? ""
              : transactionId.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Failed to submit payment."
        );
        return;
      }

      setMessage(
        data.message ||
          "Payment submitted successfully."
      );

      setTimeout(() => {
        setOpen(false);

        if (typeof onSuccess === "function") {
          onSuccess();
        }
      }, 1200);
    } catch (error) {
      console.error(
        "PAY_FINE_ERROR:",
        error
      );

      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  if (paymentStatus === "pending") {
    return (
      <div className="rounded-xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-200">
        <p className="font-bold">
          Payment Verification Pending
        </p>

        <p className="mt-1 text-xs text-amber-100/70">
          Your payment has been submitted and is
          waiting for verification.
        </p>
      </div>
    );
  }

  if (paymentStatus === "paid") {
    return (
      <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
        <p className="font-bold">
          Fine Paid
        </p>

        <p className="mt-1 text-xs text-emerald-100/70">
          This fine has already been verified.
        </p>
      </div>
    );
  }

  return (
    <>
      <button
        type="button"
        onClick={openModal}
        className="w-full rounded-xl bg-[#e9e1cf] px-5 py-3.5 text-sm font-black text-[#07141a] transition hover:bg-white"
      >
        Pay Fine · ৳{amount}
      </button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[#0d2028] shadow-2xl">
            
            {/* Header */}
            <div className="border-b border-white/10 px-6 py-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                    BookNest Payment
                  </p>

                  <h2 className="mt-2 text-xl font-black text-[#f4efe3]">
                    Pay Your Fine
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={loading}
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-[#091a21] text-lg text-slate-400 transition hover:text-white disabled:opacity-50"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Body */}
            <form
              onSubmit={handleSubmit}
              className="space-y-5 p-6"
            >
              {/* Amount */}
              <div className="rounded-xl border border-white/10 bg-[#091a21] p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Total Payable
                </p>

                <p className="mt-1 text-3xl font-black text-[#e9e1cf]">
                  ৳{amount}
                </p>

                <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <p className="text-slate-500">
                      Late Fine
                    </p>
                    <p className="mt-1 font-bold text-slate-200">
                      ৳{Number(loan.lateFine || 0)}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-500">
                      Damage
                    </p>
                    <p className="mt-1 font-bold text-slate-200">
                      ৳{Number(loan.damageFine || 0)}
                    </p>
                  </div>

                  <div>
                    <p className="text-slate-500">
                      Lost
                    </p>
                    <p className="mt-1 font-bold text-slate-200">
                      ৳{Number(loan.lostFine || 0)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Book */}
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Book
                </p>

                <p className="mt-1 font-bold text-[#f4efe3]">
                  {loan.bookTitle || "Book"}
                </p>
              </div>

              {/* Payment Method */}
              <div>
                <label className="mb-2 block text-sm font-bold text-slate-300">
                  Payment Method
                </label>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    {
                      value: "bkash",
                      label: "bKash",
                    },
                    {
                      value: "nagad",
                      label: "Nagad",
                    },
                    {
                      value: "bank",
                      label: "Bank",
                    },
                    {
                      value: "cash",
                      label: "Cash",
                    },
                  ].map((method) => (
                    <button
                      key={method.value}
                      type="button"
                      onClick={() =>
                        setPaymentMethod(
                          method.value
                        )
                      }
                      className={`rounded-xl border px-4 py-3 text-sm font-bold transition ${
                        paymentMethod ===
                        method.value
                          ? "border-blue-400/50 bg-blue-400/10 text-blue-200"
                          : "border-white/10 bg-[#091a21] text-slate-400 hover:border-white/20 hover:text-white"
                      }`}
                    >
                      {method.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Transaction ID */}
              {paymentMethod !== "cash" && (
                <div>
                  <label
                    htmlFor="transactionId"
                    className="mb-2 block text-sm font-bold text-slate-300"
                  >
                    Transaction ID
                  </label>

                  <input
                    id="transactionId"
                    type="text"
                    value={transactionId}
                    onChange={(event) =>
                      setTransactionId(
                        event.target.value
                      )
                    }
                    placeholder="Enter transaction ID"
                    className="w-full rounded-xl border border-white/10 bg-[#091a21] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-400/40"
                  />

                  <p className="mt-2 text-xs text-slate-500">
                    Enter the transaction ID you received
                    after completing your payment.
                  </p>
                </div>
              )}

              {paymentMethod === "cash" && (
                <div className="rounded-xl border border-amber-400/20 bg-amber-400/10 p-4 text-sm text-amber-100">
                  <p className="font-bold">
                    Cash Payment
                  </p>

                  <p className="mt-1 text-xs leading-5 text-amber-100/70">
                    Submit this request only if you will
                    pay the BookNest administrator directly
                    in cash.
                  </p>
                </div>
              )}

              {/* Error */}
              {error && (
                <div className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200">
                  {error}
                </div>
              )}

              {/* Success */}
              {message && (
                <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-200">
                  {message}
                </div>
              )}

              {/* Buttons */}
              <div className="flex gap-3 pt-1">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={loading}
                  className="flex-1 rounded-xl border border-white/10 bg-[#091a21] px-4 py-3.5 text-sm font-bold text-slate-300 transition hover:bg-white/5 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 rounded-xl bg-[#e9e1cf] px-4 py-3.5 text-sm font-black text-[#07141a] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading
                    ? "Submitting..."
                    : `Submit · ৳${amount}`}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}