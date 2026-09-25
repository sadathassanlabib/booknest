
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const ROLE_CONFIG = {
  user: {
    label: "User Dashboard",
    home: "/dashboard",
  },

  moderator: {
    label: "Moderator Dashboard",
    home: "/moderator",
  },

  superadmin: {
    label: "Superadmin Dashboard",
    home: "/superadmin",
  },

  admin: {
    label: "Admin Dashboard",
    home: "/dashboard",
  },
};

function getRoleConfig(role) {
  return ROLE_CONFIG[role] || ROLE_CONFIG.user;
}

function isActivePath(pathname, href) {
  if (href === "/dashboard") {
    return pathname === "/dashboard";
  }

  if (href === "/moderator") {
    return pathname === "/moderator";
  }

  if (href === "/superadmin") {
    return pathname === "/superadmin";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

function NavIcon({ type }) {
  const icons = {
    dashboard: "▦",
    profile: "◉",
    books: "▤",
    loans: "↗",
    notifications: "●",
    chat: "☏",
    report: "⚑",
    settings: "⚙",
    policy: "▥",
    users: "♙",
    requests: "⌁",
    moderation: "◈",
    payments: "৳",
    reports: "⚠",
    catalog: "▦",
    logout: "↪",
  };

  return (
    <span className="flex h-5 w-5 shrink-0 items-center justify-center text-[16px] leading-none">
      {icons[type] || "•"}
    </span>
  );
}

function SidebarLink({
  href,
  label,
  icon,
  pathname,
  onClick,
  badge,
}) {
  const active = isActivePath(pathname, href);

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`group flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-semibold transition-all duration-200 ${
        active
          ? "border border-blue-400/15 bg-blue-500/10 text-blue-300 shadow-lg shadow-blue-950/20"
          : "border border-transparent text-slate-400 hover:border-white/5 hover:bg-white/[0.04] hover:text-slate-100"
      }`}
    >
      <span
        className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${
          active
            ? "bg-blue-500/15 text-blue-300"
            : "bg-white/[0.03] text-slate-500 group-hover:bg-white/[0.06] group-hover:text-slate-200"
        }`}
      >
        <NavIcon type={icon} />
      </span>

      <span className="min-w-0 flex-1 truncate">{label}</span>

      {badge !== undefined && badge !== null && (
        <span className="rounded-full border border-blue-400/20 bg-blue-500/10 px-2 py-0.5 text-[9px] font-black text-blue-300">
          {badge}
        </span>
      )}
    </Link>
  );
}

export default function DashboardSidebar({
  role = "user",
  notificationCount = 0,
  mobileOpen: controlledMobileOpen,
  setMobileOpen: controlledSetMobileOpen,
}) {
  const pathname = usePathname();

  const [internalMobileOpen, setInternalMobileOpen] =
    useState(false);

  const isControlled =
    typeof controlledMobileOpen === "boolean" &&
    typeof controlledSetMobileOpen === "function";

  const mobileOpen = isControlled
    ? controlledMobileOpen
    : internalMobileOpen;

  const setMobileOpen = isControlled
    ? controlledSetMobileOpen
    : setInternalMobileOpen;

  const roleConfig = getRoleConfig(role);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileOpen) return;

    const originalOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [mobileOpen]);

  const commonNavigation = [
    {
      href: roleConfig.home,
      label: "Dashboard",
      icon: "dashboard",
    },
    {
      href: "/profile",
      label: "My Profile",
      icon: "profile",
    },
    {
      href: "/catalog",
      label: "Book Catalog",
      icon: "catalog",
    },
    {
      href: "/my-loans",
      label: "My Loans",
      icon: "loans",
    },
    {
      href: "/notifications",
      label: "Notifications",
      icon: "notifications",
      badge:
        notificationCount > 0
          ? notificationCount > 99
            ? "99+"
            : notificationCount
          : undefined,
    },
    {
      href: "/chat",
      label: "Messages",
      icon: "chat",
    },
  ];

  const supportNavigation = [
    {
      href: "/report",
      label: "Report an Issue",
      icon: "report",
    },
    {
      href: "/settings",
      label: "Settings",
      icon: "settings",
    },
    {
      href: "/policy",
      label: "Policies",
      icon: "policy",
    },
  ];

  const moderatorNavigation = [
    {
      href: "/moderator",
      label: "Moderator Home",
      icon: "dashboard",
    },
    {
      href: "/moderator/requests",
      label: "Book Requests",
      icon: "requests",
    },
    {
      href: "/moderator/users",
      label: "Users",
      icon: "users",
    },
    {
      href: "/moderator/reports",
      label: "Reports",
      icon: "reports",
    },
  ];

  const superadminNavigation = [
    {
      href: "/superadmin",
      label: "Superadmin Home",
      icon: "dashboard",
    },
    {
      href: "/superadmin/users",
      label: "User Management",
      icon: "users",
    },
    {
      href: "/superadmin/requests",
      label: "Requests",
      icon: "requests",
    },
    {
      href: "/superadmin/payments",
      label: "Payments",
      icon: "payments",
    },
    {
      href: "/superadmin/moderators",
      label: "Moderators",
      icon: "moderation",
    },
    {
      href: "/superadmin/reports",
      label: "Reports",
      icon: "reports",
    },
  ];

  function closeDrawer() {
    setMobileOpen(false);
  }

  function handleLogout() {
    /*
      আপনার existing logout logic থাকলে এখানে বসাবেন।

      Example:
      signOut({ callbackUrl: "/" });

      এখন আমরা শুধু home page-এ পাঠাচ্ছি না,
      কারণ আপনার authentication system-এর existing
      logout implementation আমরা পরিবর্তন করছি না।
    */
  }

  return (
    <>
      {/* =========================
          MOBILE TOP BAR
      ========================= */}
      <div className="fixed left-0 right-0 top-0 z-40 flex h-[68px] items-center justify-between border-b border-white/[0.07] bg-[#08171e]/95 px-4 backdrop-blur-xl lg:hidden">
        <Link
          href={roleConfig.home}
          className="flex items-center gap-3"
          onClick={closeDrawer}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-blue-400/15 bg-blue-500/10 text-sm font-black text-blue-300">
            BN
          </div>

          <div>
            <p className="text-sm font-black tracking-tight text-[#f1eee5]">
              BookNest
            </p>

            <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-slate-600">
              {roleConfig.label}
            </p>
          </div>
        </Link>

        <button
          type="button"
          onClick={() => setMobileOpen(true)}
          aria-label="Open navigation"
          className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-xl text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
        >
          ☰
        </button>
      </div>

      {/* =========================
          MOBILE OVERLAY
      ========================= */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={closeDrawer}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
        />
      )}

      {/* =========================
          SIDEBAR
      ========================= */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col border-r border-white/[0.07] bg-[#08171e] shadow-2xl shadow-black/50 transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        {/* =========================
            BRAND
        ========================= */}
        <div className="flex h-[82px] shrink-0 items-center justify-between border-b border-white/[0.07] px-5">
          <Link
            href={roleConfig.home}
            onClick={closeDrawer}
            className="flex min-w-0 items-center gap-3"
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-blue-400/15 bg-blue-500/10 text-sm font-black text-blue-300 shadow-lg shadow-blue-950/20">
              BN
            </div>

            <div className="min-w-0">
              <p className="truncate text-base font-black tracking-tight text-[#f1eee5]">
                BookNest
              </p>

              <p className="truncate text-[9px] font-bold uppercase tracking-[0.17em] text-slate-600">
                {roleConfig.label}
              </p>
            </div>
          </Link>

          {/* Mobile Close */}
          <button
            type="button"
            onClick={closeDrawer}
            aria-label="Close sidebar"
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/5 bg-white/[0.03] text-lg text-slate-500 transition hover:bg-white/[0.08] hover:text-white lg:hidden"
          >
            ×
          </button>
        </div>

        {/* =========================
            NAVIGATION
        ========================= */}
        <div className="flex-1 overflow-y-auto px-3 py-5">
          {/* Main */}
          <div>
            <p className="mb-2 px-3 text-[9px] font-black uppercase tracking-[0.2em] text-slate-600">
              Main Menu
            </p>

            <nav className="space-y-1">
              {commonNavigation.map((item) => (
                <SidebarLink
                  key={item.href}
                  {...item}
                  pathname={pathname}
                  onClick={closeDrawer}
                />
              ))}
            </nav>
          </div>

          {/* Role Navigation */}
          {role === "moderator" && (
            <div className="mt-7">
              <p className="mb-2 px-3 text-[9px] font-black uppercase tracking-[0.2em] text-slate-600">
                Moderation
              </p>

              <nav className="space-y-1">
                {moderatorNavigation.map((item) => (
                  <SidebarLink
                    key={item.href}
                    {...item}
                    pathname={pathname}
                    onClick={closeDrawer}
                  />
                ))}
              </nav>
            </div>
          )}

          {role === "superadmin" && (
            <div className="mt-7">
              <p className="mb-2 px-3 text-[9px] font-black uppercase tracking-[0.2em] text-slate-600">
                Administration
              </p>

              <nav className="space-y-1">
                {superadminNavigation.map((item) => (
                  <SidebarLink
                    key={item.href}
                    {...item}
                    pathname={pathname}
                    onClick={closeDrawer}
                  />
                ))}
              </nav>
            </div>
          )}

          {/* Support */}
          <div className="mt-7">
            <p className="mb-2 px-3 text-[9px] font-black uppercase tracking-[0.2em] text-slate-600">
              Account
            </p>

            <nav className="space-y-1">
              {supportNavigation.map((item) => (
                <SidebarLink
                  key={item.href}
                  {...item}
                  pathname={pathname}
                  onClick={closeDrawer}
                />
              ))}
            </nav>
          </div>
        </div>

        {/* =========================
            BOTTOM PROFILE CARD
        ========================= */}
        <div className="shrink-0 border-t border-white/[0.07] p-3">
          <Link
            href="/profile"
            onClick={closeDrawer}
            className={`group flex items-center gap-3 rounded-2xl border p-3 transition ${
              isActivePath(pathname, "/profile")
                ? "border-blue-400/15 bg-blue-500/10"
                : "border-white/5 bg-white/[0.025] hover:border-white/10 hover:bg-white/[0.05]"
            }`}
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#10242d] text-sm font-black text-slate-300">
              U
            </div>

            <div className="min-w-0 flex-1">
              <p className="truncate text-xs font-black text-slate-200">
                My Account
              </p>

              <p className="truncate text-[10px] text-slate-600">
                View Profile
              </p>
            </div>

            <span className="text-slate-600 transition group-hover:translate-x-0.5 group-hover:text-slate-300">
              →
            </span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-2 flex w-full items-center gap-3 rounded-xl px-3.5 py-2.5 text-left text-xs font-bold text-slate-500 transition hover:bg-red-500/[0.06] hover:text-red-300"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.03] text-base">
              <NavIcon type="logout" />
            </span>

            Sign Out
          </button>
        </div>
      </aside>

      {/* =========================
          MOBILE CONTENT SPACING
      ========================= */}
      <div className="h-[68px] lg:hidden" />
    </>
  );
}
