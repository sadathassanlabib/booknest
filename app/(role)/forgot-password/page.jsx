"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Something went wrong. Please try again."
        );
      }

      setMessage(data.message);
      setEmail("");
    } catch (error) {
      console.error("FORGOT_PASSWORD_PAGE_ERROR:", error);
      setError(
        error.message || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#101D23] px-5 py-10 text-[#EDE6D6]">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="mb-8 text-center">
          <Link href="/" className="inline-flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-xl bg-[#EDE6D6] text-sm font-black text-[#101D23]">
              BN
            </div>

            <span className="text-xl font-extrabold">
              BookNest
            </span>
          </Link>
        </div>

        {/* Card */}
        <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl sm:p-8">
          <div className="mb-7">
            <h1 className="text-2xl font-bold">
              Forgot Password?
            </h1>

            <p className="mt-2 text-sm leading-6 text-[#899692]">
              Enter your email address and we will send you
              a password reset link.
            </p>
          </div>

          {/* Success */}
          {message && (
            <div className="mb-5 rounded-xl border border-[#8BAF9D]/20 bg-[#8BAF9D]/10 p-4 text-sm leading-6 text-[#B9D0C4]">
              {message}
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm leading-6 text-red-400">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-xs font-bold text-[#AEB8B4]"
              >
                Email Address
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
                autoComplete="email"
                className="w-full rounded-xl border border-white/10 bg-[#101D23] px-4 py-3 text-sm text-[#EDE6D6] outline-none transition placeholder:text-[#596762] focus:border-[#8BAF9D]/50"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-[#EDE6D6] px-4 py-3.5 text-sm font-extrabold text-[#101D23] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          {/* Back to login */}
          <div className="mt-6 text-center">
            <Link
              href="/login"
              className="text-sm font-semibold text-[#8BAF9D] transition hover:text-[#B9D0C4]"
            >
              ← Back to Login
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}