"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { signIn } from "@/lib/auth";
import { LockIcon, UserCircle } from "lucide-react";
import Image from "next/image";
import { FormEvent, useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function LoginScreen() {
  const [householdNumber, setHouseholdNumber] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSignIn = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    await signIn("credentials", {
      redirect: false,
      householdNumber,
      password,
    })
      .then((callback) => {
        if (callback?.error) {
          toast.error("Invalid credentials");
        } else if (callback?.ok) {
          toast.success("Successfully logged in");
          router.push("/");
        }
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="h-full bg-slate-100">
      <div className="h-full flex items-center justify-center container">
        <div className="md:h-auto md:w-[420px]">
          <Image src="/dswd.png" width={420} height={100} alt="DSWD Logo" />
          <div className="space-y-5 px-0 pb-0">
            <p className="text-2xl font-bold text-center">Log in Account</p>
            <form className="space-y-2.5" onSubmit={handleSignIn}>
              <div>
                <p className="text-sm text-slate-900 ml-8">
                  Username (Household No.)
                </p>
                <div className="space-x-2 flex items-center">
                  <UserCircle />
                  <Input
                    disabled={loading}
                    value={householdNumber}
                    onChange={(e) => setHouseholdNumber(e.target.value)}
                    placeholder="Username"
                    type="text"
                    required
                  />
                </div>
              </div>
              <div>
                <p className="text-sm text-slate-900 ml-8">Password</p>
                <div className="space-x-2 flex items-center">
                  <LockIcon />
                  <Input
                    disabled={loading}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    type="password"
                    required
                  />
                </div>
              </div>
              <Button
                type="submit"
                className="w-full md:w-[93%] md:ml-8"
                disabled={loading}
              >
                Log in
              </Button>
            </form>
            <p className="text-sm text-muted-foreground text-center">
              By clicking continue, you agree to our{" "}
              <span className="text-slate-900 hover:underline cursor-pointer">
                Terms of Service
              </span>{" "}
              and{" "}
              <span className="text-slate-900 hover:underline cursor-pointer">
                Privacy Policy
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
