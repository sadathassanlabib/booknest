"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function SignupPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    area: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    // typing করলে error clear
    if (error) setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setLoading(true);
    setError("");

    // Basic validation
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      // Safe JSON parse (খালি body হলে crash হবে না)
      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(
          data.message || `Registration failed (${response.status})`
        );
      }

      // Success — pending page-এ পাঠান
      router.push("/pending");
    } catch (err) {
      console.error(err);
      setError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#101D23] px-6 py-12 text-[#EDE6D6]">
      <div className="mx-auto max-w-md">
        <div className="mb-10 text-center">
          <Link
            href="/"
            className="font-serif text-3xl font-semibold text-[#C9A24B]"
          >
            BookNest
          </Link>

          <h1 className="mt-8 font-serif text-4xl">
            Create your account
          </h1>

          <p className="mt-3 text-sm leading-6 text-[#9FB2B5]">
            Join BookNest and become part of the reading community.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-5 border border-white/10 bg-[#1D323B] p-7"
        >
          {error && (
            <div className="border border-[#C1666B]/40 bg-[#C1666B]/10 p-3 text-sm text-[#C1666B]">
              {error}
            </div>
          )}

          {/* Full Name */}
          <div>
            <label className="mb-2 block text-xs text-[#9FB2B5]">
              Full Name
            </label>

            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              className="w-full border border-white/10 bg-[#15242B] px-4 py-3 text-sm outline-none transition focus:border-[#C9A24B]"
              placeholder="Your name"
            />
          </div>

          {/* Email */}
          <div>
            <label className="mb-2 block text-xs text-[#9FB2B5]">
              Email
            </label>

            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full border border-white/10 bg-[#15242B] px-4 py-3 text-sm outline-none transition focus:border-[#C9A24B]"
              placeholder="you@example.com"
            />
          </div>

          {/* Password */}
          <div>
            <label className="mb-2 block text-xs text-[#9FB2B5]">
              Password
            </label>

            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full border border-white/10 bg-[#15242B] px-4 py-3 text-sm outline-none transition focus:border-[#C9A24B]"
              placeholder="At least 6 characters"
            />
          </div>

          {/* Phone + Area */}
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xs text-[#9FB2B5]">
                Phone
              </label>

              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full border border-white/10 bg-[#15242B] px-4 py-3 text-sm outline-none focus:border-[#C9A24B]"
                placeholder="01XXXXXXXXX"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs text-[#9FB2B5]">
                Area
              </label>

              <input
                name="area"
                value={form.area}
                onChange={handleChange}
                className="w-full border border-white/10 bg-[#15242B] px-4 py-3 text-sm outline-none focus:border-[#C9A24B]"
                placeholder="Mirpur"
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#C9A24B] px-5 py-3 font-semibold text-[#101D23] transition hover:bg-[#D8B65E] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>

          <p className="text-center text-sm text-[#9FB2B5]">
            Already have an account?{" "}
            <Link href="/login" className="text-[#C9A24B]">
              Login
            </Link>
          </p>
        </form>
      </div>
    </main>
  );
}