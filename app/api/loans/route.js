import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { auth } from "@/auth";
import { dbConnect } from "@/lib/dbConnect";

function getBookRule(pages) {
  const pageCount = Number(pages) || 0;

  if (pageCount < 150) {
    return {
      category: "under_150",
      freeMonths: 1,
      damageFee: 60,
    };
  }

  if (pageCount <= 300) {
    return {
      category: "151_300",
      freeMonths: 1,
      damageFee: 100,
    };
  }

  if (pageCount <= 700) {
    return {
      category: "301_700",
      freeMonths: 2,
      damageFee: 150,
    };
  }

  return {
    category: "over_700",
    freeMonths: 2,
    damageFee: 150,
  };
}

function calculateLateFine(dueDate) {
  if (!dueDate) return 0;

  const now = new Date();
  const due = new Date(dueDate);

  if (now <= due) {
    return 0;
  }

  const lateMilliseconds =
    now.getTime() - due.getTime();

  const lateDays = Math.floor(
    lateMilliseconds / (1000 * 60 * 60 * 24)
  );

  if (lateDays <= 0) {
    return 0;
  }

  const tenDayPeriods = Math.ceil(lateDays / 10);

  return Math.min(tenDayPeriods * 10, 50);
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
        { message: "Your account is not approved yet." },
        { status: 403 }
      );
    }

    if (!ObjectId.isValid(session.user.id)) {
      return NextResponse.json(
        { message: "Invalid user ID." },
        { status: 400 }
      );
    }

    const loans = await dbConnect("loans");

    const result = await loans
      .find({
        borrowerId: new ObjectId(session.user.id),
      })
      .sort({ createdAt: -1 })
      .toArray();

    const formattedLoans = result.map((loan) => {
      const lateFine =
        loan.status === "active"
          ? calculateLateFine(loan.dueDate)
          : Number(loan.lateFine) || 0;

      const totalFine =
        lateFine +
        (Number(loan.damageFine) || 0) +
        (Number(loan.lostFine) || 0);

      const dueDate = loan.dueDate
        ? new Date(loan.dueDate)
        : null;

      const now = new Date();

      const isOverdue =
        loan.status === "active" &&
        dueDate &&
        now > dueDate;

      const lateDays =
        isOverdue && dueDate
          ? Math.floor(
              (now.getTime() - dueDate.getTime()) /
                (1000 * 60 * 60 * 24)
            )
          : 0;

      return {
        ...loan,

        _id: loan._id.toString(),

        requestId:
          loan.requestId?.toString() || "",

        bookId:
          loan.bookId?.toString() || "",

        ownerId:
          loan.ownerId?.toString() || "",

        borrowerId:
          loan.borrowerId?.toString() || "",

        loanId:
          loan.loanId?.toString() || "",

        pages: Number(loan.pages) || 0,

        freeMonths:
          Number(loan.freeMonths) || 1,

        damageFee:
          Number(loan.damageFee) || 0,

        lateFine,

        lostFine:
          Number(loan.lostFine) || 0,

        damageFine:
          Number(loan.damageFine) || 0,

        totalFine,

        lateDays,

        isOverdue: !!isOverdue,

        startDate: loan.startDate
          ? new Date(loan.startDate).toISOString()
          : null,

        dueDate: loan.dueDate
          ? new Date(loan.dueDate).toISOString()
          : null,

        returnedAt: loan.returnedAt
          ? new Date(loan.returnedAt).toISOString()
          : null,

        createdAt: loan.createdAt
          ? new Date(loan.createdAt).toISOString()
          : null,

        updatedAt: loan.updatedAt
          ? new Date(loan.updatedAt).toISOString()
          : null,
      };
    });

    return NextResponse.json({
      loans: formattedLoans,
    });
  } catch (error) {
    console.error("GET_MY_LOANS_ERROR:", error);

    return NextResponse.json(
      {
        message: "Failed to load your loans.",
      },
      { status: 500 }
    );
  }
}