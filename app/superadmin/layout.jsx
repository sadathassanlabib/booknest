import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

export default function SuperadminLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#07141a] text-slate-100">
      <DashboardSidebar />

      <main className="min-h-screen lg:pl-[280px]">
        <div className="min-h-screen w-full">
          {children}
        </div>
      </main>
    </div>
  );
}