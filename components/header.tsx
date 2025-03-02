"use client";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { authClient } from "@/lib/auth-client";
import { Search, ShoppingCart, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import RichNavigationMenu from "./navbar/nav-rich";
import { Profile } from "./profile";

export default function Header() {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();

  return (
    <>
      <header
        className={`bg-[#111111] text-white p-4 flex items-center justify-between px-6 ${
          pathname.startsWith("/manage") || pathname === "/auth" ? "hidden" : ""
        }`}
      >
        <div className="flex items-center gap-8">
          <Link href="/" className="text-2xl font-bold">
            <Image src="/logo.svg" alt="Logo" width={200} height={40} />
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <RichNavigationMenu />
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search"
              className="bg-white rounded-full py-2 pl-10 pr-4 text-black w-[300px]"
            />
          </div>
          <Dialog>
            <DialogTitle className="flex items-center gap-2"></DialogTitle>
            <DialogTrigger>
              <ShoppingCart className="h-5 w-5" />
            </DialogTrigger>
            <DialogContent>
              <div className="p-4">
                <h2 className="text-lg font-semibold">Shopping Cart</h2>
                <p className="text-sm text-gray-500">
                  Your cart is currently empty.
                </p>
              </div>
            </DialogContent>
          </Dialog>
          {session === null ? (
            <Link href={"/auth"}>
              <button className="relative inline-flex h-12 overflow-hidden rounded-full p-[1px] focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 focus:ring-offset-slate-50">
                <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
                <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-full bg-slate-950 px-3 py-1 text-sm font-medium text-white backdrop-blur-3xl">
                  <User />
                </span>
              </button>
            </Link>
          ) : (
            <Profile />
          )}
        </div>
      </header>
    </>
  );
}
