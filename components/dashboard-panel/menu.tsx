"use client";

import Link from "next/link";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSidebar } from "@/hooks/use-sidebar";
import { useStore } from "@/hooks/use-store";
import { Ellipsis, LogOut } from "lucide-react";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

import { getMenuList } from "@/lib/menu-list";
import { CollapseMenuButton } from "./collapse-menu-button";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { ModeToggle } from "./mode-toggle";
import { Overpass_Mono } from "next/font/google";

interface MenuProps {
  isOpen: boolean | undefined;
}

const overpassMono = Overpass_Mono({
  weight: ["400"],
  subsets: ["latin"]
})

export function Menu({ isOpen }: MenuProps) {
  const pathname = usePathname();
  const menuList = getMenuList(pathname);
  const sidebar = useStore(useSidebar, (x) => x);
  if (!sidebar) return null;
  const { settings, setSettings } = sidebar;
  return (
    <ScrollArea className="[&>div>div[style]]:!block">
      <nav className={`mt-8 h-full w-full ${overpassMono.className}`}>
        <ul className="flex flex-col min-h-[calc(100vh-48px-36px-16px-32px)] lg:min-h-[calc(100vh-32px-40px-32px)] items-start space-y-1 px-2">
          {menuList.map(({ groupLabel, menus }, index) => (
            <li className={cn("w-full", groupLabel ? "pt-5" : "")} key={index}>
              {(isOpen && groupLabel) || isOpen === undefined ? (
                <p className="text-sm font-medium text-muted-foreground px-4 pb-2 max-w-[248px] truncate">
                  {groupLabel}
                </p>
              ) : !isOpen && isOpen !== undefined && groupLabel ? (
                <TooltipProvider>
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger className="w-full">
                      <div className="w-full flex justify-center items-center">
                        <Ellipsis className="h-5 w-5" />
                      </div>
                    </TooltipTrigger>
                    <TooltipContent side="right">
                      <p>{groupLabel}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <p className="pb-2"></p>
              )}
              {menus.map(
                ({ href, label, icon: Icon, active, submenus }, index) =>
                  !submenus || submenus.length === 0 ? (
                    <div className="w-full" key={index}>
                      <TooltipProvider disableHoverableContent>
                        <Tooltip delayDuration={100}>
                          <TooltipTrigger asChild>
                            <Button
                              variant={
                                (active === undefined &&
                                  pathname.startsWith(href)) ||
                                active
                                  ? "secondary"
                                  : "ghost"
                              }
                              className="w-full justify-start h-10 mb-1"
                              asChild
                            >
                              <Link href={href}>
                                <span
                                  className={cn(isOpen === false ? "" : "mr-4")}
                                >
                                  <Icon size={18} />
                                </span>
                                <p
                                  className={cn(
                                    "max-w-[200px] truncate",
                                    isOpen === false
                                      ? "-translate-x-96 opacity-0"
                                      : "translate-x-0 opacity-100"
                                  )}
                                >
                                  {label}
                                </p>
                              </Link>
                            </Button>
                          </TooltipTrigger>
                          {isOpen === false && (
                            <TooltipContent side="right">
                              {label}
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  ) : (
                    <div className="w-full" key={index}>
                      <CollapseMenuButton
                        icon={Icon}
                        label={label}
                        active={
                          active === undefined
                            ? pathname.startsWith(href)
                            : active
                        }
                        submenus={submenus}
                        isOpen={isOpen}
                      />
                    </div>
                  )
              )}
            </li>
          ))}
          <div className={cn("pt-5 px-2", isOpen === false ? "flex flex-col items-center space-y-4" : "flex flex-col items-start space-y-4")}>
            <div className={cn("flex items-center", isOpen === false ? "justify-center" : "space-x-2")}>
              <TooltipProvider>
                <Tooltip delayDuration={100}>
                  <TooltipTrigger>
                    <Switch
                      id="is-hover-open"
                      onCheckedChange={(x) => setSettings({ isHoverOpen: x })}
                      checked={settings.isHoverOpen}
                      className={cn(
                        "data-[state=checked]:bg-blue-600",
                        isOpen === false ? "mx-auto" : ""
                      )}
                    />
                  </TooltipTrigger>
                  {isOpen === false && (
                    <TooltipContent side="right">Hover Open</TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
              {isOpen !== false && (
                <Label htmlFor="is-hover-open">Hover Open</Label>
              )}
            </div>

            <div className={cn("flex items-center", isOpen === false ? "justify-center" : "space-x-2")}>
              <TooltipProvider>
                <Tooltip delayDuration={100}>
                  <TooltipTrigger>
                    <Switch
                      id="disable-sidebar"
                      onCheckedChange={(x) => setSettings({ disabled: x })}
                      checked={settings.disabled}
                      className={cn(
                        "data-[state=checked]:bg-blue-600",
                        isOpen === false ? "mx-auto" : ""
                      )}
                    />
                  </TooltipTrigger>
                  {isOpen === false && (
                    <TooltipContent side="right">Disable Sidebar</TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
              {isOpen !== false && (
                <Label htmlFor="disable-sidebar">Disable Sidebar</Label>
              )}
            </div>
            
            <div className={isOpen === false ? "flex justify-center" : ""}>
              {isOpen === false ? (
                <TooltipProvider>
                  <Tooltip delayDuration={100}>
                    <TooltipTrigger>
                      <ModeToggle  />
                    </TooltipTrigger>
                    <TooltipContent side="right">Switch Theme</TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ) : (
                <div className="flex items-center space-x-2">
                  <ModeToggle />
                  <Label>Switch Theme</Label>
                </div>
              )}
            </div>
          </div>
          <li className="w-full grow flex items-end">
            <TooltipProvider disableHoverableContent>
              <Tooltip delayDuration={100}>
                <TooltipTrigger asChild>
                  <Button
                    onClick={() => {}}
                    variant="outline"
                    className="w-full justify-center h-10 mt-5"
                  >
                    <span className={cn(isOpen === false ? "" : "mr-4")}>
                      <LogOut size={18} />
                    </span>
                    <p
                      className={cn(
                        "whitespace-nowrap",
                        isOpen === false ? "opacity-0 hidden" : "opacity-100"
                      )}
                    >
                      Sign out
                    </p>
                  </Button>
                </TooltipTrigger>
                {isOpen === false && (
                  <TooltipContent side="right">Sign out</TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          </li>
        </ul>
      </nav>
    </ScrollArea>
  );
}