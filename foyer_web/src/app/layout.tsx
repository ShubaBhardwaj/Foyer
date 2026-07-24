import type { Metadata } from "next";
import { AppProviders } from "@/providers/AppProviders";
import "./globals.css";

export const metadata: Metadata = {
  title: "Foyer — Enterprise Society Management Platform",
  description: "Automated structure, multi-role governance, resident tracking, and security operations for modern gated societies.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased">
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
