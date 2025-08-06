"use client";

import React, { useEffect, useState } from "react";
import { Switch } from "../ui/switch";
import { Moon, Sun } from "lucide-react";

type Theme = "light" | "dark";

function ThemeSwitcher() {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const storedTheme = localStorage.getItem("theme") as Theme | null;

    if (storedTheme) {
      setTheme(storedTheme);
      document.documentElement.classList.toggle("dark", storedTheme === "dark");
    } else {
      const prefersDark = window.matchMedia(
        "(prefers-color-scheme: dark)"
      ).matches;
      const systemTheme = prefersDark ? "dark" : "light";
      setTheme(systemTheme);
      localStorage.setItem("theme", systemTheme);
      document.documentElement.classList.toggle("dark", prefersDark);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme: Theme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.classList.toggle("dark", newTheme === "dark");
  };
  return (
    <div className="flex justify-center items-center gap-1 p-2 rounded-md">
      {theme === "light" ? (
        <Sun className="w-5 h-5 text-yellow-600" />
      ) : (
        <Moon className="w-5 h-5 text-orange-600" />
      )}

      <Switch
        onClick={toggleTheme}
        checked={theme === "light"}
        className={`transition-colors border cursor-pointer ${
          theme === "light"
            ? "bg-white border-zinc-300"
            : "bg-zinc-800 border-zinc-700"
        }`}
      />
    </div>
  );
}

export default ThemeSwitcher;
