import AuthProvider from "@/components/AuthProvider";
import Sidebar from "@/components/Sidebar";
import MobileNav from "@/components/MobileNav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      {/* Wrapper - flex row */}
      <div style={{ display: "flex", minHeight: "100vh", background: "var(--background)" }}>

        {/* ── Desktop Sidebar (fixed, 260px wide) ─────────────────── */}
        <Sidebar />

        {/* ── Mobile Top Nav (fixed bar, only visible < lg) ───────── */}
        <MobileNav />

        {/* ── Main Content Area ───────────────────────────────────── */}
        {/*
            Desktop: sidebar is position:fixed, so we need marginLeft=260px
            Mobile:  sidebar hidden → marginLeft=0, but MobileNav adds top bar
                     so we add paddingTop for the 56px top bar
        */}
        <main
          style={{
            flex: 1,
            minHeight: "100vh",
            background: "var(--background)",
            boxSizing: "border-box",
            width: "100%",
          }}
          id="dashboard-main"
        >
          {/* Desktop offset wrapper */}
          <style>{`
            #dashboard-main {
              padding: 80px 28px 32px 28px;   /* mobile: top 80 covers mobile nav */
            }
            @media (min-width: 1024px) {
              #dashboard-main {
                margin-left: 260px;
                width: calc(100% - 260px);
                padding: 32px 32px 32px 32px;
              }
            }
          `}</style>

          {children}
        </main>
      </div>
    </AuthProvider>
  );
}
