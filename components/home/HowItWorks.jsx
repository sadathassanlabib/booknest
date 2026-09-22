const steps = [
  {
    number: "01",
    title: "Sign up",
    text: "Create your BookNest account and tell us why you want to join the community.",
  },
  {
    number: "02",
    title: "Get approved",
    text: "Your membership request is reviewed before member-only borrowing and lending features are unlocked.",
  },
  {
    number: "03",
    title: "List & discover",
    text: "List books from your shelf or browse books shared by other approved members.",
  },
  {
    number: "04",
    title: "Borrow & return",
    text: "Request a book, coordinate the handover, and return it when your loan ends.",
  },
];

const HowItWorks = () => {
  return (
    <section
      id="how-it-works"
      className="bg-[#f0f3ef] py-16"
    >
      <div className="mx-auto w-[92%] max-w-[1180px]">
        <div className="mb-5">
          <div className="text-[10px] font-extrabold uppercase tracking-[.15em] text-[#2e6a50]">
            Four simple steps
          </div>

          <h2 className="mt-1 text-2xl font-black tracking-[-.04em]">
            How BookNest works
          </h2>

          <p className="mt-1 text-[11px] text-[#69736d]">
            From joining to returning a book.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((step) => (
            <div
              key={step.number}
              className="rounded-2xl border border-[#e2e7e2] bg-white p-5"
            >
              <div className="text-[10px] font-black text-[#b58a45]">
                {step.number}
              </div>

              <h3 className="mt-2 text-[13px] font-extrabold">
                {step.title}
              </h3>

              <p className="mt-2 text-[10px] leading-6 text-[#69736d]">
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;