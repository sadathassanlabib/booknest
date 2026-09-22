"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

const statItems = [
  {
    key: "books",
    label: "My Books",
    href: "/book/my-books",
    description: "Books you have added",
    icon: "▣",
  },
  {
    key: "loans",
    label: "Active Loans",
    href: "/my-loans",
    description: "Books currently with you",
    icon: "↗",
  },
  {
    key: "requests",
    label: "Pending Requests",
    href: "/my-requests",
    description: "Requests waiting for action",
    icon: "◌",
  },
  {
    key: "fine",
    label: "Unpaid Fine",
    href: "/my-loans",
    description: "Outstanding payment",
    icon: "৳",
  },
];

const quickActions = [
  {
    title: "Browse Catalog",
    description: "Find books available to borrow.",
    href: "/catalog",
    icon: "⌕",
  },
  {
    title: "Add New Book",
    description: "Share your book with the community.",
    href: "/book/add",
    icon: "+",
  },
  {
    title: "My Loans",
    description: "Check your active and completed loans.",
    href: "/my-loans",
    icon: "↗",
  },
  {
    title: "My Requests",
    description: "Track your borrow requests.",
    href: "/my-requests",
    icon: "◌",
  },
  {
    title: "Messages",
    description: "Chat with other BookNest users.",
    href: "/messages",
    icon: "✉",
  },
  {
    title: "Notifications",
    description: "See your latest updates.",
    href: "/notifications",
    icon: "◉",
  },
  {
    title: "Report Issue",
    description: "Report a problem or concern.",
    href: "/report",
    icon: "!",
  },
  {
    title: "Settings",
    description: "Manage your account preferences.",
    href: "/settings",
    icon: "⚙",
  },
];

const mobileNav = [
  ["Dashboard", "/dashboard"],
  ["Catalog", "/catalog"],
  ["My Books", "/book/my-books"],
  ["Loans", "/my-loans"],
  ["Requests", "/my-requests"],
  ["Messages", "/messages"],
  ["Notifications", "/notifications"],
  ["Settings", "/settings"],
];

