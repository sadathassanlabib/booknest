"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

export default function UserManagement({ users = [] }) {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");

  const [loadingId, setLoadingId] = useState(null);

  const [deleteUser, setDeleteUser] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const filteredUsers = useMemo(() => {
    const query = search.toLowerCase().trim();

    return users.filter((user) => {
      const matchesSearch =
        !query ||
        user.name?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query);

      const matchesStatus =
        statusFilter === "all" ||
        user.status === statusFilter;

      const matchesRole =
        roleFilter === "all" ||
        user.role === roleFilter;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesRole
      );
    });
  }, [users, search, statusFilter, roleFilter]);

  async function changeRole(userId, role) {
    setLoadingId(userId);
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        "/api/admin/users",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            role,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update role."
        );
      }

      setMessage(data.message);

      router.refresh();
    } catch (error) {
      console.error(error);

      setError(
        error.message ||
          "Failed to update user role."
      );
    } finally {
      setLoadingId(null);
    }
  }

  async function handleDelete() {
    if (!deleteUser) return;

    setLoadingId(deleteUser._id);
    setMessage("");
    setError("");

    try {
      const response = await fetch(
        "/api/admin/users",
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId: deleteUser._id,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to delete user."
        );
      }

      setDeleteUser(null);
      setMessage(data.message);

      router.refresh();
    } catch (error) {
      console.error(error);

      setError(
        error.message ||
          "Failed to delete user."
      );
    } finally {
      setLoadingId(null);
    }
  }

  return (
    <>
      <div className="space-y-6">

        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-[#EDE6D6]">
            User Management
          </h1>

          <p className="mt-1 text-sm text-[#899692]">
            Manage BookNest members, roles and access.
          </p>
        </div>

        {/* Messages */}
        {message && (
          <div className="rounded-xl border border-[#8BAF9D]/20 bg-[#8BAF9D]/10 px-4 py-3 text-sm text-[#B9D0C4]">
            {message}
          </div>
        )}

        {error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Filters */}
        <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="grid gap-3 md:grid-cols-3">

            {/* Search */}
            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search name or email..."
              className="rounded-xl border border-white/10 bg-[#101D23] px-4 py-3 text-sm text-[#EDE6D6] outline-none placeholder:text-[#596762] focus:border-[#8BAF9D]/50"
            />

            {/* Status */}
            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
              className="rounded-xl border border-white/10 bg-[#101D23] px-4 py-3 text-sm text-[#EDE6D6] outline-none"
            >
              <option value="all">
                All Status
              </option>

              <option value="pending">
                Pending
              </option>

              <option value="approved">
                Approved
              </option>

              <option value="rejected">
                Rejected
              </option>
            </select>

            {/* Role */}
            <select
              value={roleFilter}
              onChange={(e) =>
                setRoleFilter(e.target.value)
              }
              className="rounded-xl border border-white/10 bg-[#101D23] px-4 py-3 text-sm text-[#EDE6D6] outline-none"
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
          </div>

          <div className="mt-3 text-xs text-[#899692]">
            Showing {filteredUsers.length} of{" "}
            {users.length} users
          </div>
        </div>

        {/* Users */}
        <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">

          {/* Desktop table */}
          <div className="hidden overflow-x-auto md:block">
            <table className="w-full text-left">
              <thead className="border-b border-white/10 bg-white/5">
                <tr>
                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-[#899692]">
                    User
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-[#899692]">
                    Role
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-[#899692]">
                    Status
                  </th>

                  <th className="px-5 py-4 text-xs font-bold uppercase tracking-wider text-[#899692]">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user._id}
                    className="border-b border-white/5 last:border-0"
                  >
                    {/* User */}
                    <td className="px-5 py-4">
                      <div className="font-semibold text-[#EDE6D6]">
                        {user.name || "Unnamed User"}
                      </div>

                      <div className="mt-1 text-xs text-[#899692]">
                        {user.email}
                      </div>
                    </td>

                    {/* Role */}
                    <td className="px-5 py-4">
                      {user.role === "superadmin" ? (
                        <span className="inline-flex rounded-full bg-purple-500/10 px-3 py-1 text-xs font-bold text-purple-300">
                          Superadmin
                        </span>
                      ) : (
                        <select
                          value={user.role}
                          disabled={
                            loadingId === user._id
                          }
                          onChange={(e) =>
                            changeRole(
                              user._id,
                              e.target.value
                            )
                          }
                          className="rounded-lg border border-white/10 bg-[#101D23] px-3 py-2 text-xs text-[#EDE6D6] outline-none"
                        >
                          <option value="user">
                            User
                          </option>

                          <option value="moderator">
                            Moderator
                          </option>
                        </select>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${
                          user.status === "approved"
                            ? "bg-[#8BAF9D]/10 text-[#B9D0C4]"
                            : user.status ===
                              "pending"
                            ? "bg-yellow-500/10 text-yellow-300"
                            : "bg-red-500/10 text-red-400"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>

                    {/* Delete */}
                    <td className="px-5 py-4">
                      {user.role !==
                        "superadmin" && (
                        <button
                          type="button"
                          onClick={() =>
                            setDeleteUser(user)
                          }
                          className="rounded-lg border border-red-500/20 px-3 py-2 text-xs font-bold text-red-400 transition hover:bg-red-500/10"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile */}
          <div className="divide-y divide-white/5 md:hidden">
            {filteredUsers.map((user) => (
              <div
                key={user._id}
                className="p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-[#EDE6D6]">
                      {user.name || "Unnamed User"}
                    </h3>

                    <p className="mt-1 break-all text-xs text-[#899692]">
                      {user.email}
                    </p>
                  </div>

                  <span className="shrink-0 rounded-full bg-white/5 px-3 py-1 text-xs text-[#AEB8B4]">
                    {user.status}
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  {user.role === "superadmin" ? (
                    <span className="text-xs font-bold text-purple-300">
                      Superadmin
                    </span>
                  ) : (
                    <select
                      value={user.role}
                      disabled={
                        loadingId === user._id
                      }
                      onChange={(e) =>
                        changeRole(
                          user._id,
                          e.target.value
                        )
                      }
                      className="rounded-lg border border-white/10 bg-[#101D23] px-3 py-2 text-xs text-[#EDE6D6] outline-none"
                    >
                      <option value="user">
                        User
                      </option>

                      <option value="moderator">
                        Moderator
                      </option>
                    </select>
                  )}

                  {user.role !==
                    "superadmin" && (
                    <button
                      type="button"
                      onClick={() =>
                        setDeleteUser(user)
                      }
                      className="rounded-lg border border-red-500/20 px-3 py-2 text-xs font-bold text-red-400"
                    >
                      Delete
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Empty */}
          {filteredUsers.length === 0 && (
            <div className="px-6 py-16 text-center">
              <p className="font-semibold text-[#EDE6D6]">
                No users found
              </p>

              <p className="mt-1 text-sm text-[#899692]">
                Try changing your search or filters.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Delete Modal */}
      {deleteUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-5 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#17262D] p-6 shadow-2xl">

            <div className="mb-5">
              <div className="mb-4 grid h-11 w-11 place-items-center rounded-xl bg-red-500/10 text-red-400">
                !
              </div>

              <h2 className="text-xl font-bold text-[#EDE6D6]">
                Delete User?
              </h2>

              <p className="mt-2 text-sm leading-6 text-[#899692]">
                You are about to permanently delete:
              </p>

              <div className="mt-3 rounded-xl border border-white/10 bg-[#101D23] p-4">
                <p className="font-semibold text-[#EDE6D6]">
                  {deleteUser.name}
                </p>

                <p className="mt-1 break-all text-xs text-[#899692]">
                  {deleteUser.email}
                </p>
              </div>

              <p className="mt-4 text-xs leading-5 text-red-400">
                This action cannot be undone.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() =>
                  setDeleteUser(null)
                }
                disabled={
                  loadingId === deleteUser._id
                }
                className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm font-bold text-[#AEB8B4] transition hover:bg-white/5"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={
                  loadingId === deleteUser._id
                }
                className="flex-1 rounded-xl bg-red-500 px-4 py-3 text-sm font-bold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {loadingId === deleteUser._id
                  ? "Deleting..."
                  : "Delete User"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}