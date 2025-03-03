"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { LogOut, User } from "lucide-react";
import Link from "next/link";

export function Profile() {
  const { data: session } = authClient.useSession();

  if (!session || !session.user) {
    return null;
  }

  const { user } = session;
  const userInitials = user.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Avatar className="cursor-pointer ring-2 ring-green-500  h-8 w-8  ">
          {user.image ? (
            <AvatarImage src={user.image} alt={user.name || "User profile"} />
          ) : null}
          <AvatarFallback>{userInitials}</AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
          <Link href="/manage">
        <DropdownMenuItem className="cursor-pointer">
          <User className="h-4 w-4" /> Manage
        </DropdownMenuItem>
          </Link>
       
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive cursor-pointer"
          onClick={async () => await authClient.signOut()}
        >
          <LogOut className="h-4 w-4" /> Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
