"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";

export default function ThemeToggle() {
    const [isDark, setIsDark] = useState(false);

    // 初期状態：localStorage or prefers-color-scheme
    useEffect(() => {
        const stored = localStorage.getItem("theme");
        if (stored) {
            setIsDark(stored === "dark");
            document.documentElement.classList.toggle("dark", stored === "dark");
        } else {
            const prefers = window.matchMedia("(prefers-color-scheme: dark)").matches;
            setIsDark(prefers);
            document.documentElement.classList.toggle("dark", prefers);
        }
    }, []);

    const toggle = () => {
        const next = !isDark;
        setIsDark(next);
        document.documentElement.classList.toggle("dark", next);
        localStorage.setItem("theme", next ? "dark" : "light");
    };

    return (
        <button
            aria-label="Toggle theme"
            onClick={toggle}
            className="p-2 rounded-full hover:bg-muted/50 transition-colors"
        >
            {isDark ? <Sun className="size-5" /> : <Moon className="size-5" />}
        </button>
    );
} 