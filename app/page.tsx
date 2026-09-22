import Navbar from "@/components/shared/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#101D23] text-[#EDE6D6]">
      {/* Navbar */}
      <Navbar></Navbar>

      {/* Hero */}
      <section className="mx-auto grid max-w-7xl gap-16 px-6 py-24 lg:grid-cols-2 lg:items-center">
        <div>
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-[#C9A24B]">
            A Community For Book Lovers
          </p>

          <h2 className="max-w-3xl font-serif text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            Books should be{" "}
            <span className="text-[#C9A24B]">shared,</span>
            <br />
            not forgotten.
          </h2>

          <p className="mt-7 max-w-xl text-base leading-8 text-[#9FB2B5]">
            Discover books from people around you, lend the books you love,
            and build a better reading community together.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <a
              href="/catalog"
              className="bg-[#C9A24B] px-6 py-3 text-sm font-semibold text-[#101D23] transition hover:bg-[#D7B45E]"
            >
              Explore Books
            </a>

            <a
              href="/signup"
              className="border border-white/15 px-6 py-3 text-sm font-semibold transition hover:border-[#C9A24B] hover:text-[#C9A24B]"
            >
              Become a Member
            </a>
          </div>
        </div>

        {/* Book visual */}
        <div className="relative mx-auto h-[420px] w-full max-w-md">
          <div className="absolute left-12 top-8 h-80 w-28 -rotate-6 rounded-sm bg-[#405E51] p-5 shadow-2xl">
            <p className="writing-vertical font-serif text-lg font-bold tracking-widest">
              ATOMIC HABITS
            </p>
          </div>

          <div className="absolute left-28 top-3 h-96 w-32 rotate-2 rounded-sm bg-[#8A6C38] p-5 shadow-2xl">
            <p className="font-serif text-lg font-bold tracking-wide">
              THE
              <br />
              ALCHEMIST
            </p>
          </div>

          <div className="absolute left-48 top-12 h-80 w-28 rotate-8 rounded-sm bg-[#3C5961] p-5 shadow-2xl">
            <p className="font-serif text-lg font-bold">
              SAPIENS
            </p>
          </div>

          <div className="absolute bottom-5 right-0 w-48 border border-white/10 border-l-2 border-l-[#C9A24B] bg-[#1D323B] p-5">
            <p className="text-[9px] uppercase tracking-[0.2em] text-[#C9A24B]">
              Book of the day
            </p>

            <h3 className="mt-2 font-serif text-xl">
              Atomic Habits
            </h3>

            <p className="mt-1 text-xs text-[#9FB2B5]">
              James Clear
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto grid max-w-7xl grid-cols-2 border-y border-white/10 md:grid-cols-4">
        {[
          ["1,250+", "Books Available"],
          ["480+", "Active Readers"],
          ["920+", "Successful Loans"],
          ["4.9", "Community Rating"],
        ].map(([number, label]) => (
          <div
            key={label}
            className="border-r border-white/10 px-6 py-7 last:border-r-0"
          >
            <p className="font-serif text-3xl text-[#C9A24B]">
              {number}
            </p>

            <p className="mt-1 text-xs text-[#9FB2B5]">
              {label}
            </p>
          </div>
        ))}
      </section>

      {/* Featured Books */}
      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="mb-10 flex items-end justify-between gap-5">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[#C9A24B]">
              From the community
            </p>

            <h2 className="mt-3 font-serif text-4xl font-semibold">
              Recently added books
            </h2>
          </div>

          <a
            href="/catalog"
            className="text-sm text-[#C9A24B]"
          >
            View all →
          </a>
        </div>

        <div className="grid gap-5 md:grid-cols-3">
          {[
            {
              title: "Atomic Habits",
              author: "James Clear",
              genre: "Self Development",
              price: 50,
            },
            {
              title: "The Alchemist",
              author: "Paulo Coelho",
              genre: "Fiction",
              price: 40,
            },
            {
              title: "Sapiens",
              author: "Yuval Noah Harari",
              genre: "History",
              price: 60,
            },
          ].map((book) => (
            <article
              key={book.title}
              className="overflow-hidden border border-white/10 border-l-2 border-l-[#C9A24B] bg-[#1D323B] transition hover:-translate-y-1 hover:border-[#C9A24B]/50"
            >
              <div className="flex h-56 items-end bg-[#23404B] p-6">
                <div>
                  <p className="max-w-[190px] font-serif text-3xl leading-tight">
                    {book.title}
                  </p>

                  <p className="mt-2 text-xs text-[#9FB2B5]">
                    {book.author}
                  </p>
                </div>
              </div>

              <div className="p-5">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase tracking-wider text-[#9FB2B5]">
                    {book.genre}
                  </span>

                  <span className="bg-[#7FA593]/10 px-2 py-1 text-[9px] uppercase text-[#7FA593]">
                    Available
                  </span>
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                  <p className="text-xs text-[#9FB2B5]">
                    <strong className="text-sm text-[#EDE6D6]">
                      ৳{book.price}
                    </strong>{" "}
                    / month
                  </p>

                  <a
                    href="/catalog"
                    className="text-xs text-[#C9A24B]"
                  >
                    View →
                  </a>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="border-y border-white/10 bg-[#15242B]">
        <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 py-24 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-[#C9A24B]">
              Your next book is waiting
            </p>

            <h2 className="mt-4 max-w-2xl font-serif text-4xl font-semibold sm:text-5xl">
              Turn your bookshelf into a community.
            </h2>

            <p className="mt-5 text-sm text-[#9FB2B5]">
              Join Books World and start sharing the books that matter to you.
            </p>
          </div>

          <a
            href="/signup"
            className="w-fit bg-[#C9A24B] px-6 py-3 text-sm font-semibold text-[#101D23]"
          >
            Create Account →
          </a>
        </div>
      </section>

      {/* Footer */}
      <footer className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-8 text-xs text-[#9FB2B5] sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="font-serif text-base text-[#EDE6D6]">
            BookNest
          </p>

          <p>Read. Share. Repeat.</p>
        </div>

        <p>© 2026 BookNest</p>
      </footer>
    </main>
  );
}