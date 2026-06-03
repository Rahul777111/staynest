import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
