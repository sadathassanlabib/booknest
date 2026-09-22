import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { auth } from "@/auth";
import { dbConnect } from "@/lib/dbConnect";

export async function POST(request) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "You must be logged in." },
        { status: 401 }
      );
    }

    if (session.user.status !== "approved") {
      return NextResponse.json(
        { message: "Your account is not approved." },
        { status: 403 }
      );
    }

    const body = await request.json();

    const {
      loanId,
      paymentMethod,
      transactionId,
    } = body;

    if (!loanId) {
      return NextResponse.json(
        { message: "Loan ID is required." },
        { status: 400 }
      );
    }

    if (!ObjectId.isValid(loanId)) {
      return NextResponse.json(
        { message: "Invalid loan ID." },
        { status: 400 }
      );
    }

    if (!paymentMethod) {
      return NextResponse.json(
        { message: "Payment method is required." },
        { status: 400 }
      );
    }

    const allowedMethods = [
      "bkash",
      "nagad",
      "bank",
      "cash",
    ];

    if (!allowedMethods.includes(paymentMethod)) {
      return NextResponse.json(
        { message: "Invalid payment method." },
        { status: 400 }
      );
    }

    if (
      paymentMethod !== "cash" &&
      !transactionId?.trim()
    ) {
      return NextResponse.json(
        {
          message:
            "Transaction ID is required for this payment method.",
        },
        { status: 400 }
      );
    }

    const loans = await dbConnect("loans");
    const payments = await dbConnect("payments");

    const loan = await loans.findOne({
      _id: new ObjectId(loanId),
      borrowerId: new ObjectId(session.user.id),
    });

    if (!loan) {
      return NextResponse.json(
        { message: "Loan not found." },
        { status: 404 }
      );
    }

    const totalFine = Number(loan.totalFine || 0);

    if (totalFine <= 0) {
      return NextResponse.json(
        { message: "This loan has no unpaid fine." },
        { status: 400 }
      );
    }

    if (loan.paymentStatus === "paid") {
      return NextResponse.json(
        { message: "This fine has already been paid." },
        { status: 400 }
      );
    }

    if (loan.paymentStatus === "pending") {
      return NextResponse.json(
        {
          message:
            "A payment for this fine is already waiting for verification.",
        },
        { status: 400 }
      );
    }

    const existingPendingPayment =
      await payments.findOne({
        loanId: new ObjectId(loanId),
        borrowerId: new ObjectId(session.user.id),
        status: "pending",
      });

    if (existingPendingPayment) {
      return NextResponse.json(
        {
          message:
            "A payment request is already pending for this loan.",
        },
        { status: 400 }
      );
    }

    const now = new Date();

    const payment = {
      loanId: new ObjectId(loanId),

      bookId: loan.bookId
        ? new ObjectId(loan.bookId)
        : null,

      borrowerId: new ObjectId(session.user.id),

      borrowerName:
        session.user.name || loan.borrowerName || "",

      borrowerEmail:
        session.user.email || loan.borrowerEmail || "",

      bookTitle: loan.bookTitle || "",

      amount: totalFine,

      lateFine: Number(loan.lateFine || 0),

      damageFine: Number(loan.damageFine || 0),

      lostFine: Number(loan.lostFine || 0),

      paymentMethod,

      transactionId:
        transactionId?.trim() || "",

      status: "pending",

      paidAt: null,

      verifiedBy: null,

      verifiedAt: null,

      rejectedBy: null,

      rejectedAt: null,

      rejectionReason: "",

      createdAt: now,

      updatedAt: now,
    };

    const result = await payments.insertOne(payment);

    await loans.updateOne(
      { _id: new ObjectId(loanId) },
      {
        $set: {
          paymentStatus: "pending",
          paymentId: result.insertedId,
          updatedAt: now,
        },
      }
    );

    return NextResponse.json(
      {
        message:
          "Payment submitted successfully. Please wait for verification.",
        paymentId: result.insertedId.toString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("CREATE_PAYMENT_ERROR:", error);

    return NextResponse.json(
      {
        message:
          "Something went wrong while submitting payment.",
      },
      { status: 500 }
    );
  }
}


export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "You must be logged in." },
        { status: 401 }
      );
    }

    if (session.user.status !== "approved") {
      return NextResponse.json(
        { message: "Your account is not approved." },
        { status: 403 }
      );
    }

    const payments = await dbConnect("payments");

    const data = await payments
      .find({
        borrowerId: new ObjectId(session.user.id),
      })
      .sort({ createdAt: -1 })
      .toArray();

    const serialized = data.map((payment) => ({
      ...payment,

      _id: payment._id.toString(),

      loanId: payment.loanId
        ? payment.loanId.toString()
        : null,

      bookId: payment.bookId
        ? payment.bookId.toString()
        : null,

      borrowerId: payment.borrowerId
        ? payment.borrowerId.toString()
        : null,

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

    return NextResponse.json(serialized);
  } catch (error) {
    console.error("GET_PAYMENTS_ERROR:", error);

    return NextResponse.json(
      {
        message: "Failed to load payments.",
      },
      { status: 500 }
    );
  }
}