import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { dbConnect } from "@/lib/dbConnect";
import PendingUsers from "@/components/admin/PendingUsers";

export default async function SuperAdminPage() {
  const session = await auth();

  // Not logged in
  if (!session?.user) {
    redirect("/login");
  }

  // Only approved superadmin
  if (
    session.user.role !== "superadmin" ||
    session.user.status !== "approved"
  ) {
    redirect("/forbidden");
  }

  const usersCollection = await dbConnect("users");

  const pendingUsers = await usersCollection
    .find({
      role: "user",
      status: "pending",
    })
    .sort({
      createdAt: -1,
    })
    .toArray();

  // ---------------------------------------
  // Convert MongoDB objects into
  // plain serializable objects
  // ---------------------------------------
  const serializedPendingUsers = pendingUsers.map((user) => ({
    _id: user._id.toString(),
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    area: user.area || "",
    role: user.role || "user",
    status: user.status || "pending",
    createdAt: user.createdAt
      ? user.createdAt.toISOString()
      : null,
    updatedAt: user.updatedAt
      ? user.updatedAt.toISOString()
      : null,
  }));

  return (
    <main className="min-h-screen bg-[#101D23] px-6 py-10 text-[#EDE6D6]">
      <div className="mx-auto max-w-7xl">

        {/* =========================================
            HEADER
        ========================================= */}
        <div className="mb-10">
          <p className="mb-2 text-sm text-[#8FA09A]">
            BookNest Administration
          </p>

          <h1 className="text-4xl font-bold tracking-tight">
            Super Admin Dashboard
          </h1>

          <p className="mt-3 text-[#9CA8A5]">
            Welcome, {session.user.name}
          </p>
        </div>

        {/* =========================================
            STATS
        ========================================= */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-[#899692]">
              Pending Users
            </p>

            <p className="mt-2 text-3xl font-bold text-[#EDE6D6]">
              {serializedPendingUsers.length}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-[#899692]">
              Your Role
            </p>

            <p className="mt-2 text-xl font-bold capitalize text-[#B9D0C4]">
              {session.user.role}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-[#899692]">
              Account Status
            </p>

            <p className="mt-2 text-xl font-bold capitalize text-[#B9D0C4]">
              {session.user.status}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-[#899692]">
              Access Level
            </p>

            <p className="mt-2 text-xl font-bold text-[#B9D0C4]">
              Full Access
            </p>
          </div>
        </div>

        {/* =========================================
            PENDING USERS
        ========================================= */}
        <section className="mt-10">

          <div className="mb-5">
            <h2 className="text-2xl font-semibold">
              Pending User Requests
            </h2>

            <p className="mt-1 text-sm text-[#899692]">
              Review users waiting for admin approval.
            </p>
          </div>

          <PendingUsers users={serializedPendingUsers} />

        </section>
      </div>
    </main>
  );
}