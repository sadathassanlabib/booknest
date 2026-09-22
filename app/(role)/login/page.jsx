"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();

    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });

      // v5-এ শুধু result.error check করলেই হয়
      if (!result || result.error) {
        // authorize-এ thrown error message দেখানোর চেষ্টা
        const msg = result?.error || "";

        if (msg.toLowerCase().includes("pending")) {
          setError("Your account is pending approval.");
        } else if (msg.toLowerCase().includes("rejected")) {
          setError("Your account has been rejected.");
        } else {
          setError("Invalid email or password.");
        }

        setLoading(false);
        return;
      }

      // ✅ Login successful — session cookie set হয়েছে
      // Server-side auth() থেকে role/status পাঠানোর জন্য page reload
      window.location.href = "/redirect-after-login";
    } catch (err) {
      console.error("LOGIN_ERROR:", err);
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#101D23] px-6 py-12 text-[#EDE6D6]">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="mb-10 text-center">
          <Link
            href="/"
            className="font-serif text-3xl font-semibold text-[#C9A24B]"
          >
            BookNest
          </Link>

          <h1 className="mt-8 font-serif text-4xl">
            Welcome back
          </h1>

          <p className="mt-3 text-sm text-[#9FB2B5]">
            Sign in to continue to your BookNest account.
          </p>
        </div>

        {/* Login Form */}
        <form
          onSubmit={handleSubmit}
          className="space-y-5 border border-white/10 bg-[#1D323B] p-7"
        >
          {/* Error */}
          {error && (
            <div className="border border-[#C1666B]/40 bg-[#C1666B]/10 p-3 text-sm text-[#C1666B]">
              {error}
            </div>
          )}

          {/* Email */}
          <div>
            <label className="mb-2 block text-xs text-[#9FB2B5]">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError("");
              }}
              required
              autoComplete="email"
              className="w-full border border-white/10 bg-[#15242B] px-4 py-3 text-sm outline-none focus:border-[#C9A24B]"
              placeholder="you@example.com"
            />
          </div>

          {/* Password */}
          <div>
            <label className="mb-2 block text-xs text-[#9FB2B5]">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError("");
              }}
              required
              autoComplete="current-password"
              className="w-full border border-white/10 bg-[#15242B] px-4 py-3 text-sm outline-none focus:border-[#C9A24B]"
              placeholder="Your password"
            />
          </div>

          {/* Forgot password */}
          <div className="text-right">
            <Link
              href="/forgot-password"
              className="text-xs text-[#8BAF9D] hover:text-[#B9D0C4]"
            >
              Forgot password?
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C9A24B] px-5 py-3 font-semibold text-[#101D23] transition-opacity disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          {/* Signup */}
          <p className="text-center text-sm text-[#9FB2B5]">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="text-[#C9A24B] hover:underline"
            >
              Create one
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}