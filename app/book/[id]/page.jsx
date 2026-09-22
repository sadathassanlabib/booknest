import Link from "next/link";
import { ObjectId } from "mongodb";
import { dbConnect } from "@/lib/dbConnect";
import { auth } from "@/auth";
import RequestBookButton from "@/components/books/RequestBookButton";
async function getBook(id) {
  if (!ObjectId.isValid(id)) {
    return null;
  }

  const books = await dbConnect("books");

  const book = await books.findOne({
    _id: new ObjectId(id),
    status: "approved",
  });

  if (!book) {
    return null;
  }

  return {
    ...book,
    _id: book._id.toString(),
    ownerId: book.ownerId?.toString() || "",
  };
}

export default async function BookDetails({ params }) {
  const { id } = await params;

  const book = await getBook(id);
  const session = await auth();

  if (!book) {
    return (
      <main className="min-h-screen bg-[#101D23] px-5 py-20 text-[#EDE6D6]">
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-6 text-6xl">📚</div>

          <h1 className="text-3xl font-black">
            Book Not Found
          </h1>

          <p className="mt-3 text-sm leading-7 text-[#899692]">
            This book does not exist, has been removed, or is not
            available in the public catalog.
          </p>

          <Link
            href="/catalog"
            className="mt-8 inline-flex rounded-xl bg-[#EDE6D6] px-5 py-3 text-sm font-extrabold text-[#101D23] transition hover:bg-white"
          >
            Back to Catalog
          </Link>
        </div>
      </main>
    );
  }

  const isLoggedIn = !!session?.user?.id;
  const isOwner = session?.user?.id === book.ownerId;

  return (
    <main className="min-h-screen bg-[#101D23] text-[#EDE6D6]">
      <div className="mx-auto w-[92%] max-w-6xl py-10">

        {/* Back */}
        <Link
          href="/catalog"
          className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-[#8BAF9D] transition hover:text-[#EDE6D6]"
        >
          ← Back to Catalog
        </Link>

        {/* Main Card */}
        <section className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03] shadow-2xl">
          <div className="grid gap-8 p-6 md:grid-cols-[320px_1fr] md:p-10">

            {/* Cover */}
            <div>
              <div className="aspect-[3/4] overflow-hidden rounded-2xl border border-white/10 bg-[#16262D]">
                {book.coverImage ? (
                  <img
                    src={book.coverImage}
                    alt={book.title}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <div className="text-center">
                      <div className="text-6xl">📖</div>
                      <p className="mt-3 text-sm text-[#899692]">
                        No Cover Available
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Availability */}
              <div className="mt-4">
                {book.availability === "available" ? (
                  <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-center text-sm font-bold text-emerald-300">
                    ● Available for Borrow
                  </div>
                ) : (
                  <div className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-center text-sm font-bold text-red-300">
                    ● Currently Unavailable
                  </div>
                )}
              </div>
            </div>

            {/* Details */}
            <div className="flex flex-col">

              <div>
                <span className="inline-flex rounded-full border border-[#8BAF9D]/20 bg-[#8BAF9D]/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#8BAF9D]">
                  {book.category || "General"}
                </span>

                <h1 className="mt-4 text-3xl font-black leading-tight md:text-5xl">
                  {book.title}
                </h1>

                <p className="mt-3 text-lg text-[#8BAF9D]">
                  by {book.author}
                </p>
              </div>

              {/* Book Info */}
              <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
                <InfoItem
                  label="Pages"
                  value={book.pages || "N/A"}
                />

                <InfoItem
                  label="Language"
                  value={book.language || "N/A"}
                />

                <InfoItem
                  label="Condition"
                  value={book.condition || "N/A"}
                />

                <InfoItem
                  label="Status"
                  value="Approved"
                />
              </div>

              {/* Description */}
              <div className="mt-8">
                <h2 className="text-lg font-extrabold">
                  About This Book
                </h2>

                <p className="mt-3 whitespace-pre-line text-sm leading-8 text-[#899692]">
                  {book.description ||
                    "The owner has not added a description for this book yet."}
                </p>
              </div>

              {/* Owner */}
              <div className="mt-8 rounded-2xl border border-white/10 bg-black/10 p-5">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#8BAF9D]">
                  Book Owner
                </p>

                <p className="mt-2 text-lg font-bold">
                  {book.ownerName || "BookNest Member"}
                </p>

                <p className="mt-1 text-sm text-[#899692]">
                  This book is shared by a BookNest community member.
                </p>
              </div>

              {/* Action */}
              <div className="mt-auto pt-8">

                {isOwner ? (
                  <div className="rounded-xl border border-[#8BAF9D]/20 bg-[#8BAF9D]/10 px-5 py-4 text-center text-sm font-semibold text-[#BFD3C9]">
                    This is your book.
                  </div>
                ) : !isLoggedIn ? (
                  <Link
                    href="/login"
                    className="block rounded-xl bg-[#EDE6D6] px-5 py-4 text-center text-sm font-black text-[#101D23] transition hover:bg-white"
                  >
                    Sign In to Request This Book
                  </Link>
                ) : book.availability !== "available" ? (
                  <div className="rounded-xl border border-white/10 bg-white/5 px-5 py-4 text-center text-sm font-semibold text-[#899692]">
                    This book is currently unavailable.
                  </div>
                ) : (
                 <RequestBookButton bookId={book._id} />
                )}

              </div>
            </div>
          </div>
        </section>

        {/* Future Feature */}
        <section className="mt-8 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <h2 className="text-lg font-extrabold">
            BookNest Borrowing
          </h2>

          <p className="mt-2 text-sm leading-7 text-[#899692]">
            Borrowing requests are reviewed through BookNest's approval
            system. Once the request system is active, you will be able
            to request this book directly from this page.
          </p>
        </section>
      </div>
    </main>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="rounded-xl border border-white/10 bg-black/10 p-4">
      <p className="text-xs font-bold uppercase tracking-wider text-[#899692]">
        {label}
      </p>

      <p className="mt-2 truncate text-sm font-bold text-[#EDE6D6]">
        {value}
      </p>
    </div>
  );
}