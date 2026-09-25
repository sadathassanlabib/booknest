
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";

export default function ModeratorLayout({ children }) {
  return (
    <div className="min-h-screen bg-[#07141a] text-slate-100">
      <DashboardSidebar role="moderator" />

      <main className="min-h-screen lg:pl-72">
        {children}
      </main>
    </div>
  );
}

