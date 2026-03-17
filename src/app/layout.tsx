import type { Metadata } from "next";
import { Outfit, Noto_Sans_TC } from "next/font/google";
import "./globals.css";
import ClientLayout from "@/components/ClientLayout";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-outfit",
  display: "swap",
});

const notoSansTC = Noto_Sans_TC({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
  variable: "--font-noto-sans-tc",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ECN2 STUDIO | 專業影視後期製作",
  description: "ECN2 STUDIO 提供專業影視後期製作服務，包含現場檔案管理、後期檔案管理、影音同步、套片、DCP 製作、Netflix 規格製作。",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="zh-Hant" className={`${outfit.variable} ${notoSansTC.variable}`}>
      <body className="antialiased font-body">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
