
"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

function formatDate(date) {
  if (!date) return "N/A";

  try {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "N/A";
  }
}

function StatCard({
  label,
  value,
  description,
  icon,
  href,
  tone = "blue",
}) {
  const tones = {
    blue: {
      icon: "border-blue-400/10 bg-blue-500/10",
      hover: "hover:border-blue-400/20",
      value: "text-blue-300",
    },
    emerald: {
      icon: "border-emerald-400/10 bg-emerald-500/10",
      hover: "hover:border-emerald-400/20",
      value: "text-emerald-300",
    },
    orange: {
      icon: "border-orange-400/10 bg-orange-500/10",
      hover: "hover:border-orange-400/20",
      value: "text-orange-300",
    },
    red: {
      icon: "border-red-400/10 bg-red-500/10",
      hover: "hover:border-red-400/20",
      value: "text-red-300",
    },
    purple: {
      icon: "border-purple-400/10 bg-purple-500/10",
      hover: "hover:border-purple-400/20",
      value: "text-purple-300",
    },
  };

  const currentTone = tones[tone] || tones.blue;

  const card = (
    <div
      className={`group h-full rounded-2xl border border-white/[0.07] bg-[#0d2028] p-5 shadow-xl shadow-black/10 transition duration-300 hover:-translate-y-1 ${currentTone.hover}`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
            {label}
          </p>

          <p
            className={`mt-3 text-3xl font-black tracking-tight ${currentTone.value}`}
          >
            {value}
          </p>

          <p className="mt-2 text-xs leading-5 text-slate-600">
            {description}
          </p>
        </div>

        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border text-xl ${currentTone.icon}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );

  if (!href) return card;

  return (
    <Link href={href} className="block h-full">
      {card}
    </Link>
  );
}

function SectionHeader({
  title,
  description,
  href,
  linkText = "View All",
}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <h2 className="text-xl font-black text-[#f1eee5]">
          {title}
        </h2>

        {description && (
          <p className="mt-1 text-xs leading-5 text-slate-600">
            {description}
          </p>
        )}
      </div>

      {href && (
        <Link
          href={href}
          className="shrink-0 rounded-lg border border-white/5 bg-[#10242d] px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 transition hover:bg-[#142d37] hover:text-white"
        >
          {linkText}
        </Link>
      )}
    </div>
  );
}

function EmptyState({
  icon = "✓",
  title,
  description,
}) {
  return (
    <div className="mt-5 rounded-2xl border border-dashed border-white/10 bg-[#091a21] px-5 py-12 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/5 bg-[#10242d] text-2xl">
        {icon}
      </div>

      <h3 className="mt-4 text-sm font-black text-slate-200">
        {title}
      </h3>

      <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-slate-600">
        {description}
      </p>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    pending:
      "border-orange-400/20 bg-orange-500/10 text-orange-300",
    approved:
      "border-emerald-400/20 bg-emerald-500/10 text-emerald-300",
    rejected:
      "border-red-400/20 bg-red-500/10 text-red-300",
    active:
      "border-blue-400/20 bg-blue-500/10 text-blue-300",
    reported:
      "border-red-400/20 bg-red-500/10 text-red-300",
  };

  const labels = {
    pending: "Pending",
    approved: "Approved",
    rejected: "Rejected",
    active: "Active",
    reported: "Reported",
  };

  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider ${
        styles[status] || "border-white/10 bg-white/5 text-slate-400"
      }`}
    >
      {labels[status] || status || "Unknown"}
    </span>
  );
}

function RequestItem({
  icon,
  title,
  subtitle,
  date,
  status = "pending",
}) {
  return (
    <div className="rounded-2xl border border-white/[0.05] bg-[#091a21] p-4 transition hover:border-white/[0.1] hover:bg-[#0b1e26]">
      <div className="flex gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/5 bg-[#10242d] text-lg">
          {icon}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-sm font-bold text-slate-200">
              {title}
            </h3>

            <StatusBadge status={status} />
          </div>

          <p className="mt-1 text-xs leading-5 text-slate-600">
            {subtitle}
          </p>

          <p className="mt-2 text-[10px] font-semibold uppercase tracking-wider text-slate-700">
            {formatDate(date)}
          </p>
        </div>
      </div>
    </div>
  );
}

function ActivityItem({
  icon,
  title,
  description,
  date,
  type = "info",
}) {
  const types = {
    info: "border-blue-400/10 bg-blue-500/10",
    success: "border-emerald-400/10 bg-emerald-500/10",
    warning: "border-orange-400/10 bg-orange-500/10",
    danger: "border-red-400/10 bg-red-500/10",
  };

  return (
    <div className="flex gap-4 border-b border-white/[0.05] py-4 last:border-b-0">
      <div
        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-base ${
          types[type] || types.info
        }`}
      >
        {icon}
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-bold text-slate-200">
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-slate-600">
          {description}
        </p>

        <p className="mt-2 text-[10px] font-semibold uppercase tracking-wider text-slate-700">
          {formatDate(date)}
        </p>
      </div>
    </div>
  );
}

