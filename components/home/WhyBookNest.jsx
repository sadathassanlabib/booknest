import Link from "next/link";

const reasons = [
  {
    number: "01",
    title: "Browse before you join",
    text: "Explore the public catalog and book details without an account.",
  },
  {
    number: "02",
    title: "Share your shelf",
    text: "Give unused books another reader and earn through lending.",
  },
  {
    number: "03",
    title: "Build a reading community",
    text: "Connect with members around books instead of buying every title yourself.",
  },
];

const WhyBookNest = () => {
  return (
    <section
      id="why-booknest"
      className="mx-auto w-[92%] max-w-[1180px] py-16"
    >
      <div className="grid gap-5 lg:grid-cols-2">

        {/* Left */}
        <div className="rounded-2xl border border-[#e7ebe7] bg-white p-7 shadow-sm">
          <div className="text-[10px] font-extrabold uppercase tracking-[.15em] text-[#2e6a50]">
            Why join?
          </div>

          <h2 className="mt-2 text-2xl font-black tracking-[-.04em]">
            Your shelf can become part of something bigger.
          </h2>

          <p className="mt-3 text-xs leading-7 text-[#69736d]">
            Guests can browse the public catalog. Approved members can
            list books, borrow from other members, communicate, and build
            a trusted reading record.
          </p>

          <Link
            href="/signup"
            className="mt-5 inline-flex rounded-xl bg-[#214b3a] px-5 py-3 text-[11px] font-extrabold text-white transition hover:bg-[#17382c]"
          >
            Request to join
          </Link>
        </div>

        {/* Right */}
        <div className="rounded-2xl border border-[#e7ebe7] bg-white p-5 shadow-sm">
          {reasons.map((reason) => (
            <div
              key={reason.number}
              className="flex gap-3 border-b border-[#e7ebe7] py-4 last:border-b-0"
            >
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-[#eef4ef] text-[10px] font-black text-[#214b3a]">
                {reason.number}
              </div>

              <div>
                <h3 className="text-[11px] font-extrabold">
                  {reason.title}
                </h3>

                <p className="mt-1 text-[10px] leading-5 text-[#69736d]">
                  {reason.text}
                </p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default WhyBookNest;