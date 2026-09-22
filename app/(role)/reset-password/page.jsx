"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (token) {
      setChecking(false);
    } else {
      setError("Invalid password reset link.");
      setChecking(false);
    }
  }, [token]);

  async function handleSubmit(event) {
    event.preventDefault();

    setSuccess("");
    setError("");

    if (!token) {
      setError("Invalid password reset link.");
      return;
    }

    if (password.length < 8) {
      setError(
        "Password must be at least 8 characters long."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Unable to reset password."
        );
      }

      setSuccess(data.message);

      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      console.error("RESET_PASSWORD_PAGE_ERROR:", error);

      setError(
        error.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  if (checking) {
    return (
      <main className="grid min-h-screen place-items-center bg-[#101D23] text-[#EDE6D6]">
        <p className="text-sm text-[#899692]">
          Checking reset link...
        </p>
      </main>
    );
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
              Create New Password
            </h1>

            <p className="mt-2 text-sm leading-6 text-[#899692]">
              Choose a new password for your BookNest
              account.
            </p>
          </div>

          {/* Success */}
          {success && (
            <div className="mb-5 rounded-xl border border-[#8BAF9D]/20 bg-[#8BAF9D]/10 p-4 text-sm leading-6 text-[#B9D0C4]">
              <p>{success}</p>

              <Link
                href="/login"
                className="mt-3 block font-bold underline"
              >
                Go to Login
              </Link>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm leading-6 text-red-400">
              {error}
            </div>
          )}

          {/* Form */}
          {!success && token && (
            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              {/* New password */}
              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-xs font-bold text-[#AEB8B4]"
                >
                  New Password
                </label>

                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) =>
                    setPassword(event.target.value)
                  }
                  placeholder="Minimum 8 characters"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-white/10 bg-[#101D23] px-4 py-3 text-sm text-[#EDE6D6] outline-none transition placeholder:text-[#596762] focus:border-[#8BAF9D]/50"
                />
              </div>

              {/* Confirm password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-xs font-bold text-[#AEB8B4]"
                >
                  Confirm Password
                </label>

                <input
                  id="confirmPassword"
                  type="password"
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  placeholder="Repeat your password"
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className="w-full rounded-xl border border-white/10 bg-[#101D23] px-4 py-3 text-sm text-[#EDE6D6] outline-none transition placeholder:text-[#596762] focus:border-[#8BAF9D]/50"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[#EDE6D6] px-4 py-3.5 text-sm font-extrabold text-[#101D23] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Resetting..."
                  : "Reset Password"}
              </button>
            </form>
          )}

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