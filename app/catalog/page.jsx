import CatalogClient from "@/components/catalog/CatalogClient";

export const metadata = {
  title: "Browse Books | BookNest",
  description:
    "Browse books shared by the BookNest community.",
};

const CatalogPage = () => {
  return (
    <main className="min-h-screen bg-[#f7f8f5]">
      <section className="mx-auto w-[92%] max-w-[1180px] py-10">

        {/* Page Header */}
        <div className="mb-7">
          <div className="text-[10px] font-extrabold uppercase tracking-[.15em] text-[#2e6a50]">
            Public catalog
          </div>

          <h1 className="mt-2 text-4xl font-black tracking-[-.055em]">
            The Shelves
          </h1>

          <p className="mt-2 max-w-xl text-[12px] leading-6 text-[#69736d]">
            Browse books shared by the BookNest community.
            Anyone can explore the catalog. Approved members
            can request books.
          </p>
        </div>

        <CatalogClient />

      </section>
    </main>
  );
};

export default CatalogPage;