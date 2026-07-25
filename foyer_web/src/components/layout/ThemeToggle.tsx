"use client";

import { useTheme } from "next-themes";
import { Sun, Moon, Laptop } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useState, useEffect } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="h-9 w-9" />;

  const toggleTheme = () => {
    if (theme === "dark") setTheme("light");
    else if (theme === "light") setTheme("system");
    else setTheme("dark");
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      title={`Current theme: ${theme}. Click to switch.`}
      className="text-[var(--on-surface)]/70 hover:text-[var(--on-surface)] hover:bg-[var(--surface-variant)]/50"
    >
      {theme === "dark" && <Moon className="h-4 w-4 text-[var(--primary)]" />}
      {theme === "light" && <Sun className="h-4 w-4 text-[var(--tertiary)]" />}
      {theme === "system" && <Laptop className="h-4 w-4 text-[var(--secondary)]" />}
    </Button>
  );
}

