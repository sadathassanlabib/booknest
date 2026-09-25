"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const UserProfile = () => {
  const { data: session, status } = useSession();

  const router = useRouter();

  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (!session?.user?.id) {
      setLoadingProfile(false);
      return;
    }

    let cancelled = false;

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

        if (!cancelled) {
          setProfile(data.user);
        }
      } catch (error) {
        console.error(
          "PROFILE_LOAD_ERROR:",
          error
        );
      } finally {
        if (!cancelled) {
          setLoadingProfile(false);
        }
      }
    }

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [session?.user?.id, status]);

  /*
   * ---------------------------------------
   * Loading
   * ---------------------------------------
   */

  if (
    status === "loading" ||
    loadingProfile
  ) {
    return (
      <main className="min-h-screen bg-[#101D23] px-5 py-10 text-[#EDE6D6]">
        <div className="mx-auto max-w-4xl">

          <div className="mb-8">
            <div className="h-4 w-24 animate-pulse rounded bg-white/10" />

            <div className="mt-3 h-9 w-40 animate-pulse rounded bg-white/10" />

            <div className="mt-3 h-4 w-72 animate-pulse rounded bg-white/10" />
          </div>

          <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/5">

            <div className="border-b border-white/10 p-6 sm:p-8">
              <div className="flex items-center gap-5">

                <div className="h-20 w-20 animate-pulse rounded-2xl bg-white/10" />

                <div>
                  <div className="h-6 w-40 animate-pulse rounded bg-white/10" />

                  <div className="mt-2 h-4 w-52 animate-pulse rounded bg-white/10" />
                </div>

              </div>
            </div>

            <div className="grid gap-4 p-6 sm:grid-cols-2 sm:p-8">

              <div className="h-24 animate-pulse rounded-2xl bg-white/5" />

              <div className="h-24 animate-pulse rounded-2xl bg-white/5" />

              <div className="h-24 animate-pulse rounded-2xl bg-white/5" />

              <div className="h-24 animate-pulse rounded-2xl bg-white/5" />

            </div>
          </div>
        </div>
      </main>
    );
  }

  /*
   * ---------------------------------------
   * Not Logged In
   * ---------------------------------------
   */

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

  /*
   * ---------------------------------------
   * Fresh MongoDB User
   * ---------------------------------------
   */

  const user = profile || {
    id: session.user.id,
    name: session.user.name || "",
    email: session.user.email || "",
    phone: "",
    area: "",
    role: session.user.role || "user",
    status: session.user.status || "pending",
    image: session.user.image || "",
  };

  const firstLetter =
    user.name?.trim()?.charAt(0)?.toUpperCase() ||
    "U";

  /*
   * ---------------------------------------
   * Sign Out
   * ---------------------------------------
   */

  const handleSignOut = async () => {
    await signOut({
      callbackUrl: "/",
    });
  };

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

          {/* User Header */}

          <div className="border-b border-white/10 p-6 sm:p-8">

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">

              {/* Avatar */}

              <div className="grid h-20 w-20 shrink-0 place-items-center overflow-hidden rounded-2xl bg-[#EDE6D6] text-2xl font-black text-[#101D23]">

                {user.image ? (
                  <img
                    src={user.image}
                    alt={user.name || "Profile"}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  firstLetter
                )}

              </div>

              {/* Name */}

              <div>

                <h2 className="text-2xl font-bold">
                  {user.name || "BookNest User"}
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

          {/* Account Information */}

          <div className="grid gap-4 p-6 sm:grid-cols-2 sm:p-8">

            {/* Email */}

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">

              <p className="text-[10px] font-bold uppercase tracking-wider text-[#899692]">
                Email
              </p>

              <p className="mt-2 break-all text-sm font-semibold text-[#EDE6D6]">
                {user.email || "Not provided"}
              </p>

            </div>

            {/* Phone */}

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">

              <p className="text-[10px] font-bold uppercase tracking-wider text-[#899692]">
                Phone
              </p>

              <p className="mt-2 text-sm font-semibold text-[#EDE6D6]">
                {user.phone || "Not added"}
              </p>

            </div>

            {/* Area */}

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">

              <p className="text-[10px] font-bold uppercase tracking-wider text-[#899692]">
                Area
              </p>

              <p className="mt-2 text-sm font-semibold text-[#EDE6D6]">
                {user.area || "Not added"}
              </p>

            </div>

            {/* Role */}

            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">

              <p className="text-[10px] font-bold uppercase tracking-wider text-[#899692]">
                Account Role
              </p>

              <p className="mt-2 text-sm font-semibold capitalize text-[#EDE6D6]">
                {user.role || "user"}
              </p>

            </div>

          </div>

          {/* Actions */}

          <div className="flex flex-col gap-3 border-t border-white/10 p-6 sm:flex-row sm:p-8">

            <Link
              href="/edit-profile"
              className="rounded-xl bg-[#EDE6D6] px-5 py-3 text-center text-sm font-bold text-[#101D23] transition hover:bg-white"
            >
              Edit Profile
            </Link>

            <Link
              href="/change-password"
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-center text-sm font-bold text-[#EDE6D6] transition hover:bg-white/10"
            >
              Change Password
            </Link>

            <button
              type="button"
              onClick={handleSignOut}
              className="rounded-xl border border-red-500/10 bg-red-500/5 px-5 py-3 text-sm font-bold text-red-400 transition hover:bg-red-500/10"
            >
              Sign Out
            </button>

          </div>

        </section>

      </div>

    </main>
  );
};

export default UserProfile;