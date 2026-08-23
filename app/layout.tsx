import type { Metadata, Viewport } from "next";
import "./globals.css";
import { company } from "@/lib/site-content";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://apollone.jp";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${company.name}｜${company.concept}`,
    template: `%s｜${company.name}`,
  },
  description:
    "愛媛・松山の映像制作会社。PR・採用・ドキュメンタリーの映像／写真制作と、SNS運用支援。企画から撮影・編集まで一貫して手がけます。",
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: company.name,
    url: siteUrl,
    title: `${company.name}｜${company.concept}`,
    description: "愛媛・松山の映像制作会社。映像・写真制作とSNS運用支援。",
  },
  alternates: { canonical: "/" },
};

export const viewport: Viewport = {
  themeColor: "#16191A",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        {/* 明朝＝主役コピー / Sans＝本文 / Inter＝欧文ラベル（README §2.2）。
            next/font は Noto の日本語サブセット取得に失敗するため、
            デザイン正典と同じ Google Fonts の link 方式を使う。
            no-page-custom-font は Pages Router 向けの規則で App Router では誤検知。 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;500;600&family=Noto+Sans+JP:wght@300;400;500&family=Inter:wght@300;400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
