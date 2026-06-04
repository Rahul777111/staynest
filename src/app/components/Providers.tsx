"use client";

import { ThemeProvider } from "@/lib/theme";
import { AuthProvider } from "@/lib/auth";
import { UIProvider, useUI } from "@/lib/ui";
import Assistant from "./Assistant";
import AuthModal from "./AuthModal";

function GlobalOverlays() {
  const { authOpen, closeAuth } = useUI();
  return (
    <>
      <Assistant />
      <AuthModal open={authOpen} onClose={closeAuth} />
    </>
  );
}

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AuthProvider>
        <UIProvider>
          {children}
          <GlobalOverlays />
        </UIProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
