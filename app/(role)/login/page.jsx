
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

    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email: email.trim().toLowerCase(),
        password,
        redirect: false,
      });

      /*
       * Login failed
       */
      if (!result || result.error) {
        const errorMessage = result?.error || "";

        if (errorMessage.toLowerCase().includes("pending")) {
          setError("Your account is pending admin approval.");
        } else if (
          errorMessage.toLowerCase().includes("rejected")
        ) {
          setError("Your account has been rejected.");
        } else {
          setError("Invalid email or password.");
        }

        setLoading(false);
        return;
      }

      /*
       * Login successful
       *
       * Auth.js has now created the session.
       * Fetch the current session so we can determine
       * the user's role and status.
       */
      const response = await fetch("/api/auth/session", {
        method: "GET",
        cache: "no-store",
      });

      if (!response.ok) {
        throw new Error("Unable to load session.");
      }

      const session = await response.json();

      if (!session?.user) {
        setError(
          "Login was successful, but your session could not be loaded."
        );
        setLoading(false);
        return;
      }

      const { role, status } = session.user;

      /*
       * SUPERADMIN
       */
      if (role === "superadmin") {
        if (status === "approved") {
          router.replace("/superadmin");
          return;
        }

        setError("Your superadmin account is not approved.");
        setLoading(false);
        return;
      }

      /*
       * MODERATOR
       */
      if (role === "moderator") {
        if (status === "approved") {
          router.replace("/moderator");
          return;
        }

        if (status === "pending") {
          router.replace("/pending");
          return;
        }

        if (status === "rejected") {
          setError("Your account has been rejected.");
          setLoading(false);
          return;
        }
      }

      /*
       * NORMAL USER
       */
      if (role === "user") {
        if (status === "approved") {
          router.replace("/profile");
          return;
        }

        if (status === "pending") {
          router.replace("/pending");
          return;
        }

        if (status === "rejected") {
          setError("Your account has been rejected.");
          setLoading(false);
          return;
        }
      }

      /*
       * Unknown role/status
       */
      setError(
        "Your account information is invalid. Please contact the administrator."
      );

      setLoading(false);
    } catch (error) {
      console.error("LOGIN_ERROR:", error);

      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#101D23] px-6 py-12 text-[#EDE6D6]">
      <div className="w-full max-w-md">

        {/* Brand */}
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

        {/* Login Card */}
        <div className="border border-white/10 bg-[#1D323B] p-7 shadow-2xl">

          {/* Error */}
          {error && (
            <div className="mb-5 border border-[#C1666B]/40 bg-[#C1666B]/10 p-3 text-sm leading-6 text-[#C1666B]">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="space-y-5"
          >

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-xs font-semibold text-[#9FB2B5]"
              >
                Email
              </label>

              <input
                id="email"
                type="email"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);

                  if (error) {
                    setError("");
                  }
                }}
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="w-full border border-white/10 bg-[#15242B] px-4 py-3 text-sm text-[#EDE6D6] outline-none transition focus:border-[#C9A24B]"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-xs font-semibold text-[#9FB2B5]"
              >
                Password
              </label>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);

                  if (error) {
                    setError("");
                  }
                }}
                required
                autoComplete="current-password"
                placeholder="Your password"
                className="w-full border border-white/10 bg-[#15242B] px-4 py-3 text-sm text-[#EDE6D6] outline-none transition focus:border-[#C9A24B]"
              />
            </div>

            {/* Forgot Password */}
            <div className="text-right">
              <Link
                href="/forgot-password"
                className="text-xs font-semibold text-[#8BAF9D] transition hover:text-[#B9D0C4]"
              >
                Forgot password?
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#C9A24B] px-5 py-3 font-semibold text-[#101D23] transition hover:bg-[#D7B75E] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          {/* Signup */}
          <p className="mt-6 text-center text-sm text-[#9FB2B5]">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="font-semibold text-[#C9A24B] hover:underline"
            >
              Create one
            </Link>
          </p>
        </div>

        {/* Back Home */}
        <div className="mt-6 text-center">
          <Link
            href="/"
            className="text-xs text-[#697C80] transition hover:text-[#9FB2B5]"
          >
            ← Back to BookNest
          </Link>
        </div>
      </div>
    </main>
  );
}