export default function ModeratorDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [data, setData] = useState({
    user: null,
    loans: [],
    books: [],
    users: [],
    reports: [],
    notifications: [],
  });

  useEffect(() => {
    async function loadModeratorData() {
      try {
        setLoading(true);
        setError("");

        /*
          The dashboard currently uses endpoints that are
          expected to exist in the project.

          If some moderator APIs are not created yet,
          the dashboard gracefully falls back to empty arrays.
        */

        const requests = await Promise.allSettled([
          fetch("/api/loans", {
            cache: "no-store",
          }),

          fetch("/api/books", {
            cache: "no-store",
          }),

          fetch("/api/users", {
            cache: "no-store",
          }),

          fetch("/api/reports", {
            cache: "no-store",
          }),
        ]);

        const parsed = await Promise.all(
          requests.map(async (result) => {
            if (result.status !== "fulfilled") {
              return null;
            }

            const response = result.value;

            if (!response.ok) {
              return null;
            }

            try {
              return await response.json();
            } catch {
              return null;
            }
          })
        );

        const loansData = parsed[0] || {};
        const booksData = parsed[1] || {};
        const usersData = parsed[2] || {};
        const reportsData = parsed[3] || {};

        setData({
          user: loansData.user || null,
          loans: Array.isArray(loansData.loans)
            ? loansData.loans
            : [],
          books: Array.isArray(booksData.books)
            ? booksData.books
            : [],
          users: Array.isArray(usersData.users)
            ? usersData.users
            : [],
          reports: Array.isArray(reportsData.reports)
            ? reportsData.reports
            : [],
          notifications: Array.isArray(
            loansData.notifications
          )
            ? loansData.notifications
            : [],
        });
      } catch (err) {
        console.error(
          "MODERATOR_DASHBOARD_ERROR:",
          err
        );

        setError(
          err.message ||
            "Unable to load moderator dashboard."
        );
      } finally {
        setLoading(false);
      }
    }

    loadModeratorData();
  }, []);

  const statistics = useMemo(() => {
    const pendingBooks = data.books.filter(
      (book) =>
        book.status === "pending" ||
        book.approvalStatus === "pending"
    );

    const activeLoans = data.loans.filter(
      (loan) => loan.status === "active"
    );

    const overdueLoans = activeLoans.filter(
      (loan) => loan.isOverdue
    );

    const pendingUsers = data.users.filter(
      (user) =>
        user.status === "pending" ||
        user.approvalStatus === "pending"
    );

    const openReports = data.reports.filter(
      (report) =>
        report.status !== "resolved" &&
        report.status !== "closed"
    );

    return {
      pendingBooks: pendingBooks.length,
      activeLoans: activeLoans.length,
      overdueLoans: overdueLoans.length,
      pendingUsers: pendingUsers.length,
      openReports: openReports.length,
      totalUsers: data.users.length,
      totalBooks: data.books.length,
    };
  }, [data]);

  const pendingBooks = useMemo(() => {
    return data.books
      .filter(
        (book) =>
          book.status === "pending" ||
          book.approvalStatus === "pending"
      )
      .slice(0, 5);
  }, [data.books]);

  const pendingUsers = useMemo(() => {
    return data.users
      .filter(
        (user) =>
          user.status === "pending" ||
          user.approvalStatus === "pending"
      )
      .slice(0, 5);
  }, [data.users]);

  const reportedIssues = useMemo(() => {
    return data.reports
      .filter(
        (report) =>
          report.status !== "resolved" &&
          report.status !== "closed"
      )
      .slice(0, 5);
  }, [data.reports]);

  const activeLoans = useMemo(() => {
    return data.loans
      .filter((loan) => loan.status === "active")
      .slice(0, 5);
  }, [data.loans]);

  const recentActivity = useMemo(() => {
    const activity = [];

    data.books.slice(0, 3).forEach((book) => {
      activity.push({
        icon: "📚",
        title: "Book activity",
        description:
          book.title ||
          book.bookTitle ||
          "A book was added or updated.",
        date:
          book.createdAt ||
          book.updatedAt ||
          new Date(),
        type: "info",
      });
    });

    data.users.slice(0, 2).forEach((user) => {
      activity.push({
        icon: "👤",
        title: "User activity",
        description:
          user.name ||
          user.email ||
          "A user account was updated.",
        date:
          user.createdAt ||
          user.updatedAt ||
          new Date(),
        type: "success",
      });
    });

    data.reports.slice(0, 3).forEach((report) => {
      activity.push({
        icon: "🚨",
        title: "Report received",
        description:
          report.subject ||
          report.title ||
          "A new issue has been reported.",
        date:
          report.createdAt ||
          report.updatedAt ||
          new Date(),
        type: "danger",
      });
    });

    return activity.slice(0, 7);
  }, [data]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#07141a] px-4 py-6 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="animate-pulse">
            <div className="h-8 w-72 rounded-lg bg-[#10242d]" />

            <div className="mt-3 h-4 w-[28rem] max-w-full rounded bg-[#10242d]" />

            <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
              {[1, 2, 3, 4, 5].map((item) => (
                <div
                  key={item}
                  className="h-36 rounded-2xl border border-white/5 bg-[#0d2028]"
                />
              ))}
            </div>

            <div className="mt-8 grid gap-5 xl:grid-cols-3">
              <div className="h-[450px] rounded-3xl bg-[#0d2028] xl:col-span-2" />
              <div className="h-[450px] rounded-3xl bg-[#0d2028]" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-[#07141a] px-4 py-10 text-white">
        <div className="mx-auto max-w-xl rounded-3xl border border-red-400/20 bg-[#0d2028] p-8 text-center shadow-2xl">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 text-xl font-black text-red-300">
            !
          </div>

          <h1 className="mt-5 text-xl font-black">
            Moderator Dashboard Unavailable
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            {error}
          </p>

          <button
            type="button"
            onClick={() => window.location.reload()}
            className="mt-6 rounded-xl bg-[#e9e1cf] px-6 py-3 text-sm font-black text-[#07141a] transition hover:bg-white"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#07141a] text-slate-100">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute left-[-220px] top-[-220px] h-[500px] w-[500px] rounded-full bg-blue-500/[0.04] blur-[130px]" />

        <div className="absolute right-[-200px] top-[20%] h-[450px] w-[450px] rounded-full bg-purple-500/[0.035] blur-[130px]" />

        <div className="absolute bottom-[-250px] left-[30%] h-[500px] w-[500px] rounded-full bg-cyan-500/[0.025] blur-[140px]" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* Header */}
        <section className="rounded-3xl border border-white/[0.07] bg-[#0a1b22]/80 p-5 shadow-2xl shadow-black/10 backdrop-blur-xl sm:p-7">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-purple-400" />

                <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500">
                  Moderator Control Center
                </span>
              </div>

              <h1 className="text-2xl font-black tracking-tight text-[#f1eee5] sm:text-3xl lg:text-4xl">
                Moderator Dashboard
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                Review community activity, monitor loans,
                handle reports and keep the BookNest library
                organized.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:flex">
              <Link
                href="/moderator/reports"
                className="rounded-xl border border-red-400/10 bg-red-500/10 px-5 py-3 text-center text-xs font-bold text-red-300 transition hover:bg-red-500/15"
              >
                Reports
              </Link>

              <Link
                href="/moderator/books"
                className="rounded-xl bg-[#e9e1cf] px-5 py-3 text-center text-xs font-black text-[#07141a] transition hover:bg-white"
              >
                Review Books
              </Link>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          <StatCard
            label="Pending Books"
            value={statistics.pendingBooks}
            icon="📚"
            description="Books waiting for review."
            href="/moderator/books"
            tone="blue"
          />

          <StatCard
            label="Pending Users"
            value={statistics.pendingUsers}
            icon="👤"
            description="Accounts waiting for approval."
            href="/moderator/users"
            tone="purple"
          />

          <StatCard
            label="Active Loans"
            value={statistics.activeLoans}
            icon="🔄"
            description="Currently borrowed books."
            href="/moderator/loans"
            tone="emerald"
          />

          <StatCard
            label="Overdue"
            value={statistics.overdueLoans}
            icon="⏰"
            description="Loans past their due date."
            href="/moderator/loans"
            tone="orange"
          />

          <StatCard
            label="Open Reports"
            value={statistics.openReports}
            icon="🚨"
            description="Issues requiring attention."
            href="/moderator/reports"
            tone="red"
          />
        </section>

        {/* Main moderation area */}
        <section className="mt-6 grid gap-5 xl:grid-cols-3">
          {/* Pending Books */}
          <div className="rounded-3xl border border-white/[0.07] bg-[#0d2028] p-5 shadow-xl shadow-black/10 sm:p-6 xl:col-span-2">
            <SectionHeader
              title="Book Approval Queue"
              description="Review books submitted by community members."
              href="/moderator/books"
              linkText="Manage Books"
            />

            {pendingBooks.length === 0 ? (
              <EmptyState
                icon="✓"
                title="No pending books"
                description="There are currently no book submissions waiting for moderator review."
              />
            ) : (
              <div className="mt-5 space-y-3">
                {pendingBooks.map((book, index) => (
                  <RequestItem
                    key={book._id || book.id || index}
                    icon="📖"
                    title={
                      book.title ||
                      book.bookTitle ||
                      "Untitled Book"
                    }
                    subtitle={`Submitted by ${
                      book.ownerName ||
                      book.userName ||
                      book.email ||
                      "Book Owner"
                    }`}
                    date={
                      book.createdAt ||
                      book.updatedAt
                    }
                    status="pending"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="rounded-3xl border border-white/[0.07] bg-[#0d2028] p-5 shadow-xl shadow-black/10 sm:p-6">
            <SectionHeader
              title="Quick Actions"
              description="Common moderation tasks."
            />

            <div className="mt-5 space-y-3">
              <Link
                href="/moderator/books"
                className="group flex items-center gap-4 rounded-2xl border border-white/5 bg-[#091a21] p-4 transition hover:border-blue-400/15 hover:bg-[#0c2029]"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-500/10 text-lg">
                  📚
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold text-slate-200">
                    Review Books
                  </span>

                  <span className="mt-1 block text-[10px] text-slate-600">
                    Approve or reject submissions
                  </span>
                </span>

                <span className="text-slate-700 transition group-hover:text-slate-400">
                  →
                </span>
              </Link>

              <Link
                href="/moderator/users"
                className="group flex items-center gap-4 rounded-2xl border border-white/5 bg-[#091a21] p-4 transition hover:border-purple-400/15 hover:bg-[#0c2029]"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/10 text-lg">
                  👤
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold text-slate-200">
                    User Requests
                  </span>

                  <span className="mt-1 block text-[10px] text-slate-600">
                    Review account requests
                  </span>
                </span>

                <span className="text-slate-700 transition group-hover:text-slate-400">
                  →
                </span>
              </Link>

              <Link
                href="/moderator/loans"
                className="group flex items-center gap-4 rounded-2xl border border-white/5 bg-[#091a21] p-4 transition hover:border-emerald-400/15 hover:bg-[#0c2029]"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-lg">
                  🔄
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold text-slate-200">
                    Monitor Loans
                  </span>

                  <span className="mt-1 block text-[10px] text-slate-600">
                    Track borrowed books
                  </span>
                </span>

                <span className="text-slate-700 transition group-hover:text-slate-400">
                  →
                </span>
              </Link>

              <Link
                href="/moderator/reports"
                className="group flex items-center gap-4 rounded-2xl border border-white/5 bg-[#091a21] p-4 transition hover:border-red-400/15 hover:bg-[#0c2029]"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-500/10 text-lg">
                  🚨
                </span>

                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold text-slate-200">
                    Handle Reports
                  </span>

                  <span className="mt-1 block text-[10px] text-slate-600">
                    Review reported issues
                  </span>
                </span>

                <span className="text-slate-700 transition group-hover:text-slate-400">
                  →
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* Users + Reports */}
        <section className="mt-5 grid gap-5 lg:grid-cols-2">
          {/* Pending Users */}
          <div className="rounded-3xl border border-white/[0.07] bg-[#0d2028] p-5 shadow-xl shadow-black/10 sm:p-6">
            <SectionHeader
              title="User Requests"
              description="Users requiring moderator attention."
              href="/moderator/users"
              linkText="Manage Users"
            />

            {pendingUsers.length === 0 ? (
              <EmptyState
                icon="✓"
                title="No pending users"
                description="There are currently no user approval requests."
              />
            ) : (
              <div className="mt-5 space-y-3">
                {pendingUsers.map((user, index) => (
                  <RequestItem
                    key={user._id || user.id || index}
                    icon="👤"
                    title={
                      user.name ||
                      user.email ||
                      "Unnamed User"
                    }
                    subtitle={
                      user.email ||
                      "Account approval requested"
                    }
                    date={
                      user.createdAt ||
                      user.updatedAt
                    }
                    status="pending"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Reports */}
          <div className="rounded-3xl border border-white/[0.07] bg-[#0d2028] p-5 shadow-xl shadow-black/10 sm:p-6">
            <SectionHeader
              title="Reported Issues"
              description="Open reports from the BookNest community."
              href="/moderator/reports"
              linkText="View Reports"
            />

            {reportedIssues.length === 0 ? (
              <EmptyState
                icon="✓"
                title="No open reports"
                description="There are no unresolved issues requiring moderation."
              />
            ) : (
              <div className="mt-5 space-y-3">
                {reportedIssues.map((report, index) => (
                  <RequestItem
                    key={
                      report._id ||
                      report.id ||
                      index
                    }
                    icon="🚨"
                    title={
                      report.subject ||
                      report.title ||
                      "Reported Issue"
                    }
                    subtitle={
                      report.description ||
                      report.message ||
                      "A user has submitted a report."
                    }
                    date={
                      report.createdAt ||
                      report.updatedAt
                    }
                    status="reported"
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Active Loans */}
        <section className="mt-5">
          <div className="rounded-3xl border border-white/[0.07] bg-[#0d2028] p-5 shadow-xl shadow-black/10 sm:p-6">
            <SectionHeader
              title="Loan Monitoring"
              description="Recently active loans and overdue activity."
              href="/moderator/loans"
              linkText="View Loans"
            />

            {activeLoans.length === 0 ? (
              <EmptyState
                icon="📖"
                title="No active loans"
                description="There are currently no active loans to monitor."
              />
            ) : (
              <div className="mt-5 overflow-x-auto">
                <div className="min-w-[720px]">
                  <div className="grid grid-cols-[2fr_1.2fr_1fr_1fr_100px] gap-4 border-b border-white/5 px-4 pb-3">
                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-700">
                      Book
                    </p>

                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-700">
                      Borrower
                    </p>

                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-700">
                      Due Date
                    </p>

                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-700">
                      Fine
                    </p>

                    <p className="text-[9px] font-bold uppercase tracking-wider text-slate-700">
                      Status
                    </p>
                  </div>

                  <div className="divide-y divide-white/[0.04]">
                    {activeLoans.map((loan, index) => (
                      <div
                        key={
                          loan._id ||
                          loan.id ||
                          index
                        }
                        className="grid grid-cols-[2fr_1.2fr_1fr_1fr_100px] items-center gap-4 px-4 py-4 transition hover:bg-white/[0.015]"
                      >
                        <div className="flex min-w-0 items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#10242d] text-sm">
                            📚
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-xs font-bold text-slate-300">
                              {loan.bookTitle ||
                                "Untitled Book"}
                            </p>

                            <p className="mt-1 text-[10px] text-slate-700">
                              {loan.pages
                                ? `${loan.pages} pages`
                                : "Book"}
                            </p>
                          </div>
                        </div>

                        <p className="truncate text-xs text-slate-500">
                          {loan.borrowerName ||
                            loan.userName ||
                            loan.borrowerEmail ||
                            "Borrower"}
                        </p>

                        <p
                          className={`text-xs font-bold ${
                            loan.isOverdue
                              ? "text-red-300"
                              : "text-slate-500"
                          }`}
                        >
                          {formatDate(
                            loan.dueDate
                          )}
                        </p>

                        <p className="text-xs font-bold text-orange-300">
                          ৳{loan.totalFine || 0}
                        </p>

                        <div>
                          {loan.isOverdue ? (
                            <StatusBadge status="reported" />
                          ) : (
                            <StatusBadge status="active" />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Activity + System Info */}
        <section className="mt-5 grid gap-5 lg:grid-cols-2">
          {/* Activity */}
          <div className="rounded-3xl border border-white/[0.07] bg-[#0d2028] p-5 shadow-xl shadow-black/10 sm:p-6">
            <SectionHeader
              title="Recent Activity"
              description="Recent community and moderation activity."
            />

            {recentActivity.length === 0 ? (
              <EmptyState
                icon="◌"
                title="No activity yet"
                description="Recent activity will appear here as users interact with BookNest."
              />
            ) : (
              <div className="mt-3">
                {recentActivity.map((item, index) => (
                  <ActivityItem
                    key={`${item.title}-${index}`}
                    {...item}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Moderator Guidelines */}
          <div className="rounded-3xl border border-white/[0.07] bg-[#0d2028] p-5 shadow-xl shadow-black/10 sm:p-6">
            <SectionHeader
              title="Moderator Guidelines"
              description="Keep these principles in mind while moderating."
            />

            <div className="mt-5 space-y-3">
              <div className="rounded-2xl border border-blue-400/10 bg-blue-500/[0.05] p-4">
                <div className="flex gap-3">
                  <span className="text-lg">⚖️</span>

                  <div>
                    <h3 className="text-xs font-bold text-slate-200">
                      Stay Fair
                    </h3>

                    <p className="mt-1 text-[10px] leading-5 text-slate-600">
                      Apply the same rules to every user and
                      avoid personal bias.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-emerald-400/10 bg-emerald-500/[0.05] p-4">
                <div className="flex gap-3">
                  <span className="text-lg">🔒</span>

                  <div>
                    <h3 className="text-xs font-bold text-slate-200">
                      Protect Privacy
                    </h3>

                    <p className="mt-1 text-[10px] leading-5 text-slate-600">
                      Never expose private user information
                      outside the moderation process.
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-orange-400/10 bg-orange-500/[0.05] p-4">
                <div className="flex gap-3">
                  <span className="text-lg">📝</span>

                  <div>
                    <h3 className="text-xs font-bold text-slate-200">
                      Document Actions
                    </h3>

                    <p className="mt-1 text-[10px] leading-5 text-slate-600">
                      Important moderation actions should
                      remain traceable in the activity history.
                    </p>
                  </div>
                </div>
              </div>

              <Link
                href="/policies"
                className="block rounded-2xl border border-white/5 bg-[#091a21] p-4 text-center text-xs font-bold text-slate-400 transition hover:bg-[#10242d] hover:text-white"
              >
                Read Complete Platform Policies →
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <div className="mt-6 pb-4 text-center">
          <p className="text-[10px] uppercase tracking-[0.2em] text-slate-700">
            BookNest · Moderator Control Center
          </p>
        </div>
      </div>
    </main>
  );
}

