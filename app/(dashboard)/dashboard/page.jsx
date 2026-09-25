"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

function StatCard({
label,
value,
icon,
description,
href,
}) {
const content = ( <div className="group h-full rounded-2xl border border-white/[0.07] bg-[#0d2028] p-5 shadow-xl shadow-black/10 transition duration-300 hover:-translate-y-1 hover:border-white/[0.13] hover:bg-[#102630]"> <div className="flex items-start justify-between gap-4">

```
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </p>

      <p className="mt-3 text-3xl font-black tracking-tight text-white">
        {value}
      </p>

      <p className="mt-2 text-xs leading-5 text-slate-500">
        {description}
      </p>
    </div>

    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/5 bg-[#102a34] text-xl">
      {icon}
    </div>

  </div>
</div>


);

if (!href) return content;

return ( <Link href={href} className="block h-full">
{content} </Link>
);
}

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

function ActivityItem({
icon,
title,
description,
date,
type,
}) {
const typeStyles = {
success:
"border-emerald-400/10 bg-emerald-500/10 text-emerald-300",
warning:
"border-orange-400/10 bg-orange-500/10 text-orange-300",
info:
"border-blue-400/10 bg-blue-500/10 text-blue-300",
danger:
"border-red-400/10 bg-red-500/10 text-red-300",
};

return ( <div className="flex gap-4 border-b border-white/[0.05] py-4 last:border-b-0">


  <div
    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border text-base ${
      typeStyles[type] || typeStyles.info
    }`}
  >
    {icon}
  </div>

  <div className="min-w-0 flex-1">

    <p className="text-sm font-bold text-slate-200">
      {title}
    </p>

    <p className="mt-1 text-xs leading-5 text-slate-500">
      {description}
    </p>

    <p className="mt-2 text-[10px] font-semibold uppercase tracking-wider text-slate-700">
      {formatDate(date)}
    </p>

  </div>
</div>


);
}

