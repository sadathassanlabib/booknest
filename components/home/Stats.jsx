const stats = [
  {
    label: "Total books listed",
    value: "3,906",
    note: "Growing every week",
  },
  {
    label: "Total members",
    value: "1,284",
    note: "Readers & lenders",
  },
  {
    label: "Currently on loan",
    value: "618",
    note: "Books in circulation",
  },
];

const Stats = () => {
  return (
    <section className="relative z-10 -mt-8 px-4">
      <div className="mx-auto grid w-[92%] max-w-[1180px] gap-3 sm:grid-cols-3">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-2xl border border-[#e7ebe7] bg-white p-5 shadow-lg shadow-black/[0.025]"
          >
            <div className="text-[10px] text-[#69736d]">
              {stat.label}
            </div>

            <div className="mt-1 text-3xl font-black tracking-[-.05em]">
              {stat.value}
            </div>

            <div className="mt-1 text-[10px] font-semibold text-[#2e6a50]">
              {stat.note}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Stats;