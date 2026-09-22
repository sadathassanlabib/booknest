import { auth } from "@/auth";
import { dbConnect } from "@/lib/dbConnect";
import BooksManagement from "@/components/superadmin/BooksManagement";

export default async function SuperadminBooksPage() {
  const session = await auth();

  if (
    !session?.user?.id ||
    session.user.role !== "superadmin" ||
    session.user.status !== "approved"
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#101D23] px-5 text-[#EDE6D6]">
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 px-8 py-10 text-center">
          <h1 className="text-xl font-bold">
            Access Denied
          </h1>

          <p className="mt-2 text-sm text-[#899692]">
            You do not have permission to access this page.
          </p>
        </div>
      </main>
    );
  }

  const booksCollection = await dbConnect("books");

  const books = await booksCollection
    .find({})
    .sort({ createdAt: -1 })
    .toArray();

  const formattedBooks = books.map((book) => ({
    _id: book._id.toString(),
    title: book.title || "",
    author: book.author || "",
    category: book.category || "",
    isbn: book.isbn || "",
    publisher: book.publisher || "",
    edition: book.edition || "",
    pages: book.pages || 0,
    language: book.language || "",
    description: book.description || "",
    coverImage: book.coverImage || "",
    condition: book.condition || "",
    ownerId: book.ownerId?.toString() || "",
    ownerName: book.ownerName || "",
    ownerEmail: book.ownerEmail || "",
    status: book.status || "pending",
    availability: book.availability || "available",
    createdAt: book.createdAt
      ? book.createdAt.toISOString()
      : null,
  }));

  return (
    <main className="min-h-screen bg-[#101D23] px-4 py-10 text-[#EDE6D6]">
      <div className="mx-auto max-w-7xl">
        <BooksManagement books={formattedBooks} />
      </div>
    </main>
  );
}