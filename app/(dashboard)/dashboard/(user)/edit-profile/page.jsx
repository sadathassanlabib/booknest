"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function EditProfilePage() {
  const {
    data: session,
    status,
    update,
  } = useSession();

  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    phone: "",
    area: "",
  });

  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  /*
   * Load current profile
   */
  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (!session?.user) {
      router.replace("/login");
      return;
    }

    async function loadProfile() {
      try {
        const response = await fetch("/api/profile", {
          method: "GET",
          cache: "no-store",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.message || "Failed to load profile."
          );
        }

        setForm({
          name: data.user?.name || session.user.name || "",
          phone: data.user?.phone || "",
          area: data.user?.area || "",
        });
      } catch (error) {
        console.error("LOAD_PROFILE_ERROR:", error);

        setError(
          error.message || "Failed to load profile."
        );
      } finally {
        setPageLoading(false);
      }
    }

    loadProfile();
  }, [session, status, router]);

  /*
   * Input change
   */
  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setMessage("");
  }

  /*
   * Submit
   */
  async function handleSubmit(event) {
    event.preventDefault();

    if (loading) {
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const name = form.name.trim();
      const phone = form.phone.trim();
      const area = form.area.trim();

      if (!name) {
        throw new Error("Full name is required.");
      }

      const response = await fetch("/api/profile", {
        method: "PATCH",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          name,
          phone,
          area,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update profile."
        );
      }

      /*
       * Update NextAuth JWT/session
       *
       * This is the important part for Navbar.
       */
      await update({
        name,
      });

      setForm({
        name,
        phone,
        area,
      });

      setMessage(
        "Profile updated successfully."
      );

      /*
       * Give NextAuth a moment to update
       * before going back to profile.
       */
      setTimeout(() => {
        router.replace("/profile");
        router.refresh();
      }, 500);
    } catch (error) {
      console.error(
        "UPDATE_PROFILE_ERROR:",
        error
      );

      setError(
        error.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  /*
   * Loading
   */
  if (
    status === "loading" ||
    pageLoading
  ) {
    return (
      <main className="min-h-screen bg-[#101D23] px-5 py-10 text-[#EDE6D6]">
        <div className="mx-auto max-w-3xl">

          <div className="animate-pulse rounded-3xl border border-white/10 bg-white/5 p-8">

            <div className="h-7 w-48 rounded bg-white/10" />

            <div className="mt-3 h-4 w-72 rounded bg-white/10" />

            <div className="mt-8 space-y-5">

              <div className="h-14 rounded-xl bg-white/5" />

              <div className="h-14 rounded-xl bg-white/5" />

              <div className="h-14 rounded-xl bg-white/5" />

            </div>
          </div>
        </div>
      </main>
    );
  }

  if (!session?.user) {
    return null;
  }

  const firstLetter =
    form.name?.trim()?.charAt(0)?.toUpperCase() ||
    "U";

  return (
    <main className="min-h-screen bg-[#101D23] px-5 py-10 text-[#EDE6D6]">

      <div className="mx-auto max-w-3xl">

        {/* Header */}

        <div className="mb-8">

          <Link
            href="/profile"
            className="text-sm font-semibold text-[#8BAF9D] transition hover:text-[#B9D0C4]"
          >
            ← Back to Profile
          </Link>

          <p className="mt-8 text-sm font-semibold text-[#8BAF9D]">
            Account Settings
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Edit Profile
          </h1>

          <p className="mt-2 text-sm leading-6 text-[#899692]">
            Update your personal information on BookNest.
          </p>

        </div>

        {/* Card */}

        <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/5 shadow-2xl">

          {/* Preview */}

          <div className="border-b border-white/10 p-6 sm:p-8">

            <div className="flex items-center gap-5">

              <div className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-[#EDE6D6] text-2xl font-black text-[#101D23]">
                {firstLetter}
              </div>

              <div className="min-w-0">

                <h2 className="truncate text-xl font-bold">
                  {form.name || "Your Name"}
                </h2>

                <p className="mt-1 break-all text-sm text-[#899692]">
                  {session.user.email}
                </p>

                <span className="mt-3 inline-flex rounded-lg border border-[#8BAF9D]/20 bg-[#8BAF9D]/10 px-3 py-1.5 text-[11px] font-bold capitalize text-[#B9D0C4]">
                  {session.user.role || "user"}
                </span>

              </div>

            </div>

          </div>

          {/* Form */}

          <form
            onSubmit={handleSubmit}
            className="space-y-6 p-6 sm:p-8"
          >

            {/* Success */}

            {message && (
              <div className="rounded-xl border border-[#8BAF9D]/20 bg-[#8BAF9D]/10 p-4 text-sm font-semibold text-[#B9D0C4]">
                {message}
              </div>
            )}

            {/* Error */}

            {error && (
              <div className="rounded-xl border border-[#C1666B]/20 bg-[#C1666B]/10 p-4 text-sm font-semibold text-[#D98C90]">
                {error}
              </div>
            )}

            {/* Name */}

            <div>

              <label
                htmlFor="name"
                className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[#899692]"
              >
                Full Name
              </label>

              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                required
                minLength={2}
                maxLength={80}
                autoComplete="name"
                placeholder="Your full name"
                className="w-full rounded-xl border border-white/10 bg-[#101D23]/70 px-4 py-3.5 text-sm text-[#EDE6D6] outline-none transition placeholder:text-[#65736F] focus:border-[#8BAF9D]/50"
              />

            </div>

            {/* Email */}

            <div>

              <label
                htmlFor="email"
                className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[#899692]"
              >
                Email Address
              </label>

              <input
                id="email"
                type="email"
                value={session.user.email || ""}
                disabled
                className="w-full cursor-not-allowed rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3.5 text-sm text-[#65736F]"
              />

              <p className="mt-2 text-xs text-[#65736F]">
                Email address cannot be changed here.
              </p>

            </div>

            {/* Phone */}

            <div>

              <label
                htmlFor="phone"
                className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[#899692]"
              >
                Phone Number
              </label>

              <input
                id="phone"
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleChange}
                maxLength={30}
                autoComplete="tel"
                placeholder="01XXXXXXXXX"
                className="w-full rounded-xl border border-white/10 bg-[#101D23]/70 px-4 py-3.5 text-sm text-[#EDE6D6] outline-none transition placeholder:text-[#65736F] focus:border-[#8BAF9D]/50"
              />

            </div>

            {/* Area */}

            <div>

              <label
                htmlFor="area"
                className="mb-2 block text-xs font-semibold uppercase tracking-wide text-[#899692]"
              >
                Area / Location
              </label>

              <input
                id="area"
                name="area"
                type="text"
                value={form.area}
                onChange={handleChange}
                maxLength={120}
                autoComplete="address-level2"
                placeholder="Mirpur, Dhaka"
                className="w-full rounded-xl border border-white/10 bg-[#101D23]/70 px-4 py-3.5 text-sm text-[#EDE6D6] outline-none transition placeholder:text-[#65736F] focus:border-[#8BAF9D]/50"
              />

            </div>

            {/* Profile Photo */}

            <div className="rounded-2xl border border-dashed border-white/10 bg-[#101D23]/40 p-5">

              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                <div>

                  <h3 className="text-sm font-bold">
                    Profile Photo
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-[#899692]">
                    Photo upload will be connected in the next step.
                  </p>

                </div>

                <button
                  type="button"
                  disabled
                  className="rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-bold text-[#65736F]"
                >
                  Upload Photo
                </button>

              </div>

            </div>

            {/* Buttons */}

            <div className="flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:justify-end">

              <Link
                href="/profile"
                className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-center text-sm font-bold text-[#EDE6D6] transition hover:bg-white/10"
              >
                Cancel
              </Link>

              <button
                type="submit"
                disabled={loading}
                className="rounded-xl bg-[#EDE6D6] px-5 py-3 text-sm font-bold text-[#101D23] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loading
                  ? "Saving Changes..."
                  : "Save Changes"}
              </button>

            </div>

          </form>
        </section>
      </div>
    </main>
  );
}