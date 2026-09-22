
"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function ModeratorDashboard() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    books: 0,
    pendingBooks: 0,
    users: 0,
    activeLoans: 0,
    reports: 0,
  });

  useEffect(() => {
    // Temporary dashboard data.
    // পরে এগুলো API থেকে load করব।
    const timer = setTimeout(() => {
      setStats({
        books: 128,
        pendingBooks: 7,
        users: 64,
        activeLoans: 23,
        reports: 4,
      });

      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="min-h-screen bg-[#07141a] text-slate-100">
      {/* Mobile Overlay */}
      {menuOpen && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => setMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[270px] border-r border-white/[0.07] bg-[#08171e] transition-transform duration-300 lg:translate-x-0 ${
          menuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col">
          {/* Logo */}
          <div className="flex h-20 items-center justify-between border-b border-white/[0.07] px-5">
            <Link
              href="/"
              className="flex items-center gap-3"
              onClick={() => setMenuOpen(false)}
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#e9e1cf] text-lg font-black text-[#07141a]">
                B
              </div>

              <div>
                <p className="font-black tracking-tight text-[#f1eee5]">
                  BookNest
                </p>

                <p className="text-[9px] font-bold uppercase tracking-[0.18em] text-slate-500">
                  Moderator
                </p>
              </div>
            </Link>

            <button
              type="button"
              onClick={() => setMenuOpen(false)}
              className="rounded-lg px-2 py-1 text-xl text-slate-500 hover:bg-white/5 hover:text-white lg:hidden"
            >
              ×
            </button>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto px-3 py-5">
            <p className="px-3 pb-3 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">
              Overview
            </p>

            <SidebarLink
              href="/moderator"
              icon="⌂"
              label="Dashboard"
              active
              onClick={() => setMenuOpen(false)}
            />

            <SidebarLink
              href="/moderator/books"
              icon="📚"
              label="Books"
              badge={stats.pendingBooks}
              onClick={() => setMenuOpen(false)}
            />

            <SidebarLink
              href="/moderator/users"
              icon="👥"
              label="Users"
              onClick={() => setMenuOpen(false)}
            />

            <SidebarLink
              href="/moderator/loans"
              icon="↔"
              label="Loans"
              onClick={() => setMenuOpen(false)}
            />

            <p className="px-3 pb-3 pt-7 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">
              Community
            </p>

            <SidebarLink
              href="/moderator/reports"
              icon="⚑"
              label="Reports"
              badge={stats.reports}
              danger={stats.reports > 0}
              onClick={() => setMenuOpen(false)}
            />

            <SidebarLink
              href="/messages"
              icon="💬"
              label="Messages"
              onClick={() => setMenuOpen(false)}
            />

            <SidebarLink
              href="/notifications"
              icon="🔔"
              label="Notifications"
              onClick={() => setMenuOpen(false)}
            />

            <p className="px-3 pb-3 pt-7 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">
              Account
            </p>

            <SidebarLink
              href="/settings"
              icon="⚙"
              label="Settings"
              onClick={() => setMenuOpen(false)}
            />

            <SidebarLink
              href="/policy"
              icon="▤"
              label="Policies"
              onClick={() => setMenuOpen(false)}
            />
          </nav>

          {/* Bottom User */}
          <div className="border-t border-white/[0.07] p-4">
            <div className="flex items-center gap-3 rounded-2xl border border-white/5 bg-[#0d2028] p-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#17313b] text-sm font-black text-[#e9e1cf]">
                M
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-slate-200">
                  Moderator
                </p>

                <p className="text-[10px] font-bold uppercase tracking-wider text-blue-300">
                  Moderator Role
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="lg:pl-[270px]">
        {/* Topbar */}
        <header className="sticky top-0 z-30 border-b border-white/[0.07] bg-[#07141a]/90 backdrop-blur-xl">
          <div className="flex h-20 items-center justify-between px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setMenuOpen(true)}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#0d2028] text-lg lg:hidden"
              >
                ☰
              </button>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">
                  Control Center
                </p>

                <h1 className="text-lg font-black text-[#f1eee5] sm:text-xl">
                  Moderator Dashboard
                </h1>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                href="/notifications"
                className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#0d2028] text-base transition hover:border-white/20 hover:bg-[#10242d]"
              >
                🔔

                <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-400" />
              </Link>

              <Link
                href="/messages"
                className="hidden h-10 items-center gap-2 rounded-xl border border-white/10 bg-[#0d2028] px-4 text-xs font-bold text-slate-300 transition hover:border-white/20 hover:bg-[#10242d] sm:flex"
              >
                💬 Messages
              </Link>

              <Link
                href="/"
                className="hidden rounded-xl bg-[#e9e1cf] px-4 py-2.5 text-xs font-black text-[#07141a] transition hover:bg-white sm:block"
              >
                Visit Site
              </Link>
            </div>
          </div>
        </header>

        {/* Content */}
        <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
          {/* Welcome */}
          <section className="relative overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0d2028] p-6 shadow-2xl shadow-black/10 sm:p-8">
            <div className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-blue-500/5 blur-[80px]" />

            <div className="relative flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-blue-300">
                  BookNest Community
                </p>

                <h2 className="mt-2 text-2xl font-black tracking-tight text-[#f1eee5] sm:text-3xl">
                  Welcome to the control room.
                </h2>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                  Review books, monitor community activity, handle
                  reports and keep the BookNest library organized.
                </p>
              </div>

              <div className="flex shrink-0 items-center gap-3">
                <Link
                  href="/moderator/books"
                  className="rounded-xl bg-[#e9e1cf] px-5 py-3 text-xs font-black text-[#07141a] transition hover:bg-white"
                >
                  Review Books
                </Link>

                <Link
                  href="/moderator/reports"
                  className="rounded-xl border border-white/10 bg-[#10242d] px-5 py-3 text-xs font-bold text-slate-300 transition hover:border-white/20 hover:bg-[#142d37]"
                >
                  Reports
                </Link>
              </div>
            </div>
          </section>

          {/* Stats */}
          <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
            <StatCard
              label="Total Books"
              value={stats.books}
              icon="📚"
              loading={loading}
            />

            <StatCard
              label="Pending Books"
              value={stats.pendingBooks}
              icon="⏳"
              accent="blue"
              loading={loading}
            />

            <StatCard
              label="Total Users"
              value={stats.users}
              icon="👥"
              accent="green"
              loading={loading}
            />

            <StatCard
              label="Active Loans"
              value={stats.activeLoans}
              icon="↔"
              accent="purple"
              loading={loading}
            />

            <StatCard
              label="Open Reports"
              value={stats.reports}
              icon="⚑"
              accent="red"
              loading={loading}
            />
          </section>

          {/* Main Grid */}
          <section className="mt-6 grid gap-6 xl:grid-cols-3">
            {/* Book Moderation */}
            <div className="overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0d2028] xl:col-span-2">
              <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-5 sm:px-6">
                <div>
                  <h3 className="font-black text-[#f1eee5]">
                    Book Moderation
                  </h3>

                  <p className="mt-1 text-xs text-slate-600">
                    Recent activity requiring moderator attention.
                  </p>
                </div>

                <Link
                  href="/moderator/books"
                  className="text-xs font-bold text-blue-300 hover:text-blue-200"
                >
                  View All →
                </Link>
              </div>

              <div className="divide-y divide-white/[0.05]">
                <ModerationRow
                  title="The Alchemist"
                  user="User submitted a new book"
                  time="12 min ago"
                  status="Pending Review"
                  statusClass="blue"
                />

                <ModerationRow
                  title="Atomic Habits"
                  user="Book information updated"
                  time="35 min ago"
                  status="Review"
                  statusClass="orange"
                />

                <ModerationRow
                  title="Clean Code"
                  user="New book listing"
                  time="1 hour ago"
                  status="Pending Review"
                  statusClass="blue"
                />

                <ModerationRow
                  title="Deep Work"
                  user="Cover image changed"
                  time="2 hours ago"
                  status="Approved"
                  statusClass="green"
                />
              </div>
            </div>

            {/* Quick Actions */}
            <div className="rounded-3xl border border-white/[0.08] bg-[#0d2028] p-5 sm:p-6">
              <h3 className="font-black text-[#f1eee5]">
                Quick Actions
              </h3>

              <p className="mt-1 text-xs text-slate-600">
                Frequently used moderator tools.
              </p>

              <div className="mt-5 space-y-3">
                <QuickAction
                  href="/moderator/books"
                  icon="📚"
                  title="Review Books"
                  description={`${stats.pendingBooks} books waiting`}
                />

                <QuickAction
                  href="/moderator/reports"
                  icon="⚑"
                  title="Review Reports"
                  description={`${stats.reports} open reports`}
                />

                <QuickAction
                  href="/moderator/users"
                  icon="👥"
                  title="View Users"
                  description={`${stats.users} registered users`}
                />

                <QuickAction
                  href="/messages"
                  icon="💬"
                  title="Community Chat"
                  description="Talk with users"
                />

                <QuickAction
                  href="/notifications"
                  icon="🔔"
                  title="Notifications"
                  description="Check recent alerts"
                />
              </div>
            </div>
          </section>

          {/* Reports + Activity */}
          <section className="mt-6 grid gap-6 lg:grid-cols-2">
            {/* Reports */}
            <div className="rounded-3xl border border-white/[0.08] bg-[#0d2028]">
              <div className="flex items-center justify-between border-b border-white/[0.06] px-5 py-5 sm:px-6">
                <div>
                  <h3 className="font-black text-[#f1eee5]">
                    Recent Reports
                  </h3>

                  <p className="mt-1 text-xs text-slate-600">
                    Community issues that need attention.
                  </p>
                </div>

                <Link
                  href="/moderator/reports"
                  className="text-xs font-bold text-blue-300"
                >
                  All Reports →
                </Link>
              </div>

              <div className="p-5 sm:p-6">
                <ReportCard
                  title="Incorrect book information"
                  user="Member #1042"
                  priority="Medium"
                />

                <ReportCard
                  title="Inappropriate book description"
                  user="Member #1098"
                  priority="High"
                />

                <ReportCard
                  title="User behavior issue"
                  user="Member #1017"
                  priority="Low"
                />
              </div>
            </div>

            {/* Activity */}
            <div className="rounded-3xl border border-white/[0.08] bg-[#0d2028]">
              <div className="border-b border-white/[0.06] px-5 py-5 sm:px-6">
                <h3 className="font-black text-[#f1eee5]">
                  Moderator Activity
                </h3>

                <p className="mt-1 text-xs text-slate-600">
                  Your recent moderation activity.
                </p>
              </div>

              <div className="p-5 sm:p-6">
                <Activity
                  icon="✓"
                  text="Approved a book listing"
                  time="Today, 10:42 AM"
                  type="success"
                />

                <Activity
                  icon="⚑"
                  text="Reviewed a community report"
                  time="Today, 09:18 AM"
                  type="warning"
                />

                <Activity
                  icon="👥"
                  text="Viewed user profile"
                  time="Yesterday, 08:41 PM"
                  type="info"
                />

                <Activity
                  icon="📚"
                  text="Updated book information"
                  time="Yesterday, 06:22 PM"
                  type="info"
                />
              </div>
            </div>
          </section>

          {/* Permissions */}
          <section className="mt-6 rounded-3xl border border-blue-400/10 bg-[#0b1c25] p-5 sm:p-6">
            <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-blue-300">
                  Role Permissions
                </p>

                <h3 className="mt-2 text-lg font-black text-[#f1eee5]">
                  Moderator access
                </h3>

                <p className="mt-1 max-w-2xl text-xs leading-5 text-slate-600">
                  Moderators can manage community content and reports,
                  but sensitive account, payment and system controls
                  remain restricted to Superadmin.
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Permission text="Books" />
                <Permission text="Reports" />
                <Permission text="Users View" />
                <Permission text="Loans View" />
                <Permission text="Chat" />
              </div>
            </div>
          </section>

          {/* Footer */}
          <footer className="mt-10 border-t border-white/[0.06] pt-6 text-center">
            <p className="text-[11px] text-slate-700">
              BookNest Moderator Panel • Community management
            </p>
          </footer>
        </div>
      </div>
    </main>
  );
}

/* -------------------------------- */
/* Sidebar Link */
/* -------------------------------- */

function SidebarLink({
  href,
  icon,
  label,
  badge,
  active = false,
  danger = false,
  onClick,
}) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`mb-1 flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-bold transition ${
        active
          ? "bg-[#102b35] text-[#f1eee5]"
          : "text-slate-500 hover:bg-white/[0.04] hover:text-slate-200"
      }`}
    >
      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-white/[0.03] text-sm">
        {icon}
      </span>

      <span className="flex-1">{label}</span>

      {badge > 0 && (
        <span
          className={`rounded-full px-2 py-0.5 text-[9px] font-black ${
            danger
              ? "bg-red-500/10 text-red-300"
              : "bg-blue-500/10 text-blue-300"
          }`}
        >
          {badge}
        </span>
      )}
    </Link>
  );
}

/* -------------------------------- */
/* Stats */
/* -------------------------------- */

function StatCard({
  label,
  value,
  icon,
  accent = "default",
  loading,
}) {
  const accentMap = {
    default: "text-white bg-white/5 border-white/5",
    blue: "text-blue-300 bg-blue-500/10 border-blue-400/10",
    green: "text-emerald-300 bg-emerald-500/10 border-emerald-400/10",
    purple: "text-purple-300 bg-purple-500/10 border-purple-400/10",
    red: "text-red-300 bg-red-500/10 border-red-400/10",
  };

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-[#0d2028] p-5 shadow-xl shadow-black/10 transition hover:-translate-y-1 hover:border-white/10">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-slate-600">
            {label}
          </p>

          {loading ? (
            <div className="mt-3 h-9 w-16 animate-pulse rounded-lg bg-white/5" />
          ) : (
            <p className="mt-3 text-3xl font-black text-[#f1eee5]">
              {value}
            </p>
          )}
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border text-lg ${
            accentMap[accent]
          }`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

/* -------------------------------- */
/* Moderation Row */
/* -------------------------------- */

function ModerationRow({
  title,
  user,
  time,
  status,
  statusClass,
}) {
  const statusStyles = {
    blue: "border-blue-400/10 bg-blue-500/10 text-blue-300",
    orange: "border-orange-400/10 bg-orange-500/10 text-orange-300",
    green: "border-emerald-400/10 bg-emerald-500/10 text-emerald-300",
  };

  return (
    <div className="flex flex-col gap-4 p-5 transition hover:bg-white/[0.02] sm:flex-row sm:items-center sm:justify-between sm:px-6">
      <div className="flex min-w-0 items-center gap-4">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/5 bg-[#10242d]">
          📖
        </div>

        <div className="min-w-0">
          <p className="truncate text-sm font-bold text-slate-200">
            {title}
          </p>

          <p className="mt-1 text-xs text-slate-600">
            {user} • {time}
          </p>
        </div>
      </div>

      <span
        className={`w-fit rounded-full border px-3 py-1.5 text-[9px] font-bold uppercase tracking-wider ${
          statusStyles[statusClass]
        }`}
      >
        {status}
      </span>
    </div>
  );
}

/* -------------------------------- */
/* Quick Action */
/* -------------------------------- */

function QuickAction({
  href,
  icon,
  title,
  description,
}) {
  return (
    <Link
      href={href}
      className="flex items-center gap-3 rounded-2xl border border-white/5 bg-[#091a21] p-3 transition hover:border-white/10 hover:bg-[#10242d]"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white/[0.04]">
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-slate-200">
          {title}
        </p>

        <p className="mt-0.5 truncate text-[10px] text-slate-600">
          {description}
        </p>
      </div>

      <span className="text-slate-700">→</span>
    </Link>
  );
}

/* -------------------------------- */
/* Report */
/* -------------------------------- */

function ReportCard({
  title,
  user,
  priority,
}) {
  const styles = {
    High: "bg-red-500/10 text-red-300 border-red-400/10",
    Medium:
      "bg-orange-500/10 text-orange-300 border-orange-400/10",
    Low:
      "bg-blue-500/10 text-blue-300 border-blue-400/10",
  };

  return (
    <div className="mb-3 rounded-2xl border border-white/5 bg-[#091a21] p-4 last:mb-0">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-bold text-slate-200">
            {title}
          </p>

          <p className="mt-1 text-[11px] text-slate-600">
            Reported by {user}
          </p>
        </div>

        <span
          className={`shrink-0 rounded-full border px-2 py-1 text-[9px] font-bold ${
            styles[priority]
          }`}
        >
          {priority}
        </span>
      </div>
    </div>
  );
}

/* -------------------------------- */
/* Activity */
/* -------------------------------- */

function Activity({
  icon,
  text,
  time,
  type,
}) {
  const styles = {
    success: "bg-emerald-500/10 text-emerald-300",
    warning: "bg-orange-500/10 text-orange-300",
    info: "bg-blue-500/10 text-blue-300",
  };

  return (
    <div className="flex items-center gap-3 border-b border-white/5 py-4 last:border-0 last:pb-0 first:pt-0">
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs ${
          styles[type]
        }`}
      >
        {icon}
      </div>

      <div className="min-w-0">
        <p className="truncate text-xs font-bold text-slate-300">
          {text}
        </p>

        <p className="mt-1 text-[10px] text-slate-700">
          {time}
        </p>
      </div>
    </div>
  );
}

/* -------------------------------- */
/* Permission */
/* -------------------------------- */

function Permission({ text }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[10px] font-bold text-slate-400">
      ✓ {text}
    </span>
  );
}

