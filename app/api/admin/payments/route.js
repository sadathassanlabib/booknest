import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { auth } from "@/auth";
import { dbConnect } from "@/lib/dbConnect";

async function checkSuperAdmin() {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      error: NextResponse.json(
        { message: "You must be logged in." },
        { status: 401 }
      ),
    };
  }

  if (
    session.user.status !== "approved" ||
    session.user.role !== "superadmin"
  ) {
    return {
      error: NextResponse.json(
        { message: "Superadmin access required." },
        { status: 403 }
      ),
    };
  }

  return { session };
}

export async function GET() {
  try {
    const result = await checkSuperAdmin();

    if (result.error) {
      return result.error;
    }

    const payments = await dbConnect("payments");

    const data = await payments
      .find({})
      .sort({ createdAt: -1 })
      .toArray();

    return NextResponse.json(
      data.map((payment) => ({
        ...payment,
        _id: payment._id.toString(),
        loanId: payment.loanId?.toString() || null,
        bookId: payment.bookId?.toString() || null,
        borrowerId: payment.borrowerId?.toString() || null,
      }))
    );
  } catch (error) {
    console.error("ADMIN_PAYMENT_GET_ERROR:", error);

    return NextResponse.json(
      { message: "Failed to load payments." },
      { status: 500 }
    );
  }
}

export async function PATCH(request) {
  try {
    const result = await checkSuperAdmin();

    if (result.error) {
      return result.error;
    }

    const body = await request.json();

    const {
      paymentId,
      action,
    } = body;

    if (
      !paymentId ||
      !ObjectId.isValid(paymentId)
    ) {
      return NextResponse.json(
        { message: "Valid payment ID is required." },
        { status: 400 }
      );
    }

    if (!["approve", "reject"].includes(action)) {
      return NextResponse.json(
        { message: "Invalid payment action." },
        { status: 400 }
      );
    }

    const payments = await dbConnect("payments");
    const loans = await dbConnect("loans");

    const payment = await payments.findOne({
      _id: new ObjectId(paymentId),
    });

    if (!payment) {
      return NextResponse.json(
        { message: "Payment not found." },
        { status: 404 }
      );
    }

    if (payment.status !== "pending") {
      return NextResponse.json(
        { message: "This payment is no longer pending." },
        { status: 400 }
      );
    }

    const now = new Date();

    if (action === "reject") {
      await payments.updateOne(
        { _id: new ObjectId(paymentId) },
        {
          $set: {
            status: "rejected",
            rejectedAt: now,
            rejectedBy: new ObjectId(result.session.user.id),
            updatedAt: now,
          },
        }
      );

      return NextResponse.json({
        message: "Payment rejected successfully.",
      });
    }

    await payments.updateOne(
      { _id: new ObjectId(paymentId) },
      {
        $set: {
          status: "paid",
          paidAt: now,
          verifiedAt: now,
          verifiedBy: new ObjectId(result.session.user.id),
          updatedAt: now,
        },
      }
    );

    if (payment.loanId) {
      await loans.updateOne(
        { _id: payment.loanId },
        {
          $set: {
            paymentStatus: "paid",
            paidAt: now,
            updatedAt: now,
          },
        }
      );
    }

    return NextResponse.json({
      message: "Payment approved successfully.",
    });
  } catch (error) {
    console.error("ADMIN_PAYMENT_UPDATE_ERROR:", error);

    return NextResponse.json(
      { message: "Failed to update payment." },
      { status: 500 }
    );
  }
}