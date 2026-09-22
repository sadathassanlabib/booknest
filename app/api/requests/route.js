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

  return {
    category: "301_700",
    freeMonths: 2,
    damageFee: 150,
  };
}

async function getApprovedSession() {
  const session = await auth();

  if (!session?.user?.id) {
    return {
      error: NextResponse.json(
        { message: "You must be logged in." },
        { status: 401 }
      ),
    };
  }

  if (session.user.status !== "approved") {
    return {
      error: NextResponse.json(
        { message: "Your account is not approved yet." },
        { status: 403 }
      ),
    };
  }

  if (!ObjectId.isValid(session.user.id)) {
    return {
      error: NextResponse.json(
        { message: "Invalid user ID." },
        { status: 400 }
      ),
    };
  }

  return {
    session,
    userId: new ObjectId(session.user.id),
  };
}

/* =========================
   CREATE BORROW REQUEST
========================= */

export async function POST(req) {
  try {
    const access = await getApprovedSession();

    if (access.error) {
      return access.error;
    }

    const { session, userId } = access;

    const body = await req.json();

    const {
      bookId,
      type = "borrow",
    } = body;

    if (!bookId) {
      return NextResponse.json(
        { message: "Book ID is required." },
        { status: 400 }
      );
    }

    if (!ObjectId.isValid(bookId)) {
      return NextResponse.json(
        { message: "Invalid book ID." },
        { status: 400 }
      );
    }

    if (!["borrow", "collect"].includes(type)) {
      return NextResponse.json(
        { message: "Invalid request type." },
        { status: 400 }
      );
    }

    const books = await dbConnect("books");

    const book = await books.findOne({
      _id: new ObjectId(bookId),
      status: "approved",
    });

    if (!book) {
      return NextResponse.json(
        {
          message:
            "Book not found or not approved.",
        },
        { status: 404 }
      );
    }

    if (book.availability !== "available") {
      return NextResponse.json(
        {
          message:
            "This book is currently unavailable.",
        },
        { status: 409 }
      );
    }

    if (
      book.ownerId?.toString() ===
      session.user.id
    ) {
      return NextResponse.json(
        {
          message:
            "You cannot request your own book.",
        },
        { status: 400 }
      );
    }

    const requests =
      await dbConnect("requests");

    const existingRequest =
      await requests.findOne({
        bookId: new ObjectId(bookId),
        requesterId: userId,
        status: {
          $in: [
            "pending",
            "active",
          ],
        },
      });

    if (existingRequest) {
      return NextResponse.json(
        {
          message:
            "You already have an active request for this book.",
        },
        { status: 409 }
      );
    }

    const now = new Date();

    const requestData = {
      bookId: new ObjectId(bookId),
      bookTitle: book.title || "",

      ownerId: book.ownerId || null,
      ownerName:
        book.ownerName || "",
      ownerEmail:
        book.ownerEmail || "",

      requesterId: userId,
      requesterName:
        session.user.name || "",
      requesterEmail:
        session.user.email || "",

      type,
      status: "pending",

      requestedAt: now,
      createdAt: now,
      updatedAt: now,
    };

    const result =
      await requests.insertOne(
        requestData
      );

    return NextResponse.json(
      {
        message:
          "Book request submitted successfully.",

        requestId:
          result.insertedId.toString(),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "CREATE_REQUEST_ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Failed to create book request.",
      },
      { status: 500 }
    );
  }
}

/* =========================
   MY REQUESTS
========================= */

export async function GET() {
  try {
    const access =
      await getApprovedSession();

    if (access.error) {
      return access.error;
    }

    const { userId } = access;

    const requests =
      await dbConnect("requests");

    const result = await requests
      .find({
        requesterId: userId,
      })
      .sort({
        createdAt: -1,
      })
      .toArray();

    const formattedRequests =
      result.map((request) => ({
        ...request,

        _id:
          request._id.toString(),

        bookId:
          request.bookId?.toString() ||
          "",

        ownerId:
          request.ownerId?.toString() ||
          "",

        requesterId:
          request.requesterId?.toString() ||
          "",

        loanId:
          request.loanId?.toString() ||
          "",
      }));

    return NextResponse.json({
      requests:
        formattedRequests,
    });
  } catch (error) {
    console.error(
      "GET_REQUESTS_ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Failed to load requests.",
      },
      { status: 500 }
    );
  }
}

/* =========================
   OWNER ACCEPT / REJECT
========================= */

