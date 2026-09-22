
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PendingUsers({ users }) {
  const router = useRouter();

  const [loadingId, setLoadingId] = useState(null);
  const [error, setError] = useState("");

  // Modal state
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState(null);

  function openModal(user, status) {
    setSelectedUser(user);
    setSelectedStatus(status);
    setError("");
  }

  function closeModal() {
    if (loadingId) return;

    setSelectedUser(null);
    setSelectedStatus(null);
  }

  async function updateStatus() {
    if (!selectedUser || !selectedStatus) {
      return;
    }

    const userId = selectedUser._id.toString();

    try {
      setLoadingId(userId);
      setError("");

      const response = await fetch(
        "/api/admin/users/status",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            status: selectedStatus,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to update user."
        );
      }

      // Close modal
      setSelectedUser(null);
      setSelectedStatus(null);

      // Refresh server component
      router.refresh();
    } catch (error) {
      console.error("STATUS_UPDATE_ERROR:", error);

      setError(
        error.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setLoadingId(null);
    }
  }

  if (!users || users.length === 0) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-10 text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10 text-xl text-green-400">
          ✓
        </div>

        <h3 className="text-lg font-semibold text-white">
          No Pending Users
        </h3>

        <p className="mt-2 text-sm text-gray-400">
          No users are currently waiting for approval.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Error Message */}
      {error && (
        <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-400">
          {error}
        </div>
      )}

      {/* Users Table */}
      <div className="overflow-hidden rounded-2xl border border-white/10">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-white/10 bg-white/5">
              <tr>
                <th className="px-6 py-4 text-sm font-medium text-gray-400">
                  Name
                </th>

                <th className="px-6 py-4 text-sm font-medium text-gray-400">
                  Email
                </th>

                <th className="px-6 py-4 text-sm font-medium text-gray-400">
                  Phone
                </th>

                <th className="px-6 py-4 text-sm font-medium text-gray-400">
                  Area
                </th>

                <th className="px-6 py-4 text-sm font-medium text-gray-400">
                  Status
                </th>

                <th className="px-6 py-4 text-sm font-medium text-gray-400">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>
              {users.map((user) => {
                const userId = user._id.toString();
                const isLoading = loadingId === userId;

                return (
                  <tr
                    key={userId}
                    className="border-b border-white/5 last:border-b-0 transition hover:bg-white/[0.02]"
                  >
                    {/* Name */}
                    <td className="px-6 py-5">
                      <div>
                        <p className="font-medium text-white">
                          {user.name}
                        </p>

                        <p className="mt-1 text-xs text-gray-500">
                          {userId}
                        </p>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="px-6 py-5 text-gray-300">
                      {user.email}
                    </td>

                    {/* Phone */}
                    <td className="px-6 py-5 text-gray-300">
                      {user.phone || "-"}
                    </td>

                    {/* Area */}
                    <td className="px-6 py-5 text-gray-300">
                      {user.area || "-"}
                    </td>

                    {/* Status */}
                    <td className="px-6 py-5">
                      <span className="inline-flex rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-medium text-yellow-400">
                        Pending
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-5">
                      <div className="flex gap-2">
                        {/* Approve */}
                        <button
                          type="button"
                          disabled={isLoading}
                          onClick={() =>
                            openModal(
                              user,
                              "approved"
                            )
                          }
                          className="rounded-lg bg-green-500/10 px-4 py-2 text-sm font-medium text-green-400 transition hover:bg-green-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Approve
                        </button>

                        {/* Reject */}
                        <button
                          type="button"
                          disabled={isLoading}
                          onClick={() =>
                            openModal(
                              user,
                              "rejected"
                            )
                          }
                          className="rounded-lg bg-red-500/10 px-4 py-2 text-sm font-medium text-red-400 transition hover:bg-red-500/20 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Reject
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MODAL ================= */}
      {selectedUser && selectedStatus && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="w-full max-w-md rounded-2xl border border-white/10 bg-[#111111] p-6 shadow-2xl"
            onClick={(event) =>
              event.stopPropagation()
            }
          >
            {/* Icon */}
            <div className="flex justify-center">
              {selectedStatus === "approved" ? (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10 text-3xl text-green-400">
                  ✓
                </div>
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 text-3xl text-red-400">
                  !
                </div>
              )}
            </div>

            {/* Title */}
            <div className="mt-5 text-center">
              <h2 className="text-xl font-semibold text-white">
                {selectedStatus === "approved"
                  ? "Approve this user?"
                  : "Reject this user?"}
              </h2>

              <p className="mt-2 text-sm leading-6 text-gray-400">
                {selectedStatus === "approved"
                  ? "This user will be able to access their BookNest account."
                  : "This user will not be able to access their BookNest account."}
              </p>
            </div>

            {/* User Information */}
            <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-4">
              <div className="flex items-center justify-between gap-4">
                <span className="text-sm text-gray-500">
                  Name
                </span>

                <span className="text-sm font-medium text-white">
                  {selectedUser.name}
                </span>
              </div>

              <div className="mt-3 flex items-start justify-between gap-4">
                <span className="text-sm text-gray-500">
                  Email
                </span>

                <span className="break-all text-right text-sm text-gray-300">
                  {selectedUser.email}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between gap-4">
                <span className="text-sm text-gray-500">
                  Phone
                </span>

                <span className="text-sm text-gray-300">
                  {selectedUser.phone || "-"}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between gap-4">
                <span className="text-sm text-gray-500">
                  Area
                </span>

                <span className="text-sm text-gray-300">
                  {selectedUser.area || "-"}
                </span>
              </div>

              <div className="mt-3 flex items-center justify-between gap-4">
                <span className="text-sm text-gray-500">
                  Current Status
                </span>

                <span className="rounded-full bg-yellow-500/10 px-3 py-1 text-xs font-medium text-yellow-400">
                  Pending
                </span>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-6 flex gap-3">
              {/* Cancel */}
              <button
                type="button"
                disabled={loadingId !== null}
                onClick={closeModal}
                className="flex-1 rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-gray-300 transition hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>

              {/* Confirm */}
              <button
                type="button"
                disabled={loadingId !== null}
                onClick={updateStatus}
                className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${
                  selectedStatus === "approved"
                    ? "bg-green-500 text-black hover:bg-green-400"
                    : "bg-red-500 text-white hover:bg-red-400"
                }`}
              >
                {loadingId !== null
                  ? "Processing..."
                  : selectedStatus === "approved"
                  ? "Yes, Approve"
                  : "Yes, Reject"}
              </button>
            </div>

            {/* Small note */}
            <p className="mt-4 text-center text-xs text-gray-600">
              You can change this user's status later
              from the user management section.
            </p>
          </div>
        </div>
      )}
    </>
  );
}

