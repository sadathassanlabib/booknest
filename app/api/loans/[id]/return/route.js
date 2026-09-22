import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { auth } from "@/auth";
import { dbConnect } from "@/lib/dbConnect";

function calculateLateFine(dueDate) {
  if (!dueDate) return 0;

  const now = new Date();
  const due = new Date(dueDate);

  if (now <= due) return 0;

  const lateDays = Math.floor(
    (now.getTime() - due.getTime()) /
      (1000 * 60 * 60 * 24)
  );

  if (lateDays <= 0) return 0;

  const tenDayPeriods = Math.ceil(lateDays / 10);

  return Math.min(tenDayPeriods * 10, 50);
}

export async function PATCH(request, { params }) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          message: "You must be logged in.",
        },
        { status: 401 }
      );
    }

    if (session.user.status !== "approved") {
      return NextResponse.json(
        {
          message: "Your account is not approved.",
        },
        { status: 403 }
      );
    }

    const { id } = await params;

    if (!id || !ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          message: "Invalid loan ID.",
        },
        { status: 400 }
      );
    }

    const body = await request.json().catch(() => ({}));

    const condition = body.condition || "good";

    const allowedConditions = [
      "good",
      "damaged",
      "lost",
    ];

    if (!allowedConditions.includes(condition)) {
      return NextResponse.json(
        {
          message: "Invalid book condition.",
        },
        { status: 400 }
      );
    }

    const loans = await dbConnect("loans");
    const books = await dbConnect("books");
    const requests = await dbConnect("requests");

    const loanId = new ObjectId(id);

    const loan = await loans.findOne({
      _id: loanId,
    });

    if (!loan) {
      return NextResponse.json(
        {
          message: "Loan not found.",
        },
        { status: 404 }
      );
    }

    // Only borrower can return the book
    if (
      loan.borrowerId?.toString() !==
      session.user.id.toString()
    ) {
      return NextResponse.json(
        {
          message: "You are not allowed to return this book.",
        },
        { status: 403 }
      );
    }

    // Already returned
    if (loan.status !== "active") {
      return NextResponse.json(
        {
          message: "This loan is no longer active.",
        },
        { status: 400 }
      );
    }

    const now = new Date();

    // Calculate late fine
    const lateFine = calculateLateFine(loan.dueDate);

    // Damage / Lost fee
    let damageFine = 0;
    let lostFine = 0;

    if (condition === "damaged") {
      damageFine = Number(loan.damageFee || 0);
    }

    if (condition === "lost") {
      lostFine = Number(loan.damageFee || 0);
    }

    const totalFine =
      lateFine +
      damageFine +
      lostFine;

    let newStatus = "returned";

    if (condition === "damaged") {
      newStatus = "damaged";
    }

    if (condition === "lost") {
      newStatus = "lost";
    }

    const paymentStatus =
      totalFine > 0 ? "unpaid" : "not_required";

    // Update loan
    await loans.updateOne(
      {
        _id: loanId,
      },
      {
        $set: {
          status: newStatus,
          returnedAt: now,
          lateFine,
          damageFine,
          lostFine,
          totalFine,
          paymentStatus,
          returnCondition: condition,
          updatedAt: now,
        },
      }
    );

    // Update book
    if (loan.bookId) {
      const bookId =
        loan.bookId instanceof ObjectId
          ? loan.bookId
          : new ObjectId(loan.bookId);

      if (condition === "good") {
        await books.updateOne(
          {
            _id: bookId,
          },
          {
            $set: {
              availability: "available",
              updatedAt: now,
            },
            $unset: {
              currentLoanId: "",
              borrowedBy: "",
              borrowedAt: "",
            },
          }
        );
      } else {
        await books.updateOne(
          {
            _id: bookId,
          },
          {
            $set: {
              availability: "unavailable",
              updatedAt: now,
            },
            $unset: {
              currentLoanId: "",
              borrowedBy: "",
              borrowedAt: "",
            },
          }
        );
      }
    }

    // Update original request
    if (loan.requestId) {
      let requestObjectId = null;

      try {
        requestObjectId =
          loan.requestId instanceof ObjectId
            ? loan.requestId
            : new ObjectId(loan.requestId);
      } catch {
        requestObjectId = null;
      }

      if (requestObjectId) {
        await requests.updateOne(
          {
            _id: requestObjectId,
          },
          {
            $set: {
              status: newStatus,
              returnedAt: now,
              updatedAt: now,
            },
          }
        );
      }
    }

    return NextResponse.json(
      {
        message:
          condition === "good"
            ? "Book returned successfully."
            : condition === "damaged"
            ? "Book returned as damaged."
            : "Book return recorded as lost.",

        loan: {
          id: loanId.toString(),
          status: newStatus,
          condition,
          lateFine,
          damageFine,
          lostFine,
          totalFine,
          paymentStatus,
          returnedAt: now,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error(
      "RETURN_LOAN_ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Something went wrong while returning the book.",
      },
      { status: 500 }
    );
  }
}