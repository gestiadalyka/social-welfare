import { AdminSidebar } from "@/features/admin/components/admin-sidebar";
import React from "react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function layout({ children }: AdminLayoutProps) {
  return (
    <div className="h-full">
      <AdminSidebar>{children}</AdminSidebar>
    </div>
  );
}
