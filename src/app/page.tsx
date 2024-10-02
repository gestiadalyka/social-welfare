"use client";

import { Button } from "@/components/ui/button";
import LoginScreen from "@/features/auth/components/login-screen";
import { signOut } from "next-auth/react";

export default function Home() {
  return (
    <div>
      Hello user
      <Button onClick={() => signOut()}>Logout</Button>
    </div>
  );
}
