"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { siteConfig } from "@/lib/siteConfig";

const Navbar = () => {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const isLoading = status === "loading";
  const user = session?.user;

  const role = user?.role;
  const accountStatus = user?.status;
  const isAuthenticated = !!user;

  // ---------------------------------------
  // Active navigation
  // ---------------------------------------
  const isActive = (href) => {
    if (href === "/") {
      return pathname === "/";
    }

    const cleanHref = href.split("#")[0];

    return (
      pathname === cleanHref ||
      pathname.startsWith(`${cleanHref}/`)
    );
  };

  // ---------------------------------------
  // Sign out
  // ---------------------------------------
  const handleSignOut = async () => {
    await signOut({
      callbackUrl: "/",
    });
  };

  // ---------------------------------------
  // Role based navigation
  // ---------------------------------------
  const getRoleLinks = () => {
    if (!isAuthenticated) {
      return [];
    }

    if (accountStatus !== "approved") {
      return [];
    }

    if (role === "superadmin") {
      return [
        {
          href: "/superadmin",
          label: "Super Admin",
        },
      ];
    }

    if (role === "moderator") {
      return [
        {
          href: "/moderator",
          label: "Moderator",
        },
      ];
    }

    if (role === "user") {
      return [
        {
          href: "/profile",
          label: "My Account",
        },
      ];
    }

    return [];
  };

  const roleLinks = getRoleLinks();

  // ---------------------------------------
  // Public navigation
  // ---------------------------------------
  const publicNavigation = siteConfig.navigation;

  // ---------------------------------------
  // Profile destination
  // ---------------------------------------
  const profileHref =
    role === "superadmin"
      ? "/superadmin"
      : role === "moderator"
      ? "/moderator"
      : "/profile";

  // ---------------------------------------
  // Role badge
  // ---------------------------------------
  const getRoleBadge = () => {
    if (role === "superadmin") {
      return "Admin";
    }

    if (role === "moderator") {
      return "Moderator";
    }

    return "Member";
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#101D23]/90 backdrop-blur-xl">
      <div className="mx-auto flex h-[74px] w-[92%] max-w-[1180px] items-center justify-between gap-5">

        {/* =========================================
            LOGO
        ========================================= */}
        <Link
          href="/"
          className="group flex items-center gap-3"
        >
          <div className="grid h-10 w-10 place-items-center rounded-xl bg-[#EDE6D6] text-xs font-black text-[#101D23] transition duration-300 group-hover:scale-105">
            BN
          </div>

          <div>
            <div className="text-[17px] font-extrabold tracking-tight text-[#EDE6D6]">
              {siteConfig.name}
            </div>

            <span className="block text-[9px] font-semibold text-[#9CA8A5]">
              {siteConfig.tagline}
            </span>
          </div>
        </Link>

        {/* =========================================
            DESKTOP NAVIGATION
        ========================================= */}
        <nav className="hidden items-center gap-7 md:flex">

          {/* Public Links */}
          {publicNavigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`relative text-[12px] font-bold transition-colors ${
                isActive(item.href)
                  ? "text-[#EDE6D6]"
                  : "text-[#9CA8A5] hover:text-[#EDE6D6]"
              }`}
            >
              {item.label}

              {isActive(item.href) && (
                <span className="absolute -bottom-[8px] left-1/2 h-[2px] w-4 -translate-x-1/2 rounded-full bg-[#8BAF9D]" />
              )}
            </Link>
          ))}

          {/* Role Links */}
          {!isLoading &&
            roleLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`relative text-[12px] font-bold transition-colors ${
                  isActive(item.href)
                    ? "text-[#8BAF9D]"
                    : "text-[#9CA8A5] hover:text-[#8BAF9D]"
                }`}
              >
                {item.label}

                {isActive(item.href) && (
                  <span className="absolute -bottom-[8px] left-1/2 h-[2px] w-4 -translate-x-1/2 rounded-full bg-[#8BAF9D]" />
                )}
              </Link>
            ))}
        </nav>

        {/* =========================================
            DESKTOP AUTH AREA
        ========================================= */}
        <div className="hidden items-center gap-2 md:flex">

          {/* Loading */}
          {isLoading && (
            <div className="h-9 w-28 animate-pulse rounded-lg bg-white/10" />
          )}

          {/* Guest */}
          {!isLoading && !isAuthenticated && (
            <>
              <Link
                href="/login"
                className="rounded-lg px-3 py-2 text-[11px] font-bold text-[#AEB8B4] transition hover:bg-white/5 hover:text-[#EDE6D6]"
              >
                Sign In
              </Link>

              <Link
                href="/signup"
                className="rounded-lg border border-[#EDE6D6]/20 bg-[#EDE6D6] px-4 py-2.5 text-[11px] font-extrabold text-[#101D23] transition hover:bg-white"
              >
                Join BookNest
              </Link>
            </>
          )}

          {/* Logged In */}
          {!isLoading && isAuthenticated && (
            <>
              {/* Profile Name */}
              <Link
                href={profileHref}
                className="group mr-2 hidden text-right lg:block"
              >
                <p className="text-[11px] font-bold text-[#EDE6D6] transition-colors group-hover:text-[#8BAF9D]">
                  {user.name}
                </p>

                <p className="text-[9px] font-semibold capitalize text-[#899692]">
                  {role}
                </p>
              </Link>

              {/* Role Badge */}
              <div
                className={`rounded-lg border px-3 py-2 text-[10px] font-bold ${
                  role === "superadmin"
                    ? "border-[#8BAF9D]/20 bg-[#8BAF9D]/15 text-[#A9C6B7]"
                    : role === "moderator"
                    ? "border-[#D5B76F]/20 bg-[#D5B76F]/10 text-[#DCC98E]"
                    : "border-white/10 bg-white/5 text-[#B8C3BF]"
                }`}
              >
                {getRoleBadge()}
              </div>

              {/* Sign Out */}
              <button
                type="button"
                onClick={handleSignOut}
                className="rounded-lg px-3 py-2 text-[11px] font-bold text-[#899692] transition hover:bg-red-500/10 hover:text-red-400"
              >
                Sign Out
              </button>
            </>
          )}
        </div>

        {/* =========================================
            MOBILE MENU
        ========================================= */}
        <details className="relative md:hidden">

          <summary className="grid h-10 w-10 cursor-pointer list-none place-items-center rounded-lg border border-white/10 bg-white/5 text-[#EDE6D6] transition hover:bg-white/10">
            ☰
          </summary>

          <div className="absolute right-0 top-12 w-64 rounded-2xl border border-white/10 bg-[#17262D]/95 p-3 shadow-2xl backdrop-blur-xl">

            {/* Public Navigation */}
            {publicNavigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`block rounded-lg px-3 py-2.5 text-xs font-semibold transition ${
                  isActive(item.href)
                    ? "bg-[#8BAF9D]/10 text-[#B9D0C4]"
                    : "text-[#AEB8B4] hover:bg-white/5 hover:text-[#EDE6D6]"
                }`}
              >
                {item.label}
              </Link>
            ))}

            {/* Role Navigation */}
            {!isLoading &&
              roleLinks.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`mt-1 block rounded-lg px-3 py-2.5 text-xs font-semibold transition ${
                    isActive(item.href)
                      ? "bg-[#8BAF9D]/15 text-[#B9D0C4]"
                      : "text-[#AEB8B4] hover:bg-white/5 hover:text-[#EDE6D6]"
                  }`}
                >
                  {item.label}
                </Link>
              ))}

            <div className="my-2 border-t border-white/10" />

            {/* =====================================
                MOBILE GUEST
            ===================================== */}
            {!isLoading && !isAuthenticated && (
              <>
                <Link
                  href="/login"
                  className="block rounded-lg px-3 py-2.5 text-xs font-semibold text-[#AEB8B4] transition hover:bg-white/5 hover:text-[#EDE6D6]"
                >
                  Sign In
                </Link>

                <Link
                  href="/signup"
                  className="mt-1 block rounded-lg bg-[#EDE6D6] px-3 py-2.5 text-center text-xs font-extrabold text-[#101D23] transition hover:bg-white"
                >
                  Join BookNest
                </Link>
              </>
            )}

            {/* =====================================
                MOBILE LOGGED IN
            ===================================== */}
            {!isLoading && isAuthenticated && (
              <>
                {/* Profile */}
                <Link
                  href={profileHref}
                  className="mb-2 block rounded-xl border border-white/10 bg-white/5 p-3 transition hover:bg-white/10"
                >
                  <p className="text-xs font-bold text-[#EDE6D6]">
                    {user.name}
                  </p>

                  <p className="mt-1 text-[10px] font-semibold capitalize text-[#899692]">
                    {role} · {accountStatus}
                  </p>
                </Link>

                {/* Sign Out */}
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="w-full rounded-lg px-3 py-2.5 text-left text-xs font-semibold text-red-400 transition hover:bg-red-500/10"
                >
                  Sign Out
                </button>
              </>
            )}
          </div>
        </details>
      </div>
    </header>
  );
};

export default Navbar;