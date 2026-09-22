"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

const demoUsers = [
  {
    _id: "1",
    name: "Sadat Hassan Labib",
    email: "sadat@example.com",
    role: "superadmin",
    status: "active",
    books: 24,
    activeLoans: 3,
    fine: 0,
    joinedAt: "2026-01-15",
  },
  {
    _id: "2",
    name: "Abdullah Al Mamun",
    email: "mamun@example.com",
    role: "moderator",
    status: "active",
    books: 18,
    activeLoans: 2,
    fine: 20,
    joinedAt: "2026-02-04",
  },
  {
    _id: "3",
    name: "Rafi Ahmed",
    email: "rafi@example.com",
    role: "user",
    status: "active",
    books: 11,
    activeLoans: 1,
    fine: 0,
    joinedAt: "2026-03-12",
  },
  {
    _id: "4",
    name: "Nusrat Jahan",
    email: "nusrat@example.com",
    role: "user",
    status: "active",
    books: 7,
    activeLoans: 2,
    fine: 30,
    joinedAt: "2026-04-21",
  },
  {
    _id: "5",
    name: "Tanvir Hasan",
    email: "tanvir@example.com",
    role: "user",
    status: "banned",
    books: 4,
    activeLoans: 0,
    fine: 50,
    joinedAt: "2026-05-10",
  },
  {
    _id: "6",
    name: "Mehedi Hasan",
    email: "mehedi@example.com",
    role: "user",
    status: "active",
    books: 15,
    activeLoans: 4,
    fine: 10,
    joinedAt: "2026-06-02",
  },
];

