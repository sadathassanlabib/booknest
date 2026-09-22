import Link from "next/link";

const BookCard = ({ book }) => {
  return (
    <article className="group overflow-hidden rounded-2xl border border-[#e7ebe7] bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg">

      {/* Cover */}
      <div
        className={`flex h-[215px] flex-col justify-between p-4 text-white ${book.coverClass}`}
      >
        <div className="text-[8px] font-bold uppercase tracking-[0.13em] opacity-75">
          {book.genre}
        </div>

        <div className="text-4xl font-black tracking-[-0.08em]">
          {book.code}
        </div>

        <div className="text-[9px] opacity-75">
          {book.author}
        </div>
      </div>

      {/* Body */}
      <div className="p-4">
        <h3 className="text-[13px] font-extrabold leading-5 text-[#151a17]">
          {book.title}
        </h3>

        <p className="mt-1 text-[10px] text-[#69736d]">
          {book.author}
        </p>

        <div className="mt-2 text-[10px] text-[#69736d]">
          Owner:{" "}
          <span className="font-semibold text-[#4d5952]">
            {book.owner}
          </span>
        </div>

        <div className="mt-3 flex items-center justify-between gap-2">
          <span
            className={`rounded-full px-2 py-1 text-[9px] font-extrabold ${
              book.availability === "Available"
                ? "bg-[#eaf6ed] text-[#18794e]"
                : "bg-[#edf2ff] text-[#3559bd]"
            }`}
          >
            {book.availability}
          </span>

          <span className="text-[11px] font-black">
            ৳{book.monthlyRate}/mo
          </span>
        </div>

        <div className="mt-2 flex items-center justify-between text-[9px] text-[#69736d]">
          <span>★ {book.rating}</span>

          <span>
            {book.condition}
          </span>
        </div>

        <Link
          href={`/books/${book.id}`}
          className="mt-3 block rounded-lg border border-[#e7ebe7] py-2 text-center text-[10px] font-extrabold transition hover:bg-[#f5f7f5]"
        >
          View details
        </Link>
      </div>
    </article>
  );
};

export default BookCard;