export async function PATCH(req) {
  try {
    const access =
      await getApprovedSession();

    if (access.error) {
      return access.error;
    }

    const { userId } = access;

    const body = await req.json();

    const {
      requestId,
      action,
    } = body;

    if (
      !requestId ||
      !ObjectId.isValid(requestId)
    ) {
      return NextResponse.json(
        {
          message:
            "Valid request ID is required.",
        },
        { status: 400 }
      );
    }

    if (
      !["accept", "reject"].includes(
        action
      )
    ) {
      return NextResponse.json(
        {
          message:
            "Invalid action.",
        },
        { status: 400 }
      );
    }

    const requests =
      await dbConnect("requests");

    const request =
      await requests.findOne({
        _id: new ObjectId(requestId),
      });

    if (!request) {
      return NextResponse.json(
        {
          message:
            "Request not found.",
        },
        { status: 404 }
      );
    }

    // Only book owner can manage request
    if (
      request.ownerId?.toString() !==
      userId.toString()
    ) {
      return NextResponse.json(
        {
          message:
            "You are not authorized to manage this request.",
        },
        { status: 403 }
      );
    }

    if (request.status !== "pending") {
      return NextResponse.json(
        {
          message:
            "This request has already been processed.",
        },
        { status: 409 }
      );
    }

    const books =
      await dbConnect("books");

    const book =
      await books.findOne({
        _id: request.bookId,
        status: "approved",
      });

    if (!book) {
      return NextResponse.json(
        {
          message:
            "This book no longer exists or is not approved.",
        },
        { status: 404 }
      );
    }

    /* =========================
       REJECT
    ========================= */

    if (action === "reject") {
      const now = new Date();

      await requests.updateOne(
        {
          _id:
            new ObjectId(requestId),
        },
        {
          $set: {
            status: "rejected",

            rejectedBy: userId,
            rejectedAt: now,

            updatedAt: now,
          },
        }
      );

      return NextResponse.json({
        message:
          "Request rejected successfully.",
      });
    }

    /* =========================
       ACCEPT
    ========================= */

    if (
      book.availability !==
      "available"
    ) {
      return NextResponse.json(
        {
          message:
            "This book is no longer available.",
        },
        { status: 409 }
      );
    }

    const now = new Date();

    // Get page-based rule
    const rule =
      getBookRule(book.pages);

    // Calculate due date
    const dueDate =
      new Date(now);

    dueDate.setMonth(
      dueDate.getMonth() +
        rule.freeMonths
    );

    /* =========================
       CREATE LOAN
    ========================= */

    const loans =
      await dbConnect("loans");

    const loanData = {
      requestId:
        new ObjectId(requestId),

      bookId:
        request.bookId,

      bookTitle:
        request.bookTitle ||
        book.title ||
        "",

      pages:
        Number(book.pages) || 0,

      ownerId:
        request.ownerId,

      ownerName:
        request.ownerName ||
        book.ownerName ||
        "",

      borrowerId:
        request.requesterId,

      borrowerName:
        request.requesterName ||
        "",

      borrowerEmail:
        request.requesterEmail ||
        "",

      type:
        request.type ||
        "borrow",

      startDate: now,

      dueDate,

      ruleCategory:
        rule.category,

      freeMonths:
        rule.freeMonths,

      damageFee:
        rule.damageFee,

      lateFine: 0,

      damageFine: 0,

      lostFine: 0,

      totalFine: 0,

      paymentStatus:
        "not_required",

      status: "active",

      returnedAt: null,

      createdAt: now,

      updatedAt: now,
    };

    const loanResult =
      await loans.insertOne(
        loanData
      );

    /* =========================
       UPDATE REQUEST
    ========================= */

    await requests.updateOne(
      {
        _id:
          new ObjectId(requestId),
      },
      {
        $set: {
          status: "active",

          ownerApprovedBy:
            userId,

          ownerApprovedAt:
            now,

          loanId:
            loanResult.insertedId,

          updatedAt: now,
        },
      }
    );

    /* =========================
       UPDATE BOOK
    ========================= */

    await books.updateOne(
      {
        _id: request.bookId,
      },
      {
        $set: {
          availability:
            "borrowed",

          currentLoanId:
            loanResult.insertedId,

          borrowedBy:
            request.requesterId,

          borrowedAt: now,

          updatedAt: now,
        },
      }
    );

    return NextResponse.json({
      message:
        "Request accepted. The book is now actively borrowed.",

      loanId:
        loanResult.insertedId.toString(),

      dueDate,

      freeMonths:
        rule.freeMonths,

      damageFee:
        rule.damageFee,
    });
  } catch (error) {
    console.error(
      "UPDATE_REQUEST_ERROR:",
      error
    );

    return NextResponse.json(
      {
        message:
          "Failed to process the borrowing request.",
      },
      { status: 500 }
    );
  }
}