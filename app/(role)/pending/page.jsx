import Link from "next/link";

export default function PendingPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#101D23] px-6 text-[#EDE6D6]">
      <div className="w-full max-w-lg border border-white/10 bg-[#1D323B] p-8 text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center border border-[#C9A24B] text-xl text-[#C9A24B]">
          B
        </div>

        <p className="mt-8 text-xs font-semibold uppercase tracking-[0.25em] text-[#C9A24B]">
          Account Under Review
        </p>

        <h1 className="mt-4 font-serif text-4xl">
          Welcome to BookNest
        </h1>

        <p className="mx-auto mt-5 max-w-md text-sm leading-7 text-[#9FB2B5]">
          Your account has been created successfully. An administrator needs
          to approve your account before you can access the member dashboard.
        </p>

        <Link
          href="/catalog"
          className="mt-8 inline-block border border-white/10 px-6 py-3 text-sm transition hover:border-[#C9A24B] hover:text-[#C9A24B]"
        >
          Browse Catalog
        </Link>
      </div>
    </main>
  );
}