function formatDate(date) {
  if (!date) return "";

  try {
    return new Date(date).toLocaleDateString("en-BD", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

export default function UserDashboard() {
  const { data: session, status: sessionStatus } = useSession();

  const [books, setBooks] = useState([]);
  const [loans, setLoans] = useState([]);
  const [requests, setRequests] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadDashboard() {
    try {
      setLoading(true);
      setError("");

      const [booksResponse, loansResponse, requestsResponse] =
        await Promise.all([
          fetch("/api/books", {
            cache: "no-store",
          }),
          fetch("/api/loans", {
            cache: "no-store",
          }),
          fetch("/api/requests", {
            cache: "no-store",
          }),
        ]);

      const booksData = booksResponse.ok
        ? await booksResponse.json()
        : [];

      const loansData = loansResponse.ok
        ? await loansResponse.json()
        : [];

      const requestsData = requestsResponse.ok
        ? await requestsResponse.json()
        : [];

      setBooks(Array.isArray(booksData) ? booksData : []);

      setLoans(Array.isArray(loansData) ? loansData : []);

      setRequests(
        Array.isArray(requestsData)
          ? requestsData
          : []
      );
    } catch (err) {
      console.error("DASHBOARD_LOAD_ERROR:", err);
      setError("Unable to load dashboard data.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      loadDashboard();
    }

    if (sessionStatus === "unauthenticated") {
      setLoading(false);
    }
  }, [sessionStatus]);

  const activeLoans = loans.filter(
    (loan) => loan.status === "active"
  );

  const pendingRequests = requests.filter(
    (request) => request.status === "pending"
  );

  const unpaidFine = loans.reduce((total, loan) => {
    if (
      loan.paymentStatus === "paid" ||
      loan.paymentStatus === "not_required"
    ) {
      return total;
    }

    return total + Number(loan.totalFine || 0);
  }, 0);

  const stats = {
    books: books.length,
    loans: activeLoans.length,
    requests: pendingRequests.length,
    fine: unpaidFine,
  };

  if (sessionStatus === "loading" || loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#07141a] px-4 text-[#f4efe3]">
        <div className="w-full max-w-sm rounded-2xl border border-white/10 bg-[#0d2028] px-6 py-7 text-center shadow-2xl">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-600 border-t-[#e9e1cf]" />

          <p className="mt-4 text-sm font-bold text-slate-300">
            Loading your dashboard...
          </p>
        </div>
      </main>
    );
  }

  if (!session?.user) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#07141a] px-4 py-10 text-[#f4efe3]">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0d2028] p-6 text-center sm:p-8">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-slate-500">
            BookNest
          </p>

          <h1 className="mt-3 text-2xl font-black sm:text-3xl">
            Sign in required
          </h1>

          <p className="mt-3 text-sm leading-6 text-slate-400">
            Please sign in to access your BookNest dashboard.
          </p>

          <Link
            href="/login"
            className="mt-7 inline-flex w-full items-center justify-center rounded-xl bg-[#e9e1cf] px-6 py-3.5 text-sm font-black text-[#07141a] transition hover:bg-white sm:w-auto"
          >
            Sign In
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#07141a] text-[#f4efe3]">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-100px] top-[-100px] h-64 w-64 rounded-full bg-blue-500/5 blur-3xl sm:h-80 sm:w-80" />

        <div className="absolute bottom-[-120px] right-[-100px] h-80 w-80 rounded-full bg-cyan-400/5 blur-3xl sm:h-96 sm:w-96" />
      </div>

      <div className="relative flex min-h-screen">
        {/* Desktop Sidebar */}
        <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-[#081820] xl:block">
          <div className="sticky top-0 flex h-screen flex-col p-5">
            <Link
              href="/"
              className="border-b border-white/10 px-3 pb-5"
            >
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-500">
                Community Library
              </p>

              <p className="mt-2 text-2xl font-black tracking-tight">
                Book
                <span className="text-blue-300">
                  Nest
                </span>
              </p>
            </Link>

            <nav className="mt-6 space-y-1">
              <SidebarLink
                href="/dashboard"
                label="Dashboard"
                icon="⌂"
                active
              />

              <SidebarLink
                href="/catalog"
                label="Catalog"
                icon="⌕"
              />

              <SidebarLink
                href="/book/my-books"
                label="My Books"
                icon="▣"
              />

              <SidebarLink
                href="/my-requests"
                label="My Requests"
                icon="◌"
              />

              <SidebarLink
                href="/my-loans"
                label="My Loans"
                icon="↗"
              />

              <SidebarLink
                href="/messages"
                label="Messages"
                icon="✉"
              />

              <SidebarLink
                href="/notifications"
                label="Notifications"
                icon="◉"
              />

              <SidebarLink
                href="/report"
                label="Report Issue"
                icon="!"
              />
            </nav>

            <div className="mt-auto space-y-1 border-t border-white/10 pt-4">
              <SidebarLink
                href="/profile"
                label="Profile"
                icon="◎"
              />

              <SidebarLink
                href="/settings"
                label="Settings"
                icon="⚙"
              />
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <section className="min-w-0 flex-1">
          {/* Header */}
          <header className="sticky top-0 z-40 border-b border-white/10 bg-[#07141a]/90 backdrop-blur-xl">
            <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-3 px-4 py-3.5 sm:px-6 lg:px-8">
              <div className="min-w-0">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 sm:text-xs">
                  User Dashboard
                </p>

                <h1 className="mt-1 truncate text-lg font-black sm:text-2xl">
                  Welcome,{" "}
                  {session.user.name ||
                    "BookNest User"}
                </h1>
              </div>

              <div className="flex shrink-0 items-center gap-2 sm:gap-3">
                <Link
                  href="/notifications"
                  aria-label="Notifications"
                  className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-[#0d2028] text-sm text-slate-300 transition hover:border-white/20 hover:text-white sm:h-10 sm:w-10"
                >
                  ◉
                </Link>

                <Link
                  href="/profile"
                  className="flex items-center gap-2 rounded-xl border border-white/10 bg-[#0d2028] p-1.5 pr-2.5 transition hover:border-white/20 sm:gap-3 sm:p-2 sm:pr-3"
                >
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e9e1cf] text-xs font-black text-[#07141a] sm:h-9 sm:w-9">
                    {(session.user.name || "U")
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div className="hidden min-w-0 sm:block">
                    <p className="max-w-[120px] truncate text-xs font-bold text-white">
                      {session.user.name ||
                        "User"}
                    </p>

                    <p className="text-[10px] text-slate-500">
                      Member
                    </p>
                  </div>
                </Link>
              </div>
            </div>
          </header>

          <div className="mx-auto w-full max-w-[1500px] px-4 py-5 sm:px-6 sm:py-7 lg:px-8 lg:py-9">
            {/* Mobile / Tablet Navigation */}
            <div className="mb-6 overflow-x-auto xl:hidden">
              <div className="flex min-w-max gap-2 pb-1">
                {mobileNav.map(([label, href]) => (
                  <Link
                    key={href}
                    href={href}
                    className={`rounded-xl border px-3.5 py-2.5 text-xs font-bold transition sm:px-4 ${
                      href === "/dashboard"
                        ? "border-blue-400/30 bg-blue-400/10 text-blue-200"
                        : "border-white/10 bg-[#0d2028] text-slate-400 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-6 rounded-2xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-200 sm:px-5">
                {error}
              </div>
            )}

            {/* Stats */}
            <section>
              <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                {statItems.map((item) => (
                  <Link
                    key={item.key}
                    href={item.href}
                    className="group min-w-0 rounded-2xl border border-white/10 bg-[#0d2028] p-4 transition hover:-translate-y-0.5 hover:border-white/20 hover:bg-[#102630] sm:p-5"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="truncate text-[10px] font-bold uppercase tracking-wider text-slate-500 sm:text-xs">
                          {item.label}
                        </p>

                        <p className="mt-2 text-2xl font-black text-[#f4efe3] sm:mt-3 sm:text-3xl">
                          {item.key === "fine"
                            ? `৳${stats[item.key]}`
                            : stats[item.key]}
                        </p>
                      </div>

                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#091a21] text-xs font-black text-slate-500 transition group-hover:text-blue-300 sm:h-9 sm:w-9">
                        {item.icon}
                      </div>
                    </div>

                    <p className="mt-2 hidden text-xs leading-5 text-slate-500 sm:mt-3 sm:block">
                      {item.description}
                    </p>
                  </Link>
                ))}
              </div>
            </section>

            {/* Quick Actions */}
            <section className="mt-8 sm:mt-10">
              <div className="mb-4 sm:mb-5">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 sm:text-xs">
                  Workspace
                </p>

                <h2 className="mt-1.5 text-xl font-black sm:mt-2 sm:text-2xl">
                  Quick Actions
                </h2>
              </div>

              <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3 xl:grid-cols-4">
                {quickActions.map((action) => (
                  <Link
                    key={action.href}
                    href={action.href}
                    className="group min-w-0 rounded-2xl border border-white/10 bg-[#0d2028] p-4 transition hover:-translate-y-0.5 hover:border-blue-300/20 hover:bg-[#102630] sm:p-5"
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-[#091a21] text-base font-black text-slate-300 transition group-hover:border-blue-300/20 group-hover:text-blue-200 sm:h-11 sm:w-11 sm:text-lg">
                      {action.icon}
                    </div>

                    <h3 className="mt-3 truncate text-sm font-black text-white sm:mt-5 sm:text-base">
                      {action.title}
                    </h3>

                    <p className="mt-1.5 hidden text-xs leading-5 text-slate-500 sm:mt-2 sm:block">
                      {action.description}
                    </p>
                  </Link>
                ))}
              </div>
            </section>

            {/* Activity + Account */}
            <section className="mt-8 grid gap-4 sm:mt-10 sm:gap-5 xl:grid-cols-[1.4fr_0.8fr]">
              {/* Recent Loans */}
              <div className="min-w-0 rounded-2xl border border-white/10 bg-[#0d2028] p-4 sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 sm:text-xs">
                      Activity
                    </p>

                    <h2 className="mt-1.5 truncate text-lg font-black sm:mt-2 sm:text-xl">
                      Recent Loans
                    </h2>
                  </div>

                  <Link
                    href="/my-loans"
                    className="shrink-0 text-[10px] font-bold text-blue-300 hover:text-blue-200 sm:text-xs"
                  >
                    View all →
                  </Link>
                </div>

                <div className="mt-5 space-y-2.5 sm:mt-6 sm:space-y-3">
                  {loans.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-white/10 bg-[#091a21] px-4 py-7 text-center sm:px-5 sm:py-8">
                      <p className="text-sm font-bold text-slate-400">
                        No loan activity yet.
                      </p>

                      <Link
                        href="/catalog"
                        className="mt-3 inline-block text-xs font-bold text-blue-300"
                      >
                        Browse the catalog →
                      </Link>
                    </div>
                  ) : (
                    loans.slice(0, 5).map((loan) => (
                      <div
                        key={
                          loan._id ||
                          loan.id
                        }
                        className="flex min-w-0 items-center justify-between gap-3 rounded-xl border border-white/5 bg-[#091a21] px-3 py-3.5 sm:px-4 sm:py-4"
                      >
                        <div className="min-w-0">
                          <p className="truncate text-xs font-bold text-slate-200 sm:text-sm">
                            {loan.bookTitle ||
                              "Book"}
                          </p>

                          <p className="mt-1 text-[10px] text-slate-500 sm:text-xs">
                            {loan.status ===
                            "active"
                              ? "Active loan"
                              : "Completed"}{" "}
                            ·{" "}
                            {formatDate(
                              loan.startDate ||
                                loan.createdAt
                            )}
                          </p>
                        </div>

                        <span
                          className={`shrink-0 rounded-full px-2 py-1 text-[8px] font-black uppercase sm:px-3 sm:text-[10px] ${
                            loan.status ===
                            "active"
                              ? "bg-blue-400/10 text-blue-200"
                              : loan.status ===
                                "returned"
                              ? "bg-emerald-400/10 text-emerald-200"
                              : "bg-orange-400/10 text-orange-200"
                          }`}
                        >
                          {loan.status ||
                            "unknown"}
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Account */}
              <div className="min-w-0 rounded-2xl border border-white/10 bg-[#0d2028] p-4 sm:p-6">
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 sm:text-xs">
                  Account
                </p>

                <h2 className="mt-1.5 text-lg font-black sm:mt-2 sm:text-xl">
                  Your Membership
                </h2>

                <div className="mt-5 rounded-xl border border-white/10 bg-[#091a21] p-4 sm:mt-6 sm:p-5">
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#e9e1cf] text-base font-black text-[#07141a] sm:h-14 sm:w-14 sm:text-lg">
                      {(session.user.name ||
                        "U")
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-black text-white sm:text-base">
                        {session.user.name ||
                          "BookNest User"}
                      </p>

                      <p className="mt-1 truncate text-[10px] text-slate-500 sm:text-xs">
                        {session.user.email}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 border-t border-white/10 pt-4 sm:mt-5">
                    <div className="flex items-center justify-between gap-3 text-xs">
                      <span className="text-slate-500">
                        Account Status
                      </span>

                      <span className="shrink-0 rounded-full bg-emerald-400/10 px-2.5 py-1 text-[10px] font-bold text-emerald-200">
                        Approved
                      </span>
                    </div>

                    <div className="mt-3 flex items-center justify-between gap-3 text-xs">
                      <span className="text-slate-500">
                        Role
                      </span>

                      <span className="truncate font-bold capitalize text-slate-200">
                        {session.user.role ||
                          "user"}
                      </span>
                    </div>
                  </div>
                </div>

                <Link
                  href="/profile"
                  className="mt-3 block rounded-xl border border-white/10 bg-[#091a21] px-4 py-3 text-center text-xs font-black text-slate-300 transition hover:border-white/20 hover:text-white sm:mt-4"
                >
                  View Profile
                </Link>
              </div>
            </section>

            {/* Footer */}
            <footer className="mt-8 border-t border-white/10 pt-5 sm:mt-10 sm:pt-6">
              <div className="flex flex-col gap-3 text-[10px] text-slate-600 sm:flex-row sm:items-center sm:justify-between sm:text-xs">
                <p>
                  BookNest · Community-powered book
                  sharing
                </p>

                <div className="flex flex-wrap gap-x-4 gap-y-2">
                  <Link
                    href="/policies"
                    className="transition hover:text-slate-400"
                  >
                    Policies
                  </Link>

                  <Link
                    href="/report"
                    className="transition hover:text-slate-400"
                  >
                    Report Issue
                  </Link>

                  <Link
                    href="/settings"
                    className="transition hover:text-slate-400"
                  >
                    Settings
                  </Link>
                </div>
              </div>
            </footer>
          </div>
        </section>
      </div>
    </main>
  );
}

function SidebarLink({
  href,
  label,
  icon,
  active = false,
}) {
  return (
    <Link
      href={href}
      className={`flex items-center rounded-xl px-4 py-3 text-sm font-bold transition ${
        active
          ? "bg-blue-400/10 text-blue-200"
          : "text-slate-400 hover:bg-white/5 hover:text-white"
      }`}
    >
      <span className="mr-3 w-4 text-center">
        {icon}
      </span>

      {label}
    </Link>
  );
}