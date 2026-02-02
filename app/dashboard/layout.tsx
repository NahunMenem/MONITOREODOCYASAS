import Sidebar from "@/components/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0F2027] via-[#203A43] to-[#2C5364]">
      <Sidebar />

      <main
        className="
          flex-1
          overflow-y-auto
          px-3
          py-3
          md:px-8
          md:py-8
        "
      >
        {children}
      </main>
    </div>
  );
}
