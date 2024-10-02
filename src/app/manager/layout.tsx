import { ManagerSidebar } from "@/features/manager/components/manager-sidebar";
import React from "react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function layout({ children }: AdminLayoutProps) {
  return (
    <div className="h-full">
      <ManagerSidebar>{children}</ManagerSidebar>
    </div>
  );
}
