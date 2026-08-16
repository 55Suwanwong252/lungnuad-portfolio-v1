import type { Metadata } from "next";
import "./globals.css";
import SiteShell from "@/components/SiteShell";

export const metadata: Metadata = {
  title: "Lungnuad Production",
  description: "Video, photography, and visual storytelling portfolio.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th">
      <body>
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
