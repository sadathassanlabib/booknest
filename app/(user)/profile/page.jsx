"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";

const UserProfile = () => {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <main className="min-h-screen bg-[#101D23] px-5 py-10 text-[#EDE6D6]">
        <div className="mx-auto max-w-4xl">
          <div className="h-48 animate-pulse rounded-3xl border border-white/10 bg-white/5" />
        </div>
      </main>
    );
  }

  if (!session?.user) {
    return (
      <main className="min-h-screen bg-[#101D23] px-5 py-10 text-[#EDE6D6]">
        <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-white/5 p-10 text-center">
          <h1 className="text-2xl font-bold">
            Please Sign In
          </h1>

          <p className="mt-2 text-sm text-[#899692]">
            You need to sign in to view your profile.
          </p>

          <Link
            href="/login"
            className="mt-6 inline-block rounded-xl bg-[#EDE6D6] px-5 py-3 text-sm font-bold text-[#101D23] transition hover:bg-white"
          >
            Sign In
          </Link>
        </div>
      </main>
    );
  }

  const user = session.user;

  return (
    <main className="min-h-screen bg-[#101D23] px-5 py-10 text-[#EDE6D6]">
      <div className="mx-auto max-w-4xl">

        {/* Header */}
        <div className="mb-8">
          <p className="text-sm font-semibold text-[#8BAF9D]">
            My Account
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight">
            Profile
          </h1>

          <p className="mt-2 text-sm text-[#899692]">
            Manage your BookNest account information.
          </p>
        </div>

        {/* Profile Card */}
        <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">

          {/* Top */}
          <div className="border-b border-white/10 p-6 sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

              {/* Avatar */}
              <div className="grid h-20 w-20 shrink-0 place-items-center rounded-2xl bg-[#EDE6D6] text-2xl font-black text-[#101D23]">
                {user.name?.charAt(0)?.toUpperCase() || "U"}
              </div>

              <div>
                <h2 className="text-2xl font-bold">
                  {user.name}
                </h2>

                <p className="mt-1 text-sm text-[#899692]">
                  {user.email}
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-lg border border-[#8BAF9D]/20 bg-[#8BAF9D]/10 px-3 py-1.5 text-[11px] font-bold capitalize text-[#B9D0C4]">
                    {user.role}
                  </span>

                  <span className="rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-bold capitalize text-[#AEB8B4]">
                    {user.status}
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* Information */}
          <div className="grid gap-4 p-6 sm:grid-cols-2 sm:p-8">

            <div className="rounded-2xl border border-white/10 bg-[#101D23]/60 p-5">
              <p className="text-xs font-semibold text-[#899692]">
                Full Name
              </p>

              <p className="mt-2 text-sm font-bold text-[#EDE6D6]">
                {user.name || "Not available"}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#101D23]/60 p-5">
              <p className="text-xs font-semibold text-[#899692]">
                Email
              </p>

              <p className="mt-2 break-all text-sm font-bold text-[#EDE6D6]">
                {user.email || "Not available"}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#101D23]/60 p-5">
              <p className="text-xs font-semibold text-[#899692]">
                Account Role
              </p>

              <p className="mt-2 text-sm font-bold capitalize text-[#B9D0C4]">
                {user.role || "user"}
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#101D23]/60 p-5">
              <p className="text-xs font-semibold text-[#899692]">
                Account Status
              </p>

              <p className="mt-2 text-sm font-bold capitalize text-[#B9D0C4]">
                {user.status || "pending"}
              </p>
            </div>

          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 border-t border-white/10 p-6 sm:flex-row sm:p-8">

            <button
              type="button"
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-[#EDE6D6] transition hover:bg-white/10"
            >
              Edit Profile
            </button>

            <Link
              href="/"
              className="rounded-xl bg-[#EDE6D6] px-5 py-3 text-center text-sm font-bold text-[#101D23] transition hover:bg-white"
            >
              Back to Home
            </Link>

          </div>
        </section>
      </div>
    </main>
  );
};

export default UserProfile;