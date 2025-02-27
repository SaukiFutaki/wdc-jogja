"use client";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient, signIn } from "@/lib/auth-client";
import Image from "next/image";
import { Profile } from "../profile";
import ThemeToggleButton from "../theme-button";
import RichNavigationMenu from "./nav-rich";
import { NavigationSheet } from "./nav-sheet";

export default function Navbar() {
  const { data: session, isPending } = authClient.useSession();

  return (
    <div className="min-h-screen bg-muted">
      {isPending ? (
        <div className="fixed top-6 inset-x-4 h-16 max-w-screen-xl mx-auto">
          <Skeleton className="h-full w-full rounded-full" />
        </div>
      ) : (
        <nav className="fixed top-6 inset-x-4 h-16 bg-background border dark:border-slate-700/70 max-w-screen-xl mx-auto rounded-full">
          <div className="h-full flex items-center justify-between mx-auto px-4">
            <Image src="/logo.svg" alt="Logo" width={200} height={40} />
            {/* Desktop Menu */}
            <RichNavigationMenu className="hidden xl:flex"  />

            <div className="flex items-center gap-3">
              {session === null ? (
                <div>
                  <Button
                    variant="outline"
                    className="hidden sm:inline-flex rounded-full"
                    onClick={() => signIn()}
                  >
                    Sign In
                  </Button>
                  <Button
                    className="rounded-full hidden sm:inline-flex cursor-not-allowed"
                    disabled
                  >
                    Sign Up
                  </Button>
                </div>
              ) : (
                <Profile />
              )}
              <ThemeToggleButton />
              {/* Mobile Menu */}
              <div className="md:hidden">
                <NavigationSheet />
              </div>
            </div>
          </div>
        </nav>
      )}
    </div>
  );
}
