import Link from "next/link";

const books = [
  {
    id: "1",
    title: "Atomic Habits",
    author: "James Clear",
    genre: "Self-help",
    rate: 210,
    available: true,
    code: "AH",
    cover: "from-[#1e3a32] to-[#55806d]",
  },
  {
    id: "2",
    title: "Clean Code",
    author: "Robert C. Martin",
    genre: "Technology",
    rate: 250,
    available: true,
    code: "CC",
    cover: "from-[#23364f] to-[#567da8]",
  },
  {
    id: "3",
    title: "Pather Panchali",
    author: "Bibhutibhushan Bandyopadhyay",
    genre: "Bengali classic",
    rate: 140,
    available: false,
    code: "PP",
    cover: "from-[#443c25] to-[#907947]",
  },
  {
    id: "4",
    title: "The Alchemist",
    author: "Paulo Coelho",
    genre: "Self-help",
    rate: 160,
    available: true,
    code: "TA",
    cover: "from-[#44324f] to-[#805f91]",
  },
];

const RecentBooks = () => {
  return (
    <section className="mx-auto w-[92%] max-w-[1180px] py-16">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <div className="text-[10px] font-extrabold uppercase tracking-[.15em] text-[#2e6a50]">
            Fresh arrivals
          </div>

          <h2 className="mt-1 text-2xl font-black tracking-[-.04em]">
            Recently added books
          </h2>

          <p className="mt-1 text-[11px] text-[#69736d]">
            New titles recently placed on the shared shelves.
          </p>
        </div>

        <Link
          href="/catalog"
          className="text-[11px] font-extrabold text-[#214b3a]"
        >
          View catalog →
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {books.map((book) => (
          <article
            key={book.id}
            className="overflow-hidden rounded-2xl border border-[#e7ebe7] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
          >
            <div
              className={`flex h-[215px] flex-col justify-between bg-gradient-to-br ${book.cover} p-4 text-white`}
            >
              <div className="text-[8px] font-bold uppercase tracking-[.13em] opacity-75">
                {book.genre}
              </div>

              <div className="text-4xl font-black tracking-[-.08em]">
                {book.code}
              </div>

              <div className="text-[9px] opacity-75">
                {book.author}
              </div>
            </div>

            <div className="p-4">
              <h3 className="text-[13px] font-extrabold leading-5">
                {book.title}
              </h3>

              <p className="mt-1 text-[10px] text-[#69736d]">
                {book.author}
              </p>

              <div className="mt-3 flex items-center justify-between">
                <span
                  className={`rounded-full px-2 py-1 text-[9px] font-extrabold ${
                    book.available
                      ? "bg-[#eaf6ed] text-[#18794e]"
                      : "bg-[#edf2ff] text-[#3559bd]"
                  }`}
                >
                  {book.available ? "Available" : "On loan"}
                </span>

                <span className="text-[11px] font-black">
                  ৳{book.rate}/mo
                </span>
              </div>

              <Link
                href={`/books/${book.id}`}
                className="mt-3 block rounded-lg border border-[#e7ebe7] py-2 text-center text-[10px] font-extrabold transition hover:bg-[#f6f8f6]"
              >
                View details
              </Link>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default RecentBooks;