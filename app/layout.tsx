import type { Metadata, Viewport } from "next";
import "./globals.css";
import { company } from "@/lib/site-content";
import { isIndexable, siteUrl } from "@/lib/site-url";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${company.name}｜${company.concept}`,
    template: `%s｜${company.name}`,
  },
  description:
    "愛媛・松山の映像制作会社。PR・採用・ドキュメンタリーの映像／写真制作と、SNS運用支援。構成から撮影・編集まで一貫して手がけます。",
  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: company.name,
    url: siteUrl,
    title: `${company.name}｜${company.concept}`,
    description: "愛媛・松山の映像制作会社。映像・写真制作とSNS運用支援。",
    /* SNS やチャットに貼られたときのサムネイル。ヒーロー1本目の
       先頭フレームを 1200x630 に切ったもの。色は触っていない。 */
    images: [{ url: "/ogp.jpg", width: 1200, height: 630, alt: company.concept }],
  },
  twitter: { card: "summary_large_image" },
  alternates: { canonical: "/" },
  /* 仮公開中とプレビューは検索結果に出さない。robots.txt はクロールを
     止めるだけで、外部リンクがあればURL自体は載ってしまう。
     ページ側にも noindex を出して二重に止める。 */
  robots: isIndexable ? undefined : { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#16191A",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <head>
        {/* 和文＝Shippori Mincho（明朝）、欧文ラベル・UI＝IBM Plex Sans JP。
            next/font は日本語サブセットの取得に失敗するため、
            デザイン正典と同じ Google Fonts の link 方式を使う。
            no-page-custom-font は Pages Router 向けの規則で App Router では誤検知。 */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+JP:wght@400;500&family=Shippori+Mincho:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
