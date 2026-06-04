"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";

export type ThemeMode = "light" | "dark" | "system";
export type Accent = "coral" | "ocean" | "forest" | "violet" | "sunset";

export const ACCENTS: { id: Accent; label: string; color: string }[] = [
  { id: "coral", label: "Coral", color: "#ff385c" },
  { id: "ocean", label: "Ocean", color: "#0d6efd" },
  { id: "forest", label: "Forest", color: "#1a9d63" },
  { id: "violet", label: "Violet", color: "#7c4dff" },
  { id: "sunset", label: "Sunset", color: "#f4631e" },
];

const THEME_KEY = "staynest.theme.v1";
const ACCENT_KEY = "staynest.accent.v1";

type Ctx = {
  mode: ThemeMode;
  accent: Accent;
  resolved: "light" | "dark";
  setMode: (m: ThemeMode) => void;
  setAccent: (a: Accent) => void;
};

const ThemeContext = createContext<Ctx | null>(null);

function systemPrefersDark() {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-color-scheme: dark)").matches;
}

function applyTheme(mode: ThemeMode, accent: Accent) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  const dark = mode === "dark" || (mode === "system" && systemPrefersDark());
  root.setAttribute("data-theme", dark ? "dark" : "light");
  root.setAttribute("data-accent", accent);
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>("system");
  const [accent, setAccentState] = useState<Accent>("coral");
  const [resolved, setResolved] = useState<"light" | "dark">("light");

  useEffect(() => {
    const m = (localStorage.getItem(THEME_KEY) as ThemeMode) || "system";
    const a = (localStorage.getItem(ACCENT_KEY) as Accent) || "coral";
    setModeState(m);
    setAccentState(a);
    applyTheme(m, a);
    setResolved(
      m === "dark" || (m === "system" && systemPrefersDark()) ? "dark" : "light"
    );
  }, []);

  // react to OS theme changes while in system mode
  useEffect(() => {
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => {
      if (mode === "system") {
        applyTheme("system", accent);
        setResolved(systemPrefersDark() ? "dark" : "light");
      }
    };
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [mode, accent]);

  const setMode = useCallback(
    (m: ThemeMode) => {
      setModeState(m);
      localStorage.setItem(THEME_KEY, m);
      applyTheme(m, accent);
      setResolved(
        m === "dark" || (m === "system" && systemPrefersDark())
          ? "dark"
          : "light"
      );
    },
    [accent]
  );

  const setAccent = useCallback(
    (a: Accent) => {
      setAccentState(a);
      localStorage.setItem(ACCENT_KEY, a);
      applyTheme(mode, a);
    },
    [mode]
  );

  return (
    <ThemeContext.Provider
      value={{ mode, accent, resolved, setMode, setAccent }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
}

// Inline script (string) to set theme before first paint, preventing flash.
export const themeNoFlashScript = `(function(){try{var m=localStorage.getItem('${THEME_KEY}')||'system';var a=localStorage.getItem('${ACCENT_KEY}')||'coral';var d=m==='dark'||(m==='system'&&window.matchMedia('(prefers-color-scheme: dark)').matches);var r=document.documentElement;r.setAttribute('data-theme',d?'dark':'light');r.setAttribute('data-accent',a);}catch(e){}})();`;
