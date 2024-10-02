"use client";
import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";

import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Archive, CirclePlusIcon, LogOut, Users2Icon } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { signOut } from "next-auth/react";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminSidebar({ children }: AdminLayoutProps) {
  const links = [
    {
      label: "Users",
      href: "/admin/users",
      icon: (
        <Users2Icon className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Archived users",
      href: "/admin/archived-users",
      icon: (
        <Archive className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
    {
      label: "Add users",
      href: "/admin/add-users",
      icon: (
        <CirclePlusIcon className="text-neutral-700 dark:text-neutral-200 h-5 w-5 flex-shrink-0" />
      ),
    },
  ];
  const [open, setOpen] = useState(false);
  return (
    <div
      className={cn(
        "rounded-md flex flex-col md:flex-row dark:bg-neutral-800 w-full flex-1 mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden",
        "h-[100vh]" // for your use case, use `h-screen` instead of `h-[60vh]`
      )}
    >
      <Sidebar open={open} setOpen={setOpen} animate={false}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            <Image
              src="/dswd.png"
              alt="Logo"
              height={150}
              width={200}
              className="mx-auto"
            />
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div className="flex flex-col">
            <p className="mb-4">Admin</p>
            <div
              onClick={() => signOut()}
              className="flex gap-2 cursor-pointer"
            >
              <LogOut />
              Logout
            </div>
          </div>
        </SidebarBody>
      </Sidebar>
      <ScrollArea className="m-4 w-auto md:w-full">{children}</ScrollArea>
    </div>
  );
}
