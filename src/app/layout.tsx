import type { Metadata } from "next";
import "./globals.css";
import { themeNoFlashScript } from "@/lib/theme";
import Providers from "./components/Providers";

export const metadata: Metadata = {
  title: "StayNest — Find your next stay",
  description:
    "Book unique places to stay around the world. A full-stack Airbnb-style booking app built by D L Narayana.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeNoFlashScript }} />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