export default function DashboardPage() {
const [loading, setLoading] = useState(true);

const [dashboard, setDashboard] = useState({
user: null,
loans: [],
notifications: [],
activities: [],
stats: {
totalLoans: 0,
activeLoans: 0,
completedLoans: 0,
unpaidFine: 0,
},
});

const [error, setError] = useState("");

useEffect(() => {
async function loadDashboard() {
try {
setLoading(true);
setError("");


    const response = await fetch("/api/loans", {
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(
        data.message || "Failed to load dashboard."
      );
    }

    const loans = data.loans || [];

    const activeLoans = loans.filter(
      (loan) => loan.status === "active"
    );

    const completedLoans = loans.filter(
      (loan) => loan.status !== "active"
    );

    const unpaidFine = loans.reduce(
      (sum, loan) => {
        if (loan.paymentStatus === "paid") {
          return sum;
        }

        return (
          sum +
          Number(loan.totalFine || 0)
        );
      },
      0
    );

    const activities = [];

    loans.slice(0, 5).forEach((loan) => {

      if (loan.status === "active") {
        activities.push({
          icon: "📚",
          title: `Borrowed ${
            loan.bookTitle || "a book"
          }`,
          description: `Due date: ${formatDate(
            loan.dueDate
          )}`,
          date: loan.startDate,
          type: "info",
        });
      }

      if (loan.status === "returned") {
        activities.push({
          icon: "✓",
          title: `Returned ${
            loan.bookTitle || "a book"
          }`,
          description:
            "Book return has been completed.",
          date: loan.returnedAt,
          type: "success",
        });
      }

      if (loan.status === "damaged") {
        activities.push({
          icon: "⚠",
          title: "Damaged book reported",
          description:
            loan.bookTitle ||
            "A borrowed book was marked damaged.",
          date: loan.returnedAt,
          type: "warning",
        });
      }

      if (loan.status === "lost") {
        activities.push({
          icon: "!",
          title: "Lost book reported",
          description:
            loan.bookTitle ||
            "A borrowed book was marked lost.",
          date: loan.returnedAt,
          type: "danger",
        });
      }
    });

    setDashboard({
      user: data.user || null,
      loans,
      notifications:
        data.notifications || [],
      activities,
      stats: {
        totalLoans: loans.length,
        activeLoans: activeLoans.length,
        completedLoans:
          completedLoans.length,
        unpaidFine,
      },
    });

  } catch (err) {
    console.error(
      "DASHBOARD_ERROR:",
      err
    );

    setError(
      err.message ||
        "Unable to load your dashboard."
    );
  } finally {
    setLoading(false);
  }
}

loadDashboard();


}, []);

if (loading) {
return ( <main className="min-h-screen bg-[#07141a] px-4 py-6 text-white sm:px-6 lg:px-8"> <div className="mx-auto max-w-7xl animate-pulse">


      <div className="h-8 w-64 rounded-lg bg-[#10242d]" />

      <div className="mt-3 h-4 w-96 max-w-full rounded bg-[#10242d]" />

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[1, 2, 3, 4].map((item) => (
          <div
            key={item}
            className="h-36 rounded-2xl border border-white/5 bg-[#0d2028]"
          />
        ))}
      </div>

      <div className="mt-8 grid gap-5 xl:grid-cols-3">

        <div className="h-96 rounded-2xl bg-[#0d2028] xl:col-span-2" />

        <div className="h-96 rounded-2xl bg-[#0d2028]" />

      </div>
    </div>
  </main>
);


}

if (error) {
return ( <main className="min-h-screen bg-[#07141a] px-4 py-10 text-white"> <div className="mx-auto max-w-xl rounded-3xl border border-red-400/20 bg-[#0d2028] p-8 text-center">


      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 text-xl font-black text-red-300">
        !
      </div>

      <h1 className="mt-5 text-xl font-black">
        Dashboard unavailable
      </h1>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        {error}
      </p>

      <button
        type="button"
        onClick={() =>
          window.location.reload()
        }
        className="mt-6 rounded-xl bg-[#e9e1cf] px-6 py-3 text-sm font-black text-[#07141a] transition hover:bg-white"
      >
        Try Again
      </button>

    </div>
  </main>
);


}

const {
totalLoans,
activeLoans,
completedLoans,
unpaidFine,
} = dashboard.stats;

const activeLoanItems =
dashboard.loans.filter(
(loan) => loan.status === "active"
);

return ( <main className="min-h-screen bg-[#07141a] text-slate-100">


  <div className="pointer-events-none fixed inset-0 overflow-hidden">

    <div className="absolute left-[-220px] top-[-220px] h-[500px] w-[500px] rounded-full bg-blue-500/[0.04] blur-[130px]" />

    <div className="absolute right-[-200px] top-[30%] h-[450px] w-[450px] rounded-full bg-cyan-500/[0.035] blur-[130px]" />

    <div className="absolute bottom-[-250px] left-[30%] h-[500px] w-[500px] rounded-full bg-indigo-500/[0.025] blur-[140px]" />

  </div>

  <div className="relative z-10 mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">

    {/* HEADER */}
    <section className="rounded-3xl border border-white/[0.07] bg-[#0a1b22]/80 p-5 shadow-2xl shadow-black/10 backdrop-blur-xl sm:p-7">

      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">

        <div>

          <div className="mb-2 flex items-center gap-2">

            <span className="h-2 w-2 rounded-full bg-emerald-400" />

            <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-slate-500">
              Member Dashboard
            </span>

          </div>

          <h1 className="text-2xl font-black tracking-tight text-[#f1eee5] sm:text-3xl lg:text-4xl">
            Welcome back
            {dashboard.user?.name
              ? `, ${dashboard.user.name}`
              : ""}
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Manage your books, loans,
            payments, notifications and
            account activity from one place.
          </p>

        </div>

        <div className="grid grid-cols-2 gap-3 sm:flex">

          <Link
            href="/catalog"
            className="rounded-xl bg-[#e9e1cf] px-5 py-3 text-center text-xs font-black text-[#07141a] transition hover:bg-white"
          >
            Browse Books
          </Link>

          <Link
            href="/dashboard/my-loans"
            className="rounded-xl border border-white/10 bg-[#10242d] px-5 py-3 text-center text-xs font-bold text-slate-200 transition hover:bg-[#142d37]"
          >
            My Loans
          </Link>

        </div>

      </div>
    </section>

    {/* STATS */}
    <section className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">

      <StatCard
        label="Total Loans"
        value={totalLoans}
        icon="📚"
        description="All books you have borrowed."
        href="/dashboard/my-loans"
      />

      <StatCard
        label="Active Loans"
        value={activeLoans}
        icon="⏳"
        description="Books currently with you."
        href="/dashboard/my-loans"
      />

      <StatCard
        label="Completed"
        value={completedLoans}
        icon="✓"
        description="Returned or completed loans."
        href="/dashboard/my-loans"
      />

      <StatCard
        label="Unpaid Fine"
        value={`৳${unpaidFine}`}
        icon="৳"
        description={
          unpaidFine > 0
            ? "Payment may be required."
            : "You have no unpaid fine."
        }
        href="/dashboard/my-loans"
      />

    </section>

    {/* MAIN GRID */}
    <section className="mt-6 grid gap-5 xl:grid-cols-3">

      {/* ACTIVE LOANS */}
      <div className="rounded-3xl border border-white/[0.07] bg-[#0d2028] p-5 shadow-xl shadow-black/10 sm:p-6 xl:col-span-2">

        <div className="flex items-start justify-between gap-4">

          <div>

            <h2 className="text-xl font-black text-[#f1eee5]">
              Active Loans
            </h2>

            <p className="mt-1 text-xs text-slate-600">
              Your currently borrowed books.
            </p>

          </div>

          <Link
            href="/dashboard/my-loans"
            className="rounded-lg border border-white/5 bg-[#10242d] px-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400 transition hover:bg-[#142d37] hover:text-white"
          >
            View All
          </Link>

        </div>

        {activeLoanItems.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-white/10 bg-[#091a21] px-5 py-12 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/5 bg-[#10242d] text-2xl">
              📖
            </div>

            <h3 className="mt-4 text-sm font-black text-slate-200">
              No active loans
            </h3>

            <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-slate-600">
              You are not currently borrowing
              any books.
            </p>

            <Link
              href="/catalog"
              className="mt-5 inline-flex rounded-xl bg-[#e9e1cf] px-5 py-2.5 text-xs font-black text-[#07141a] transition hover:bg-white"
            >
              Explore Catalog
            </Link>

          </div>
        ) : (
          <div className="mt-5 space-y-3">

            {activeLoanItems
              .slice(0, 5)
              .map((loan) => (
                <div
                  key={loan._id}
                  className="rounded-2xl border border-white/[0.05] bg-[#091a21] p-4 transition hover:border-white/[0.1] hover:bg-[#0b1e26]"
                >

                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

                    <div className="flex min-w-0 gap-3">

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-blue-400/10 bg-blue-500/10 text-lg">
                        📚
                      </div>

                      <div className="min-w-0">

                        <h3 className="truncate text-sm font-black text-slate-200">
                          {loan.bookTitle ||
                            "Untitled Book"}
                        </h3>

                        <p className="mt-1 text-xs text-slate-600">
                          Owner:{" "}
                          {loan.ownerName ||
                            "Book Owner"}
                        </p>

                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 sm:flex">

                      <div className="rounded-xl border border-white/5 bg-[#0d2028] px-3 py-2">

                        <p className="text-[9px] uppercase tracking-wider text-slate-700">
                          Due
                        </p>

                        <p
                          className={`mt-1 text-[11px] font-bold ${
                            loan.isOverdue
                              ? "text-red-300"
                              : "text-slate-300"
                          }`}
                        >
                          {formatDate(
                            loan.dueDate
                          )}
                        </p>

                      </div>

                      <div className="rounded-xl border border-white/5 bg-[#0d2028] px-3 py-2">

                        <p className="text-[9px] uppercase tracking-wider text-slate-700">
                          Fine
                        </p>

                        <p className="mt-1 text-[11px] font-bold text-orange-300">
                          ৳
                          {loan.totalFine ||
                            0}
                        </p>

                      </div>

                    </div>

                  </div>
                </div>
              ))}

            {activeLoanItems.length > 5 && (
              <Link
                href="/dashboard/my-loans"
                className="block rounded-xl border border-white/5 bg-[#10242d] py-3 text-center text-xs font-bold text-slate-500 transition hover:bg-[#142d37] hover:text-white"
              >
                View{" "}
                {activeLoanItems.length - 5}{" "}
                more
              </Link>
            )}

          </div>
        )}

      </div>

      {/* QUICK ACTIONS */}
      <div className="rounded-3xl border border-white/[0.07] bg-[#0d2028] p-5 shadow-xl shadow-black/10 sm:p-6">

        <h2 className="text-xl font-black text-[#f1eee5]">
          Quick Actions
        </h2>

        <p className="mt-1 text-xs text-slate-600">
          Frequently used sections.
        </p>

        <div className="mt-5 space-y-3">

          <Link
            href="/catalog"
            className="group flex items-center gap-4 rounded-2xl border border-white/5 bg-[#091a21] p-4 transition hover:border-blue-400/15 hover:bg-[#0c2029]"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-lg">
              🔎
            </span>

            <span className="min-w-0 flex-1">
              <span className="block text-sm font-bold text-slate-200">
                Browse Catalog
              </span>

              <span className="mt-1 block text-[10px] text-slate-600">
                Find books to borrow
              </span>
            </span>

            <span className="text-slate-700 group-hover:text-slate-400">
              →
            </span>
          </Link>

          <Link
            href="/dashboard/my-loans"
            className="group flex items-center gap-4 rounded-2xl border border-white/5 bg-[#091a21] p-4 transition hover:border-emerald-400/15 hover:bg-[#0c2029]"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-lg">
              📚
            </span>

            <span className="min-w-0 flex-1">
              <span className="block text-sm font-bold text-slate-200">
                My Loans
              </span>

              <span className="mt-1 block text-[10px] text-slate-600">
                Manage borrowed books
              </span>
            </span>

            <span className="text-slate-700 group-hover:text-slate-400">
              →
            </span>
          </Link>

          <Link
            href="/dashboard/profile"
            className="group flex items-center gap-4 rounded-2xl border border-white/5 bg-[#091a21] p-4 transition hover:border-purple-400/15 hover:bg-[#0c2029]"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-500/10 text-lg">
              👤
            </span>

            <span className="min-w-0 flex-1">
              <span className="block text-sm font-bold text-slate-200">
                My Profile
              </span>

              <span className="mt-1 block text-[10px] text-slate-600">
                View and manage your profile
              </span>
            </span>

            <span className="text-slate-700 group-hover:text-slate-400">
              →
            </span>
          </Link>

          <Link
            href="/notifications"
            className="group flex items-center gap-4 rounded-2xl border border-white/5 bg-[#091a21] p-4 transition hover:border-orange-400/15 hover:bg-[#0c2029]"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-500/10 text-lg">
              🔔
            </span>

            <span className="min-w-0 flex-1">
              <span className="block text-sm font-bold text-slate-200">
                Notifications
              </span>

              <span className="mt-1 block text-[10px] text-slate-600">
                View account updates
              </span>
            </span>

            <span className="text-slate-700 group-hover:text-slate-400">
              →
            </span>
          </Link>

        </div>
      </div>

    </section>

    {/* BOTTOM GRID */}
    <section className="mt-5 grid gap-5 lg:grid-cols-2">

      {/* ACTIVITY */}
      <div className="rounded-3xl border border-white/[0.07] bg-[#0d2028] p-5 shadow-xl shadow-black/10 sm:p-6">

        <h2 className="text-xl font-black text-[#f1eee5]">
          Recent Activity
        </h2>

        <p className="mt-1 text-xs text-slate-600">
          Your latest library activity.
        </p>

        {dashboard.activities.length === 0 ? (
          <div className="mt-5 rounded-2xl border border-dashed border-white/10 bg-[#091a21] p-8 text-center">
            <p className="text-xs text-slate-600">
              No recent activity yet.
            </p>
          </div>
        ) : (
          <div className="mt-3">
            {dashboard.activities.map(
              (activity, index) => (
                <ActivityItem
                  key={`${activity.title}-${index}`}
                  {...activity}
                />
              )
            )}
          </div>
        )}

      </div>

      {/* HELP */}
      <div className="rounded-3xl border border-white/[0.07] bg-[#0d2028] p-5 shadow-xl shadow-black/10 sm:p-6">

        <h2 className="text-xl font-black text-[#f1eee5]">
          Need Help?
        </h2>

        <p className="mt-1 text-xs text-slate-600">
          Get support or review the platform rules.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">

          <Link
            href="/report-issue"
            className="rounded-2xl border border-red-400/10 bg-red-500/[0.05] p-5 transition hover:bg-red-500/[0.08]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10 text-lg">
              🚨
            </div>

            <h3 className="mt-4 text-sm font-black text-slate-200">
              Report Issue
            </h3>

            <p className="mt-1 text-[10px] leading-5 text-slate-600">
              Report a problem, user or book.
            </p>
          </Link>

          <Link
            href="/policies"
            className="rounded-2xl border border-blue-400/10 bg-blue-500/[0.05] p-5 transition hover:bg-blue-500/[0.08]"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-lg">
              📜
            </div>

            <h3 className="mt-4 text-sm font-black text-slate-200">
              Policies
            </h3>

            <p className="mt-1 text-[10px] leading-5 text-slate-600">
              Read borrowing and platform policies.
            </p>
          </Link>

        </div>

        <div className="mt-5 rounded-2xl border border-white/5 bg-[#091a21] p-4">

          <div className="flex items-start gap-3">

            <div className="text-lg">
              🛡️
            </div>

            <div>

              <p className="text-xs font-bold text-slate-300">
                Keep your account secure
              </p>

              <p className="mt-1 text-[10px] leading-5 text-slate-600">
                Never share your password or
                account verification information
                with anyone.
              </p>

            </div>

          </div>

        </div>

      </div>

    </section>

    <div className="mt-6 pb-4 text-center">
      <p className="text-[10px] uppercase tracking-[0.2em] text-slate-700">
        BookNest · Personal Library Dashboard
      </p>
    </div>

  </div>
</main>


);
}
