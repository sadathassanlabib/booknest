
"use client";

import Link from "next/link";
import { useState } from "react";

const stats = [
  {
    title: "Total Users",
    value: "248",
    detail: "+12 this month",
    icon: "U",
    href: "/superadmin/users",
  },
  {
    title: "Total Books",
    value: "1,284",
    detail: "+36 this month",
    icon: "B",
    href: "/superadmin/books",
  },
  {
    title: "Active Loans",
    value: "86",
    detail: "14 overdue",
    icon: "L",
    href: "/superadmin/loans",
  },
  {
    title: "Pending Payments",
    value: "৳2,450",
    detail: "18 payments",
    icon: "৳",
    href: "/superadmin/payments",
  },
];

const quickActions = [
  {
    title: "Manage Users",
    description: "View, ban, promote or manage users.",
    href: "/superadmin/users",
    icon: "U",
  },
  {
    title: "Manage Books",
    description: "Review and manage book listings.",
    href: "/superadmin/books",
    icon: "B",
  },
  {
    title: "Loan Management",
    description: "Monitor loans, returns and overdue books.",
    href: "/superadmin/loans",
    icon: "L",
  },
  {
    title: "Payment Review",
    description: "Approve or reject submitted payments.",
    href: "/superadmin/payments",
    icon: "৳",
  },
  {
    title: "Reports",
    description: "Review issues reported by users.",
    href: "/superadmin/reports",
    icon: "!",
  },
  {
    title: "Policies",
    description: "Manage BookNest rules and policies.",
    href: "/superadmin/policies",
    icon: "P",
  },
];

const recentActivities = [
  {
    user: "Rahim Ahmed",
    action: "submitted a payment",
    time: "5 minutes ago",
    type: "payment",
  },
  {
    user: "Nusrat Jahan",
    action: "added a new book",
    time: "18 minutes ago",
    type: "book",
  },
  {
    user: "Sakib Hasan",
    action: "reported an issue",
    time: "42 minutes ago",
    type: "report",
  },
  {
    user: "Tanvir Islam",
    action: "requested moderator access",
    time: "1 hour ago",
    type: "user",
  },
];

