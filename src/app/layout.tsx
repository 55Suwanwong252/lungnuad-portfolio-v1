import type { Metadata } from "next";
import { Noto_Sans_Thai } from "next/font/google";
import "./globals.css";
import SiteShell from "@/components/SiteShell";
import { CmsProvider } from "@/components/CmsProvider";

const notoThai = Noto_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-noto-thai",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lungnuad Production",
  description: "Video, photography, and visual storytelling portfolio.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="th" className={notoThai.variable}>
      <body>
        <CmsProvider><SiteShell>{children}</SiteShell></CmsProvider>
      </body>
    </html>
  );
}
