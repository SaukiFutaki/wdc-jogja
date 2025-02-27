import { Search, ShoppingCart, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import RichNavigationMenu from "./navbar/nav-rich";

export default function Header() {
  return (
    <>
      <header className="bg-[#111111] text-white p-4 flex items-center justify-between px-6">
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
          <Link href="/cart">
            <ShoppingCart className="h-5 w-5" />
          </Link>
          <Link href="/account">
            <User className="h-5 w-5" />
          </Link>
        </div>
      </header>
    </>
  );
}
