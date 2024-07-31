"use client";

import Button from "@/components/ui/Button";
import React, { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa6";

export default function ThemeButton() {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const systemPrefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;
    if (systemPrefersDark) {
      setTheme("dark");
    }
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const handleThemeToggle = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <Button.LowContrast onClick={handleThemeToggle}>
      {theme === "light" ? <FaMoon /> : <FaSun />}
    </Button.LowContrast>
  );
}