function formatDate(date) {
  if (!date) return "N/A";

  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function getInitials(name) {
  if (!name) return "U";

  return name
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

function getRoleStyle(role) {
  switch (role) {
    case "superadmin":
      return "border-purple-300 bg-purple-50 text-purple-700";

    case "moderator":
      return "border-blue-200 bg-blue-50 text-blue-700";

    default:
      return "border-slate-200 bg-slate-50 text-slate-600";
  }
}

function getStatusStyle(status) {
  if (status === "banned") {
    return "border-red-200 bg-red-50 text-red-700";
  }

  return "border-emerald-200 bg-emerald-50 text-emerald-700";
}

export default function SuperadminUsersPage() {
  const [users, setUsers] = useState(demoUsers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState(null);
  const [actionUser, setActionUser] = useState(null);
  const [actionType, setActionType] = useState("");
  const [notice, setNotice] = useState("");

  const stats = useMemo(() => {
    const total = users.length;

    const moderators = users.filter(
      (user) => user.role === "moderator"
    ).length;

    const active = users.filter(
      (user) => user.status === "active"
    ).length;

    const banned = users.filter(
      (user) => user.status === "banned"
    ).length;

    return {
      total,
      moderators,
      active,
      banned,
    };
  }, [users]);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !query ||
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query);

      const matchesRole =
        roleFilter === "all" ||
        user.role === roleFilter;

      const matchesStatus =
        statusFilter === "all" ||
        user.status === statusFilter;

      return (
        matchesSearch &&
        matchesRole &&
        matchesStatus
      );
    });
  }, [users, search, roleFilter, statusFilter]);

  function showNotice(message) {
    setNotice(message);

    setTimeout(() => {
      setNotice("");
    }, 2500);
  }

  function openAction(user, type) {
    setActionUser(user);
    setActionType(type);
  }

  function closeAction() {
    setActionUser(null);
    setActionType("");
  }

  function confirmAction() {
    if (!actionUser) return;

    if (actionType === "promote") {
      setUsers((current) =>
        current.map((user) =>
          user._id === actionUser._id
            ? { ...user, role: "moderator" }
            : user
        )
      );

      showNotice(
        `${actionUser.name} is now a moderator.`
      );
    }

    if (actionType === "ban") {
      setUsers((current) =>
        current.map((user) =>
          user._id === actionUser._id
            ? { ...user, status: "banned" }
            : user
        )
      );

      showNotice(`${actionUser.name} has been banned.`);
    }

    if (actionType === "unban") {
      setUsers((current) =>
        current.map((user) =>
          user._id === actionUser._id
            ? { ...user, status: "active" }
            : user
        )
      );

      showNotice(
        `${actionUser.name} has been unbanned.`
      );
    }

    if (actionType === "delete") {
      setUsers((current) =>
        current.filter(
          (user) => user._id !== actionUser._id
        )
      );

      showNotice(
        `${actionUser.name} has been deleted.`
      );
    }

    closeAction();
  }

  function actionTitle() {
    switch (actionType) {
      case "promote":
        return "Promote User";

      case "ban":
        return "Ban User";

      case "unban":
        return "Unban User";

      case "delete":
        return "Delete User";

      default:
        return "Confirm Action";
    }
  }

  function actionDescription() {
    if (!actionUser) return "";

    switch (actionType) {
      case "promote":
        return `You are about to promote ${actionUser.name} to Moderator.`;

      case "ban":
        return `You are about to ban ${actionUser.name}. They will lose access to normal platform activities.`;

      case "unban":
        return `You are about to restore access for ${actionUser.name}.`;

      case "delete":
        return `You are about to permanently delete ${actionUser.name}'s account. This action should only be used when necessary.`;

      default:
        return "";
    }
  }

  return (
    <main className="min-h-screen bg-[#07141a] text-slate-100">
      {/* Background */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-blue-500/[0.04] blur-[120px]" />

        <div className="absolute -bottom-40 -right-40 h-96 w-96 rounded-full bg-cyan-500/[0.04] blur-[120px]" />
      </div>

      {/* Notification */}
      {notice && (
        <div className="fixed right-4 top-4 z-[100] w-[calc(100%-2rem)] max-w-sm rounded-2xl border border-emerald-400/20 bg-[#10242d] px-5 py-4 shadow-2xl">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-300">
              ✓
            </div>

            <div>
              <p className="text-sm font-bold text-white">
                Action completed
              </p>

              <p className="mt-1 text-xs leading-5 text-slate-400">
                {notice}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="relative z-10">
        {/* Header */}
        <section className="border-b border-white/[0.07] bg-[#08171e]/95 backdrop-blur-xl">
          <div className="mx-auto max-w-7xl px-4 py-7 sm:px-6 lg:px-8">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <div className="mb-2 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.25em] text-[#718b94]">
                  <Link
                    href="/superadmin"
                    className="transition hover:text-white"
                  >
                    Superadmin
                  </Link>

                  <span>/</span>

                  <span>Users</span>
                </div>

                <h1 className="text-3xl font-black tracking-tight text-[#f1eee5] sm:text-4xl">
                  Users Management
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                  Manage BookNest members, roles, account
                  status and platform access from one place.
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Link
                  href="/superadmin"
                  className="rounded-xl border border-white/10 bg-[#10242d] px-4 py-3 text-sm font-bold text-slate-300 transition hover:border-white/20 hover:bg-[#142d37]"
                >
                  ← Dashboard
                </Link>

                <button
                  type="button"
                  onClick={() => showNotice("Refresh requested.")}
                  className="rounded-xl bg-[#e9e1cf] px-5 py-3 text-sm font-black text-[#07141a] transition hover:bg-white"
                >
                  ↻ Refresh
                </button>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Stats */}
          <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-white/[0.08] bg-[#0d2028] p-5 shadow-xl shadow-black/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                    Total Users
                  </p>

                  <p className="mt-3 text-3xl font-black text-white">
                    {stats.total}
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-xl">
                  👥
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-[#0d2028] p-5 shadow-xl shadow-black/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                    Moderators
                  </p>

                  <p className="mt-3 text-3xl font-black text-blue-300">
                    {stats.moderators}
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-500/10 text-xl">
                  🛡
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-[#0d2028] p-5 shadow-xl shadow-black/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                    Active
                  </p>

                  <p className="mt-3 text-3xl font-black text-emerald-300">
                    {stats.active}
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-xl">
                  ✓
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-[#0d2028] p-5 shadow-xl shadow-black/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">
                    Banned
                  </p>

                  <p className="mt-3 text-3xl font-black text-red-300">
                    {stats.banned}
                  </p>
                </div>

                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-xl">
                  !
                </div>
              </div>
            </div>
          </section>

          {/* Filters */}
          <section className="mt-8 rounded-3xl border border-white/[0.08] bg-[#0d2028] p-4 shadow-2xl shadow-black/10 sm:p-5">
            <div className="grid gap-3 lg:grid-cols-[1fr_180px_180px_auto]">
              {/* Search */}
              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm text-slate-500">
                  🔎
                </span>

                <input
                  type="text"
                  value={search}
                  onChange={(event) =>
                    setSearch(event.target.value)
                  }
                  placeholder="Search by name or email..."
                  className="h-12 w-full rounded-xl border border-white/10 bg-[#091a21] pl-11 pr-4 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-blue-400/30 focus:ring-2 focus:ring-blue-400/10"
                />
              </div>

              {/* Role */}
              <select
                value={roleFilter}
                onChange={(event) =>
                  setRoleFilter(event.target.value)
                }
                className="h-12 rounded-xl border border-white/10 bg-[#091a21] px-4 text-sm font-semibold text-slate-300 outline-none focus:border-blue-400/30"
              >
                <option value="all">
                  All Roles
                </option>

                <option value="user">
                  User
                </option>

                <option value="moderator">
                  Moderator
                </option>

                <option value="superadmin">
                  Superadmin
                </option>
              </select>

              {/* Status */}
              <select
                value={statusFilter}
                onChange={(event) =>
                  setStatusFilter(event.target.value)
                }
                className="h-12 rounded-xl border border-white/10 bg-[#091a21] px-4 text-sm font-semibold text-slate-300 outline-none focus:border-blue-400/30"
              >
                <option value="all">
                  All Status
                </option>

                <option value="active">
                  Active
                </option>

                <option value="banned">
                  Banned
                </option>
              </select>

              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setRoleFilter("all");
                  setStatusFilter("all");
                }}
                className="h-12 rounded-xl border border-white/10 bg-white/5 px-5 text-sm font-bold text-slate-300 transition hover:bg-white/10"
              >
                Clear
              </button>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-white/5 pt-4">
              <p className="text-xs text-slate-500">
                Showing{" "}
                <span className="font-bold text-slate-300">
                  {filteredUsers.length}
                </span>{" "}
                of{" "}
                <span className="font-bold text-slate-300">
                  {users.length}
                </span>{" "}
                users
              </p>

              <p className="text-[11px] text-slate-600">
                Superadmin control panel
              </p>
            </div>
          </section>

          {/* Desktop Table */}
          <section className="mt-6 hidden overflow-hidden rounded-3xl border border-white/[0.08] bg-[#0d2028] shadow-2xl shadow-black/20 lg:block">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1050px]">
                <thead>
                  <tr className="border-b border-white/5 bg-[#091a21] text-left">
                    <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600">
                      User
                    </th>

                    <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600">
                      Role
                    </th>

                    <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600">
                      Status
                    </th>

                    <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600">
                      Books
                    </th>

                    <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600">
                      Loans
                    </th>

                    <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600">
                      Fine
                    </th>

                    <th className="px-5 py-4 text-right text-[10px] font-bold uppercase tracking-[0.15em] text-slate-600">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/5">
                  {filteredUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="transition hover:bg-white/[0.02]"
                    >
                      {/* User */}
                      <td className="px-5 py-5">
                        <div className="flex items-center gap-3">
                          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#10242d] text-xs font-black text-blue-300">
                            {getInitials(user.name)}
                          </div>

                          <div className="min-w-0">
                            <p className="truncate text-sm font-black text-slate-100">
                              {user.name}
                            </p>

                            <p className="mt-1 truncate text-xs text-slate-600">
                              {user.email}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Role */}
                      <td className="px-5 py-5">
                        <span
                          className={`inline-flex rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide ${getRoleStyle(
                            user.role
                          )}`}
                        >
                          {user.role}
                        </span>
                      </td>

                      {/* Status */}
                      <td className="px-5 py-5">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide ${getStatusStyle(
                            user.status
                          )}`}
                        >
                          <span>
                            {user.status === "active"
                              ? "●"
                              : "●"}
                          </span>

                          {user.status}
                        </span>
                      </td>

                      {/* Books */}
                      <td className="px-5 py-5">
                        <span className="text-sm font-bold text-slate-200">
                          {user.books}
                        </span>
                      </td>

                      {/* Loans */}
                      <td className="px-5 py-5">
                        <span className="text-sm font-bold text-slate-200">
                          {user.activeLoans}
                        </span>
                      </td>

                      {/* Fine */}
                      <td className="px-5 py-5">
                        <span
                          className={`text-sm font-black ${
                            user.fine > 0
                              ? "text-orange-300"
                              : "text-emerald-300"
                          }`}
                        >
                          ৳{user.fine}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-5">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() =>
                              setSelectedUser(user)
                            }
                            className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-slate-300 transition hover:bg-white/10"
                          >
                            View
                          </button>

                          {user.role === "user" && (
                            <button
                              type="button"
                              onClick={() =>
                                openAction(
                                  user,
                                  "promote"
                                )
                              }
                              className="rounded-lg border border-blue-400/10 bg-blue-500/10 px-3 py-2 text-xs font-bold text-blue-300 transition hover:bg-blue-500/20"
                            >
                              Promote
                            </button>
                          )}

                          {user.status === "active" &&
                            user.role !== "superadmin" && (
                              <button
                                type="button"
                                onClick={() =>
                                  openAction(
                                    user,
                                    "ban"
                                  )
                                }
                                className="rounded-lg border border-red-400/10 bg-red-500/10 px-3 py-2 text-xs font-bold text-red-300 transition hover:bg-red-500/20"
                              >
                                Ban
                              </button>
                            )}

                          {user.status === "banned" && (
                            <button
                              type="button"
                              onClick={() =>
                                openAction(
                                  user,
                                  "unban"
                                )
                              }
                              className="rounded-lg border border-emerald-400/10 bg-emerald-500/10 px-3 py-2 text-xs font-bold text-emerald-300 transition hover:bg-emerald-500/20"
                            >
                              Unban
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredUsers.length === 0 && (
              <div className="px-6 py-16 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-2xl">
                  🔎
                </div>

                <h3 className="mt-4 text-lg font-black text-white">
                  No users found
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Try changing your search or filters.
                </p>
              </div>
            )}
          </section>

          {/* Mobile / Tablet Cards */}
          <section className="mt-6 grid gap-4 lg:hidden">
            {filteredUsers.length === 0 ? (
              <div className="rounded-3xl border border-white/5 bg-[#0d2028] px-6 py-16 text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/5 text-2xl">
                  🔎
                </div>

                <h3 className="mt-4 text-lg font-black text-white">
                  No users found
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Try changing your search or filters.
                </p>
              </div>
            ) : (
              filteredUsers.map((user) => (
                <div
                  key={user._id}
                  className="rounded-3xl border border-white/[0.08] bg-[#0d2028] p-5 shadow-xl shadow-black/10"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#10242d] text-sm font-black text-blue-300">
                        {getInitials(user.name)}
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate text-base font-black text-white">
                          {user.name}
                        </h3>

                        <p className="mt-1 truncate text-xs text-slate-600">
                          {user.email}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        setSelectedUser(user)
                      }
                      className="shrink-0 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold text-slate-300"
                    >
                      View
                    </button>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    <span
                      className={`rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase ${getRoleStyle(
                        user.role
                      )}`}
                    >
                      {user.role}
                    </span>

                    <span
                      className={`rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase ${getStatusStyle(
                        user.status
                      )}`}
                    >
                      {user.status}
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-3 gap-2">
                    <div className="rounded-xl border border-white/5 bg-[#091a21] p-3">
                      <p className="text-[9px] font-bold uppercase tracking-wide text-slate-600">
                        Books
                      </p>

                      <p className="mt-1 text-lg font-black text-white">
                        {user.books}
                      </p>
                    </div>

                    <div className="rounded-xl border border-white/5 bg-[#091a21] p-3">
                      <p className="text-[9px] font-bold uppercase tracking-wide text-slate-600">
                        Loans
                      </p>

                      <p className="mt-1 text-lg font-black text-white">
                        {user.activeLoans}
                      </p>
                    </div>

                    <div className="rounded-xl border border-white/5 bg-[#091a21] p-3">
                      <p className="text-[9px] font-bold uppercase tracking-wide text-slate-600">
                        Fine
                      </p>

                      <p
                        className={`mt-1 text-lg font-black ${
                          user.fine > 0
                            ? "text-orange-300"
                            : "text-emerald-300"
                        }`}
                      >
                        ৳{user.fine}
                      </p>
                    </div>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-2">
                    {user.role === "user" && (
                      <button
                        type="button"
                        onClick={() =>
                          openAction(
                            user,
                            "promote"
                          )
                        }
                        className="rounded-xl border border-blue-400/10 bg-blue-500/10 px-3 py-3 text-xs font-bold text-blue-300"
                      >
                        Promote
                      </button>
                    )}

                    {user.status === "active" &&
                      user.role !== "superadmin" && (
                        <button
                          type="button"
                          onClick={() =>
                            openAction(user, "ban")
                          }
                          className="rounded-xl border border-red-400/10 bg-red-500/10 px-3 py-3 text-xs font-bold text-red-300"
                        >
                          Ban User
                        </button>
                      )}

                    {user.status === "banned" && (
                      <button
                        type="button"
                        onClick={() =>
                          openAction(user, "unban")
                        }
                        className="rounded-xl border border-emerald-400/10 bg-emerald-500/10 px-3 py-3 text-xs font-bold text-emerald-300"
                      >
                        Unban User
                      </button>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        openAction(user, "delete")
                      }
                      className="rounded-xl border border-white/10 bg-white/5 px-3 py-3 text-xs font-bold text-slate-400 transition hover:border-red-400/20 hover:text-red-300"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </section>

          {/* Footer Info */}
          <div className="mt-8 rounded-2xl border border-blue-400/10 bg-blue-500/[0.04] p-4">
            <div className="flex gap-3">
              <div className="shrink-0 text-lg">
                🛡
              </div>

              <div>
                <p className="text-sm font-bold text-slate-300">
                  Superadmin permissions
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Superadmins can manage account roles,
                  access status and platform membership.
                  Destructive actions should be used carefully.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* User Details Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md">
          <div className="w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-[#0d2028] shadow-2xl">
            <div className="flex items-center justify-between border-b border-white/5 px-6 py-5">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">
                  User Details
                </p>

                <h2 className="mt-1 text-xl font-black text-white">
                  {selectedUser.name}
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedUser(null)
                }
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-lg text-slate-400 transition hover:bg-white/10 hover:text-white"
              >
                ×
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#10242d] text-lg font-black text-blue-300">
                  {getInitials(selectedUser.name)}
                </div>

                <div className="min-w-0">
                  <p className="truncate text-base font-black text-white">
                    {selectedUser.name}
                  </p>

                  <p className="mt-1 truncate text-sm text-slate-500">
                    {selectedUser.email}
                  </p>

                  <p className="mt-1 text-xs text-slate-600">
                    Joined{" "}
                    {formatDate(
                      selectedUser.joinedAt
                    )}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <div className="rounded-2xl border border-white/5 bg-[#091a21] p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-600">
                    Role
                  </p>

                  <p className="mt-2 text-sm font-black text-slate-200">
                    {selectedUser.role}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/5 bg-[#091a21] p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-600">
                    Status
                  </p>

                  <p className="mt-2 text-sm font-black text-slate-200">
                    {selectedUser.status}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/5 bg-[#091a21] p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-600">
                    Books
                  </p>

                  <p className="mt-2 text-xl font-black text-white">
                    {selectedUser.books}
                  </p>
                </div>

                <div className="rounded-2xl border border-white/5 bg-[#091a21] p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wide text-slate-600">
                    Active Loans
                  </p>

                  <p className="mt-2 text-xl font-black text-white">
                    {selectedUser.activeLoans}
                  </p>
                </div>
              </div>

              <div className="mt-3 rounded-2xl border border-orange-400/10 bg-orange-500/[0.05] p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-500">
                    Outstanding Fine
                  </span>

                  <span className="text-lg font-black text-orange-300">
                    ৳{selectedUser.fine}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedUser(null)
                }
                className="mt-6 w-full rounded-xl bg-[#e9e1cf] px-5 py-3 text-sm font-black text-[#07141a] transition hover:bg-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Action Confirmation Modal */}
      {actionUser && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/75 p-4 backdrop-blur-md">
          <div className="w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-[#0d2028] shadow-2xl">
            <div className="p-6">
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl text-xl ${
                  actionType === "delete" ||
                  actionType === "ban"
                    ? "bg-red-500/10 text-red-300"
                    : "bg-blue-500/10 text-blue-300"
                }`}
              >
                {actionType === "delete"
                  ? "×"
                  : actionType === "ban"
                  ? "!"
                  : actionType === "unban"
                  ? "✓"
                  : "↑"}
              </div>

              <h2 className="mt-5 text-xl font-black text-white">
                {actionTitle()}
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                {actionDescription()}
              </p>

              <div className="mt-5 rounded-2xl border border-white/5 bg-[#091a21] p-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#10242d] text-xs font-black text-blue-300">
                    {getInitials(
                      actionUser.name
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-slate-200">
                      {actionUser.name}
                    </p>

                    <p className="truncate text-xs text-slate-600">
                      {actionUser.email}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={closeAction}
                  className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-slate-300 transition hover:bg-white/10"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={confirmAction}
                  className={`rounded-xl px-5 py-3 text-sm font-black transition ${
                    actionType === "delete" ||
                    actionType === "ban"
                      ? "bg-red-400 text-[#210b0b] hover:bg-red-300"
                      : "bg-[#e9e1cf] text-[#07141a] hover:bg-white"
                  }`}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}