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
  title: {
    default: "ECN2 STUDIO | 專業影視後期製作",
    template: "%s | ECN2 STUDIO",
  },
  description:
    "ECN2 STUDIO 是台灣專業影視後期製作團隊，提供現場檔案管理、後期檔案管理、影音同步、套片、DCP 製作、Netflix IMF 規格製作、HDR/SDR 調色等一站式後期技術服務。",
  keywords: [
    "ECN2 STUDIO",
    "影視後期製作",
    "post-production",
    "DCP",
    "Netflix IMF",
    "HDR",
    "SDR",
    "現場檔案管理",
    "DIT",
    "台灣後期製作",
    "film post-production Taiwan",
    "color grading",
    "online editing",
    "conforming",
  ],
  authors: [{ name: "ECN2 STUDIO" }],
  creator: "ECN2 STUDIO",
  metadataBase: new URL("https://ecn2studio.com"),
  openGraph: {
    type: "website",
    locale: "zh_TW",
    alternateLocale: "en_US",
    url: "https://ecn2studio.com",
    siteName: "ECN2 STUDIO",
    title: "ECN2 STUDIO | 專業影視後期製作",
    description:
      "從片場到銀幕，ECN2 STUDIO 提供一站式後期技術解決方案。服務涵蓋現場檔案管理、後期影像全流程、DCP 製作、Netflix IMF 封包、HDR/SDR 調色。",
    images: [
      {
        url: "/images/slide1.jpg",
        width: 1200,
        height: 630,
        alt: "ECN2 STUDIO - 專業影視後期製作",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ECN2 STUDIO | 專業影視後期製作",
    description:
      "從片場到銀幕，ECN2 STUDIO 提供一站式後期技術解決方案。",
    images: ["/images/slide1.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    // 之後在 Google Search Console 取得驗證碼後填入
    // google: "你的驗證碼",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ECN2 STUDIO",
    url: "https://ecn2studio.com",
    logo: "https://ecn2studio.com/icon.png",
    description:
      "台灣專業影視後期製作團隊，提供現場檔案管理、後期影像全流程、DCP 製作、Netflix IMF 規格製作、HDR/SDR 調色等一站式後期技術服務。",
    email: "ecn2studio@gmail.com",
    telephone: "+886-972-339-366",
    address: {
      "@type": "PostalAddress",
      addressCountry: "TW",
    },
    sameAs: [],
    knowsAbout: [
      "Film Post-Production",
      "DCP Mastering",
      "Netflix IMF Packaging",
      "HDR Color Grading",
      "On-Set Data Management",
      "Audio-Video Synchronization",
      "Online Editing",
    ],
  };

  return (
    <html lang="zh-Hant" className={`${outfit.variable} ${notoSansTC.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased font-body">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
