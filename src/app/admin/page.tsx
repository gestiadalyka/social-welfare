"use client";

import { redirect } from "next/navigation";
import { useEffect } from "react";

const AdminHome = () => {
  useEffect(() => {
    redirect("/admin/users");
  }, []);

  return null;
};

export default AdminHome;
