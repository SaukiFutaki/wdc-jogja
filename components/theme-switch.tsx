"use client";

import { MoonIcon, SunMediumIcon } from "lucide-react";
import { Switch } from "./ui/switch";
import React, { useEffect, useState } from "react";
import { useTheme } from "next-themes";

const ThemeSwitch = () => {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  useEffect(() => {
    setMounted(true);
  }, []);

  // Only render the switch after component has mounted to prevent hydration errors
  if (!mounted) return null;

  return (
    <Switch
      icon={
        resolvedTheme === "dark" ? (
          <MoonIcon className="h-4 w-4" />
        ) : (
          <SunMediumIcon className="h-4 w-4" />
        )
      }
      checked={resolvedTheme === "dark"}
      onCheckedChange={toggleTheme}
      className="h-7 w-12"
      thumbClassName="h-6 w-6 data-[state=checked]:translate-x-5"
    />
  );
};

export default ThemeSwitch;
