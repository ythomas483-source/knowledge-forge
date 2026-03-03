import { ReactNode } from "react";
import AppSidebar from "./AppSidebar";

interface DashboardLayoutProps {
  children: ReactNode;
  role?: "admin" | "user" | "guest";
}

const DashboardLayout = ({ children, role = "admin" }: DashboardLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar role={role} />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
