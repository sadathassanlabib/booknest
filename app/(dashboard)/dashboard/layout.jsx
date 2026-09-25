"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
{
label: "Overview",
href: "/dashboard",
icon: "⌂",
},
{
label: "Profile",
href: "/dashboard/profile",
icon: "👤",
},
{
label: "My Loans",
href: "/dashboard/my-loans",
icon: "📚",
},
];

export default function DashboardLayout({ children }) {
const pathname = usePathname();

const isActive = (href) => {
if (href === "/dashboard") {
return pathname === "/dashboard";
}

return pathname === href || pathname.startsWith(`${href}/`);


};

return ( <div className="min-h-screen bg-[#07141a] text-slate-100"> <div className="flex min-h-screen">

```
    {/* ================= SIDEBAR ================= */}
    <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-white/[0.07] bg-[#091a21] lg:flex lg:flex-col">

      {/* Logo */}
      <div className="border-b border-white/[0.07] px-5 py-6">
        <Link href="/dashboard" className="block">
          <p className="text-lg font-black tracking-tight text-[#f1eee5]">
            BookNest
          </p>

          <p className="mt-1 text-[9px] font-bold uppercase tracking-[0.25em] text-slate-600">
            Personal Library
          </p>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-5">

        <p className="mb-3 px-3 text-[9px] font-bold uppercase tracking-[0.22em] text-slate-700">
          Dashboard
        </p>

        <div className="space-y-1">
          {menuItems.map((item) => {
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group flex items-center gap-3 rounded-xl px-3 py-3 transition ${
                  active
                    ? "border border-white/[0.07] bg-[#102a34] text-white"
                    : "text-slate-500 hover:bg-[#0d2028] hover:text-slate-200"
                }`}
              >
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-lg text-base ${
                    active
                      ? "bg-[#e9e1cf] text-[#07141a]"
                      : "bg-white/[0.03]"
                  }`}
                >
                  {item.icon}
                </span>

                <span className="text-sm font-bold">
                  {item.label}
                </span>

                {active && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-emerald-400" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Library */}
        <div className="mt-8">
          <p className="mb-3 px-3 text-[9px] font-bold uppercase tracking-[0.22em] text-slate-700">
            Library
          </p>

          <div className="space-y-1">

            <Link
              href="/catalog"
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-slate-500 transition hover:bg-[#0d2028] hover:text-slate-200"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.03]">
                🔎
              </span>

              <span className="text-sm font-bold">
                Catalog
              </span>
            </Link>

            <Link
              href="/"
              className="flex items-center gap-3 rounded-xl px-3 py-3 text-slate-500 transition hover:bg-[#0d2028] hover:text-slate-200"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/[0.03]">
                ↗
              </span>

              <span className="text-sm font-bold">
                Home
              </span>
            </Link>

          </div>
        </div>
      </nav>

      {/* Sidebar Footer */}
      <div className="border-t border-white/[0.07] p-4">
        <div className="rounded-2xl border border-white/[0.05] bg-[#0d2028] p-4">

          <p className="text-xs font-bold text-slate-300">
            BookNest
          </p>

          <p className="mt-1 text-[10px] leading-5 text-slate-600">
            Your books. Your loans. Your library.
          </p>

        </div>
      </div>
    </aside>

    {/* ================= MAIN ================= */}
    <div className="min-w-0 flex-1">

      {/* Mobile Header */}
      <header className="sticky top-0 z-40 border-b border-white/[0.07] bg-[#091a21]/95 px-4 py-4 backdrop-blur-xl lg:hidden">

        <div className="flex items-center justify-between">

          <Link href="/dashboard">
            <p className="text-lg font-black text-[#f1eee5]">
              BookNest
            </p>

            <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-slate-600">
              Dashboard
            </p>
          </Link>

          <Link
            href="/dashboard/profile"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/5 bg-[#0d2028]"
          >
            👤
          </Link>

        </div>

        {/* Mobile Navigation */}
        <nav className="mt-4 flex gap-2 overflow-x-auto pb-1">

          {menuItems.map((item) => {
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex shrink-0 items-center gap-2 rounded-xl px-3 py-2 text-xs font-bold transition ${
                  active
                    ? "bg-[#e9e1cf] text-[#07141a]"
                    : "border border-white/5 bg-[#0d2028] text-slate-500 hover:text-slate-200"
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            );
          })}

        </nav>
      </header>

      {/* Page Content */}
      <main className="min-w-0">
        {children}
      </main>

    </div>
  </div>
</div>


);
}
