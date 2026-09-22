import { auth } from "@/auth";
import { dbConnect } from "@/lib/dbConnect";
import PaymentsManagement from "@/components/superadmin/PaymentsManagement";

export default async function SuperadminPaymentsPage() {
  const session = await auth();

  if (
    !session?.user?.id ||
    session.user.role !== "superadmin" ||
    session.user.status !== "approved"
  ) {
    return (
      <main className="min-h-screen bg-[#07141a] px-4 py-16 text-white">
        <div className="mx-auto max-w-xl rounded-3xl border border-red-400/20 bg-[#0d2028] p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-500/10 text-2xl font-black text-red-400">
            !
          </div>

          <h1 className="mt-5 text-2xl font-black">
            Access Denied
          </h1>

          <p className="mt-2 text-sm text-slate-500">
            Superadmin access is required to view payment
            management.
          </p>
        </div>
      </main>
    );
  }

  const paymentsCollection = await dbConnect("payments");

  const payments = await paymentsCollection
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  const serializedPayments = payments.map((payment) => ({
    ...payment,
    _id: payment._id.toString(),
    loanId: payment.loanId?.toString() || null,
    bookId: payment.bookId?.toString() || null,
    borrowerId: payment.borrowerId?.toString() || null,
    verifiedBy: payment.verifiedBy?.toString() || null,
    rejectedBy: payment.rejectedBy?.toString() || null,
    createdAt: payment.createdAt
      ? payment.createdAt.toISOString()
      : null,
    updatedAt: payment.updatedAt
      ? payment.updatedAt.toISOString()
      : null,
    paidAt: payment.paidAt
      ? payment.paidAt.toISOString()
      : null,
    verifiedAt: payment.verifiedAt
      ? payment.verifiedAt.toISOString()
      : null,
    rejectedAt: payment.rejectedAt
      ? payment.rejectedAt.toISOString()
      : null,
  }));

  return (
    <PaymentsManagement
      initialPayments={serializedPayments}
    />
  );
}