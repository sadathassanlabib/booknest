import Navbar from "@/components/shared/Navbar";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#101D23] text-[#EDE6D6]">
      <Navbar />

      <section className="mx-auto flex min-h-[calc(100vh-74px)] w-[92%] max-w-[1180px] items-center">
        <div>
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.25em] text-[#8BAF9D]">
            Welcome to BookNest
          </p>

          <h1 className="max-w-3xl text-4xl font-black tracking-tight md:text-6xl">
            Discover, Share & Borrow Books
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-[#899692] md:text-base">
            BookNest is a community-powered platform where readers can
            discover books, share their collections, lend books and build
            a stronger reading community.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="/catalog"
              className="rounded-xl bg-[#EDE6D6] px-5 py-3 text-sm font-extrabold text-[#101D23] transition hover:bg-white"
            >
              Explore Books
            </a>

            <a
              href="/signup"
              className="rounded-xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-bold text-[#EDE6D6] transition hover:bg-white/10"
            >
              Join BookNest
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}