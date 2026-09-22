"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const initialForm = {
  title: "",
  author: "",
  category: "",
  isbn: "",
  publisher: "",
  edition: "",
  pages: "",
  language: "Bangla",
  description: "",
  coverImage: "",
  condition: "Good",
};

export default function AddBookPage() {
  const router = useRouter();

  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const response = await fetch("/api/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Failed to add book."
        );
      }

      setMessage(data.message);
      setForm(initialForm);

      setTimeout(() => {
        router.push("/book/my-books");
        router.refresh();
      }, 1200);
    } catch (error) {
      console.error(error);

      setError(
        error.message || "Something went wrong."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#101D23] px-4 py-10 text-[#EDE6D6]">
      <div className="mx-auto max-w-4xl">

        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-[#8BAF9D]">
            BookNest Library
          </p>

          <h1 className="mt-2 text-3xl font-black md:text-4xl">
            Add a Book
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-[#899692]">
            Add a book to your collection. Your book will be
            reviewed by an administrator before appearing in
            the public catalog.
          </p>
        </div>

        {message && (
          <div className="mb-5 rounded-xl border border-[#8BAF9D]/20 bg-[#8BAF9D]/10 px-4 py-3 text-sm text-[#B9D0C4]">
            {message}
          </div>
        )}

        {error && (
          <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="rounded-2xl border border-white/10 bg-white/5 p-5 md:p-8"
        >
          <div className="grid gap-5 md:grid-cols-2">

            <div className="md:col-span-2">
              <label className="mb-2 block text-xs font-bold text-[#AEB8B4]">
                Book Title *
              </label>

              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                required
                placeholder="Enter book title"
                className="w-full rounded-xl border border-white/10 bg-[#101D23] px-4 py-3 text-sm text-[#EDE6D6] outline-none placeholder:text-[#596762] focus:border-[#8BAF9D]/50"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold text-[#AEB8B4]">
                Author *
              </label>

              <input
                type="text"
                name="author"
                value={form.author}
                onChange={handleChange}
                required
                placeholder="Author name"
                className="w-full rounded-xl border border-white/10 bg-[#101D23] px-4 py-3 text-sm text-[#EDE6D6] outline-none placeholder:text-[#596762] focus:border-[#8BAF9D]/50"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold text-[#AEB8B4]">
                Category *
              </label>

              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-white/10 bg-[#101D23] px-4 py-3 text-sm text-[#EDE6D6] outline-none focus:border-[#8BAF9D]/50"
              >
                <option value="">Select category</option>
                <option value="Fiction">Fiction</option>
                <option value="Non-Fiction">Non-Fiction</option>
                <option value="Islamic">Islamic</option>
                <option value="Academic">Academic</option>
                <option value="Biography">Biography</option>
                <option value="History">History</option>
                <option value="Science">Science</option>
                <option value="Technology">Technology</option>
                <option value="Literature">Literature</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold text-[#AEB8B4]">
                ISBN
              </label>

              <input
                type="text"
                name="isbn"
                value={form.isbn}
                onChange={handleChange}
                placeholder="ISBN number"
                className="w-full rounded-xl border border-white/10 bg-[#101D23] px-4 py-3 text-sm text-[#EDE6D6] outline-none placeholder:text-[#596762] focus:border-[#8BAF9D]/50"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold text-[#AEB8B4]">
                Publisher
              </label>

              <input
                type="text"
                name="publisher"
                value={form.publisher}
                onChange={handleChange}
                placeholder="Publisher name"
                className="w-full rounded-xl border border-white/10 bg-[#101D23] px-4 py-3 text-sm text-[#EDE6D6] outline-none placeholder:text-[#596762] focus:border-[#8BAF9D]/50"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold text-[#AEB8B4]">
                Edition
              </label>

              <input
                type="text"
                name="edition"
                value={form.edition}
                onChange={handleChange}
                placeholder="e.g. 3rd Edition"
                className="w-full rounded-xl border border-white/10 bg-[#101D23] px-4 py-3 text-sm text-[#EDE6D6] outline-none placeholder:text-[#596762] focus:border-[#8BAF9D]/50"
              />
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold text-[#AEB8B4]">
                Page Count *
              </label>

              <input
                type="number"
                name="pages"
                value={form.pages}
                onChange={handleChange}
                min="1"
                required
                placeholder="e.g. 240"
                className="w-full rounded-xl border border-white/10 bg-[#101D23] px-4 py-3 text-sm text-[#EDE6D6] outline-none placeholder:text-[#596762] focus:border-[#8BAF9D]/50"
              />

              <p className="mt-1 text-[10px] text-[#66746F]">
                Page count is used for membership and damage
                fee calculation.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold text-[#AEB8B4]">
                Language
              </label>

              <select
                name="language"
                value={form.language}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-[#101D23] px-4 py-3 text-sm text-[#EDE6D6] outline-none focus:border-[#8BAF9D]/50"
              >
                <option value="Bangla">Bangla</option>
                <option value="English">English</option>
                <option value="Arabic">Arabic</option>
                <option value="Hindi">Hindi</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xs font-bold text-[#AEB8B4]">
                Condition
              </label>

              <select
                name="condition"
                value={form.condition}
                onChange={handleChange}
                className="w-full rounded-xl border border-white/10 bg-[#101D23] px-4 py-3 text-sm text-[#EDE6D6] outline-none focus:border-[#8BAF9D]/50"
              >
                <option value="New">New</option>
                <option value="Like New">Like New</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Worn">Worn</option>
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-xs font-bold text-[#AEB8B4]">
                Cover Image URL
              </label>

              <input
                type="url"
                name="coverImage"
                value={form.coverImage}
                onChange={handleChange}
                placeholder="https://..."
                className="w-full rounded-xl border border-white/10 bg-[#101D23] px-4 py-3 text-sm text-[#EDE6D6] outline-none placeholder:text-[#596762] focus:border-[#8BAF9D]/50"
              />
            </div>

            <div className="md:col-span-2">
              <label className="mb-2 block text-xs font-bold text-[#AEB8B4]">
                Description
              </label>

              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={5}
                placeholder="Tell readers something about this book..."
                className="w-full resize-none rounded-xl border border-white/10 bg-[#101D23] px-4 py-3 text-sm leading-6 text-[#EDE6D6] outline-none placeholder:text-[#596762] focus:border-[#8BAF9D]/50"
              />
            </div>
          </div>

          <div className="mt-8 flex flex-col-reverse gap-3 border-t border-white/10 pt-6 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => router.back()}
              className="rounded-xl border border-white/10 px-5 py-3 text-sm font-bold text-[#AEB8B4] transition hover:bg-white/5 hover:text-[#EDE6D6]"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-[#EDE6D6] px-6 py-3 text-sm font-extrabold text-[#101D23] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Book"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}