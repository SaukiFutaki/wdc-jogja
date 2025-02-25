import { Button } from "@/components/ui/button";
import Logo from "../logo";
import { NavMenu } from "./nav-menu";
import { NavigationSheet } from "./nav-sheet";
import Image from "next/image";
import ThemeToggleButton from "../theme-button";
export default function Navbar() {
  return (
    <div className="min-h-screen bg-muted">
      <nav className="fixed top-6 inset-x-4 h-16 bg-background border dark:border-slate-700/70 max-w-screen-xl mx-auto rounded-full">
        <div className="h-full flex items-center justify-between mx-auto px-4">
          <Image src="/logo.svg" alt="Logo" width={200} height={40} />
          {/* Desktop Menu */}
          <NavMenu className="hidden md:block" />
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              className="hidden sm:inline-flex rounded-full"
            >
              Sign In
            </Button>
            <Button className="rounded-full hidden sm:inline-flex">
              Get Started
            </Button>
            <ThemeToggleButton />
            {/* Mobile Menu */}
            <div className="md:hidden">
              <NavigationSheet />
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