function ActivityIcon({ type }) {
  const styles = {
    payment: "bg-orange-500/10 text-orange-300 border-orange-400/10",
    book: "bg-blue-500/10 text-blue-300 border-blue-400/10",
    report: "bg-red-500/10 text-red-300 border-red-400/10",
    user: "bg-emerald-500/10 text-emerald-300 border-emerald-400/10",
  };

  return (
    <div
      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-xs font-black ${
        styles[type] || styles.user
      }`}
    >
      {type === "payment"
        ? "৳"
        : type === "book"
        ? "B"
        : type === "report"
        ? "!"
        : "U"}
    </div>
  );
}

export default function SuperadminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#07141a] text-slate-100">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[420px] w-[420px] rounded-full bg-blue-500/[0.04] blur-[120px]" />
        <div className="absolute -bottom-40 -right-40 h-[420px] w-[420px] rounded-full bg-cyan-500/[0.04] blur-[120px]" />
      </div>

      {/* Mobile Overlay */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
        />
      )}

      <div className="relative z-10 flex min-h-screen">
        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 flex w-[270px] flex-col border-r border-white/[0.07] bg-[#08171e] transition-transform duration-300 lg:static lg:translate-x-0 ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }`}
        >
          {/* Logo */}
          <div className="flex h-[76px] items-center justify-between border-b border-white/[0.07] px-6">
            <Link
              href="/"
              className="flex items-center gap-3"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e9e1cf] text-sm font-black text-[#07141a]">
                BN
              </div>

              <div>
                <p className="text-lg font-black tracking-tight text-[#f1eee5]">
                  BookNest
                </p>

                <p className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-600">
                  Superadmin
                </p>
              </div>
            </Link>

            <button
              type="button"
              onClick={() => setSidebarOpen(false)}
              className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/5 bg-white/5 text-slate-400 lg:hidden"
            >
              ×
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-4 py-6">
            <p className="mb-3 px-3 text-[9px] font-black uppercase tracking-[0.2em] text-slate-600">
              Administration
            </p>

            <div className="space-y-1">
              <SidebarLink
                href="/superadmin"
                label="Overview"
                icon="⌂"
                active
                onClick={() => setSidebarOpen(false)}
              />

              <SidebarLink
                href="/superadmin/users"
                label="Users"
                icon="U"
                onClick={() => setSidebarOpen(false)}
              />

              <SidebarLink
                href="/superadmin/moderators"
                label="Moderators"
                icon="M"
                onClick={() => setSidebarOpen(false)}
              />

              <SidebarLink
                href="/superadmin/books"
                label="Books"
                icon="B"
                onClick={() => setSidebarOpen(false)}
              />

              <SidebarLink
                href="/superadmin/loans"
                label="Loans"
                icon="L"
                onClick={() => setSidebarOpen(false)}
              />

              <SidebarLink
                href="/superadmin/payments"
                label="Payments"
                icon="৳"
                badge="18"
                onClick={() => setSidebarOpen(false)}
              />

              <SidebarLink
                href="/superadmin/reports"
                label="Reports"
                icon="!"
                badge="5"
                onClick={() => setSidebarOpen(false)}
              />
            </div>

            <p className="mb-3 mt-8 px-3 text-[9px] font-black uppercase tracking-[0.2em] text-slate-600">
              System
            </p>

            <div className="space-y-1">
              <SidebarLink
                href="/superadmin/notifications"
                label="Notifications"
                icon="N"
                onClick={() => setSidebarOpen(false)}
              />

              <SidebarLink
                href="/superadmin/messages"
                label="Messages"
                icon="C"
                onClick={() => setSidebarOpen(false)}
              />

              <SidebarLink
                href="/superadmin/policies"
                label="Policies"
                icon="P"
                onClick={() => setSidebarOpen(false)}
              />

              <SidebarLink
                href="/superadmin/settings"
                label="Settings"
                icon="S"
                onClick={() => setSidebarOpen(false)}
              />
            </div>
          </nav>

          {/* Admin Profile */}
          <div className="border-t border-white/[0.07] p-4">
            <div className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-[#0d2028] p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e9e1cf] text-xs font-black text-[#07141a]">
                SA
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-slate-200">
                  Superadmin
                </p>

                <p className="truncate text-[10px] text-slate-600">
                  Full system access
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className="min-w-0 flex-1">
          {/* Topbar */}
          <header className="sticky top-0 z-30 border-b border-white/[0.07] bg-[#07141a]/90 backdrop-blur-xl">
            <div className="flex h-[76px] items-center justify-between px-4 sm:px-6 lg:px-8">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setSidebarOpen(true)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#0d2028] text-lg text-slate-300 lg:hidden"
                >
                  ☰
                </button>

                <div>
                  <p className="hidden text-[9px] font-bold uppercase tracking-[0.2em] text-slate-600 sm:block">
                    BookNest Administration
                  </p>

                  <h1 className="text-lg font-black text-[#f1eee5] sm:text-xl">
                    Superadmin Dashboard
                  </h1>
                </div>
              </div>

              <div className="flex items-center gap-2 sm:gap-3">
                <Link
                  href="/notifications"
                  className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#0d2028] text-sm text-slate-300 transition hover:bg-[#10242d]"
                >
                  N

                  <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-red-400" />
                </Link>

                <Link
                  href="/"
                  className="hidden rounded-xl border border-white/10 bg-[#0d2028] px-4 py-2.5 text-xs font-bold text-slate-300 transition hover:bg-[#10242d] sm:block"
                >
                  Visit BookNest
                </Link>

                <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-[#10242d] text-[10px] font-black text-slate-300">
                  SA
                </div>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
            <div className="mx-auto max-w-[1500px]">
              {/* Welcome */}
              <section className="mb-8">
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#718b94]">
                  System Overview
                </p>

                <h2 className="mt-2 text-2xl font-black tracking-tight text-[#f1eee5] sm:text-3xl">
                  Welcome back, Superadmin
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                  Monitor your BookNest community, manage books,
                  review payments and keep the entire platform
                  running smoothly.
                </p>
              </section>

              {/* Stats */}
              <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => (
                  <Link
                    key={stat.title}
                    href={stat.href}
                    className="group rounded-2xl border border-white/[0.08] bg-[#0d2028] p-5 shadow-xl shadow-black/10 transition duration-300 hover:-translate-y-1 hover:border-white/15"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-600">
                          {stat.title}
                        </p>

                        <p className="mt-3 text-3xl font-black text-[#f1eee5]">
                          {stat.value}
                        </p>

                        <p className="mt-2 text-[11px] font-semibold text-slate-500">
                          {stat.detail}
                        </p>
                      </div>

                      <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/5 bg-[#10242d] text-xs font-black text-slate-300 transition group-hover:border-white/10 group-hover:bg-[#142d37]">
                        {stat.icon}
                      </div>
                    </div>
                  </Link>
                ))}
              </section>

              {/* Main Grid */}
              <section className="mt-8 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
                {/* Recent Activity */}
                <div className="rounded-3xl border border-white/[0.08] bg-[#0d2028] shadow-xl shadow-black/10">
                  <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-5 sm:px-6">
                    <div>
                      <h3 className="text-lg font-black text-[#f1eee5]">
                        Recent Activity
                      </h3>

                      <p className="mt-1 text-xs text-slate-600">
                        Latest activity across BookNest.
                      </p>
                    </div>

                    <Link
                      href="/superadmin/activity"
                      className="text-xs font-bold text-slate-400 transition hover:text-white"
                    >
                      View all →
                    </Link>
                  </div>

                  <div className="divide-y divide-white/[0.05]">
                    {recentActivities.map((activity, index) => (
                      <div
                        key={`${activity.user}-${index}`}
                        className="flex items-center gap-4 px-5 py-5 sm:px-6"
                      >
                        <ActivityIcon type={activity.type} />

                        <div className="min-w-0 flex-1">
                          <p className="text-sm text-slate-300">
                            <span className="font-bold text-slate-100">
                              {activity.user}
                            </span>{" "}
                            {activity.action}
                          </p>

                          <p className="mt-1 text-[11px] text-slate-600">
                            {activity.time}
                          </p>
                        </div>

                        <span className="hidden text-[10px] font-bold uppercase tracking-wider text-slate-700 sm:block">
                          Activity
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="rounded-3xl border border-white/[0.08] bg-[#0d2028] shadow-xl shadow-black/10">
                  <div className="border-b border-white/[0.06] px-5 py-5 sm:px-6">
                    <h3 className="text-lg font-black text-[#f1eee5]">
                      Quick Actions
                    </h3>

                    <p className="mt-1 text-xs text-slate-600">
                      Frequently used administration tools.
                    </p>
                  </div>

                  <div className="grid gap-2 p-4 sm:grid-cols-2 xl:grid-cols-1">
                    {quickActions.map((action) => (
                      <Link
                        key={action.title}
                        href={action.href}
                        className="group flex items-center gap-3 rounded-2xl border border-transparent p-3 transition hover:border-white/[0.07] hover:bg-white/[0.025]"
                      >
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/5 bg-[#10242d] text-xs font-black text-slate-400 transition group-hover:text-slate-200">
                          {action.icon}
                        </div>

                        <div className="min-w-0">
                          <p className="text-sm font-bold text-slate-200">
                            {action.title}
                          </p>

                          <p className="mt-0.5 truncate text-[10px] text-slate-600">
                            {action.description}
                          </p>
                        </div>

                        <span className="ml-auto text-xs text-slate-700 transition group-hover:text-slate-400">
                          →
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              </section>

              {/* Bottom Sections */}
              <section className="mt-6 grid gap-6 md:grid-cols-3">
                {/* Pending Payments */}
                <Link
                  href="/superadmin/payments"
                  className="group rounded-3xl border border-orange-400/10 bg-[#0d2028] p-6 transition hover:-translate-y-1 hover:border-orange-400/20"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-orange-400/10 bg-orange-500/10 text-sm font-black text-orange-300">
                      ৳
                    </div>

                    <span className="text-xs font-bold text-orange-300">
                      18 Pending
                    </span>
                  </div>

                  <h3 className="mt-5 text-lg font-black text-slate-100">
                    Payment Review
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-slate-600">
                    Review submitted fine payments and approve
                    or reject them.
                  </p>

                  <div className="mt-5 text-xs font-bold text-orange-300">
                    Review payments →
                  </div>
                </Link>

                {/* Reports */}
                <Link
                  href="/superadmin/reports"
                  className="group rounded-3xl border border-red-400/10 bg-[#0d2028] p-6 transition hover:-translate-y-1 hover:border-red-400/20"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-red-400/10 bg-red-500/10 text-sm font-black text-red-300">
                      !
                    </div>

                    <span className="text-xs font-bold text-red-300">
                      5 Open
                    </span>
                  </div>

                  <h3 className="mt-5 text-lg font-black text-slate-100">
                    Reported Issues
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-slate-600">
                    Handle user reports, technical problems and
                    community issues.
                  </p>

                  <div className="mt-5 text-xs font-bold text-red-300">
                    View reports →
                  </div>
                </Link>

                {/* Moderators */}
                <Link
                  href="/superadmin/moderators"
                  className="group rounded-3xl border border-blue-400/10 bg-[#0d2028] p-6 transition hover:-translate-y-1 hover:border-blue-400/20"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-blue-400/10 bg-blue-500/10 text-sm font-black text-blue-300">
                      M
                    </div>

                    <span className="text-xs font-bold text-blue-300">
                      8 Active
                    </span>
                  </div>

                  <h3 className="mt-5 text-lg font-black text-slate-100">
                    Moderator Team
                  </h3>

                  <p className="mt-2 text-xs leading-5 text-slate-600">
                    Manage moderators and control their platform
                    permissions.
                  </p>

                  <div className="mt-5 text-xs font-bold text-blue-300">
                    Manage moderators →
                  </div>
                </Link>
              </section>

              {/* System Status */}
              <section className="mt-6 rounded-3xl border border-white/[0.08] bg-[#0d2028] p-5 sm:p-6">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-600">
                      System Status
                    </p>

                    <h3 className="mt-2 text-lg font-black text-[#f1eee5]">
                      BookNest is running normally
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 rounded-full border border-emerald-400/10 bg-emerald-500/10 px-4 py-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />

                    <span className="text-xs font-bold text-emerald-300">
                      All Systems Operational
                    </span>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

function SidebarLink({
  href,
  label,
  icon,
  badge,
  active,
  onClick,
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition ${
        active
          ? "bg-[#102a34] text-[#f1eee5]"
          : "text-slate-500 hover:bg-white/[0.03] hover:text-slate-200"
      }`}
    >
      <span
        className={`flex h-8 w-8 items-center justify-center rounded-lg text-[10px] font-black ${
          active
            ? "bg-[#e9e1cf] text-[#07141a]"
            : "bg-white/[0.04] text-slate-500"
        }`}
      >
        {icon}
      </span>

      <span className="flex-1">{label}</span>

      {badge && (
        <span className="rounded-full bg-red-500/10 px-2 py-0.5 text-[9px] font-black text-red-300">
          {badge}
        </span>
      )}
    </Link>
  );
}

